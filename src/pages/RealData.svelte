<script>
	import { onMount } from 'svelte';
	import rawData from '../data/taoyuanMRTVolume.csv'

	let data = rawData.filter(x => x['zhy']/1 == 112)
	data = {
		mode: "lines+markers+text",
		type: "scatter",
		marker: {
			"size": 10
		},

		x: data.map(x => x['m']/1),
		y: data.map(x => x['volume']/1),
		text: data.map(x => x['volume']),
		textposition: "top center"
	}

	onMount(async () => {
		const Plotly = await import('plotly.js-dist-min')

		const myGraph = document.querySelector('#myGraph')

		Plotly.newPlot(myGraph, [data], {
			title: {
				text: "每月桃園捷運平均日運量",
				font: { size: 32}
			},
			yaxis: { range: [6e4, 1.2e5] }
		})
	})
</script>

<div id="myGraph" class="graph"></div>
<div class="content is-medium pt-4">
	<h1>練習 真實資料</h1>
	<p>
		上圖是112年桃園機捷單月平均日運量的折線圖。由於這些數字都很大，所以我把y軸限定在6e4 ~ 1.2e5的區間內。
		從112年的1月開始平均日運量不斷上升，尤其是5~8月有明顯的上升。雖然最後8~9月的上升趨於平緩，但整體來說桃園機捷單月平均日運量是呈現上漲趨勢的。
	</p>
	<p>
		就像在作業1 發現的一樣，折線圖很適合用來呈現趨勢變化，以這份數據來說，我看到折線圖便能很輕易地發現運量在上漲。
		客觀來說 (100648-69207)/69207≈0.45，這九個月來運量上漲了四成五。
		因此不論就主觀的折線圖趨勢觀察與客觀的計算分析都能得出「桃園機捷的搭乘人數有明顯上升」的結論。
	</p>
</div>