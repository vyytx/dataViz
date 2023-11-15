<script lang='ts'>
	import Fa from 'svelte-fa/src/fa.svelte'
	import { onMount } from 'svelte';

	import { Pages } from '@/Pages'

	export let nowViewing: typeof Pages[number]['name'];

	onMount(() => {
		for(let faicon of document.getElementsByClassName('faicon')) {
			(faicon as HTMLElement).style.height = 'auto';
		}
	})
</script>

<div class="tabs is-large is-centered">
	<ul>
		{#each Pages as page, i}
		<li class:active={nowViewing == page['name']} data-tooltip={page['name']} style="cursor: default;">
			<a class='px-2' on:click={() => { nowViewing = page['name'] }}>
				<span class='icon'> <Fa class="faicon" icon={page['icon']} /> </span>
			</a>
		</li>
		{/each}
	</ul>
</div>

<style lang='scss'>	
	ul, a {
		border: none;
	}

	.tabs {
		padding-top: 3em;
		padding-bottom: 1.5em;
		margin-bottom: 0 !important;

		& > ul {
			height: 75%;
			& > li {
				position: relative;

				& > a {
					margin-left: 0.3em;
					margin-right: 0.3em;
					&> .icon {
						width: 40px;
						height: 40px;
						color: #eeeeee;
					}
				}

				&.active > a > .icon {
					color: #ffffff;

					&::after {
						content: '';
						display: block;
						position: absolute;
						left: 50%;
						bottom: -1.5em;
						margin-left: -0.75em;
						border-bottom: solid 0.75em #ffffff;
						border-left: solid 0.75em transparent;
						border-right: solid 0.75em transparent;
					}
				}
			}
		}
	}

	li[data-tooltip] {
		&::before {
			width: 100%;
			text-align: center;
			font-size: 1rem !important;
		}
	}
</style>