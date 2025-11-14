import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyPsy',
    short_name: 'MyPsy',
    description: 'MyPsy — PWA de soutien psycho-émotionnel non médical.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFCC',
    theme_color: '#140D07',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  };
}
