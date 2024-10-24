import { useSelector } from "react-redux";
import {
  Asset,
  calculateLiquidity,
  formatDollars,
  selectAllAssets,
  selectNetPosition,
} from "../store/assetSlice.ts";
import {
  Box,
  Button,
  DialogActions,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

type INetDetailProps = {
  asset: Asset;
};

const NetDetail = ({ asset }: INetDetailProps) => {
  const liquidity = calculateLiquidity(asset);
  const amount = asset.amount;

  if (asset.type !== "house") {
    return liquidity === amount ? (
      formatDollars(liquidity)
    ) : (
      <Box>
        {formatDollars(liquidity)}{" "}
        <span className="text-gray-400">
          from {formatDollars(asset.amount)}
        </span>
      </Box>
    );
  }

  if (!asset.canSell) {
    return <span className="text-gray-400">Not willing to sell</span>;
  }

  return (
    <Stack>
      <Box>
        {formatDollars(asset.amount)}{" "}
        <span className="text-gray-400"> (approx sale price)</span>
      </Box>
      <Box className="pl-2">
        - {formatDollars(asset.amount * 0.02)}{" "}
        <span className="text-gray-400">(agent fees)</span>
      </Box>
      <Box className="pl-2">
        {" "}
        - {formatDollars(-asset.loan)}{" "}
        <span className="text-gray-400">(loan)</span>
      </Box>
      <Box> = {formatDollars(liquidity)}</Box>
    </Stack>
  );
};

const NetForm = () => {
  const assets = useSelector(selectAllAssets);
  const net = useSelector(selectNetPosition);

  const renderAssetRow = (asset: Asset) => {
    const liquidity = calculateLiquidity(asset);

    return (
      <TableRow key={asset.slug}>
        <TableCell
          className={`!align-top ${liquidity === 0 ? "!text-gray-400" : ""}`}
        >
          {asset.label}
        </TableCell>
        <TableCell className={liquidity === 0 ? "!text-gray-400" : ""}>
          <NetDetail asset={asset} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="flex flex-col">
      <Typography variant="h3" className="!mb-8">
        Net Position
      </Typography>
      <Typography variant="h4" className="!mb-8" color="success">
        {formatDollars(net)}
      </Typography>
      <Box className="!mb-8 flex gap-x-8 w-full">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
            {assets.map((asset) => renderAssetRow(asset))}
          </TableHead>
        </Table>
      </Box>
      <Box className="mt-8">
        <DialogActions>
          <Button component={Link} to="/">
            Close
          </Button>
        </DialogActions>
      </Box>
    </div>
  );
};

export default NetForm;
