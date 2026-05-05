import WhatsAppIcon from '../ui/WhatsAppIcon'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491100000000'
const WHATSAPP_MSG    = encodeURIComponent('Hola! Quiero consultar sobre un producto de Tiendita Tuti 🌸')

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 [margin-bottom:env(safe-area-inset-bottom,0px)]"
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  )
}
