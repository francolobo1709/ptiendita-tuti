import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, ShoppingBag } from 'lucide-react'
import Layout from '../components/layout/Layout'

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
  const statusKey  = params.get('status') ?? 'pending'
  const config     = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending
  const { icon: Icon, color, bgColor, border, title, message } = config

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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar por WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
