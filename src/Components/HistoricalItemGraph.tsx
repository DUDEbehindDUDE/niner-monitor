import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { display, formatTime, roundDateTo15 } from "../util/util";
import { LineChart } from "@mui/x-charts";
import { HistoricalData } from "../types/HistoricalOccupancyData";
import {
  OccupancyAdkins,
  OccupancyDining,
  OccupancyParking,
} from "../types/OccupancyResponseData";

function HistoricalItemGraph({
  type,
  subtype = null,
}: {
  type: "dining" | "parking" | "atkins";
  subtype?: string | null;
}) {
  let height = 200; // chart height
  const { isPending, error, data } = useQuery<HistoricalData[]>({
    queryKey: ["HistoricalOccupancyData" + type],
    queryFn: async () => {
      const res = await fetch(
        `https://uncc-occupancy-tracker-backend.onrender.com/api/OccupancyData/HistoricalOccupancyData?item=${type}`
      );
      return await res.json();
    },
    refetchInterval: 1000 * 60,
  });

  if (isPending) return <Typography>Loading graph data...</Typography>;
  if (error)
    return <Typography>Error fetching graph data: {error.message}.</Typography>;

  function createData(time: Date, occupancy: number | null = null) {
    const timeString = formatTime(time);
    return { timeString, occupancy };
  }

  function generateDataset() {
    if (!data) throw Error("Data is undefined!");
    const rawGraphData = data.slice(type === "atkins" ? -60 * 24 : -60); // last hour
    let dataset: {
      dataType: "percent" | "people";
      dataMax: number;
      data: {
        timeString: string;
        occupancy: number | null;
      }[];
    } = {
      dataType: "percent",
      dataMax: 100,
      data: [],
    };

    let _prev: any;
    rawGraphData.forEach((data) => {
      if (!subtype && (type === "dining" || type === "parking")) {
        throw Error("Component subtype is required for this type!");
      }

      if (type === "dining") {
        height = 319;
        const _data = data.data as OccupancyDining;
        let occupancy;
        dataset.dataType = "people";

        if (subtype === "sovi") {
          occupancy = _data.currentSoVi;
          dataset.dataMax = _data.maxSoVi;
        } else if (subtype === "social704") {
          occupancy = _data.current704;
          dataset.dataMax = _data.max704;
        } else {
          throw Error(`Component subtype '${subtype}' is invalid!`);
        }

        dataset.data = [
          ...dataset.data,
          createData(new Date(data.time), occupancy),
        ];
      }
      if (type === "parking") {
        const _data = data.data as OccupancyParking[];
        let percent: number | null = null;

        for (const lot of _data) {
          if (lot.name === subtype) percent = lot.percentAvailable;
        }

        if (!percent) throw Error("Component subtype is not valid!");

        dataset.data = [
          ...dataset.data,
          createData(new Date(data.time), (1 - percent) * 100),
        ];
      }
      if (type === "atkins") {
        const _data = data.data as OccupancyAdkins;
        if (_prev && _prev === _data.lastUpdated) return;
        dataset.dataMax = 1200;
        dataset.dataType = "people";
        _prev = _data.lastUpdated;
        const occupants =
          _data.currentOccupants < 0 ? null : _data.currentOccupants;
        dataset.data = [
          ...dataset.data,
          createData(roundDateTo15(_data.lastUpdated), occupants),
        ];
      }
    });

    return dataset;
  }

  const dataset = generateDataset();

  // have to do this because we can't include multiple things (% and amount) in the dataset
  function getGraphIntervals(intervalCount: number) {
    const max = dataset.dataMax;
    const interval = max / intervalCount;
    let intervals: number[] = [];
    for (let i = 0; i < intervalCount; i++) {
      intervals = [...intervals, interval * i];
    }
    return [...intervals, max];
  }

  return (
    <LineChart
      height={height}
      dataset={dataset.data}
      xAxis={[
        {
          scaleType: "point",
          dataKey: "timeString",
          tickInterval: (value: string) => {
            const time = value.slice(0, value.length - 3);
            const splitTime = time.split(":");
            if (type === "atkins") {
              return parseInt(splitTime[0]) % 4 === 0 && splitTime[1] === "00";
            }
            return splitTime[1].endsWith("0") || splitTime[1].endsWith("5");
          },
        },
      ]}
      yAxis={[
        {
          max: type !== "atkins" ? dataset.dataMax : undefined,
          min: 0,
          tickInterval: type !== "dining" ? "auto" : getGraphIntervals(5),
          valueFormatter: (value, context) => {
            if (context.location !== "tick") return value;
            if (dataset.dataType === "people") {
              if (type === "dining") {
                // have to do this because we can't include multiple things (% and amount) in the dataset
                return `${Math.round((value * 100) / dataset.dataMax)}%`;
              }
              return value;
            }
            return `${value}%`;
          },
        },
      ]}
      sx={{
        bgcolor: "rgba(255, 255, 255, .06)",
        p: 1,
        borderRadius: 4,
      }}
      series={[
        {
          dataKey: "occupancy",
          showMark: false,
          valueFormatter: (v) => {
            if (v === null) return "N/A";
            if (type === "atkins") {
              return `${v} occupants`;
            }
            if (dataset.dataType === "percent") {
              return display(v! / 100);
            }
            return `${display(v!, dataset.dataMax)}`;
          },
        },
      ]}
    />
  );
}

export default HistoricalItemGraph;
