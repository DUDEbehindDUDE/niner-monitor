import { HelpOutline } from "@mui/icons-material";
import { Box, SxProps, Tooltip, Typography } from "@mui/material";

function InfoQuestionText({
  text,
  tooltip,
  sx,
}: {
  text: string;
  tooltip: string;
  sx?: SxProps;
}) {
  return (
    <Box sx={sx}>
      <Tooltip title={tooltip}>
        <Typography variant="body2" sx={{ mt: 1, width: "fit-content" }}>
          {text}
          <HelpOutline
            sx={{ fontSize: "1.2em", verticalAlign: "-16%", ml: 1 }}
          />
        </Typography>
      </Tooltip>
    </Box>
  );
}

export default InfoQuestionText;
