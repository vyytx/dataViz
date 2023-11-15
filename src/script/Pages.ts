import type { ComponentType } from 'svelte'
import { faHouse, faChartLine, faChartColumn, faChartPie, type IconDefinition } from '@fortawesome/free-solid-svg-icons/index'

import Home from '../pages/Home.svelte'
import HW1 from '../pages/HW1.svelte'
import HW1_2 from '../pages/HW1_2.svelte'
import HW2 from '../pages/HW2.svelte'
import HW3 from '../pages/HW3.svelte'
import RealData from '../pages/RealData.svelte'

type Page = {
	name: string,
	icon: IconDefinition,
	page?: ComponentType
}

export const Pages = [
	{
		name: '首頁',
		icon: faHouse,
		page: Home
	},
	{
		name: '作業 1',
		icon: faChartLine,
		page: HW1
	},
	{
		name: '作業 1-2',
		icon: faChartLine,
		page: HW1_2
	},
	{
		name: '作業 2',
		icon: faChartColumn,
		page: HW2
	},
	{
		name: '作業 3',
		icon: faChartPie,
		page: HW3
	},
	{
		name: '真實資料',
		icon: faChartColumn,
		page: RealData
	}
] as const satisfies readonly Page[];