import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  envDir: "../",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        productDetails: resolve(__dirname, "src/productDetails/index.html"),
        wishlist: resolve(__dirname, "src/wishlist/index.html"),
      },
    },
  },
});
