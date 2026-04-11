const functions = require('firebase-functions')
const express   = require('express')
const cors      = require('cors')
const { MercadoPagoConfig, Preference } = require('mercadopago')

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

// POST /create-preference
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
        id:         String(i.id),
        title:      String(i.title),
        quantity:   Number(i.quantity),
        unit_price: Number(i.unit_price),
        currency_id: 'ARS',
      })),
      payer: buyerEmail ? { email: buyerEmail } : undefined,
      back_urls: {
        success: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/?status=success`,
        failure: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/?status=failure`,
        pending: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/?status=pending`,
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

exports.api = functions.https.onRequest(app)
