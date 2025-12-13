import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Avoid injecting full process.env to prevent security risks and memory issues
        'process.env.NODE_ENV': JSON.stringify(mode),
      },
      optimizeDeps: {
        include: ['pdfjs-dist'],
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Mobile-focused build optimizations
        target: 'es2015', // Broader browser support including mobile
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true, // Remove console logs in production
            drop_debugger: true,
            passes: 2, // Single pass = faster (was 2 for maximum compression)
          },
          mangle: {
            safari10: true, // Fix Safari 10 issues
          },
        },
        rollupOptions: {
          output: {
            // Manual chunks for better code splitting
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'react-vendor';
                }
                if (id.includes('dompurify') || id.includes('lucide-react')) {
                  return 'ui-vendor';
                }
                if (id.includes('pdfjs')) {
                  return 'pdf-vendor';
                }
                return 'vendor';
              }
              // Split blog translations for lazy loading
              if (id.includes('blog_posts_')) {
                return 'blog-translations';
              }
            },
          },
        },
        chunkSizeWarningLimit: 1000, // Increase limit to reduce warnings
        cssCodeSplit: true, // Split CSS for better caching
        reportCompressedSize: false, // Faster builds
      },
    };
});
