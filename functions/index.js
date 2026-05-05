const functions = require('firebase-functions')
const express   = require('express')
const cors      = require('cors')
const { MercadoPagoConfig, Preference } = require('mercadopago')
const cloudinary = require('cloudinary').v2

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

// ─────────────────────────────────────────────────────────────
// POST /create-preference  —  MercadoPago
// ─────────────────────────────────────────────────────────────
app.post('/create-preference', async (req, res) => {
  try {
    const { items, buyerEmail } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items requeridos' })
    }

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return res.status(500).json({ message: 'Access token no configurado' })
    }

    const client = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    const body = {
      items: items.map((i) => ({
        id:          String(i.id),
        title:       String(i.title),
        quantity:    Number(i.quantity),
        unit_price:  Number(i.unit_price),
        currency_id: 'ARS',
      })),
      payer: buyerEmail ? { email: buyerEmail } : undefined,
      back_urls: {
        success: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/pago?status=success`,
        failure: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/pago?status=failure`,
        pending: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/pago?status=pending`,
      },
      auto_return: 'approved',
    }

    const result = await preference.create({ body })

    return res.json({
      init_point:         result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      id:                 result.id,
    })
  } catch (err) {
    console.error('MercadoPago error:', err)
    return res.status(500).json({ message: 'Error al crear preferencia de pago' })
  }
})

// ─────────────────────────────────────────────────────────────
// POST /sign-upload  —  Cloudinary signed upload
//
// El frontend pide una firma al backend. El backend usa el API
// Secret (que NUNCA sale al cliente) para generar la firma.
// El cliente luego sube la imagen directo a Cloudinary con esa firma.
// ─────────────────────────────────────────────────────────────
app.post('/sign-upload', (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey    = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ message: 'Cloudinary no configurado en el servidor' })
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

  const timestamp = Math.round(Date.now() / 1000)
  const folder    = 'tiendita-tuti/products'

  // Parámetros que se firman — deben coincidir exactamente con los que envía el frontend
  const paramsToSign = { folder, timestamp }
  const signature    = cloudinary.utils.api_sign_request(paramsToSign, apiSecret)

  return res.json({ timestamp, signature, apiKey, cloudName, folder })
})

exports.api = functions.https.onRequest(app)
