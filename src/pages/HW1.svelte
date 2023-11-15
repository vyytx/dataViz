<script>
	import HL from '../components/HL.svelte';
    import { onMount } from 'svelte';
	import dataJSON from '../data/HW1.json'

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
				text: "折線圖與散佈圖",
				font: { size: 32}
			},
			xaxis: { range: [0, 8] },
			yaxis: { range: [0, 25] }
		},{
			responsive: true
		})
	})
</script>

<div id="myGraph" class='graph'></div>
<div class="content is-medium pt-4">
	<h1>作業1 折線圖與散佈圖</h1>
	<p>
		以上圖表分別以散佈圖、純折線圖與有標記資料點的折線圖來表現三組隊伍在1~7月得分的假資料。
		<HL>A隊</HL>只有在前四個月有得分，依序是10、15、13、17分。<HL>B隊</HL>則是分別在2、3、5、6月得了6、9、20、5分。
		<HL>C隊</HL>則是在1、3、5、7月得了2、4、8、10分。
	</p>
	<p>
		利用Plotly.js作圖後，我們可以很清楚地看到各隊得分數變化的趨勢，這也是使用散佈圖或折線圖呈現的好處。
		另外，使用散佈圖或折線圖，也可以很簡單地將回歸分析的結果納入圖中而不需要去擔心座標軸的問題。
	</p>
	<p>
		對於<HL>A隊</HL>的線（或實際上不能叫做線，可能可以稱作點集合），我們將點的名稱列在該點的上方。
		而<HL>B隊</HL>的線，一開始為了練習單純的無裝飾的Line Chart，並沒有特別把點標出來。
		不過後來在整理時，資料點的位置實在不夠清楚。因此在每個資料點右側標上了該點的名稱，以方便認出點的位置。
		最後我們看向<HL>C隊</HL>的線，這是一個有標點的折線圖，雖然這條線不會直接將名稱寫在旁邊，但由於有在資料點上加畫一個點，所以仍能容易地找到位置。
	</p>
</div>