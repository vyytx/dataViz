<script>
	import 'bulma/css/bulma.css'

	import { onMount } from 'svelte'
	import rawData from '../data/HW3.json'
    import HL from '../components/HL.svelte';

	onMount(async () => {
		const Plotly = await import('plotly.js-dist-min')
		
		const myGraph = document.querySelector('#myGraph')
	
		let data = []
	
		Object.keys(rawData['subjects']).forEach((subjectName, i) => {
			data[i] = {
				type: 'pie',
				title: {
					text: subjectName,
					font: {
						size: 15
					}
				},
				values: rawData['subjects'][subjectName]['ratio'],
				labels: rawData['ratio_names'],
				domain: {
					row: Math.floor(i/3),
					column: i%3
				},
				hole: rawData['subjects'][subjectName]['holesize']
			}
		})
	
		Plotly.newPlot(myGraph, data, {
			title: {
				text: '科目分配比例',
				font: {
					size: 32
				}
			},
			grid: {
				rows: 2,
				columns: 3,
				ygap: 0.2
			}
		}, {
			responsive: true
		})
	})
</script>

<div id="myGraph" class="graph"></div>
<div class="content is-medium pt-4">
	<h1>作業3 圓餅圖</h1>
	<p>
		以上圖表列出了某學生，<HL>國文</HL>、<HL>英文</HL>、<HL>數學</HL>、<HL>自然</HL>與<HL>社會</HL>，共五科目學期成績評分比例的假資料。
		剛好這些科目無一例外都只會參採，<HL c='info'>期中評量</HL>、<HL c='info'>期末評量</HL>、
		<HL c='info'>出席</HL>與<HL c='info'>作業</HL>，這四種成績，以計算學期成績。
		但是每個科目分配的比例不同，換句話說，對參採項目的比重不同，因此，可以使用圓餅圖來清楚地表達各個科目的比例。
	</p>
	<p>
		利用Plotly.js作圖後，上圖五個圓餅圖分別代表五個科目的比例，其中中央挖空的比例依序是0、0.5、0.6、0.7、0.8。
		由於國文的圓餅圖並沒有挖空，該圖的標題會跑到圖的上面進而限縮了該子圖的繪圖空間。因此代表國文的圓餅圖實際上是比其他圖來得小；
		反過來說，其餘四張圖由於中央有挖空，基於Plotly的機制，會把標題塞在洞裡面，因此只要開洞夠大就能確保標題能夠清楚顯示。
		由於這只是圓餅圖與多子圖排列的練習，我們並不在乎是否能很好的維持整齊的排列，但在往後使用時，應當全部都挖相同大小的洞或是都不挖
		，進而確保實際上的圓餅圖大小相圖，以利觀察與判斷。
	</p>
</div>