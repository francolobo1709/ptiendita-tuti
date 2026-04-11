import { TrendingUp, TrendingDown, Package, Eye, ShoppingBag, DollarSign } from 'lucide-react'

const DEMO_METRICS = [
  {
    id: 1,
    name: 'Pulsera macramé',
    category: 'Bijouterie',
    price: 300,
    sales: 89,
    revenue: 26700,
    views: 567,
    stock: 35,
    trend: '+31%',
    up: true,
  },
  {
    id: 2,
    name: 'Aros dorados perla',
    category: 'Bijouterie',
    price: 400,
    sales: 62,
    revenue: 24800,
    views: 445,
    stock: 20,
    trend: '+24%',
    up: true,
  },
  {
    id: 3,
    name: 'Diadema flores pastel',
    category: 'Accesorios',
    price: 600,
    sales: 47,
    revenue: 28200,
    views: 312,
    stock: 12,
    trend: '+12%',
    up: true,
  },
  {
    id: 4,
    name: 'Cartera mini beige',
    category: 'Carteras',
    price: 2000,
    sales: 31,
    revenue: 62000,
    views: 289,
    stock: 3,
    trend: '+8%',
    up: true,
  },
  {
    id: 5,
    name: 'Remera oversize rosa',
    category: 'Ropa',
    price: 1500,
    sales: 25,
    revenue: 37500,
    views: 198,
    stock: 8,
    trend: '-3%',
    up: false,
  },
  {
    id: 6,
    name: 'Bolso rafia verano',
    category: 'Carteras',
    price: 2500,
    sales: 18,
    revenue: 45000,
    views: 167,
    stock: 0,
    trend: '+5%',
    up: true,
  },
]

const totalRevenue = DEMO_METRICS.reduce((acc, p) => acc + p.revenue, 0)
const totalSales   = DEMO_METRICS.reduce((acc, p) => acc + p.sales, 0)
const totalViews   = DEMO_METRICS.reduce((acc, p) => acc + p.views, 0)
const activeStock  = DEMO_METRICS.filter((p) => p.stock > 0).length
const maxSales     = Math.max(...DEMO_METRICS.map((p) => p.sales))
const sorted       = [...DEMO_METRICS].sort((a, b) => b.sales - a.sales)

const STAT_CARDS = [
  {
    label: 'Ingresos totales',
    value: `$${totalRevenue.toLocaleString('es-AR')}`,
    icon: DollarSign,
    bg: 'bg-emerald-100',
    color: 'text-emerald-600',
    note: 'Últimos 30 días',
  },
  {
    label: 'Unidades vendidas',
    value: totalSales,
    icon: ShoppingBag,
    bg: 'bg-pink-100',
    color: 'text-pink-500',
    note: 'Últimos 30 días',
  },
  {
    label: 'Visitas al catálogo',
    value: totalViews.toLocaleString('es-AR'),
    icon: Eye,
    bg: 'bg-violet-100',
    color: 'text-violet-500',
    note: 'Últimos 30 días',
  },
  {
    label: 'Productos activos',
    value: activeStock,
    icon: Package,
    bg: 'bg-sky-100',
    color: 'text-sky-500',
    note: `${DEMO_METRICS.length - activeStock} sin stock`,
  },
]

export default function AdminMetrics() {
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

      {/* Ranking visual */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
          🏆 Ranking de ventas
          <span className="text-xs font-normal text-gray-400">(últimos 30 días)</span>
        </h3>
        <div className="space-y-4">
          {sorted.map((p, i) => (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-gray-300 w-5 shrink-0">#{i + 1}</span>
                  <span className="text-sm font-semibold text-gray-700 truncate">{p.name}</span>
                  <span className="text-xs text-gray-400 shrink-0 hidden sm:inline">({p.category})</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${p.up ? 'text-emerald-500' : 'text-red-400'}`}>
                    {p.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {p.trend}
                  </span>
                  <span className="text-sm font-bold text-gray-600">{p.sales} uds.</span>
                </div>
              </div>
              <div className="bg-pink-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-pink-300 h-2 rounded-full"
                  style={{ width: `${(p.sales / maxSales) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">📦 Métricas por producto</h3>
            <p className="text-xs text-gray-400 mt-0.5">Datos ficticios de demostración</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Producto</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Precio</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Ventas</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Ingresos</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Visitas</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Stock</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Tendencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DEMO_METRICS.map((p) => (
                <tr key={p.id} className="hover:bg-pink-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    ${p.price.toLocaleString('es-AR')}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-pink-600">{p.sales}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">
                    ${p.revenue.toLocaleString('es-AR')}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{p.views}</td>
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
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-bold inline-flex items-center justify-end gap-0.5 ${p.up ? 'text-emerald-500' : 'text-red-400'}`}>
                      {p.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {p.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
