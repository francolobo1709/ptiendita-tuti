import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, CreditCard, ArrowLeft, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { createMercadoPagoPreference } from '../services/mercadopagoService'
import Layout from '../components/layout/Layout'
import toast from 'react-hot-toast'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491100000000'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate                    = useNavigate()
  const [email, setEmail]           = useState('')
  const [loading, setLoading]       = useState(false)

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-20 space-y-4">
          <ShoppingBag size={56} className="mx-auto text-pink-200" />
          <h1 className="text-xl font-bold text-gray-700">Tu carrito está vacío</h1>
          <button onClick={() => navigate('/')} className="btn-primary">
            Ver productos
          </button>
        </div>
      </Layout>
    )
  }

  async function handleMercadoPago() {
    if (!email) {
      toast.error('Ingresá tu email para continuar')
      return
    }

    setLoading(true)
    try {
      const mpItems = items.map((i) => ({
        id:         i.id,
        title:      i.name,
        quantity:   i.quantity,
        unit_price: Number(i.price),
      }))

      const { init_point } = await createMercadoPagoPreference(mpItems, email)
      clearCart()
      // Redirigir al checkout de MercadoPago
      window.location.href = init_point
    } catch (err) {
      toast.error(err.message ?? 'Error al conectar con MercadoPago')
    } finally {
      setLoading(false)
    }
  }

  function handleWhatsApp() {
    const productList = items
      .map((i) => `• ${i.name} x${i.quantity} = $${(i.price * i.quantity).toLocaleString('es-AR')}`)
      .join('\n')

    const msg = encodeURIComponent(
      `Hola! Quiero realizar el siguiente pedido:\n\n${productList}\n\nTOTAL: $${total.toLocaleString('es-AR')}`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a la tienda
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Resumen del pedido</h1>

        {/* Productos */}
        <div className="card p-5 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
              </div>
              <span className="font-bold text-pink-500">
                ${(item.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 font-bold text-lg">
            <span>Total</span>
            <span className="text-pink-600">${total.toLocaleString('es-AR')}</span>
          </div>
        </div>

        {/* Formulario email */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Datos de contacto</h2>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email (obligatorio para MercadoPago)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Botones de pago */}
        <div className="space-y-3">
          <button
            onClick={handleMercadoPago}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#009EE3] hover:bg-[#0085c8] text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60"
          >
            <CreditCard size={20} />
            {loading ? 'Redirigiendo...' : 'Pagar con MercadoPago'}
          </button>

          <div className="flex items-center gap-3 text-gray-400">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs">o también podés</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Consultar por WhatsApp
          </button>
        </div>

        <p className="text-xs text-center text-gray-400">
          Tus datos están protegidos. Pago procesado de forma segura por MercadoPago.
        </p>
      </div>
    </Layout>
  )
}
