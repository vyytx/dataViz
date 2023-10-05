import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import css from 'rollup-plugin-css-only'

import { spawn } from 'child_process'

import svelteConfig from './svelte.config.js'

const isDev = process.env.ROLLUP_WATCH

function serve() {
	let server

	function kill() {
		if (server)
			server.kill(0)
	}

	return {
		writeBundle() {
			if (server)
				return
			server = spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			})

			process.on('SIGTERM', kill)
			process.on('exit', kill)
		}
	}
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			...svelteConfig,
			compilerOptions: {
				dev: isDev
			} 
		}),
		css({ output: 'bundle.css' }),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		isDev && serve(),
		isDev && livereload('public'),
	],
	watch: {
		clearScreen: false
	}
}