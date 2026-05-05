import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    badge:    'Nueva temporada ✨',
    title:    'Accesorios que te definen',
    subtitle: 'Pulseras, aros y bijouterie artesanal con onda. Piezas únicas para vos.',
    bg:       'from-grayMinimal-800 to-grayMinimal-600',
    textColor:'text-white',
  },
  {
    id: 2,
    badge:    'Envíos a todo el país 📦',
    title:    'Llevate lo que más te gusta',
    subtitle: 'Comprá online y recibí en la puerta de tu casa. Rápido y seguro.',
    bg:       'from-grayMinimal-700 to-grayMinimal-500',
    textColor:'text-white',
  },
  {
    id: 3,
    badge:    'Hecho con amor 💛',
    title:    'Moda femenina para toda ocasión',
    subtitle: 'Ropa, carteras y accesorios pensados para el día a día con estilo.',
    bg:       'from-grayMinimal-900 to-grayMinimal-700',
    textColor:'text-white',
  },
]

const AUTOPLAY_MS = 5000

export default function HeroCarousel({ onScrollToSection }) {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = SLIDES[current]

  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative h-72 sm:h-96">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 bg-gradient-to-br ${s.bg} flex flex-col items-center justify-center text-center px-8 transition-opacity duration-700 ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Badge */}
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide">
              {s.badge}
            </span>

            {/* Título */}
            <h2 className={`text-2xl sm:text-4xl font-extrabold ${s.textColor} leading-tight mb-3 max-w-xl`}>
              {s.title}
            </h2>

            {/* Subtítulo */}
            <p className="text-white/80 text-sm sm:text-base max-w-sm mb-6">
              {s.subtitle}
            </p>

            {/* Botones CTA */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#catalogo"
                onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="bg-white text-grayMinimal-900 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-grayMinimal-100 transition-colors"
              >
                Ver productos
              </a>
              <button
                onClick={onScrollToSection}
                className="border border-white/60 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors"
              >
                Quiénes somos
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Flecha izquierda */}
      <button
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Flecha derecha */}
      <button
        onClick={next}
        aria-label="Siguiente slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
