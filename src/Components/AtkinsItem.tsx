import { HelpOutline } from "@mui/icons-material";
import { Paper, Tooltip, Typography } from "@mui/material";
import { OccupancyAdkins } from "../types/OccupancyResponseData";
import { formatDistanceToNow } from "date-fns";

function AtkinsItem({ atkins }: { atkins: OccupancyAdkins }) {
  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6">
        Atkins Library:{" "}
        {atkins.isOpen ? atkins.currentOccupants + " occupants" : "closed"}
      </Typography>
      <Typography sx={{ fontWeight: "bold", mt: 1 }}>Hours</Typography>
      <Typography>{atkins.todayOpenTimes}</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Last updated {formatDistanceToNow(atkins.lastUpdated)} ago
        <Tooltip title="This API only refreshes every 15 minutes, so live counts can't be displayed">
          <HelpOutline
            sx={{ fontSize: "1.2em", verticalAlign: "-16%", ml: 1 }}
          />
        </Tooltip>
      </Typography>
    </Paper>
  );
}

export default AtkinsItem;
