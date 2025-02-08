import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  envDir: "../",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        productDetails: resolve(__dirname, "src/productDetails/index.html"),
        wishlist: resolve(__dirname, "src/wishlist/index.html"),
      },
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
