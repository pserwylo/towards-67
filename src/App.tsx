import {Box, Button, Divider, Grid, Typography} from "@mui/joy";
import {useState} from "react";

type AssetHouse = {
  type: 'house';
  label: string;
  amountInDollars: number;
};

type AssetShares = {
  type: 'shares';
  label: string;
  amountInDollars: number;
};

type AssetLoan = {
  type: 'loan';
  label: string;
  amountInDollars: number;
};

type AssetOffset = {
  type: 'offset';
  label: string;
  amountInDollars: number;
};

type AssetMisc = {
  type: 'misc';
  label: string;
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

const parseDollars = (amount: string) => {
  const simpleAmount = amount.replace(/\s+/, '').replace(/,/, '');
  const parts = /^\$?(?<number>\d*?\.?\d*?)(?<unit>[km])?$/.exec(simpleAmount)?.groups;
  if (parts == null) {
    return null;
  }

  const amountInUnits = parseFloat(parts.number);
  const unit = parts.unit;

  if (unit === 'm') {
    return amountInUnits * 1000000;
  }

  if (unit === 'k') {
    return amountInUnits * 1000;
  }

  return amountInUnits;
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
      amountInDollars: 850000,
    },
    {
      type: 'loan',
      label: 'Home loan',
      amountInDollars: -300000,
    },
    {
      type: 'offset',
      label: 'Offset',
      amountInDollars: 135000,
    },
    {
      type: 'shares',
      label: 'VAS',
      amountInDollars: 80000,
    }
  ]);

  const handleAssetChange = (asset: Asset, amount: string) => {
    const amountInDollars = parseDollars(amount);
    if (amountInDollars == null) {
      console.error('Oops');
      return;
    }

    setAssets(assets.map(a => a === asset ? {
      ...asset,
      amountInDollars,
    } : a));
  }

  const netPosition = calcNetPosition(assets);

  const mortgagePerMonth = 2036;
  const mortgageTotal = -300000;
  const houseValue = 850000;

  return (
    <Box className="flex flex-col space-y-4">
      <Typography level="h1">Toward 67</Typography>

      <Typography level="title-lg">My stuff</Typography>

      <Grid container spacing={1}>
        <Grid size={{ xs: 4, md: 2 }} component='div'>
          <ItemButton label="Net" amountInDollars={netPosition} />
        </Grid>
        {assets.map(asset =>
          <Grid key={asset.label} size={{ xs: 4, md: 2 }}>
            <ItemButton label={asset.label} amountInDollars={asset.amountInDollars} />
          </Grid>)}
        <Grid size={{ xs: 4, md: 2 }}>
          <Button variant="outlined" color="neutral">
            +
          </Button>
        </Grid>
      </Grid>

      <Typography level="title-lg">I can afford</Typography>

      <Grid container spacing={1}>
        <Grid size={{ xs: 4, md: 2 }}>
          <Box className="flex flex-col">
            <Typography level="title-md">Current</Typography>
            <Typography level="title-md"></Typography>
            <Typography level="body-md">{formatDollars(houseValue)}</Typography>
            <Typography level="body-md" color="danger">{formatDollars(mortgageTotal)}</Typography>
            <Typography level="body-md">${mortgagePerMonth} p/m</Typography>
          </Box>
        </Grid>
        {[1, 1.25, 1.5, 1.75, 2].map(multiplier => {

          const newLoan = mortgageTotal * multiplier;
          const newHouse = -newLoan + netPosition;

          return (
            <Grid size={{ xs: 4, md: 2 }}>
              <Button className="flex flex-col items-start" color="neutral" variant="outlined">
                <Typography level="title-md" className="text-left w-full">x{multiplier}</Typography>
                <Typography level="body-md" className="text-left w-full">{formatDollars(newHouse)}</Typography>
                <Typography level="body-md" className="text-left w-full" color="danger">{formatDollars(newLoan)}</Typography>
                <Typography level="body-md" className="text-left w-full">${mortgagePerMonth * multiplier} p/m</Typography>
              </Button>
            </Grid>
          );
        })}
      </Grid>

    </Box>
  )
}

type ItemButtonProps = {
  label: string;
  amountInDollars: number;
};

const ItemButton = ({ label, amountInDollars }: ItemButtonProps) => {
  return (
    <Button className="flex flex-col items-start" variant="outlined" color="neutral">
      <Typography level="title-md">
        {label}
      </Typography>
      <Box className="flex space-x-2">
        <Typography level="body-md" color={amountInDollars >= 0 ? 'success' : 'danger'}>
          {formatDollars(amountInDollars)}
        </Typography>
      </Box>
    </Button>
  );
}

export default App
