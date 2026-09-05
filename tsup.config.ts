import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		vanilla: "src/vanilla/etch.ts",
		react: "src/react/index.ts",
	},
	format: ["esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	target: "es2020",
	external: ["react", "react/jsx-runtime", "react/jsx-dev-runtime"],
});
