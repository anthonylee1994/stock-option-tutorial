import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {name: "reveal", test: /node_modules[\\/]reveal\.js[\\/]/},
                        {name: "react", test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/},
                    ],
                },
            },
        },
    },
});
