import { mount } from "ripple";
import { App } from "./App.ripple";
import "./index.css";

const target = document.getElementById("app");
if (target) {
  mount(App, {
    target,
  });
}
