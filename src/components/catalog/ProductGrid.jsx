import ProductCard    from './ProductCard'
import LoadingSpinner from '../ui/LoadingSpinner'

// Productos de demo para mostrar mientras Firebase no tiene datos cargados
const DEMO_PRODUCTS = [
  { id: 'd1', name: 'Pulsera macramé', description: 'Pulsera artesanal tejida a mano con hilo de macramé y dije dorado. Regulable, ideal para regalar.', price: 300, stock: 35, category: 'Bijouterie', imageUrl: '' },
  { id: 'd2', name: 'Aros dorados perla', description: 'Aros colgantes con perla sintética y base dorada hipoalergénica. Estilo delicado y versátil.', price: 400, stock: 20, category: 'Bijouterie', imageUrl: '' },
  { id: 'd3', name: 'Diadema flores pastel', description: 'Diadema de flores de tela en tonos pastel. Perfecta para primavera, combina con cualquier look.', price: 600, stock: 12, category: 'Accesorios', imageUrl: '' },
  { id: 'd4', name: 'Cartera mini beige', description: 'Cartera mini en cuero sintético color beige con correa ajustable. Cabe celular, llaves y billetera.', price: 2000, stock: 3, category: 'Carteras', imageUrl: '' },
  { id: 'd5', name: 'Remera oversize rosa', description: 'Remera de algodón oversize en rosa empolvado. Suave al tacto, talle único hasta el XL.', price: 1500, stock: 8, category: 'Ropa', imageUrl: '' },
  { id: 'd6', name: 'Bolso rafia verano', description: 'Bolso tejido en rafia natural con asa corta y larga. Capacidad amplia, viene con bolsillo interior.', price: 2500, stock: 0, category: 'Carteras', imageUrl: '' },
]

export default function ProductGrid({ products, loading, error }) {
  if (loading) return <LoadingSpinner />

  // Si Firebase falló o tardó demasiado, mostramos demo con aviso
  const isDemo = error || products.length === 0
  const displayProducts = isDemo ? DEMO_PRODUCTS : products

  return (
    <div className="space-y-4">
      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2 mb-2">
          <span className="text-base leading-tight mt-0.5">🌸</span>
          <span>
            <strong>Vista previa</strong> — Estos son productos de ejemplo. Agregá los tuyos desde el{' '}
            <a href="/login" className="underline font-semibold">Panel Admin</a>.
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
