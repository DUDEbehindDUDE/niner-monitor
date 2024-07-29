export type MenuData = {
	status: string,
	request_time: number,
	records: number,
	locations: MenuLocationData[],
}

export type MenuLocationData = {
	id: string,
	name: string,
	periods: MenuPeriod[],
	type: string,
}

export type MenuPeriod = {
	id: string,
	name: "Breakfast" | "Lunch" | "Dinner",
	stations: MenuStation[],
}

export type MenuStation = {
	id: string,
	name: string,
	items: MenuStationItems[],
}

export type MenuStationItems = {
	calories: number,
	name: string,
	portion: string,
}