<script lang="ts">
	import { Pages } from '@/Pages'

	export let nowViewing: typeof Pages[number]['name'] = 'Home'

	$: nowPage = Pages.find(p => p.name == nowViewing)
</script>

<div class="box">
	{#if nowPage.hasOwnProperty('page')}
	<svelte:component this={nowPage['page']}></svelte:component>
	{:else}
	{nowViewing} has no content
	{/if}
</div>