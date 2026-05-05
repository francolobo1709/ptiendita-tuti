import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, LogOut, Settings } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useLogout'

export default function Navbar() {
  const { count, setIsOpen } = useCart()
  const { user, isAdmin, demoMode } = useAuth()
  const handleLogout = useLogout()

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-grayMinimal-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="text-accent fill-accent" size={24} />
          <span className="text-xl font-bold text-accent tracking-tight">
            Tiendita Tuti
          </span>
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {/* Admin: si ya es admin va directo al panel, si no va al login */}
          <Link
            to={isAdmin ? '/admin' : '/login'}
            className="btn-ghost flex items-center gap-1.5 text-sm"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">{isAdmin ? 'Panel Admin' : 'Admin'}</span>
          </Link>

          {(user || demoMode) && (
            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center gap-1 text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}

          {/* Carrito */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative btn-primary flex items-center gap-2"
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
