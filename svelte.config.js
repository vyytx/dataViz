import preprocess from 'svelte-preprocess'

const {typescript, scss} = preprocess

/**@type {import('rollup-plugin-svelte').Options} */
const config = {
	compilerOptions: {
		dev: true,
	},
	preprocess: [
		//typescript({
		//	tsconfigFile: true,
		//}),
		scss({
			includePaths: ['src/scss', 'node_modules']
		})
	],
	onwarn: (warning, handler) => {
		const ignores = [
			'a11y-label-has-associated-control'
		]

		if(ignores.indexOf(warning.code) > -1)
			return

		handler(warning)
	}
}

export default config