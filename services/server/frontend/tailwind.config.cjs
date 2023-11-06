/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', ...require('tailwindcss/defaultTheme').fontFamily.sans],
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
