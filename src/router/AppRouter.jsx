import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

import StorePage          from '../pages/StorePage'
import LoginPage          from '../pages/LoginPage'
import AdminPage          from '../pages/AdminPage'
import CheckoutPage       from '../pages/CheckoutPage'
import PaymentStatusPage  from '../pages/PaymentStatusPage'
import NotFoundPage       from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/"        element={<StorePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pago"    element={<PaymentStatusPage />} />

        {/* Auth */}
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Ruta admin protegida */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
