<div id="myGraph"></div>

<script>
    import { onMount } from 'svelte';

	import dataJSON from '../data/HW2.json'

	onMount(async () => {
		const Plotly = await import('plotly.js-dist-min')

		const data = Object.values(dataJSON).map(trace => {
			trace['x'] = []
			trace['y'] = []
			trace['text'] = []

			trace['dots'].forEach(v => {
				trace['x'].push(v[0])
				trace['y'].push(v[1])
				trace['text'].push(v[2])
			})

			return trace
		})

		const myGraph = document.querySelector('#myGraph');
	
		Plotly.newPlot(myGraph, data, {
			title: "Lines and Scatters (Interactive)",
			margin: { t: 25 },
			xaxis: { range: [0, 7] },
			yaxis: { range: [0, 25] },
	
			//from here
			updatemenus: [{
				y: 1.2,
				x: 0,
				yanchor: 'top',
				buttons: [
					{
						method: 'restyle',
						args: ['visible', [true, true, true]],
						label: 'show all'
					},
					{
						method: 'restyle',
						args: ['visible', [true, false, false]],
						label: 'blue only'
					},
					{
						method: 'restyle',
						args: ['visible', [false, true, true]],
						label: 'without blue'
					}
				]
			}]
		})
	})
</script>

<style lang="scss">
	#myGraph {
		width: 600px;
		height: 400px;
	}
</style>