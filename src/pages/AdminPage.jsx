import { useState } from 'react'
import { Plus, Pencil, Trash2, PackageX, LogOut, BarChart2, Package } from 'lucide-react'
import AdminMetrics from '../components/admin/AdminMetrics'
import ProductForm from '../components/admin/ProductForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useProducts } from '../hooks/useProducts'
import { deleteProduct } from '../services/productService'
import { useAuth } from '../context/AuthContext'
import { useLogout } from '../hooks/useLogout'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const { products, loading, refetch } = useProducts()
  const [showForm, setShowForm]        = useState(false)
  const [editTarget, setEditTarget]    = useState(null)
  const [tab, setTab]                  = useState('metricas')
  const { demoMode }                   = useAuth()
  const handleLogout                   = useLogout()

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return
    try {
      await deleteProduct(product.id)
      toast.success('Producto eliminado')
      refetch()
    } catch {
      toast.error('Error al eliminar el producto')
    }
  }

  function handleEdit(product) {
    setEditTarget(product)
    setShowForm(true)
    setTab('productos')
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditTarget(null)
    refetch()
  }

  const TABS = [
    { id: 'metricas',  label: 'Métricas',  Icon: BarChart2 },
    { id: 'productos', label: 'Productos', Icon: Package   },
  ]

  return (
    <div className="min-h-screen bg-grayMinimal-50">

      {/* ── Header ── */}
      <header className="bg-white border-b border-grayMinimal-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo + tabs */}
          <div className="flex items-center gap-5 min-w-0">
            <h1 className="text-lg font-bold text-accent shrink-0">Panel Admin</h1>
            <nav className="flex items-center gap-1">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    tab === id
                      ? 'bg-grayMinimal-100 text-grayMinimal-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 shrink-0">
            {tab === 'productos' && (
              <button
                onClick={() => { setEditTarget(null); setShowForm(true) }}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Nuevo producto</span>
                <span className="sm:hidden">+</span>
              </button>
            )}
            <button onClick={handleLogout} className="btn-ghost flex items-center gap-1 text-sm">
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>

        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Banner modo demo */}
        {demoMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
            <span className="text-base leading-tight mt-0.5">🧪</span>
            <span>
              <strong>Modo Demo activo</strong> — Estás navegando sin cuenta real. La gestión de productos y las métricas están conectadas a Firebase en vivo.
            </span>
          </div>
        )}

        {/* ── Tab: Métricas ── */}
        {tab === 'metricas' && <AdminMetrics />}

        {/* ── Tab: Productos ── */}
        {tab === 'productos' && (
          <>
            {/* Formulario inline */}
            {showForm && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-800">
                    {editTarget ? 'Editar producto' : 'Nuevo producto'}
                  </h2>
                  <button
                    onClick={() => { setShowForm(false); setEditTarget(null) }}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>
                <ProductForm product={editTarget} onSuccess={handleFormSuccess} />
              </div>
            )}

            {/* Tabla de productos */}
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">
                  Productos ({products.length})
                </h2>
              </div>

              {loading && <LoadingSpinner />}

              {!loading && products.length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <PackageX size={48} className="mx-auto mb-3 text-grayMinimal-300" />
                  <p>No hay productos. ¡Crea el primero!</p>
                </div>
              )}

              {!loading && products.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-grayMinimal-50 text-left">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-600">Producto</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Precio</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Stock</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Categoría</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-grayMinimal-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {p.imageUrl ? (
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-grayMinimal-100 flex items-center justify-center text-grayMinimal-400 shrink-0">
                                  ?
                                </div>
                              )}
                              <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-accent font-semibold">
                            ${Number(p.price).toLocaleString('es-AR')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                            }`}>
                              {p.stock > 0 ? p.stock : 'Sin stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{p.category || '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-500 transition-colors"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(p)}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
