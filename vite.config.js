import { defineConfig } from "vite";
import htmlInject from "vite-plugin-html-inject";

export default defineConfig({
  base: "/Sergey_Araven/",
  plugins: [htmlInject()],
});
