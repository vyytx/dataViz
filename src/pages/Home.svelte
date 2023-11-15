<div class="columns">
	<div class="column">
		<div class="card">
			<div class="card-content">
				<p class="title"> 張信富 </p>
				<p class="subtitle">資工二B</p>
				<p class="subtitle">111502551</p>
			</div>
		</div>
	</div>
	<div class="column">
		<div class="content">
			<ul>
				<li>Svelte -- 方便模組化設計與編排</li>
				<li>Bulma -- css framework</li>
				<li>Rollup -- 打包</li>
				<li>Github Action -- 線上Build到指定的分支並部署到Github Pages</li>
				<li>... 剩餘的請看<a href='https://github.com/vyytx/dataViz/blob/main/package.json'>這裡</a></li>
			</ul>
		</div>
	</div>
</div>

<div class="content is-medium pt-4">
	<p>
		首先，因為我以<HL>Svelte</HL>重寫了整個摸版，所以看起來會跟模板有些不同。
		因為這樣就不會有需要把所有東西寫在同一個緊湊的HTML檔內的問題，也能更加靈活的調用js以控制網頁的變化，因此我覺得將整份模板改寫是方便開發的。
		另外，由於<HL>Svelte</HL>提供的功能更像是一個編譯器，所以隨後就可以產出一個通用的.js檔，來控制網頁。
	</p>
	<p>
		在樣式設計上，我引入了<HL>Bulma</HL>這個pure css framework來做絕大多數的設計。當然，小部分還是有自己寫的scss
		，之後交給<HL>Svelte Preprocessor</HL>跟Rollup 打包成一個通用的css檔。
	</p>
	<p>
		而<HL>Rollup</HL>作為一個打包工具，處理.svelte檔匯入的其他檔案，諸如<HL>.json</HL>、<HL>.csv</HL>、<HL>.ts</HL>等等。
		另外當整個打包流程都結束後，控制著輸出。
	</p>
	<p>
		最後，我使用了<a href='https://github.com/JamesIves/github-pages-deploy-action'>JamesIves設計的Action</a>來部署到Github Pages。
	</p>
</div>

<script>
	import HL from '../components/HL.svelte';
	import 'bulma/css/bulma.css'
</script>

<style lang="scss">
	.card {
		height: 100%
	}
</style>