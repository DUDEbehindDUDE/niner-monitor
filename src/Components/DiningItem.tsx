import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  MenuData,
  MenuLocationData,
  MenuStationItems,
} from "../types/MenuData";
import { TimeData, TimeLocationData } from "../types/TimeData";
import { display, formatTime, getOrdinalSuffix } from "../util/util";
import { useState } from "react";
import MenuDialog from "./MenuDialog";
import {
  format,
  isWithinInterval,
  parse,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import HistoricalItemGraph from "./HistoricalItemGraph";
import InfoQuestionText from "./InfoQuestionText";
import { OccupancyApiResponse } from "../types/OccupancyResponseData";

function DiningItem({
  item,
  response,
}: {
  item: string;
  response: OccupancyApiResponse;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const now = new Date();
  const nowIso = now.toISOString().split("T")[0]; // just the date part of it
  let name: string;
  let percent: number;
  let occupancy: number;
  let maxOccupancy: number;

  const {
    isPending: menuDataIsPending,
    error: menuDataError,
    data: menuData,
  } = useQuery<MenuData>({
    queryKey: ["DiningData"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.dineoncampus.com/v1/sites/todays_menu?site_id=5751fd2790975b60e0489226"
      );
      return await res.json();
    },
  });

  const {
    isPending: timeDataIsPending,
    error: timeDataError,
    data: timeData,
  } = useQuery<TimeData>({
    queryKey: ["DiningDataTimes"],
    queryFn: async () => {
      const res = await fetch(
        `https://api.dineoncampus.com/v1/locations/weekly_schedule?site_id=5751fd2790975b60e0489226&date=${nowIso}`
      );
      return await res.json();
    },
  });

  item = item.toLowerCase();
  if (item === "sovi") {
    name = "Social Village (SoVi)";
    occupancy = response.data.dining.currentSoVi;
    maxOccupancy = response.data.dining.maxSoVi;
    percent = response.data.dining.percentSoVi;
  } else if (item === "social704") {
    name = "Social 704";
    occupancy = response.data.dining.current704;
    maxOccupancy = response.data.dining.max704;
    percent = response.data.dining.percent704;
  } else {
    throw Error(`Invalid dining type ${item}!`);
  }

  function getTimeData() {
    if (timeDataIsPending) return <Typography>Loading...</Typography>;
    if (timeDataError) return <Typography>Problem fetching hours.</Typography>;

    let location: TimeLocationData | null = null;
    for (const _location of timeData.the_locations) {
      if (item === "sovi" && _location.name.toLowerCase() === "sovi") {
        location = _location;
        break;
      }
      if (
        item === "social704" &&
        _location.name.toLowerCase() === "social 704"
      ) {
        location = _location;
        break;
      }
    }
    if (location === null) {
      return <Typography>Problem fetching hours.</Typography>;
    }

    const todayIsoString = format(new Date(), "yyyy-MM-dd");
    let todayIndex = new Date().getDay(); // day of the week; 0 = sun, etc

    if (
      location.week[todayIndex].hours.length === 0 ||
      location.week[todayIndex].closed
    ) {
      for (let i = todayIndex; i < location.week.length; i++) {
        let current = location.week[i];
        if (!current.closed) {
          const date = parse(current.date, "yyyy-MM-dd", new Date());
          let dateStr = format(date, "EEEE, MMM d");
          dateStr += getOrdinalSuffix(format(date, "d")); // adds suffix (e.g. 'th' to '20th')
          return <Typography>Closed for today. Opens {dateStr}.</Typography>;
        }
      }
      return <Typography>Closed this week.</Typography>;
    }

    let isOpen = false;
    for (let times of location.week[todayIndex].hours) {
      if (
        isDiningOpen(
          { minutes: times.start_hour, hours: times.start_hour },
          { minutes: times.end_minutes, hours: times.end_hour }
        )
      )
        isOpen = true;
    }

    return (
      <>
        <Typography>Currently {isOpen ? "Open" : "Closed"}</Typography>
        {location.week[todayIndex].hours.map((hours) => {
          const open = formatTime(hours.start_hour, hours.start_minutes);
          const close = formatTime(hours.end_hour, hours.end_minutes);
          return (
            <Typography key={`${open}${close}`}>
              {open}–{close}
            </Typography>
          );
        })}
      </>
    );
  }

  function menuTitle(text: string) {
    return (
      <InfoQuestionText
        text={text}
        tooltip="Provided by Dine On Campus, may be incorrect."
        bold
      />
    );
  }

  function getMenuData() {
    if (menuDataIsPending)
      return (
        <>
          {menuTitle("Menu")}
          <Typography>Loading...</Typography>
        </>
      );
    if (menuDataError) {
      return (
        <>
          {menuTitle("Menu")}
          <Typography>
            There was a problem fetching menu data. You can view the full menu
            at{" "}
            <Link href="https://dineoncampus.com/unccharlotte">
              Dine On Campus
            </Link>
            . Error: {menuDataError.message}
          </Typography>
        </>
      );
    }

    let location: MenuLocationData | null = null;
    for (const _location of menuData.locations) {
      if (item === "sovi" && _location.name.toLowerCase() === "sovi") {
        location = _location;
        break;
      }
      if (
        item === "social704" &&
        _location.name.toLowerCase() === "social 704"
      ) {
        location = _location;
        break;
      }
    }

    if (location === null) {
      return (
        <>
          {menuTitle("Menu")}
          <Typography>
            Nothing is on the menu today. You can view the full menu at{" "}
            <Link
              color={"secondary"}
              href="https://dineoncampus.com/unccharlotte"
            >
              Dine On Campus
            </Link>
            .
          </Typography>
        </>
      );
    }

    // In case there are days where breakfast, lunch, and dinner aren't all served (e.g. no breakfast one day)
    const idealPeriod = now.getHours() < 11 ? 0 : now.getHours() < 15 ? 1 : 2;
    let periodIndex: number | null = null;
    if (idealPeriod === 0) periodIndex = 0;
    if (idealPeriod === 1) {
      location.periods.forEach((period, index) => {
        if (period.name === "Lunch") periodIndex = index;
      });
      if (!periodIndex) periodIndex = location.periods.length - 1;
    }
    if (idealPeriod === 2) periodIndex = location.periods.length - 1;

    let items = [] as MenuStationItems[];
    location.periods[periodIndex!].stations.forEach((station) => {
      items = [...items, ...station.items];
    });

    let parsedItems = items.map((item) => (
      <Typography key={item.name}>{item.name}</Typography>
    ));
    if (parsedItems.length > 6) {
      parsedItems[5] = <Typography>+ {parsedItems.length - 6} more</Typography>;
      parsedItems = parsedItems.slice(0, 6);
    }

    return (
      <>
        {menuTitle(`${location.periods[periodIndex!].name} Menu`)}
        {parsedItems}
        <Button
          variant="contained"
          sx={{ mt: 1 }}
          onClick={() => setOpenDialog(true)}
        >
          View Full Menu
        </Button>
        <MenuDialog
          menuData={location}
          title={`Today's Menu at ${name}`}
          open={openDialog}
          setOpen={setOpenDialog}
        />
      </>
    );
  }

  function isDiningOpen(
    openTime: { minutes: number; hours: number },
    closeTime: { minutes: number; hours: number }
  ) {
    const start = setSeconds(
      setMinutes(setHours(new Date(), openTime.hours), openTime.minutes),
      0
    );
    const end = setSeconds(
      setMinutes(setHours(new Date(), closeTime.hours), closeTime.minutes),
      0
    );

    return isWithinInterval(now, { start, end });
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant={"h6"}>
        {name}: {display(occupancy, maxOccupancy, percent)}
      </Typography>
      <InfoQuestionText
        text="Updated live"
        tooltip="Occupancy data is updated realtime, as long as you have an internet connection"
      />
      <Grid container spacing={4} sx={{ mt: -1 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ width: "100%" }}>
            <HistoricalItemGraph type="dining" subtype={item} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoQuestionText
            text="Hours"
            tooltip="Provided by Dine On Campus, may be incorrect."
            bold={true}
          />
          {getTimeData()}
          {getMenuData()}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DiningItem;
