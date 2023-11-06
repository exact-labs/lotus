import path from 'path';
import { defineConfig } from 'vite';
import banner from 'vite-plugin-banner';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import removeConsole from 'vite-plugin-remove-console';
import { ReactConfig, BannerMessage, RenderChunks, dependencies } from './vite.ext';

const ConsolePlugin = removeConsole();
const ReactPlugin = react(ReactConfig);
const BannerPlugin = banner(BannerMessage);
const CheckerPlugin = checker({ typescript: true });

export default defineConfig({
	plugins: [ReactPlugin, ConsolePlugin, CheckerPlugin, BannerPlugin],
	build: {
		sourcemap: false,
		emptyOutDir: true,
		manifest: true,
		minify: true,
		// rollupOptions: {
		// 	output: {
		// 		manualChunks: {
		// 			vendor: ['react', 'react-router-dom', 'react-dom'],
		// 			...RenderChunks(dependencies),
		// 		},
		// 	},
		// },
	},
	optimizeDeps: {
		esbuildOptions: {
			target: 'es2020',
		},
	},
	esbuild: {
		logOverride: { 'this-is-undefined-in-esm': 'silent' },
	},
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
	},
});
