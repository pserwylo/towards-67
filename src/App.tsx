import {
  Button,
  Dialog,
  DialogContent,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useOutlet } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  Asset,
  calculateLiquidity,
  formatDollars,
  selectAllAssets,
} from "./store/assetSlice.ts";
import { useSelector } from "react-redux";
import AppBar from "./components/AppBar.tsx";
import PageHeading from "./components/PageHeading.tsx";
import { EditableSummaryButton } from "./components/SummaryButton.tsx";
import Simulations from "./components/Simulations.tsx";

function App() {
  const assets = useSelector(selectAllAssets);

  const outlet = useOutlet();
  const navigate = useNavigate();

  const renderForm = () => {
    if (outlet === null) {
      return null;
    }

    // TODO: On larger screens, don't render a dialog, but rather always render just the outlet in full screen
    //       (i.e. instead of the rest of the app).
    return (
      <Dialog open={true} onClose={() => navigate("/")}>
        <DialogContent>{outlet}</DialogContent>
      </Dialog>
    );
  };

  return (
    <Stack spacing={2}>
      <AppBar />

      <Stack direction="row" spacing={2} className="pt-12">
        <PageHeading title="My Assets" />
        <Button
          to="/asset/add/misc"
          component={Link}
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
        >
          Add Asset
        </Button>
        <Button
          to="/asset/add/house"
          component={Link}
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
        >
          Add House
        </Button>
      </Stack>

      <Grid container spacing={1}>
        <Grid size={{ xs: 4, md: 3, lg: 2 }}>
          <Net assets={assets} />
        </Grid>
        {assets.map((asset) => (
          <Grid key={asset.slug} size={{ xs: 4, md: 3, lg: 2 }}>
            <AssetSummary asset={asset} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h2">Simulations</Typography>

      <Simulations />

      {renderForm()}
    </Stack>
  );
}

type ItemButtonProps = {
  asset: Asset;
};

const AssetSummary = ({ asset }: ItemButtonProps) => {
  const liquidity = calculateLiquidity(asset);
  return (
    <EditableSummaryButton
      label={asset.label}
      to={`/asset/${asset.slug}/edit`}
      progress={(liquidity / asset.amount) * 100}
    >
      <Stack>
        <Typography variant="body1" color="success">
          {formatDollars(asset.amount)}
        </Typography>
        {asset.type === "house" && (
          <Typography variant="body1" color="error">
            {formatDollars(asset.loan)}
          </Typography>
        )}
      </Stack>
    </EditableSummaryButton>
  );
};

type INetProps = {
  assets: Asset[];
};

const Net = ({ assets }: INetProps) => {
  const net = assets.reduce((acc, asset) => acc + calculateLiquidity(asset), 0);
  return (
    <EditableSummaryButton label="Net" to="/net">
      <Typography color="success">{formatDollars(net)}</Typography>
    </EditableSummaryButton>
  );
};

export default App;
