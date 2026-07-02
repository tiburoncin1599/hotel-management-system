import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Grand Hotel - Sistema de Gestión Hotelera',
    short_name: 'Grand Hotel',
    description: 'Sistema de gestión hotelera completo',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
