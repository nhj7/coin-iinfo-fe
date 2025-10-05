import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [tailwindcss(), vue()],
    server: {
        host: '0.0.0.0'
    }
});