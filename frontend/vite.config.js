// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { viteStaticCopy } from "vite-plugin-static-copy";

// export default defineConfig({
//   plugins: [
//     react(),
//     viteStaticCopy({
//       targets: [
//         {
//           src: "404.html",
//           dest: "",
//         },
//       ],
//     }),
//   ],
//   server: {
//     port: 5174,
//     open: true,
//     proxy: {
//       "/api": {
//         target: "https://my-appointment-backend.onrender.com",
//         changeOrigin: true,
//       },
//     },
//   },
//   build: {
//     outDir: "dist",
//     rollupOptions: {
//       output: {
//         manualChunks: undefined,
//       },
//     },
//   },
// });









import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "404.html",
          dest: "",
        },
      ],
    }),
  ],
  server: {
    port: 5174,
    open: true,
    // REMOVED THE PROXY HERE - it's no longer needed for production configuration.
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});