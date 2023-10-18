import type { ComponentType } from 'svelte'
import { HomeSolid, ChartSolid, ChartBars3FromLeftSolid } from 'flowbite-svelte-icons'

import HW1 from '../pages/HW1.svelte'
import HW2 from '../pages/HW2.svelte'
import HW3 from '../pages/HW3.svelte'

type Page = {
	name: string,
	icon: ComponentType,
	page?: ComponentType
}

export const Pages = [
	{
		name: 'Home',
		icon: HomeSolid
	},
	{
		name: 'HW1',
		icon: ChartSolid,
		page: HW1
	},
	{
		name: 'HW2',
		icon: ChartSolid,
		page: HW2
	},
	{
		name: 'HW3',
		icon: ChartSolid,
		page: HW3
	},
	{
		name: 'HW4',
		icon: ChartBars3FromLeftSolid
	}
] as const satisfies readonly Page[];