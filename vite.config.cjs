const path = require("node:path");
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
const vitePrerender = require("vite-plugin-prerender");

module.exports = defineConfig({
  plugins: [
    react.default ?? react,
    vitePrerender({
      staticDir: path.join(__dirname, "dist"),
      routes: ["/"],
      renderer: new vitePrerender.PuppeteerRenderer({
        headless: true,
        // networkidle0 blockiert oft bei SPAs mit Auth/Analytics
        navigationOptions: { waituntil: "load" },
        // Zeitfenster für ersten React-Paint (Landing / Ladezustand)
        renderAfterTime: 8000,
      }),
    }),
  ],
});
