import svelte from 'rollup-plugin-svelte'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import css from 'rollup-plugin-css-only'
 import json from '@rollup/plugin-json'

import { spawn } from 'child_process'

import svelteConfig from './svelte.config.js'
import tsconfigJson from './tsconfig.json' assert { type: 'json' }

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
		format: 'esm',
		name: 'app',
		dir: 'public/build'
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
		typescript(tsconfigJson),
		commonjs(),
		json({
			compact: true
		}),
		isDev && serve(),
		isDev && livereload('public'),
	],
	watch: {
		clearScreen: false
	}
}