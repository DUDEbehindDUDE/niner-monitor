import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MenuLocationData } from "../types/MenuData";
import React from "react";

function MenuDialog({
  menuData,
  title,
  open,
  setOpen,
}: {
  menuData: MenuLocationData;
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // this component is shit but I'm lazy af so it's staying for a while
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth={true}
      maxWidth={"lg"}
    >
      <DialogTitle variant="h5">{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
        <Grid container spacing={2}>
          {menuData.periods.map((period) => {
            return (
              <Grid
                item
                xs={12}
                md={12 / menuData.periods.length}
                sx={{ pb: 4 }}
                key={period.id}
              >
                <Typography variant="h6">{period.name}</Typography>
                {period.stations.map((station) => {
                  return (
                    <>
                      <DialogContentText
                        sx={{ fontWeight: "bold", mt: 1.5 }}
                        key={station.id}
                      >
                        {station.name}
                      </DialogContentText>
                      {station.items.map((item) => (
                        <DialogContentText
                          key={item.name + item.portion + item.calories}
                        >
                          {item.name} · {item.calories} cal ({item.portion})
                        </DialogContentText>
                      ))}
                    </>
                  );
                })}
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default MenuDialog;
