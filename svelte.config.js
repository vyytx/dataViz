import preprocess from 'svelte-preprocess'

const {typescript, scss} = preprocess

/**@type {import('rollup-plugin-svelte').Options} */
const config = {
	compilerOptions: {
		dev: true,
	},
	preprocess: [
		typescript({
			tsconfigFile: './tsconfig.json'
		}),
		scss({
			includePaths: ['src/scss', 'node_modules']
		}),
	],
	onwarn: (warning, handler) => {
		const ignores = []

		if(ignores.indexOf(warning.code) > -1 || warning.code.startsWith('a11y'))
			return

		handler(warning)
	}
}

export default config