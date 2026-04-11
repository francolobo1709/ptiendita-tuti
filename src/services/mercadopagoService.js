/**
 * Crea una preferencia de pago en MercadoPago a través del backend proxy.
 * El backend Firebase Function firma la request con el Access Token privado.
 *
 * @param {Array<{id,title,quantity,unit_price}>} items
 * @param {string} buyerEmail
 * @returns {Promise<{init_point: string, sandbox_init_point: string}>}
 */
export async function createMercadoPagoPreference(items, buyerEmail) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const response = await fetch(`${backendUrl}/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, buyerEmail }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message ?? 'Error al crear la preferencia de pago')
  }

  return response.json()
}
