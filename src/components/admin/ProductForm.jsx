import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, X, Save } from 'lucide-react'
import { createProduct, updateProduct } from '../../services/productService'
import { uploadProductImage } from '../../services/storageService'
import toast from 'react-hot-toast'

const INITIAL_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
}

export default function ProductForm({ product = null, onSuccess }) {
  const isEdit = Boolean(product)

  const [form, setForm]           = useState(isEdit ? {
    name:        product.name        ?? '',
    description: product.description ?? '',
    price:       String(product.price ?? ''),
    stock:       String(product.stock ?? ''),
    category:    product.category    ?? '',
  } : INITIAL_FORM)

  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.imageUrl ?? null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving]             = useState(false)
  const fileInputRef                    = useRef(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validación: solo imágenes, max 5MB
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(isEdit ? product?.imageUrl ?? null : null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = product?.imageUrl ?? null

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, setUploadProgress)
        setUploadProgress(0)
      }

      const data = {
        name:        form.name.trim(),
        description: form.description.trim(),
        price:       form.price,
        stock:       form.stock,
        category:    form.category.trim(),
        imageUrl,
      }

      if (isEdit) {
        await updateProduct(product.id, data)
        toast.success('Producto actualizado ✅')
      } else {
        await createProduct(data)
        toast.success('Producto creado 🎉')
        setForm(INITIAL_FORM)
        setImageFile(null)
        setImagePreview(null)
      }

      onSuccess?.()
    } catch (err) {
      toast.error(err.message ?? 'Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Imagen */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Imagen del producto</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-colors ${
            imagePreview ? 'border-pink-300' : 'border-gray-300 hover:border-pink-300'
          }`}
        >
          {imagePreview ? (
            <div className="relative h-48">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage() }}
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1 hover:bg-red-50 transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="h-36 flex flex-col items-center justify-center gap-2 text-gray-400">
              <Upload size={28} className="text-pink-300" />
              <span className="text-sm">Click para subir imagen</span>
              <span className="text-xs">PNG, JPG, WEBP • máx. 5MB</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-pink-400 h-1.5 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Nombre */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Nombre *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          maxLength={100}
          className="input-field"
          placeholder="Ej: Bolso rosa trendy"
        />
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          className="input-field resize-none"
          placeholder="Describe el producto brevemente..."
        />
      </div>

      {/* Precio y Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Precio (ARS) *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="input-field"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Stock *</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            step="1"
            className="input-field"
            placeholder="0"
          />
        </div>
      </div>

      {/* Categoría */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Categoría</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          maxLength={50}
          className="input-field"
          placeholder="Ej: Bolsos, Ropa, Accesorios..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base disabled:opacity-60"
      >
        <Save size={18} />
        {saving ? 'Guardando...' : isEdit ? 'Actualizar producto' : 'Crear producto'}
      </button>
    </form>
  )
}
