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
const headerStyle = { fontWeight: 500 };
const theme = createTheme({
  typography: {
    h1: headerStyle,
    h2: headerStyle,
    h3: headerStyle,
    h4: headerStyle,
    h5: headerStyle,
    h6: headerStyle,
  },
  palette: {
    mode: "dark", // Change to 'light' if you prefer a light theme
    primary: {
      main: "#005035",
      light: "#91D5B1",
      dark: "#003824",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A49665",
      light: "#D6C691",
      dark: "#6A5E32",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#0F1511",
      paper: "#1B211D",
    },
    text: {
      primary: "#DEE4DE",
      secondary: "#C0C9C1",
    },
    error: {
      main: "#FFB4AB",
      light: "#FFDAD6",
      dark: "#93000A",
      contrastText: "#690005",
    },
    warning: {
      main: "#FAE287",
      light: "#FFF0C3",
      dark: "#544600",
      contrastText: "#221B00",
    },
    info: {
      main: "#A5CDDE",
      light: "#C0E9FA",
      dark: "#244C5A",
      contrastText: "#063543",
    },
    success: {
      main: "#8ED5B0",
      light: "#AAF2CB",
      dark: "#005236",
      contrastText: "#003824",
    },
    divider: "#404943",
    action: {
      active: "#8A938C",
      hover: "#737874",
      selected: "#5A605B",
      disabled: "#424844",
      disabledBackground: "#373D39",
    },
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
      fetch("http://10.0.0.7:5096/api/OccupancyData/CurrentOccupancyData").then(
        (res) => res.json()
      ),
    refetchInterval: 5000,
  });

  if (isPending) return <Typography sx={{ mt: 4 }}>Loading...</Typography>;
  if (error) return <Typography>Error! {error.message}</Typography>;

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
