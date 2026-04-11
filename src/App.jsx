import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#fff',
              color: '#374151',
              boxShadow: '0 4px 20px -2px rgba(255,105,180,0.2)',
            },
            success: {
              iconTheme: { primary: '#ff69b4', secondary: '#fff' },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  )
}
