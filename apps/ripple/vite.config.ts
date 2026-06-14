import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { ripple } from "@ripple-ts/vite-plugin";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // @ts-ignore ripple plugin type compatibility across vite versions
    ripple(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
