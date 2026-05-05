const functions  = require('firebase-functions')
const express    = require('express')
const cors       = require('cors')
const admin      = require('firebase-admin')
const crypto     = require('crypto')
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago')
const cloudinary = require('cloudinary').v2

admin.initializeApp()
const db = admin.firestore()

const app = express()

// ── CORS: solo el dominio del frontend en producción ─────────
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
}))

app.use(express.json())

// ─────────────────────────────────────────────────────────────
// Verifica la firma HMAC-SHA256 que MercadoPago incluye en cada
// notificación de webhook. Previene que terceros disparen el handler.
// Requiere la variable de entorno MP_WEBHOOK_SECRET (configurada en
// el panel de MP al registrar la notification URL).
// Si el secret no está configurado aún, permite el paso con warning
// para no romper el flow durante el setup inicial.
// ─────────────────────────────────────────────────────────────
function verifyMPWebhookSignature(req) {
  const secret = process.env.MP_WEBHOOK_SECRET

  if (!secret) {
    console.warn('Webhook: MP_WEBHOOK_SECRET no configurado — verificación de firma omitida')
    return true
  }

  const signature = req.headers['x-signature']  ?? ''
  const requestId = req.headers['x-request-id'] ?? ''

  if (!signature) {
    console.warn('Webhook: cabecera x-signature ausente')
    return false
  }

  // Parsear ts y v1 del header: "ts=<timestamp>,v1=<hash>"
  const parts = {}
  for (const part of signature.split(',')) {
    const idx = part.indexOf('=')
    if (idx !== -1) parts[part.slice(0, idx).trim()] = part.slice(idx + 1).trim()
  }

  const { ts, v1 } = parts
  if (!ts || !v1) return false

  const dataId   = req.body?.data?.id
  const template = `id:${dataId};request-id:${requestId};ts:${ts}`
  const computed = crypto.createHmac('sha256', secret).update(template).digest('hex')

  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(v1))
}

// ─────────────────────────────────────────────────────────────
// Middleware: verifica que el header Authorization tenga un
// Firebase ID Token válido y que el usuario sea administrador
// (campo role === 'admin' en la colección users de Firestore).
// ─────────────────────────────────────────────────────────────
async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' })
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    const userDoc = await db.collection('users').doc(decoded.uid).get()

    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: no sos administrador' })
    }

    req.uid = decoded.uid
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

// ─────────────────────────────────────────────────────────────
// POST /create-preference  —  MercadoPago
//
// 🔒 Los precios y títulos se obtienen DESDE FIRESTORE.
// Se crea una orden pendiente antes de redirigir a MercadoPago.
// El orderId se pasa como external_reference para que el webhook
// pueda correlacionar el pago con la orden exacta.
// ─────────────────────────────────────────────────────────────
app.post('/create-preference', async (req, res) => {
  try {
    const { items, buyerEmail } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items requeridos' })
    }

    for (const item of items) {
      if (!item.id || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
        return res.status(400).json({ message: 'Cada item requiere id y quantity válidos' })
      }
    }

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return res.status(500).json({ message: 'Access token no configurado' })
    }

    // 🔒 Obtener precio y título desde Firestore (fuente de verdad)
    const mpItems = await Promise.all(
      items.map(async ({ id, quantity }) => {
        const snap = await db.collection('products').doc(String(id)).get()

        if (!snap.exists) {
          throw new Error(`Producto ${id} no encontrado`)
        }

        const product = snap.data()

        if (Number(product.stock) < Number(quantity)) {
          throw new Error(`Stock insuficiente para "${product.name}"`)
        }

        return {
          id:          String(id),
          title:       String(product.name),
          quantity:    Number(quantity),
          unit_price:  Number(product.price),
          currency_id: 'ARS',
        }
      })
    )

    // Crear la orden pendiente en Firestore antes de ir a MercadoPago.
    // Esto garantiza que si el webhook llega antes que el usuario vuelva
    // al browser, ya tenemos la orden para impactar el stock.
    const totalAmount = mpItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)

    const orderRef = await db.collection('orders').add({
      status:     'pending',
      buyerEmail: buyerEmail ?? null,
      items:      mpItems.map(({ id, title, quantity, unit_price }) => ({
        productId: id,
        name:      title,
        quantity,
        unitPrice: unit_price,
      })),
      total:      totalAmount,
      createdAt:  admin.firestore.FieldValue.serverTimestamp(),
      updatedAt:  admin.firestore.FieldValue.serverTimestamp(),
    })

    const client     = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    const body = {
      items: mpItems,
      payer: buyerEmail ? { email: buyerEmail } : undefined,
      // orderId como external_reference para vincular pago ↔ orden
      external_reference: orderRef.id,
      back_urls: {
        success: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/pago?status=success&order=${orderRef.id}`,
        failure: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/pago?status=failure&order=${orderRef.id}`,
        pending: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/pago?status=pending&order=${orderRef.id}`,
      },
      auto_return:      'approved',
      notification_url: `${process.env.BACKEND_URL}/webhook`,
    }

    const result = await preference.create({ body })

    return res.json({
      init_point:         result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      id:                 result.id,
    })
  } catch (err) {
    console.error('MercadoPago error:', err)
    const status = err.message.includes('no encontrado') || err.message.includes('Stock') ? 400 : 500
    return res.status(status).json({ message: err.message ?? 'Error al crear preferencia de pago' })
  }
})

// ─────────────────────────────────────────────────────────────
// POST /webhook  —  Notificaciones de MercadoPago (server-to-server)
//
// Cuando el pago es APPROVED:
//   1. Busca la orden por external_reference (orderId)
//   2. Ejecuta una transacción Firestore para descontar stock
//      de cada producto de forma atómica (evita race conditions)
//   3. Marca la orden como "paid"
//
// Si el webhook llega duplicado (MP reintenta), la transacción
// verifica si la orden ya fue procesada y hace idempotent el handler.
// ─────────────────────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  // Responder 200 inmediatamente para que MP no reintente
  res.sendStatus(200)

  // Verificar firma antes de procesar
  if (!verifyMPWebhookSignature(req)) {
    console.warn('Webhook: firma inválida, solicitud ignorada')
    return
  }

  try {
    const { type, data } = req.body

    if (type !== 'payment' || !data?.id) return

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) return

    const client  = new MercadoPagoConfig({ accessToken })
    const payment = new Payment(client)
    const info    = await payment.get({ id: data.id })

    const paymentStatus  = info.status
    const orderId        = info.external_reference
    const payerEmail     = info.payer?.email ?? ''
    const transactionAmt = info.transaction_amount ?? 0

    // Guardar registro del pago en Firestore (auditoría)
    await db.collection('payments').doc(String(data.id)).set({
      paymentId:  String(data.id),
      status:     paymentStatus,
      orderId:    orderId ?? null,
      payerEmail,
      amount:     transactionAmt,
      rawStatus:  info.status_detail ?? '',
      updatedAt:  admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })

    // Solo impactar inventario si el pago fue APROBADO y tenemos orderId
    if (paymentStatus !== 'approved' || !orderId) return

    const orderRef = db.collection('orders').doc(orderId)

    await db.runTransaction(async (tx) => {
      const orderSnap = await tx.get(orderRef)

      if (!orderSnap.exists) {
        throw new Error(`Orden ${orderId} no encontrada`)
      }

      const order = orderSnap.data()

      // Idempotencia: si la orden ya fue procesada, no hacer nada
      if (order.status === 'paid') return

      // Leer todos los productos involucrados dentro de la misma transacción
      const productRefs   = order.items.map((i) => db.collection('products').doc(i.productId))
      const productSnaps  = await Promise.all(productRefs.map((r) => tx.get(r)))

      // Validar stock antes de escribir (dentro de la transacción)
      for (let i = 0; i < order.items.length; i++) {
        const snap    = productSnaps[i]
        const ordered = order.items[i]

        if (!snap.exists) {
          throw new Error(`Producto ${ordered.productId} no encontrado`)
        }

        const currentStock = Number(snap.data().stock)
        if (currentStock < ordered.quantity) {
          // Stock insuficiente — registrar el problema pero no bloquear el pago
          // El admin deberá resolver manualmente
          console.error(`Stock insuficiente para ${ordered.name}: tiene ${currentStock}, vendió ${ordered.quantity}`)
        }
      }

      // Escribir: descontar stock de cada producto
      for (let i = 0; i < order.items.length; i++) {
        const snap    = productSnaps[i]
        const ordered = order.items[i]
        const newStock = Math.max(0, Number(snap.data().stock) - ordered.quantity)

        tx.update(productRefs[i], {
          stock:     newStock,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
      }

      // Actualizar la orden a "paid"
      tx.update(orderRef, {
        status:    'paid',
        paymentId: String(data.id),
        paidAt:    admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    })

  } catch (err) {
    console.error('Webhook error:', err)
  }
})

// ─────────────────────────────────────────────────────────────
// POST /sign-upload  —  Cloudinary signed upload
//
// 🔒 FIX: Requiere token de admin válido antes de firmar.
// Evita que bots consuman la cuota de Cloudinary.
// ─────────────────────────────────────────────────────────────
app.post('/sign-upload', requireAdmin, (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey    = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ message: 'Cloudinary no configurado en el servidor' })
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

  const timestamp    = Math.round(Date.now() / 1000)
  const folder       = 'tiendita-tuti/products'
  const transformation = 'q_auto,f_auto,w_800,c_limit'
  const paramsToSign = { folder, timestamp, transformation }
  const signature    = cloudinary.utils.api_sign_request(paramsToSign, apiSecret)

  return res.json({ timestamp, signature, apiKey, cloudName, folder, transformation })
})

exports.api = functions.https.onRequest(app)

