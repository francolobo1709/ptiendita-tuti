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

const COLLECTION = 'products'

/**
 * Obtiene todos los productos ordenados por fecha de creación desc.
 */
export async function getProducts() {
  // Timeout de 6s para no colgar la UI si Firebase tarda
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), 6000)
  )
  const fetchPromise = (async () => {
    try {
      // Intentar con orden (requiere índice auto-creado por Firestore)
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
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

/**
 * Crea un nuevo producto en Firestore.
 * @param {Object} product - { name, description, price, stock, imageUrl, category }
 */
export async function createProduct(product) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

/**
 * Actualiza un producto existente.
 */
export async function updateProduct(id, data) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    price: data.price !== undefined ? Number(data.price) : undefined,
    stock: data.stock !== undefined ? Number(data.stock) : undefined,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Elimina un producto por ID.
 */
export async function deleteProduct(id) {
  await deleteDoc(doc(db, COLLECTION, id))
}
