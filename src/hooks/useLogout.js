import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

/**
 * Hook que centraliza la lógica de cierre de sesión,
 * manejando tanto el modo demo como la autenticación real de Firebase.
 */
export function useLogout() {
  const { demoMode, exitDemoMode } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    if (demoMode) {
      exitDemoMode()
      toast.success('Sesión demo cerrada')
      navigate('/')
      return
    }
    await logout()
    toast.success('Sesión cerrada')
    navigate('/')
  }

  return handleLogout
}
