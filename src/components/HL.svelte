<script>
	import 'bulma/css/bulma.css'
	export let c = 'warning'
</script>

<span class="has-background-{c}" class:has-text-white={c != 'warning'}>
	<slot></slot>
</span>