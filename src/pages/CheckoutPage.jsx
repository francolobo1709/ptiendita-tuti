import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, CreditCard, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { createMercadoPagoPreference } from '../services/mercadopagoService'
import Layout from '../components/layout/Layout'
import WhatsAppIcon from '../components/ui/WhatsAppIcon'
import toast from 'react-hot-toast'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491100000000'

export default function CheckoutPage() {
  const { items, total } = useCart()
  const navigate                    = useNavigate()
  const [email, setEmail]           = useState('')
  const [loading, setLoading]       = useState(false)

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-20 space-y-4">
          <ShoppingBag size={56} className="mx-auto text-grayMinimal-300" />
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
      // 🔒 Solo mandamos id y quantity — el precio lo valida el backend desde Firestore
      const mpItems = items.map((i) => ({
        id:       i.id,
        quantity: i.quantity,
      }))

      const { init_point } = await createMercadoPagoPreference(mpItems, email)
      // El carrito se limpia en PaymentStatusPage cuando el pago es aprobado.
      // Si lo borramos aquí y la navegación falla, el usuario pierde su carrito.
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
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors"
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
              <span className="font-bold text-accent">
                ${(item.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 font-bold text-lg">
            <span>Total</span>
            <span className="text-accent">${total.toLocaleString('es-AR')}</span>
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
            <WhatsAppIcon className="w-5 h-5" />
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
