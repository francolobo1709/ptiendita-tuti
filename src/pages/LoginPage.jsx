import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Heart, Mail, Lock, Eye, EyeOff, FlaskConical } from 'lucide-react'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)

  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, enterDemoMode }  = useAuth()
  const from      = location.state?.from?.pathname ?? '/admin'

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Bienvenida! 🌸')
      navigate(from, { replace: true })
    } catch {
      toast.error('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  function handleDemoLogin() {
    enterDemoMode()
    toast.success('Modo demo activado 🧪')
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-grayMinimal-50 to-grayMinimal-100">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-grayMinimal-100 rounded-full">
              <Heart size={28} className="text-accent fill-accent" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Tiendita Tuti</h1>
            <p className="text-gray-500 text-sm">Panel de Administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-9"
                  placeholder="admin@tiendita.com"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pl-9 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Divisor + demo — solo visibles en desarrollo */}
          {import.meta.env.DEV && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">o bien</span>
              </div>
            </div>
          )}

          {/* Botón demo — solo visible en desarrollo */}
          {import.meta.env.DEV && (
            <>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
              >
                <FlaskConical size={16} />
                Ingresar en modo demo
              </button>

              {/* Credenciales de prueba */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1.5">
                <p className="font-bold text-amber-900">🔑 Credenciales de prueba (Firebase):</p>
                <p>Email: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">admin@tiendita.com</code></p>
                <p>Contraseña: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">Admin123!</code></p>
                <p className="text-amber-600 text-[11px] pt-1">El modo demo no requiere Firebase y activa métricas de ejemplo.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
