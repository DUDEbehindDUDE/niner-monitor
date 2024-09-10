import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { OccupancyParking } from "../types/OccupancyResponseData";
import { display } from "../util/util";
import { ExpandMore, Star } from "@mui/icons-material";
import HistoricalItemGraph from "./HistoricalItemGraph";
import InfoQuestionText from "./InfoQuestionText";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { addYears } from "date-fns";

function ParkingData({ parking }: { parking: OccupancyParking[] }) {
  const [cookies, setCookie] = useCookies([
    "parkingStarred",
    "parkingHideNonStars",
  ]);

  // Get cookie values, but set default ones if they don't exist
  const [starred, setStarred] = useState<string[]>(
    cookies.parkingStarred || ["Union Deck Upper", "Union Deck Lower"]
  );
  const [hideNonStars, setHideNonStars] = useState<boolean>(
    cookies.parkingHideNonStars || false
  );

  const bg = "rgba(255, 255, 255, 0.04)";
  const expiresAt = addYears(new Date(), 10); // cookie expiration date, 10 years from now

  let normalLotItems: JSX.Element[] = [];
  let starredLotItems: JSX.Element[] = [];
  for (const item of parking) {
    const _starred = starred.includes(item.name);
    const parkingElement: JSX.Element = (
      <>
        <Box
          display={"flex"}
          justifyContent="space-between"
          sx={{ mt: 1.5, mb: 0.5 }}
        >
          <Typography sx={{ fontWeight: "bold", mt: 1 }}>
            {item.name}
          </Typography>
          <IconButton
            color={_starred ? "secondary" : "default"}
            onClick={() => editStar(item.name, _starred)}
          >
            <Star />
          </IconButton>
        </Box>
        <Box sx={{ mt: 0 }}>
          <Accordion id={item.name}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: bg }}>
              {display(1 - item.percentAvailable)}
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: bg }}>
              <HistoricalItemGraph type={"parking"} subtype={item.name} />
            </AccordionDetails>
          </Accordion>
        </Box>
      </>
    );
    if (_starred) {
      starredLotItems = [...starredLotItems, parkingElement];
    } else if (!hideNonStars) {
      normalLotItems = [...normalLotItems, parkingElement];
    }
  }
  const parkingItems = [...starredLotItems, ...normalLotItems];

  function editStar(item: string, current: boolean) {
    if (!current) {
      setStarred((prev) => [...prev, item]);
      return;
    }

    setStarred((prev) => {
      let newStarred: string[] = [];
      for (const str of prev) {
        if (str !== item) {
          newStarred = [...newStarred, str];
        }
      }
      return newStarred;
    });
  }

  function handleHideNonStarsChange() {
    setHideNonStars((prev) => !prev);
  }

  // Save changes to cookies
  useEffect(() => {
    setCookie("parkingStarred", JSON.stringify(starred), {
      path: "/",
      expires: expiresAt,
    });
  }, [starred, setCookie]);
  useEffect(() => {
    setCookie("parkingHideNonStars", hideNonStars.toString(), {
      path: "/",
      expires: expiresAt,
    });
  }, [hideNonStars, setCookie]);

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6">Parking Data</Typography>
      <InfoQuestionText
        text="Updated live"
        tooltip="Lot capacity is updated realtime, as long as you have an internet connection"
        sx={{ mb: 2 }}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={hideNonStars}
              onChange={handleHideNonStarsChange}
            />
          }
          label={"Hide non-starred"}
        />
      </FormGroup>
      {parkingItems}
    </Paper>
  );
}

export default ParkingData;
