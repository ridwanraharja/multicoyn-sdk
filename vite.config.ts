import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Generate TypeScript declaration files
    dts({
      include: ['src/**/*'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/App.tsx',
        'src/main.tsx',
        'src/App.css',
        'src/index.css',
        'src/assets/**/*',
        'vite.config.ts',
      ],
      rollupTypes: true,
      tsconfigPath: './tsconfig.lib.json',
    }),
  ],
  build: {
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, 'src/index.ts'),
      // Library name
      name: 'MultiCoynSDK',
      // Output file names
      fileName: (format) => `multicoyn-sdk.${format === 'es' ? 'es' : 'cjs'}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Externalize dependencies that should not be bundled
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Provide global variables for UMD build (if needed)
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
        // Preserve modules for better tree-shaking
        preserveModules: false,
        // Ensure CSS is extracted with correct name
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return assetInfo.name || 'asset';
        },
      },
      // Include CSS in the build
      input: {
        index: resolve(__dirname, 'src/index.ts'),
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Copy CSS to dist
    cssCodeSplit: false,
  },
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
