import { Box, LinearProgress, styled, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const SummaryButton = styled(Link)({
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 8,
  borderRadius: 4,
  "&:hover": {
    borderColor: "#bebebe",
    backgroundColor: "#f9f9f9",
  },
});

type EditableSummaryButtonProps = {
  label: string;
  to: string;
  children: React.ReactNode;
  progress?: number;
};

export const EditableSummaryButton = ({
  label,
  to,
  children,
  progress,
}: EditableSummaryButtonProps) => {
  return (
    <SummaryButton className="flex flex-col items-start" to={to}>
      <Typography variant="subtitle1">{label}</Typography>
      <Box className="flex space-x-2">{children}</Box>
      {progress === undefined ? null : (
        <LinearProgress
          value={progress}
          className="h-24 w-full"
          variant="determinate"
        />
      )}
    </SummaryButton>
  );
};
