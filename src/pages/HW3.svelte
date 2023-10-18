<div id="myGraph1" class="graph"></div>
<div id="myGraph2" class="graph"></div>

<script>
    import { onMount } from 'svelte';

	import rawData from '../data/HW3.json'

	onMount(async () => {
		const Plotly = await import('plotly.js-dist-min')

		const myGraph1 = document.querySelector('#myGraph1')
		const myGraph2 = document.querySelector('#myGraph2')

		// group by zoo
		let data1 = Object.entries(rawData).map(([name, {animals, type}]) => ({
			name: `${name} zoo`,
			type,
			x: animals.map(animal => animal.name),
			y: animals.map(animal => animal.count)
		}))
		data1 = data1.map(_ => ({
			..._,
			text: _.y,
			textfont: {
				size: 20,
				color: 'white'
			}
		}))


		// group by animal
		const animalNames = ['lion', 'tiger', 'monkey']
		let data2 = new Array(3).fill({}).map((_, i) => ({
			name: animalNames[i],
			type: 'bar',
			x: Object.keys(rawData),
			y: Object.values(rawData).map(({animals, type}) => animals[i].count)
		}))
		data2 = data2.map(_ => ({
			..._,
			text: _.y,
			textfont: {
				size: 20,
				color: 'white'
			}
		}))


		Plotly.newPlot(myGraph1, data1, {
			name: "Animal Numbers (group by zoo)",
			barmode: 'group'
		})
		Plotly.newPlot(myGraph2, data2, {
			name: "Animal Numbers (group by animal)",
			barmode: 'group'
		})

		console.table(data1, data2)
	})
</script>

<style lang="scss">
	.graph {
		width: 600px;
		height: 400px;
	}
</style>