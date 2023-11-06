import pkg, { dependencies } from './package.json';

const BannerMessage = `Copyright (c) ${new Date().getUTCFullYear()} theMackabu. All Rights Reserved.
version: ${pkg.version} 
build: ${process.env.NODE_ENV}
`;

const ReactConfig = {
	babel: {
		plugins: [
			'babel-plugin-macros',
			[
				'@emotion/babel-plugin-jsx-pragmatic',
				{
					export: 'jsx',
					import: '__cssprop',
					module: '@emotion/react',
				},
			],
			['@babel/plugin-transform-react-jsx', { pragma: '__cssprop' }, 'twin.macro'],
		],
	},
};

const RenderChunks = (deps: Record<string, string>) => {
	let chunks = {};
	Object.keys(deps).forEach((key) => {
		if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
		chunks[key] = [key];
	});
	return chunks;
};

export { BannerMessage, ReactConfig, RenderChunks, dependencies };
