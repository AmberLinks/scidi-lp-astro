/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'scidi-blue': '#004B87',
				'scidi-green': '#009688',
				'scidi-dark-green': '#00796B',
				'scidi-light-blue': '#E3F2FD',
			},
			fontFamily: {
				'sans': ['Noto Sans JP', 'sans-serif'],
			}
		},
	},
	plugins: [],
}