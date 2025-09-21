import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "localhost",
      ".localhost",
      "f6e94164639f.ngrok-free.app",
      // Add more ngrok hosts as needed
      ".ngrok-free.app",
    ],
    host: true, // Allow external connections
    port: 5173, // Default Vite port
  },
});
