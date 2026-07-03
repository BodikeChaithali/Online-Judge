import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,

    allowedHosts: [
      "ojchaithali.me",
      "www.ojchaithali.me",
      "3.110.220.185",
      "localhost"
    ]
  }
});
