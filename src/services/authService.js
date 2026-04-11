import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

/**
 * Login con email/password. Lanza error si las credenciales son inválidas.
 */
export async function login(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function logout() {
  await signOut(auth)
}

/**
 * Obtiene el rol del usuario desde Firestore.
 * Retorna 'admin' | 'user' | null
 */
export async function getUserRole(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return snap.data().role ?? 'user'
}

/**
 * Suscribe a los cambios de auth state. Retorna la función unsubscribe.
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback)
}
