/// <reference types="vite/client" />

declare module "*.tsrx" {
  import type { Component } from "ripple";

  export const App: Component;
  export const Counter: Component;
  const component: Component;
  export default component;
}
