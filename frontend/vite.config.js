// Import the defineConfig helper from Vite
// This helps with type-checking and IntelliSense in IDEs
import { defineConfig } from 'vite'

// Import the official React plugin for Vite
// This enables JSX/TSX support and fast refresh for React
import react from '@vitejs/plugin-react'

// Export the Vite configuration
export default defineConfig({
  // Register Vite plugins
  plugins: [react()], // Use the React plugin

  // Development server configuration
  server: {
    port: 5173, // Set the port for the dev server (default is 5173)

    // Proxy configuration
    proxy: {
      // Any request starting with /api will be proxied
      '/api': {
        target: 'http://localhost:3000', // Forward these requests to backend server
        changeOrigin: true, // Needed for virtual hosted sites, modifies the origin header
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
