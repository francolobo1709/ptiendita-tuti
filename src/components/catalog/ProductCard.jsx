import { useState } from 'react'
import { ShoppingCart, ImageOff, Info, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { name, description, price, imageUrl, stock } = product
  const [showDesc, setShowDesc] = useState(false)

  function handleAdd() {
    if (stock <= 0) return
    addToCart(product)
    toast.success(`${name} agregado al carrito 🛍️`, { duration: 2000 })
  }

  return (
    <article className="card flex flex-col overflow-hidden group">

      {/* ── Imagen + overlay descripción ── */}
      <div className="relative aspect-square bg-gradient-to-br from-grayMinimal-50 to-grayMinimal-100 overflow-hidden">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-grayMinimal-300">
            <ImageOff size={40} />
          </div>
        )}

        {/* Badge sin stock */}
        {stock <= 0 && !showDesc && (
          <div className="absolute top-2 left-2">
            <span className="bg-gray-800/75 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              Sin stock
            </span>
          </div>
        )}

        {/* Botón "Ver descripción" — aparece en hover o siempre en mobile */}
        {description && !showDesc && (
          <button
            onClick={() => setShowDesc(true)}
            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-accent text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow-md hover:bg-white hover:scale-105 transition-all duration-200 flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100"
          >
            <Info size={11} />
            Ver más
          </button>
        )}

        {/* ── Overlay descripción: se desliza desde abajo ── */}
        <div
          className={`absolute inset-0 bg-white/97 backdrop-blur-sm flex flex-col p-4 transition-all duration-300 ease-out ${
            showDesc ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-bold text-gray-800 text-sm leading-snug pr-2 line-clamp-2">{name}</h4>
            <button
              onClick={() => setShowDesc(false)}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-grayMinimal-100 text-gray-500 hover:text-accent transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed flex-1 overflow-auto">
            {description}
          </p>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-base font-extrabold text-accent">
              ${Number(price).toLocaleString('es-AR')}
            </span>
            <button
              onClick={() => { handleAdd(); setShowDesc(false) }}
              disabled={stock <= 0}
              className="btn-primary flex items-center gap-1 text-xs py-1.5 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={12} />
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* ── Info inferior ── */}
      <div className="p-3.5 flex flex-col gap-2.5">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">{name}</h3>
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-extrabold text-accent">
            ${Number(price).toLocaleString('es-AR')}
          </span>
          <button
            onClick={handleAdd}
            disabled={stock <= 0}
            className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <ShoppingCart size={13} />
            Agregar
          </button>
        </div>
      </div>

    </article>
  )
}
