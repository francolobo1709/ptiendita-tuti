import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 mt-auto py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
        <p className="flex items-center gap-1">
          Hecho con <Heart size={14} className="text-pink-400 fill-pink-300" /> por Tiendita Tuti
        </p>
        <p>&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
