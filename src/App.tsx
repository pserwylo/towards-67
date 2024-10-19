import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid2 as Grid,
  LinearProgress,
  styled,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useOutlet } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  calculateLiquidity,
  isLiquidAsset,
  mockData,
  selectAllAssets,
  selectNetPosition,
  setMockData,
} from "./store/assetSlice.ts";
import { useDispatch, useSelector } from "react-redux";

const formatDollars = (
  amountInDollars: number,
  includeCurrency: boolean = true,
) => {
  const prefix =
    (amountInDollars < 0 ? "-" : "") + (includeCurrency ? "$" : "");

  const absDollars = Math.abs(Number(amountInDollars.toPrecision(3)));

  if (absDollars > 1000000) {
    return prefix + absDollars / 1000000 + "m";
  }

  if (absDollars) {
    return prefix + absDollars / 1000 + "k";
  }

  return prefix + absDollars;
};

function App() {
  const dispatch = useDispatch();

  const assets = useSelector(selectAllAssets);
  const netPosition = useSelector(selectNetPosition);

  const outlet = useOutlet();
  const navigate = useNavigate();

  const mortgagePerMonth = 2036;
  const mortgageTotal = -300000;
  const houseValue = 850000;

  const renderForm = () => {
    if (outlet === null) {
      return null;
    }

    // TODO: On larger screens, don't render a dialog, but rather always render just the outlet in full screen
    //       (i.e. instead of the rest of the app).
    return (
      <Dialog open onClose={() => navigate("/")}>
        <DialogContent>{outlet}</DialogContent>
        <DialogActions>
          <Button to="/">Cancel</Button>
          <Button to="/" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box className="flex flex-col space-y-4">
      <Typography variant="h1">Toward 67</Typography>

      <Typography variant="h2">Examples</Typography>

      <Box className="flex space-x-4">
        {mockData.map((data) => (
          <Button onClick={() => dispatch(setMockData(data))}>
            {data.label}
          </Button>
        ))}
      </Box>

      <Typography variant="h2">My stuff</Typography>

      <Grid container spacing={1}>
        <Grid size={{ xs: 4, md: 3, lg: 1 }}>
          <ItemButton
            label="Available"
            amountInDollars={netPosition}
            to="/asset/net"
          />
        </Grid>
        {assets.map((asset) => (
          <Grid key={asset.label} size={{ xs: 4, md: 3, lg: 2 }}>
            <ItemButton
              label={asset.label}
              amountInDollars={asset.amountInDollars}
              to={`/asset/${asset.slug}`}
              progress={
                isLiquidAsset(asset)
                  ? (calculateLiquidity(asset) / asset.amountInDollars) * 100
                  : undefined
              }
            />
          </Grid>
        ))}
        <Grid size={{ xs: 4, md: 1, lg: 1 }}>
          <SummaryButton
            to="/asset/add"
            className="inline-block max-w-12 text-center"
          >
            <AddIcon />
          </SummaryButton>
        </Grid>
      </Grid>

      <Typography variant="h2">I can afford</Typography>

      <Grid container spacing={1}>
        <Grid size={{ xs: 4, md: 3, lg: 2 }}>
          <SummaryButton className="flex flex-col" to="/afford/current">
            <Typography variant="subtitle1">Current</Typography>
            <Typography variant="body1">{formatDollars(houseValue)}</Typography>
            <Typography variant="body1" color="error">
              {formatDollars(mortgageTotal)}
            </Typography>
            <Typography variant="body1">${mortgagePerMonth} p/m</Typography>
          </SummaryButton>
        </Grid>
        {[1, 1.25, 1.5, 1.75, 2].map((multiplier) => {
          const newLoan = mortgageTotal * multiplier;
          const newHouse = -newLoan + netPosition;

          return (
            <Grid size={{ xs: 4, md: 3, lg: 2 }}>
              <SummaryButton
                className="flex flex-col items-start"
                to={`/afford/${multiplier}`}
              >
                <Typography variant="subtitle1" className="text-left w-full">
                  Repayments x {multiplier}
                </Typography>
                <Typography variant="body1" className="text-left w-full">
                  {formatDollars(newHouse)}
                </Typography>
                <Typography
                  variant="body1"
                  className="text-left w-full"
                  color="error"
                >
                  {formatDollars(newLoan)}
                </Typography>
                <Typography variant="body1" className="text-left w-full">
                  ${mortgagePerMonth * multiplier} p/m
                </Typography>
              </SummaryButton>
            </Grid>
          );
        })}
      </Grid>
      {renderForm()}
    </Box>
  );
}

type ItemButtonProps = {
  label: string;
  amountInDollars: number;
  to: string;
  progress?: number;
};

const ItemButton = ({
  label,
  amountInDollars,
  progress,
  to,
}: ItemButtonProps) => {
  return (
    <EditableSummaryButton label={label} to={to} progress={progress}>
      <Typography
        variant="body1"
        color={amountInDollars >= 0 ? "success" : "error"}
      >
        {formatDollars(amountInDollars)}
      </Typography>
    </EditableSummaryButton>
  );
};

const SummaryButton = styled(Link)({
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

const EditableSummaryButton = ({
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

export default App;
