import { OccupancyAdkins, OccupancyDining, OccupancyParking } from "./OccupancyResponseData"

export type HistoricalData = {
	time: string,
	data: OccupancyDining | OccupancyAdkins | OccupancyParking[]
}