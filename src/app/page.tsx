'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Hotel,
  Menu,
  X,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Shield,
  Wifi,
  Coffee,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const navLinks = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Habitaciones', href: '#rooms' },
  { label: 'Servicios', href: '#services' },
  { label: 'Galería', href: '#gallery' },
  { label: 'Testimonios', href: '#testimonials' },
  { label: 'Contacto', href: '#contact' },
];

const rooms = [
  {
    name: 'Habitación Estándar',
    price: 80,
    image: '🏠',
    size: '25 m²',
    capacity: 2,
    description:
      'Espacio acogedor con todas las comodidades básicas para una estancia confortable.',
  },
  {
    name: 'Habitación Deluxe',
    price: 150,
    image: '🌟',
    size: '40 m²',
    capacity: 3,
    description: 'Amplia habitación con vistas panorámicas y acabados de lujo.',
  },
  {
    name: 'Suite Presidencial',
    price: 300,
    image: '👑',
    size: '80 m²',
    capacity: 4,
    description: 'La máxima experiencia de lujo con sala de estar independiente y jacuzzi.',
  },
  {
    name: 'Habitación Familiar',
    price: 200,
    image: '👨‍👩‍👧‍👦',
    size: '55 m²',
    capacity: 5,
    description: 'Perfecta para familias, con espacios separados y entretenimiento infantil.',
  },
];

const services = [
  {
    icon: Wifi,
    title: 'WiFi Premium',
    description: 'Conexión de alta velocidad en todas las instalaciones',
  },
  {
    icon: Coffee,
    title: 'Restaurante',
    description: 'Cocina internacional con ingredientes locales frescos',
  },
  { icon: Users, title: 'Spa & Wellness', description: 'Masajes, sauna y centro de relajación' },
  { icon: Shield, title: 'Seguridad 24/7', description: 'Vigilancia permanente y acceso seguro' },
  { icon: Calendar, title: 'Eventos', description: 'Salones para reuniones y celebraciones' },
  { icon: Sparkles, title: 'Lavandería', description: 'Servicio de lavandería y tintorería' },
];

const testimonials = [
  {
    name: 'María García',
    role: 'Huésped frecuente',
    text: 'Una experiencia inolvidable. El personal es increíblemente atento y las habitaciones son espectaculares.',
    rating: 5,
  },
  {
    name: 'Carlos López',
    role: 'Viajero de negocios',
    text: 'Excelente ubicación y servicios. El WiFi es rápido y el ambiente de trabajo es perfecto.',
    rating: 5,
  },
  {
    name: 'Ana Martínez',
    role: 'Turista internacional',
    text: 'La suite presidencial superó todas mis expectativas. Volveré sin dudarlo.',
    rating: 5,
  },
  {
    name: 'Roberto Sánchez',
    role: 'Familia en vacaciones',
    text: 'Las habitaciones familiares son ideales. Mis hijos disfrutaron muchísimo.',
    rating: 4,
  },
];

const gallery = [
  { label: 'Lobby Principal', emoji: '🏛️' },
  { label: 'Piscina', emoji: '🏊' },
  { label: 'Restaurante', emoji: '🍽️' },
  { label: 'Spa', emoji: '💆' },
  { label: 'Gimnasio', emoji: '🏋️' },
  { label: 'Terraza', emoji: '🌅' },
];

const faqs = [
  {
    q: '¿Cuál es el horario de check-in y check-out?',
    a: 'El check-in es a partir de las 15:00 hrs y el check-out hasta las 12:00 hrs. Ofrecemos opciones de early check-in y late check-out sujetas a disponibilidad.',
  },
  {
    q: '¿Aceptan mascotas?',
    a: 'Sí, contamos con habitaciones pet-friendly. Es necesario informar al momento de la reserva.',
  },
  {
    q: '¿Tienen estacionamiento?',
    a: 'Sí, ofrecemos estacionamiento gratuito para nuestros huéspedes con vigilancia las 24 horas.',
  },
  {
    q: '¿Ofrecen transporte desde el aeropuerto?',
    a: 'Sí, contamos con servicio de transporte aeropuerto-hotel con costo adicional. Reserve con 24 horas de anticipación.',
  },
  {
    q: '¿Puedo cancelar mi reserva?',
    a: 'Ofrecemos cancelación gratuita hasta 48 horas antes de la fecha de llegada. Consulte nuestra política de cancelación para más detalles.',
  },
  {
    q: '¿Hay opciones de alimentos para dietas especiales?',
    a: 'Sí, nuestro restaurante se adapta a necesidades dietéticas especiales. Por favor, notifíquenos con anticipación.',
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-sm backdrop-blur-sm' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="#hero" className="flex items-center gap-2">
            <Hotel className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Grand Hotel</span>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Reservar ahora
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-gray-600 lg:hidden"
            aria-label="Menú"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t bg-white px-4 pb-6 pt-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600"
                >
                  {l.label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white"
              >
                Reservar ahora
              </Link>
            </nav>
          </div>
        )}
      </header>

      <section
        id="hero"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Bienvenido al mejor hotel de la ciudad</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Donde el lujo se encuentra con la comodidad
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Disfrute de una estancia inolvidable en nuestras instalaciones de primer nivel.
            Habitaciones elegantes, gastronomía excepcional y servicios personalizados.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50"
            >
              Reservar ahora
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#rooms"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Ver habitaciones
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '150+', label: 'Habitaciones' },
              { value: '98%', label: 'Satisfacción' },
              { value: '12K+', label: 'Huéspedes' },
              { value: '4.9', label: 'Calificación' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-blue-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section id="rooms" className="bg-gray-50 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
              Habitaciones
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Nuestras habitaciones
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Descubre nuestras opciones de alojamiento diseñadas para brindarte la máxima
              comodidad.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <div
                key={room.name}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-xl"
              >
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-5xl">
                  {room.image}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{room.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {room.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {room.capacity} pers.
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${room.price}</span>
                    <span className="text-sm text-gray-500">/noche</span>
                  </div>
                  <Link
                    href="/login"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700">
              Servicios
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Todo lo que necesitas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Disfruta de nuestras instalaciones y servicios diseñados para hacer de tu estancia una
              experiencia única.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-gray-200 p-6 transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-gray-50 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
              Galería
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Conoce nuestras instalaciones
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Un vistazo a nuestros espacios diseñados para tu confort y bienestar.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div key={item.label} className="group relative overflow-hidden rounded-2xl">
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-6xl transition-transform duration-500 group-hover:scale-110">
                  {item.emoji}
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-lg font-semibold text-white">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700">
              Testimonios
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Lo que dicen nuestros huéspedes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              La satisfacción de nuestros clientes es nuestra mejor carta de presentación.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-gray-50 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Preguntas frecuentes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Resolvemos tus dudas para que tu estancia sea perfecta.
            </p>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-gray-900">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
                Contacto
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Estamos para servirte
              </h2>
              <p className="mt-4 text-gray-600">
                Contáctanos para cualquier consulta o asistencia. Nuestro equipo está disponible
                24/7.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dirección</p>
                    <p className="text-sm text-gray-500">
                      Av. Principal 123, Col. Centro, Ciudad de México
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teléfono</p>
                    <p className="text-sm text-gray-500">+52 55 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">contacto@grandhotel.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              <h3 className="text-xl font-semibold text-gray-900">Envíanos un mensaje</h3>
              <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Asunto"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  rows={4}
                  placeholder="Mensaje"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-16 text-center lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            ¿Listo para tu próxima estancia?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Reserva ahora y vive una experiencia inolvidable en el Grand Hotel.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50"
            >
              Reservar ahora
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 px-4 py-16 text-gray-400 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Hotel className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold text-white">Grand Hotel</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                Excelencia y confort en el corazón de la ciudad. Tu hogar lejos de casa.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Enlaces rápidos</h4>
              <ul className="mt-4 space-y-2 text-sm">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Servicios</h4>
              <ul className="mt-4 space-y-2 text-sm">
                {services.map((s) => (
                  <li key={s.title}>
                    <span className="transition-colors hover:text-white">{s.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Contacto</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  Av. Principal 123, Centro
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  +52 55 1234 5678
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  contacto@grandhotel.com
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Grand Hotel. Todos los derechos reservados.</p>
            <p className="mt-2">Hotel Management System v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
