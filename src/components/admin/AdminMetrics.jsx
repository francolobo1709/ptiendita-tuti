import { TrendingUp, Package, ShoppingBag, DollarSign, ClipboardList } from 'lucide-react'
import { useMetrics } from '../../hooks/useMetrics'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function AdminMetrics() {
  const { metrics, loading, error } = useMetrics()

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="card p-6 text-center text-red-500 text-sm">
        Error al cargar métricas: {error}
      </div>
    )
  }

  const {
    totalRevenue,
    totalUnits,
    totalOrders,
    activeStock,
    totalProducts,
    productMetrics,
    maxSales,
  } = metrics

  const STAT_CARDS = [
    {
      label: 'Ingresos totales',
      value: `$${totalRevenue.toLocaleString('es-AR')}`,
      icon:  DollarSign,
      bg:    'bg-emerald-100',
      color: 'text-emerald-600',
      note:  `${totalOrders} ${totalOrders === 1 ? 'orden pagada' : 'órdenes pagadas'}`,
    },
    {
      label: 'Unidades vendidas',
      value: totalUnits.toLocaleString('es-AR'),
      icon:  ShoppingBag,
      bg:    'bg-grayMinimal-100',
      color: 'text-grayMinimal-500',
      note:  `en ${totalOrders} pedidos`,
    },
    {
      label: 'Órdenes pagadas',
      value: totalOrders,
      icon:  ClipboardList,
      bg:    'bg-sky-100',
      color: 'text-sky-500',
      note:  'Total histórico',
    },
    {
      label: 'Productos activos',
      value: activeStock,
      icon:  Package,
      bg:    'bg-violet-100',
      color: 'text-violet-500',
      note:  `${totalProducts - activeStock} sin stock`,
    },
  ]

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, bg, color, note }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider truncate">{label}</p>
                <p className="text-2xl font-extrabold text-gray-800 mt-1 leading-tight">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{note}</p>
              </div>
              <div className={`shrink-0 p-2.5 rounded-xl ${bg} ${color}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {productMetrics.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <ShoppingBag size={40} className="mx-auto mb-3 text-grayMinimal-200" />
          <p className="font-medium">Todavía no hay ventas registradas.</p>
          <p className="text-sm mt-1">Las métricas por producto aparecerán cuando se procesen los primeros pagos.</p>
        </div>
      ) : (
        <>
          {/* Ranking visual */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              🏆 Ranking de ventas
              <span className="text-xs font-normal text-gray-400">(histórico)</span>
            </h3>
            <div className="space-y-4">
              {productMetrics.map((p, i) => (
                <div key={p.productId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-gray-300 w-5 shrink-0">#{i + 1}</span>
                      <span className="text-sm font-semibold text-gray-700 truncate">{p.name}</span>
                      {p.category && (
                        <span className="text-xs text-gray-400 shrink-0 hidden sm:inline">({p.category})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold flex items-center gap-0.5 text-emerald-500">
                        <TrendingUp size={12} />
                        ${p.revenue.toLocaleString('es-AR')}
                      </span>
                      <span className="text-sm font-bold text-gray-600">{p.sales} uds.</span>
                    </div>
                  </div>
                  <div className="bg-grayMinimal-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent to-grayMinimal-400 h-2 rounded-full"
                      style={{ width: `${(p.sales / maxSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla detallada */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">📦 Métricas por producto</h3>
              <p className="text-xs text-gray-400 mt-0.5">Datos reales de órdenes pagadas</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-grayMinimal-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Producto</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Precio actual</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Uds. vendidas</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Ingresos</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productMetrics.map((p) => (
                    <tr key={p.productId} className="hover:bg-grayMinimal-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{p.name}</p>
                        {p.category && <p className="text-xs text-gray-400">{p.category}</p>}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        ${p.price.toLocaleString('es-AR')}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-accent">{p.sales}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600">
                        ${p.revenue.toLocaleString('es-AR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          p.stock > 5
                            ? 'bg-green-100 text-green-700'
                            : p.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {p.stock > 0 ? p.stock : 'Sin stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
