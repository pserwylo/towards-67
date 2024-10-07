import {Box, Dialog, DialogContent, DialogTitle, Grid2 as Grid, styled, Typography} from "@mui/material";
import {useState} from "react";
import {Link, Outlet, useNavigate, useOutlet} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

type AssetHouse = {
  type: 'house';
  label: string;
  slug: string;
  amountInDollars: number;
};

type AssetShares = {
  type: 'shares';
  label: string;
  slug: string;
  amountInDollars: number;
};

type AssetLoan = {
  type: 'loan';
  label: string;
  slug: string;
  amountInDollars: number;
};

type AssetOffset = {
  type: 'offset';
  label: string;
  slug: string;
  amountInDollars: number;
};

type AssetMisc = {
  type: 'misc';
  label: string;
  slug: string;
  amountInDollars: number;
};

type Asset = AssetHouse | AssetOffset | AssetMisc | AssetShares | AssetLoan;

const calculateLiquidity = (asset: Asset) => {
  if (asset.type === 'house') {
    const agentFees = asset.amountInDollars * 0.02;
    return asset.amountInDollars - agentFees;
  }

  return asset.amountInDollars;
}

const formatDollars = (amountInDollars: number, includeCurrency: boolean = true) => {
  const prefix = (amountInDollars < 0 ? '-' : '') + (includeCurrency ? '$' : '');

  const absDollars = Math.abs(Number(amountInDollars.toPrecision(3)));

  if (absDollars > 1000000) {
    return prefix + (absDollars / 1000000) + 'm';
  }

  if (absDollars) {
    return prefix + (absDollars / 1000) + 'k';
  }

  return prefix + absDollars;
}

const calcNetPosition = (assets: Asset[]) => {
  let total = 0;
  assets.forEach((asset) => {
    total += calculateLiquidity(asset);
  })

  return total;
}

function App() {
  const [assets, setAssets] = useState<Asset[]>([
    {
      type: 'house',
      label: 'Current House',
      slug: 'current-house',
      amountInDollars: 850000,
    },
    {
      type: 'loan',
      label: 'Home loan',
      slug: 'home-loan',
      amountInDollars: -300000,
    },
    {
      type: 'offset',
      label: 'Offset',
      slug: 'offset',
      amountInDollars: 135000,
    },
    {
      type: 'shares',
      label: 'VAS',
      slug: 'vas',
      amountInDollars: 80000,
    }
  ]);

  const outlet = useOutlet();
  const navigate = useNavigate();

  const netPosition = calcNetPosition(assets);

  const mortgagePerMonth = 2036;
  const mortgageTotal = -300000;
  const houseValue = 850000;

  const renderForm = () => {
    if (outlet === null) {
      return null;
    }

    return (
      <Dialog open onClose={() => navigate("/")}>
        <DialogContent>
          {outlet}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Box className="flex flex-col space-y-4">
      <Typography variant="h1">Toward 67</Typography>

      <Typography variant="h2">My stuff</Typography>

      <Grid container spacing={1}>
        <Grid size={{ xs: 4, md: 3, lg: 1 }}>
          <ItemButton label="Net" amountInDollars={netPosition} to="/asset/net" />
        </Grid>
        {assets.map(asset =>
          <Grid key={asset.label} size={{ xs: 4, md: 3, lg: 2 }}>
            <ItemButton label={asset.label} amountInDollars={asset.amountInDollars} to={`/asset/${asset.slug}`} />
          </Grid>)}
        <Grid size={{ xs: 4, md: 1, lg: 1 }}>
          <SummaryButton to="/asset/add" className="inline-block max-w-12 text-center">
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
            <Typography variant="body1" color="error">{formatDollars(mortgageTotal)}</Typography>
            <Typography variant="body1">${mortgagePerMonth} p/m</Typography>
          </SummaryButton>
        </Grid>
        {[1, 1.25, 1.5, 1.75, 2].map(multiplier => {

          const newLoan = mortgageTotal * multiplier;
          const newHouse = -newLoan + netPosition;

          return (
            <Grid size={{ xs: 4, md: 3, lg: 2 }}>
              <SummaryButton className="flex flex-col items-start" to={`/afford/${multiplier}`}>
                <Typography variant="subtitle1" className="text-left w-full">Repayments x {multiplier}</Typography>
                <Typography variant="body1" className="text-left w-full">{formatDollars(newHouse)}</Typography>
                <Typography variant="body1" className="text-left w-full" color="error">{formatDollars(newLoan)}</Typography>
                <Typography variant="body1" className="text-left w-full">${mortgagePerMonth * multiplier} p/m</Typography>
              </SummaryButton>
            </Grid>
          );
        })}
      </Grid>
      {renderForm()}
    </Box>
  )
}

type ItemButtonProps = {
  label: string;
  amountInDollars: number;
  to: string;
};

const ItemButton = ({ label, amountInDollars, to }: ItemButtonProps) => {
  return (
    <EditableSummaryButton label={label} to={to}>
      <Typography variant="body1" color={amountInDollars >= 0 ? 'success' : 'error'}>
        {formatDollars(amountInDollars)}
      </Typography>
    </EditableSummaryButton>
  );
}

const SummaryButton = styled(Link)({
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 8,
  borderRadius: 4,
  '&:hover': {
    borderColor: '#bebebe',
    backgroundColor: '#f9f9f9',
  }
})

type EditableSummaryButtonProps = {
  label: string;
  to: string;
  children: React.ReactNode;
};

const EditableSummaryButton = ({ label, to, children }: EditableSummaryButtonProps) => {
  return (
    <SummaryButton className="flex flex-col items-start" to={to}>
      <Typography variant="subtitle1">
        {label}
      </Typography>
      <Box className="flex space-x-2">
        {children}
      </Box>
    </SummaryButton>
  );
}

export default App
