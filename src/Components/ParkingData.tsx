import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { OccupancyParking } from "../types/OccupancyResponseData";
import { display } from "../util/util";
import { ExpandMore, Favorite, Star } from "@mui/icons-material";
import HistoricalItemGraph from "./HistoricalItemGraph";
import InfoQuestionText from "./InfoQuestionText";
import { useState } from "react";

function ParkingData({ parking }: { parking: OccupancyParking[] }) {
  const [starred, setStarred] = useState<string[]>(["South Village Deck"]);
  const [hideNonStars, setHideNonStars] = useState(false);
  const bg = "rgba(255, 255, 255, 0.04)";

  let normalLotItems: JSX.Element[] = [];
  let starredLotItems: JSX.Element[] = [];
  for (const item of parking) {
    const _starred = starred.includes(item.name);
    const parkingElement: JSX.Element = (
      <>
        <Box display={"flex"} justifyContent="space-between">
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
        <Box sx={{ mt: 1 }}>
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
  console.log(parkingItems);

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

  function handleHideNonStarsChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setHideNonStars(event.target.checked);
  }

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
          control={<Switch onChange={handleHideNonStarsChange} />}
          label={"Hide non-starred"}
        />
      </FormGroup>
      {parkingItems}
    </Paper>
  );
}

export default ParkingData;
