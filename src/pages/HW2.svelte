<script>
    import { onMount } from 'svelte';

	import rawData from '../data/HW2.json'
    import HL from '../components/HL.svelte';

	onMount(async () => {
		const Plotly = await import('plotly.js-dist-min')

		const myGraph = document.querySelector('#myGraph')

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
			},
			xaxis: 'x2'
		}))

		Plotly.newPlot(myGraph, data1.concat(data2), {
			title: {
				text: '動物園數量統計',
				font: {
					size: 32
				}
			},
			xaxis:  { domain: [0, 0.5] },
			xaxis2: { domain: [0.5, 1] },
			annotations: [{
				text: "依「動物」分群",
				font: { size: 15 },
				showarrow: false,
				align: 'center',
				x: 0.15,
				y: 1,
				xref: 'paper',
				yref: 'paper'
			}, {
				text: "依「地點」分群",
				font: { size: 15 },
				showarrow: false,
				align: 'center',
				x: 0.85,
				y: 1,
				xref: 'paper',
				yref: 'paper'
			}]
		}, {
			responsive: true
		})

	})
</script>

<div id="myGraph" class="graph"></div>

<div class="content is-medium pt-4">
	<h1>作業2 長條圖</h1>
	<p>
		以上圖表呈現了<HL>台北</HL>與<HL>桃園</HL>兩地的動物園內動物的假資料。
		這兩個園區都只有，<HL c='info'>獅子</HL>、<HL c='info'>老虎</HL>跟<HL c='info'>猴子</HL>，這三種動物。
		在呈現數量時，以長條圖呈現可以很明顯地看到數量的差距，因此，在這裡我們使用分群的長條圖來分別顯示「依動物分群」與「依地點分群」的結果。
	</p>
	<p>
		利用Plotly.js作圖後，先以左圖來說，我們可以看到台北的獅子比桃園的多，就算我們看不到白色的實際數量數字也可以直觀地用長條圖長度來判斷。
		依此類推，也會得出不論是老虎還是猴子，桃園都比較多的結論。
	</p>
	<p>
		雖然我們可以直接從左圖長條上的數字看到各項動物的數量，但若要比較一家動物園內的動物數量，則顯得有些麻煩。
		因此，若我們對地點分群，即左圖，就可以清楚地看到各地每種動物數量多寡。
		舉例來說，我們可以發現，不論是台北還是桃園，猴子的數量都明顯多於其他兩種動物。對其餘的動物來說，桃園的獅子略多於老虎，而台北則是相反。
	</p>
	<p>
		一開始這頁長條圖的作業是真的使用兩張圖來呈現的，但在上完作業3的課程並學到子圖的做法後，便將這裡的兩張圖併成一張。
		這樣除了方便排版外，也同時讓使用者能一眼就看到所有內容。
	</p>
</div>