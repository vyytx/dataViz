<script>
    import { onMount } from 'svelte';
	import dataJSON from '../data/HW1_2.json'

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
			title: {
				text: "可互動的折線圖與散佈圖",
				font: { size: 32}
			},
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

<div id="myGraph" class='graph'></div>
<div class="content is-medium pt-4">
	<h1>作業1-2 可互動的折線圖與散佈圖</h1>
	<p>
		上面這張圖實質上跟作業1的資料是一樣的，但當時為了方便練習且現在為了方便演示，我仍將它獨立出來。
	</p>
	<p>
		這張圖使用了Plotly.js提供的updatemenus功能，能夠讓使用者操作一個預先設定好的小選單，來即時更改圖顯示的資料等等。
		在這裡我加入了三個選項:
	</p>
	<ol>
		<li>show all -- 顯示所有資料</li>
		<li>blue only -- 只顯示藍色（A隊）的點或線</li>
		<li>without blue -- 顯示除了藍色（A隊）以外的點或線</li>
	</ol>
	<p>
		透過這項功能，假設當有使用者想要從100個隊伍挑出他之前就很關注的兩隊來觀察，就不需要在一旁的圖例欄位點98次。
	</p>
</div>