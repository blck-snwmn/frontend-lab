import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { ripple } from "@ripple-ts/vite-plugin";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // @ts-expect-error ripple plugin type compatibility with vite version
  plugins: [ripple(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
