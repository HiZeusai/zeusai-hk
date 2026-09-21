import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://zeusai.ai",
  trailingSlash: "always",
  build: {
    assets: "starhold/_astro",
  },
});
