import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION  = 'products'
const CACHE_KEY   = 'tuti_products_cache'
const CACHE_TTL   = 10 * 60 * 1000   // 10 minutos en ms

// ─── helpers de cache ────────────────────────────────────────

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null   // expirado
    return data
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // localStorage puede estar lleno o deshabilitado — no es crítico
  }
}

function clearCache() {
  localStorage.removeItem(CACHE_KEY)
}

// ─── queries Firestore ───────────────────────────────────────

async function fetchFromFirestore() {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), 6000)
  )
  const fetchPromise = (async () => {
    try {
      const q    = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch {
      // Fallback sin orderBy si el índice no existe aún
      const snap = await getDocs(collection(db, COLLECTION))
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    }
  })()
  return Promise.race([fetchPromise, timeoutPromise])
}

// ─── API pública ─────────────────────────────────────────────

/**
 * Obtiene todos los productos.
 * Sirve primero desde cache (localStorage, TTL 10 min).
 * Si el cache expiró o no existe, consulta Firestore y renueva el cache.
 */
export async function getProducts() {
  const cached = readCache()
  if (cached) return cached

  const products = await fetchFromFirestore()
  writeCache(products)
  return products
}

/**
 * Crea un nuevo producto en Firestore e invalida el cache.
 * @param {Object} product - { name, description, price, stock, imageUrl, category }
 */
export async function createProduct(product) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...product,
    price:     Number(product.price),
    stock:     Number(product.stock),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  clearCache()
  return ref.id
}

/**
 * Actualiza un producto existente e invalida el cache.
 */
export async function updateProduct(id, data) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    price:     data.price !== undefined ? Number(data.price) : undefined,
    stock:     data.stock !== undefined ? Number(data.stock) : undefined,
    updatedAt: serverTimestamp(),
  })
  clearCache()
}

/**
 * Elimina un producto e invalida el cache.
 */
export async function deleteProduct(id) {
  await deleteDoc(doc(db, COLLECTION, id))
  clearCache()
}

