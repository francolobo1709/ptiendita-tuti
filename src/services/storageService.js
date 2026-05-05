const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

/**
 * Pide una firma al backend y sube la imagen directo a Cloudinary.
 * El API Secret NUNCA toca el navegador.
 *
 * @param {File}     file        - Archivo de imagen a subir
 * @param {Function} onProgress  - Callback con porcentaje 0-100 (usa XHR)
 * @returns {Promise<string>}    - URL segura de la imagen en Cloudinary
 */
export async function uploadProductImage(file, onProgress) {
  if (!BACKEND_URL) {
    throw new Error('VITE_BACKEND_URL no configurado.')
  }

  // 1️⃣  Pedir firma al backend
  const signRes = await fetch(`${BACKEND_URL}/sign-upload`, { method: 'POST' })
  if (!signRes.ok) throw new Error('No se pudo obtener la firma de Cloudinary')
  const { timestamp, signature, apiKey, cloudName, folder } = await signRes.json()

  // 2️⃣  Construir FormData para el upload directo
  const form = new FormData()
  form.append('file',      file)
  form.append('timestamp', timestamp)
  form.append('signature', signature)
  form.append('api_key',   apiKey)
  form.append('folder',    folder)
  // Transformación automática: entregar WebP, máx 800px ancho, calidad auto
  form.append('transformation', 'q_auto,f_auto,w_800,c_limit')

  // 3️⃣  Subir con XHR para tener progreso real
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl)

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        resolve(data.secure_url)
      } else {
        reject(new Error('Error al subir la imagen a Cloudinary'))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Error de red al subir imagen')))
    xhr.send(form)
  })
}

/**
 * Elimina una imagen de Cloudinary dado su secure_url.
 * La eliminación real debe hacerse desde el backend (requiere API Secret).
 * Esta función es un stub para mantener compatibilidad con ProductForm.
 * Si necesitás eliminar imágenes del servidor, agregá un endpoint DELETE /delete-image.
 */
export async function deleteProductImage(_imageUrl) {
  // No-op en el cliente: la firma para delete requiere el API Secret del servidor.
  // Los archivos huérfanos se pueden limpiar con la API de Cloudinary desde el panel.
}

