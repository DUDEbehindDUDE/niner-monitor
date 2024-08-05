import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { OccupancyParking } from "../types/OccupancyResponseData";
import { display } from "../util/util";
import { ExpandMore } from "@mui/icons-material";
import HistoricalItemGraph from "./HistoricalItemGraph";
import InfoQuestionText from "./InfoQuestionText";

function ParkingData({ parking }: { parking: OccupancyParking[] }) {
  const bg = "rgba(255, 255, 255, 0.04)";
  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6">Parking Data</Typography>
      <InfoQuestionText
        text="Updated live"
        tooltip="Lot capacity is updated realtime, as long as you have an internet connection"
        sx={{ mb: 2 }}
      />
      {parking.map((item) => (
        <>
          <Typography sx={{ fontWeight: "bold", mt: 1 }}>
            {item.name}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Accordion id={item.name}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{ bgcolor: bg }}
              >
                {display(1 - item.percentAvailable)}
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: bg }}>
                <HistoricalItemGraph type={"parking"} subtype={item.name} />
              </AccordionDetails>
            </Accordion>
          </Box>
        </>
      ))}
    </Paper>
  );
}

export default ParkingData;
