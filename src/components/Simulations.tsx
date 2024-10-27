import { Alert, Grid2 as Grid, Typography } from "@mui/material";
import {
  formatDollars,
  selectHouseWithMortgage,
  selectNetPosition,
} from "../store/assetSlice.ts";
import { SummaryButton } from "./SummaryButton.tsx";
import { useSelector } from "react-redux";

const Simulations = () => {
  const netPosition = useSelector(selectNetPosition);
  const houseWithMortgage = useSelector(selectHouseWithMortgage);

  if (
    houseWithMortgage === undefined ||
    houseWithMortgage.repayments.amount === 0
  ) {
    return (
      <Alert color="info">
        Add a house with a loan and repayments mortgage to see what you can
        afford compared to your current repayments.
      </Alert>
    );
  }

  const { frequency, amount } = houseWithMortgage.repayments;
  let mortgagePerMonth = 0;
  if (frequency === "fortnightly") {
    mortgagePerMonth = Math.round((amount * 26) / 12);
  } else if (frequency === "weekly") {
    mortgagePerMonth = Math.round((amount * 52) / 12);
  } else {
    mortgagePerMonth = amount;
  }

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 4, md: 3, lg: 2 }}>
        <SummaryButton className="flex flex-col" to="/afford/current">
          <Typography variant="subtitle1">Current</Typography>
          <Typography variant="body1">${mortgagePerMonth} p/m</Typography>
        </SummaryButton>
      </Grid>
      {[1, 1.25, 1.5, 1.75, 2].map((multiplier) => {
        const newLoan = houseWithMortgage.loan * multiplier;
        const newHouse = -newLoan + netPosition;
        const stampDuty = newHouse * 0.055; // Much more complex than this in real life.
        const newHouseLessTax = newHouse - stampDuty;

        return (
          <Grid key={multiplier} size={{ xs: 4, md: 3, lg: 2 }}>
            <SummaryButton
              className="flex flex-col items-start"
              to={`/afford/${multiplier}`}
            >
              <Typography variant="subtitle1" className="text-left w-full">
                Repayments x {multiplier}
              </Typography>
              <Typography variant="subtitle1" className="text-left w-full">
                {formatDollars(newHouseLessTax)}
              </Typography>
              <Typography variant="body1" className="text-left w-full">
                ${mortgagePerMonth * multiplier} p/m
              </Typography>
            </SummaryButton>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Simulations;
