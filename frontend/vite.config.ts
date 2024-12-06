import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";

export default defineConfig({
    plugins: [react()],
    define: {
        __API_URL__: JSON.stringify(process.env.VITE_API_URL),
    },
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        host: true,
        open: true,
        strictPort: true,
        watch: {
            ignored: [
                '**/node_modules/**',
                '**/dist/**',
                '**/.git/**',
                '**/public/**',
                '**/test/**',
                '**/coverage/**'
            ],
            usePolling: true,
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false
            }
        },
        hmr: {
            overlay: false
        }
    }
});