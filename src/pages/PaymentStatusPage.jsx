import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, ShoppingBag } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useCart } from '../context/CartContext'
import WhatsAppIcon from '../components/ui/WhatsAppIcon'

const STATUS_CONFIG = {
  success: {
    icon:    CheckCircle,
    color:   'text-emerald-500',
    bgColor: 'bg-emerald-50',
    border:  'border-emerald-100',
    title:   '¡Pago aprobado!',
    message: 'Tu pedido fue procesado correctamente. En breve recibirás un email con la confirmación.',
  },
  failure: {
    icon:    XCircle,
    color:   'text-red-500',
    bgColor: 'bg-red-50',
    border:  'border-red-100',
    title:   'El pago no se pudo completar',
    message: 'Hubo un problema al procesar tu pago. Podés intentarlo de nuevo o contactarnos por WhatsApp.',
  },
  pending: {
    icon:    Clock,
    color:   'text-yellow-500',
    bgColor: 'bg-yellow-50',
    border:  'border-yellow-100',
    title:   'Pago pendiente',
    message: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme. Revisá tu email.',
  },
}

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491100000000'

export default function PaymentStatusPage() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const { clearCart } = useCart()
  const statusKey  = params.get('status') ?? 'pending'
  const config     = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending
  const { icon: Icon, color, bgColor, border, title, message } = config

  // Limpiar el carrito una sola vez cuando el pago fue aprobado
  useEffect(() => {
    if (statusKey === 'success') clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleWhatsApp() {
    const msg = encodeURIComponent(
      statusKey === 'failure'
        ? 'Hola! Tuve un problema con el pago en MercadoPago y necesito ayuda.'
        : 'Hola! Quiero consultar el estado de mi pedido.'
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto py-16 px-4">
        <div className={`card p-8 text-center space-y-6 border ${border}`}>

          {/* Icono de estado */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${bgColor} mx-auto`}>
            <Icon size={40} className={color} />
          </div>

          {/* Título y mensaje */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-grayMinimal-800">{title}</h1>
            <p className="text-grayMinimal-500 text-sm leading-relaxed">{message}</p>
          </div>

          {/* ID de pago si viene en los params */}
          {params.get('payment_id') && (
            <div className="bg-grayMinimal-50 rounded-xl px-4 py-3 text-left space-y-1">
              <p className="text-xs font-semibold text-grayMinimal-400 uppercase tracking-wide">ID de pago</p>
              <p className="text-sm font-mono text-grayMinimal-700">{params.get('payment_id')}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/')}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              Volver a la tienda
            </button>

            {(statusKey === 'failure' || statusKey === 'pending') && (
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-full transition-all duration-200 active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Contactar por WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
