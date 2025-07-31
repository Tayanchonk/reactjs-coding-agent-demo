import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log(`API Gateway URL for ${mode} mode:`, env.VITE_API_GATEWAY_URL);
  console.log(`MCSA Integration for ${mode} mode:`, env.VITE_MCSA_INTEGRATION);
  const envDir = resolve(process.cwd(), ".config");
  const rawEnv = loadEnv(mode, envDir, "");

  return {
    plugins: [react()],
    define: {
      // Pass environment variables to the client
      'process.env': env,
    },
    envDir: '.config',
    assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],
    server: {
      host: "0.0.0.0",
      port: 3001,
      proxy: {
        "/api": {
          target: env.VITE_API_GATEWAY_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/authenticationService": {
          target: env.VITE_API_GATEWAY_URL + "/api/v1",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/authenticationService/, ""),
        },
        "/configurationService": {
          target: `${env.VITE_API_GATEWAY_URL}/configuration`,

          // target: "http://localhost:44357/api/v1",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/configurationService/, ""),
        },
        "/customerDataService": {
          target: `${env.VITE_API_GATEWAY_URL}/customerdata`,
          // target: "https://localhost:44305/api/v1/",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/customerDataService/, ""),
        },
        "/dashboardService": {
          target: `${env.VITE_API_GATEWAY_URL}/dashboard`,
          // target: "https://localhost:44305/api/v1/",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/dashboardService/, ""),
        }
      },
    },
    optimizeDeps: {
      include: ["react-quill-new", "quill"],
    },
  };
});
