import Navbar         from './Navbar'
import Footer         from './Footer'
import WhatsAppButton from './WhatsAppButton'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
