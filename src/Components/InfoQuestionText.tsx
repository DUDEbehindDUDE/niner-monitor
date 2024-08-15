import { HelpOutline } from "@mui/icons-material";
import { Box, SxProps, Tooltip, Typography } from "@mui/material";

function InfoQuestionText({
  text,
  tooltip,
  sx,
  bold = false,
}: {
  text: string;
  tooltip: string;
  sx?: SxProps;
  bold?: boolean;
}) {
  const variant = bold ? "body1" : "body2";
  const weight = bold ? "bold" : null;
  return (
    <Box sx={sx}>
      <Tooltip title={tooltip}>
        <Typography
          variant={variant}
          sx={{ mt: 1, width: "fit-content", fontWeight: weight }}
        >
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
