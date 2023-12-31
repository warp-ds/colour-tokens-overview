import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import UnoCSS from 'unocss/vite';
import { presetWarp } from '@warp-ds/uno';
import { classes } from '@warp-ds/css/component-classes/classes';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/colour-tokens-overview/',
  plugins: [
    svelte(),
    UnoCSS({
      presets: [presetWarp()],
      safelist: classes,
    }),
  ],
})