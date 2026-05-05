import { useRef } from 'react'
import { MapPin, Truck, ShieldCheck, Sparkles } from 'lucide-react'
import Layout        from '../components/layout/Layout'
import ProductGrid   from '../components/catalog/ProductGrid'
import CartDrawer    from '../components/catalog/CartDrawer'
import HeroCarousel  from '../components/catalog/HeroCarousel'
import { useProducts } from '../hooks/useProducts'

const VALORES = [
  {
    icon: Sparkles,
    title: 'Piezas únicas',
    desc: 'Cada accesorio es seleccionado a mano. No vas a encontrar lo mismo en ningún otro lado.',
  },
  {
    icon: Truck,
    title: 'Envíos a todo el país',
    desc: 'Despachamos por correo y empresas de transporte. Seguí tu paquete en tiempo real.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra segura',
    desc: 'Pagá con MercadoPago o coordiná por WhatsApp. Tu seguridad es prioridad.',
  },
  {
    icon: MapPin,
    title: 'Con base en Argentina',
    desc: 'Somos un emprendimiento 100% argentino. Cada venta apoya a una pyme local.',
  },
]

export default function StorePage() {
  const { products, loading, error } = useProducts()
  const quienesSomosRef = useRef(null)

  function scrollToQuienesSomos() {
    quienesSomosRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Layout>
      <CartDrawer />

      {/* ── Hero carousel ── */}
      <section className="mb-10 sm:mb-14">
        <HeroCarousel onScrollToSection={scrollToQuienesSomos} />
      </section>

      {/* ── Separador ── */}
      <div id="catalogo" className="flex items-center gap-3 mb-6">
        <hr className="flex-1 border-grayMinimal-200" />
        <span className="text-sm font-semibold text-grayMinimal-500">Nuestros productos</span>
        <hr className="flex-1 border-grayMinimal-200" />
      </div>

      {/* ── Catálogo ── */}
      <ProductGrid products={products} loading={loading} error={error} />

      {/* ── Quiénes somos ── */}
      <section
        ref={quienesSomosRef}
        id="quienes-somos"
        className="mt-20 mb-10 scroll-mt-20"
      >
        {/* Encabezado */}
        <div className="text-center space-y-3 mb-12">
          <span className="inline-block bg-grayMinimal-100 text-grayMinimal-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
            Nuestra historia
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-grayMinimal-900 leading-tight">
            Quiénes somos
          </h2>
          <p className="text-grayMinimal-500 text-base max-w-xl mx-auto leading-relaxed">
            Tiendita Tuti nació de la pasión por la moda femenina y el deseo de ofrecer accesorios
            únicos a precios accesibles. Desde el primer día, nuestro objetivo es que cada cliente
            se sienta especial con lo que lleva puesto.
          </p>
        </div>

        {/* Foto + texto */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-14">
          {/* Imagen placeholder */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-grayMinimal-100 to-grayMinimal-200 aspect-[4/3] flex items-center justify-center">
            <div className="text-center space-y-2 px-8">
              <div className="text-5xl">🛍️</div>
              <p className="text-grayMinimal-500 text-sm font-medium">
                Foto de Tiendita Tuti
              </p>
            </div>
          </div>

          {/* Texto */}
          <div className="space-y-4 text-grayMinimal-600 leading-relaxed">
            <p>
              Empezamos con una mesa llena de pulseras artesanales y muchas ganas de crecer.
              Hoy somos una tienda online con cientos de clientas satisfechas en todo el país.
            </p>
            <p>
              Elegimos cada pieza con cuidado, pensando en tendencias actuales sin perder
              la esencia de lo artesanal. Trabajamos con proveedores de confianza y nos
              actualizamos temporada a temporada.
            </p>
            <p>
              Si tenés alguna consulta, estamos siempre disponibles por WhatsApp.
              Queremos que tu experiencia de compra sea tan linda como lo que recibís.
            </p>
            <div className="pt-2">
              <span className="text-grayMinimal-800 font-bold text-base">— El equipo de Tiendita Tuti 💛</span>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALORES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group card p-5 space-y-3 hover:bg-grayMinimal-100 active:bg-grayMinimal-100 transition-colors duration-200 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-grayMinimal-100 group-hover:bg-grayMinimal-200 group-active:bg-grayMinimal-200 flex items-center justify-center transition-colors duration-200">
                <Icon size={20} className="text-grayMinimal-600 group-hover:text-grayMinimal-800 transition-colors duration-200" />
              </div>
              <h3 className="font-bold text-grayMinimal-800 text-sm">{title}</h3>
              <p className="text-grayMinimal-500 group-hover:text-grayMinimal-700 text-xs leading-relaxed transition-colors duration-200">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

