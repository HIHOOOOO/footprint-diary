import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'footprint-diary',
  brand: {
    displayName: '발자국 일기',
    primaryColor: '#4ade80',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEc0lEQVR4nO2dW4hVVRjHf5WpBVmpdDGlcCx980WiexCiEUFFZAY2ElFKPpgPWS9BYUVkQVlRFL2qkASV1XRR5iGK7iiJRfWQdDErGyu76qxY9G3Y7M7as/aZvc9Z7e/7wR8Oc9Y53zn/b2btdfn2GjAMwzAMwzAMwzAMwzAMwzAMw0iLK4HtwIhou/zMaJgjgWcAF9DT0saoyCnACmC9yD8+uUO7dSXmZ/JtjEimAI8BhzoY+TewAThO2s4JtOv0utl9/l7/C04E3o0w9ANguvxluEg9IDEuAoaAA6JXgAv6/L2TwPfT2yoYOgzsqND+Q2AlMNrhucPSxalmRQUznej3Cm1/ka6orJtagOLf/i+6SMBohbaHI9q8gFIWdGG+ayBZfwDHoJBbe5AAF6m5KKTKaMY1rLNQyIZxGPZNRJu3gD8rdEF+wnet6CQUcOc4ErAe2FPyvH/uDODFiPd6HlgjiciPtFbTcq4YRwIuB2YBWwsX2lExfabEODtiGHpXyfPLafnyQ5UxvRP9lluW8AwAS0T+cZGyidgtwLdjdHUTaTFPdpGAx7uIcyHwcm7Z+iXgfFmiGCteq5csTgN+qGD+98CpNcYfjIjp27SayyqMVi6tOfaSiLjXoIBFEX3xwgbiDkQkQM2S9gnAHcB7ub7aL1PfDhzfYNzXS8x/rcG4rRhFXSUX8veBL4GDwF/Ad8DbwCMyZD265H3mSPui+XsDoyr1TAHuBn6ucPHeJ1uUfkOnE37Stgn4SbQROF0GCcvk2lOWRDUslJGQ61IjMsM9KiLWYGGeshOYgWJulu7F1aBhKQAIMVMmfMXXPYdS1tZkfF5fAecG4vm9ZPWjoowbKu6CVZGfWyzmvwyVvEZV4deiMRbT6pC/mM8vxLUE8G8/vK9h8/PdUb4ATH0XNAF4s0fmZ3q2kPyDHdpsQQm39dj8TFfnPsOywjB0R80LgckyS+p5+pEA3xVNzn2WGZKIxZomYlv6ZH6mVShmfoNDzljtafsuWBmb+my+qj2AIgORZee9kMolh3UJGJ/J79BNRRFHAJ8nYHxe16GIcxIw3BXkN3rUcE8ChruCdqOI4QQMdwX54fA0FDAxsO7iElCri7IyzkvAaBfQTSjgxgSMdgE9hALuTcBoF9BmFLA5AaNdQP7sidbzTgJGu4A+RgGfJmC0C8jXq7aerxMw2gW0HwWMJGC0C8jPT1pPXdVurgH55fHWE3NzhuuTfOFW6/kxAaNdQL4uqfXsTMBoF9BHKCDlidhGFLA6AaOd5hKVeQkY7QI6EyXEnBnneix/j5kalidguCvoehThq6E/ScD0TLsi7yNrFZckUJaYHeJxMUp5OIEEPIhiJoxxe1DT2qqx6ylyLPBqH8wf0np6YicmAU/10PwnJKZRYGngHIe6tFdrKXoVpgL3A7/WaLy/Beo+OTjcqJCINXIgdzemj8oJ7H7tyYyv4Ua+QfmfA9uktH2/7GAdksefAW8Aj8qsNjtJ0TAMwzAMwzAMwzAMwzBIgX8A9lEZJywW0jwAAAAASUVORK5CYII=',
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
