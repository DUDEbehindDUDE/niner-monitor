import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  Container,
  createTheme,
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import DiningItem from "./Components/DiningItem";
import { OccupancyApiResponse } from "./types/OccupancyResponseData";
import AtkinsItem from "./Components/AtkinsItem";
import ParkingData from "./Components/ParkingData";

const queryClient = new QueryClient();
const theme = createTheme({
  typography: {
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  palette: {
    primary: {
      main: "#005035",
    },
    secondary: {
      main: "#A49665",
    },
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Container sx={{ height: "100vh" }}>
          <Data />
        </Container>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function Data() {
  const { isPending, error, data } = useQuery<OccupancyApiResponse>({
    queryKey: ["CurrentOccupancyData"],
    queryFn: () =>
      fetch(
        "http://localhost:5096/api/OccupancyData/CurrentOccupancyData"
      ).then((res) => res.json()),
    refetchInterval: 5000,
  });

  if (isPending) return <p>Loading..."</p>;
  if (error) return <p>Error! {error.message}</p>;

  const lastUpdate = new Date(data.time);
  const atkins = data.data.adkins;

  return (
    <>
      <Typography variant="h3" sx={{ mt: 4 }}>
        UNC Charlotte Occupancy Tracker
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h5">Dining</Typography>
            <DiningItem item="social704" data={data} />
            <DiningItem item="sovi" data={data} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction={"column"} spacing={2}>
            <Grid item>
              <AtkinsItem atkins={atkins} />
            </Grid>
            <Grid item>
              <ParkingData parking={data.data.parking} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <p>Last updated {formatDistanceToNow(lastUpdate)} ago</p>
    </>
  );
}

export default App;
