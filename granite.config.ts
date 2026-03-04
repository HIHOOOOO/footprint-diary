import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'footprint-diary',
  brand: {
    displayName: '발자국 일기',
    primaryColor: '#4ade80',
    icon: '/footprint-icon-mono.svg',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite --host',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [{ name: 'geolocation', access: 'access' }],
  outdir: 'dist',
});
