import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import UnoCSS from 'unocss/vite';
import { presetWarp } from '@warp-ds/uno';
import { classes } from '@warp-ds/component-classes/classes';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    UnoCSS({
      presets: [presetWarp()],
      safelist: classes,
    }),
  ],
})