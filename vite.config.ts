import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

import vueI18n from '@intlify/vite-plugin-vue-i18n';
import vueDevTools from 'vite-plugin-vue-devtools'
export default defineConfig({
    plugins: [
        vue(),
        vueI18n({
            include: path.resolve(__dirname, './src/locales/**'),
        }),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        include: ['quill'],
    },
});
