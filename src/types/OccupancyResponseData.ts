export type OccupancyApiResponse = {
  time: string;
  data: OccupancyData;
};

export type OccupancyData = {
  dining: OccupancyDining;
  adkins: OccupancyAdkins;
  parking: OccupancyParking[];
};

export type OccupancyDining = {
  currentSoVi: number;
  maxSoVi: number;
  current704: number;
  max704: number;
  percentSoVi: number;
  percent704: number;
};

export type OccupancyAdkins = {
  currentOccupants: number;
  isOpen: boolean;
  todayOpenTimes: string;
	lastUpdated: string;
};

export type OccupancyParking = {
  lotCode: string;
  name: string;
  mapLink: string;
  percentAvailable: number;
};