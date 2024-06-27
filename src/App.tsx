import React from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Data />
      </div>
    </QueryClientProvider>
  );
}

function Data() {
  const { isPending, error, data } = useQuery({
    queryKey: ["test"],
    queryFn: () =>
      fetch(
        "http://localhost:5096/api/OccupancyData/currentoccupancydata"
      ).then((res) => res.json()),
    refetchInterval: 1000
  });

  if (isPending) return <p>"Loading..."</p>;
  if (error) return <p>"Error! " + error.message</p>;

  const lastUpdate = new Date(data.time);
  const dining = data.data.dining;

  return (
    <>
      <p>
        Social 704: {dining.current704}/{dining.max704} ({dining.percent704}%
        full)
      </p>
      <p>
        Social Village: {dining.currentSoVi}/{dining.maxSoVi} (
        {dining.percentSoVi}% full)
      </p>
      <p>
        Last Updated: {lastUpdate.getHours()}:{lastUpdate.getMinutes()}:{lastUpdate.getSeconds()}
      </p>
    </>
  );
}

export default App;
