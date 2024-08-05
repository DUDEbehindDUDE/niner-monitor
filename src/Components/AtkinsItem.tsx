import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material";
import { OccupancyAdkins } from "../types/OccupancyResponseData";
import { formatDistanceToNow } from "date-fns";
import HistoricalItemGraph from "./HistoricalItemGraph";
import InfoQuestionText from "./InfoQuestionText";

function AtkinsItem({ atkins }: { atkins: OccupancyAdkins }) {
  const bg = "rgba(255, 255, 255, 0.04)";
  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6">
        Atkins Library:{" "}
        {atkins.isOpen ? atkins.currentOccupants + " occupants" : "Closed"}
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: bg }}>
          Occupancy over the Last 24 Hours
        </AccordionSummary>
        <AccordionDetails sx={{ bgcolor: bg }}>
          <HistoricalItemGraph type="atkins" />
        </AccordionDetails>
      </Accordion>
      <Typography sx={{ fontWeight: "bold", mt: 1 }}>Hours</Typography>
      <Typography>{atkins.todayOpenTimes}</Typography>
      <InfoQuestionText
        text={`Last updated ${formatDistanceToNow(atkins.lastUpdated)} ago`}
        tooltip="This API only refreshes every 15 minutes, so live counts can't be displayed"
        sx={{ mt: 1.5 }}
      />
    </Paper>
  );
}

export default AtkinsItem;
