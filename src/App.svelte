<script lang='ts'>
	import 'bulma/css/bulma.css'
	import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css'
	
	import Nav from './components/Nav.svelte'
	import Viewer from './components/Viewer.svelte'

	import { Pages } from '@/Pages'

	let nowViewing: typeof Pages[number]['name'] = '首頁'
</script>

<div class="column is-8 is-offset-2 pb-6">
	<Nav bind:nowViewing/>
	<Viewer bind:nowViewing />
</div>

<style lang='scss'>
	:global(html, body) {
		width: 100%;
		min-height: 100vh;
		height: auto;
		margin: 0 auto;
	}

	:global(body) {	
		background: rgb(236,181,164);
		background: linear-gradient(170deg, rgba(236,181,164,1) 0%, rgba(214,157,143,1) 66%, rgba(140,94,119,1) 100%);
		//, url('img/noise.svg'); fix here
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	:global(svg) {
		outline: none;
	}

	div {
		padding: 0 0;
	}

	:global(.graph) {
		position: relative;
		display: block;
		left: 50%;
		transform: translateX(-50%);

		width: 60rem;
		max-width: 100%;
		height: 25rem;
		max-height: 50vh;
		min-height: 15vh;
	}
</style>