import { createContext, useContext, useEffect, useState } from 'react'
import { getUserRole, subscribeToAuthChanges } from '../services/authService'

const AuthContext = createContext(null)

const DEMO_USER = { email: 'demo@tiendita.com', uid: 'demo', displayName: 'Demo Admin' }

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [role, setRole]                 = useState(null)
  const [loading, setLoading]           = useState(true)
  const [demoMode, setDemoMode]         = useState(
    () => sessionStorage.getItem('demo_admin') === 'true'
  )

  useEffect(() => {
    if (demoMode) {
      setLoading(false)
      return
    }
    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      if (fbUser) {
        const userRole = await getUserRole(fbUser.uid)
        setFirebaseUser(fbUser)
        setRole(userRole)
      } else {
        setFirebaseUser(null)
        setRole(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [demoMode])

  function enterDemoMode() {
    sessionStorage.setItem('demo_admin', 'true')
    setDemoMode(true)
  }

  function exitDemoMode() {
    sessionStorage.removeItem('demo_admin')
    setDemoMode(false)
    setLoading(true)
  }

  const user    = demoMode ? DEMO_USER : firebaseUser
  const isAdmin = demoMode || role === 'admin'

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, loading, demoMode, enterDemoMode, exitDemoMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
