import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { ripple } from "@ripple-ts/vite-plugin";
import { defineConfig } from "vite";

const ripplePlugins = ripple();
const rippleTransform = ripplePlugins[0]?.transform;

if (typeof rippleTransform === "object" && "handler" in rippleTransform) {
  ripplePlugins[0].transform = async function (source, id, options) {
    if (!id.endsWith(".tsrx")) {
      return null;
    }

    return rippleTransform.handler.call(this, source, id, options);
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // @ts-ignore ripple plugin type compatibility across vite versions
    ripplePlugins,
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
