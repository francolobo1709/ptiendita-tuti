import { Heart } from 'lucide-react'
import Layout      from '../components/layout/Layout'
import ProductGrid from '../components/catalog/ProductGrid'
import CartDrawer  from '../components/catalog/CartDrawer'
import { useProducts } from '../hooks/useProducts'

export default function StorePage() {
  const { products, loading, error } = useProducts()

  return (
    <Layout>
      <CartDrawer />

      {/* Hero */}
      <section className="text-center py-10 sm:py-14 space-y-4">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 text-sm font-semibold px-4 py-1.5 rounded-full">
          <Heart size={14} className="fill-pink-400" />
          Nueva temporada disponible 🌸
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-800 leading-tight">
          Bienvenida a<br />
          <span className="text-pink-400">Tiendita Tuti</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto">
          Accesorios y ropa con onda para vos. Envíos a todo el país 💕
        </p>
      </section>

      {/* Separador */}
      <div className="flex items-center gap-3 mb-6">
        <hr className="flex-1 border-pink-200" />
        <span className="text-sm font-semibold text-pink-400">Nuestros productos</span>
        <hr className="flex-1 border-pink-200" />
      </div>

      {/* Catálogo */}
      <ProductGrid products={products} loading={loading} error={error} />
    </Layout>
  )
}
