import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Sube una imagen al Firebase Storage y retorna su URL pública.
 * @param {File} file - Archivo de imagen a subir
 * @param {Function} onProgress - Callback con porcentaje de progreso (0-100)
 * @returns {Promise<string>} URL pública de la imagen
 */
export function uploadProductImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    const fileName = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const storageRef = ref(storage, fileName)
    const task = uploadBytesResumable(storageRef, file)

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        if (onProgress) onProgress(pct)
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve(url)
      }
    )
  })
}

/**
 * Elimina una imagen de Storage dado su URL.
 */
export async function deleteProductImage(imageUrl) {
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch {
    // Si la imagen no existe, ignorar el error
  }
}
