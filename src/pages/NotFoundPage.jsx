import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grayMinimal-50 px-4">
      <div className="text-center space-y-5">
        <div className="text-8xl font-extrabold text-grayMinimal-200">404</div>
        <h1 className="text-2xl font-bold text-gray-700">Página no encontrada</h1>
        <p className="text-gray-400">Ups, parece que esta página no existe.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Heart size={16} />
          Volver a la tienda
        </Link>
      </div>
    </div>
  )
}
