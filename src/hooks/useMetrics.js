import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import { getProducts } from '../services/productService'

/**
 * Agrega métricas reales desde las colecciones `orders` (pagadas) y `products`.
 * Solo puede ser usado por un admin autenticado (Firestore rules: isAdmin()).
 */
export function useMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Consultas en paralelo: órdenes pagadas + todos los productos
        const [ordersSnap, products] = await Promise.all([
          getDocs(query(collection(db, 'orders'), where('status', '==', 'paid'))),
          getProducts(),
        ])

        const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

        // Mapa productId → detalle del catálogo (precio actual, stock, categoría)
        const productDetails = {}
        for (const p of products) {
          productDetails[p.id] = p
        }

        // Agregación por producto
        const productMap   = {}
        let totalRevenue   = 0
        let totalUnits     = 0

        for (const order of orders) {
          totalRevenue += order.total ?? 0
          for (const item of (order.items ?? [])) {
            totalUnits += item.quantity
            if (!productMap[item.productId]) {
              productMap[item.productId] = {
                productId: item.productId,
                name:      item.name,
                sales:     0,
                revenue:   0,
              }
            }
            productMap[item.productId].sales   += item.quantity
            productMap[item.productId].revenue += item.unitPrice * item.quantity
          }
        }

        // Enriquecer con datos del catálogo (precio, stock, categoría)
        const productMetrics = Object.values(productMap)
          .map((pm) => ({
            ...pm,
            price:    productDetails[pm.productId]?.price    ?? 0,
            stock:    productDetails[pm.productId]?.stock    ?? 0,
            category: productDetails[pm.productId]?.category ?? '',
          }))
          .sort((a, b) => b.sales - a.sales)

        const activeStock = products.filter((p) => p.stock > 0).length

        setMetrics({
          totalRevenue,
          totalUnits,
          totalOrders:    orders.length,
          activeStock,
          totalProducts:  products.length,
          productMetrics,
          maxSales:       productMetrics.length > 0 ? productMetrics[0].sales : 1,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return { metrics, loading, error }
}
