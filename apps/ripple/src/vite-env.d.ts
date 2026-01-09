/// <reference types="vite/client" />

declare module "*.ripple" {
  // biome-ignore lint: ripple component type
  const component: any;
  export { component as App };
  export { component as Counter };
  export default component;
}
