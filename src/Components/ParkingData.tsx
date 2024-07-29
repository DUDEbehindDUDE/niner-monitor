import { Paper, Typography } from "@mui/material";
import { OccupancyParking } from "../types/OccupancyResponseData";
import { display } from "../util/util";

function ParkingData({ parking }: { parking: OccupancyParking[] }) {
  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Parking Data
      </Typography>
      {parking.map((item) => (
        <>
          <Typography sx={{ fontWeight: "bold", mt: 1 }}>
            {item.name}
          </Typography>
          <Typography>{display(1 - item.percentAvailable)}</Typography>
        </>
      ))}
    </Paper>
  );
}

export default ParkingData;
