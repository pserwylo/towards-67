import {
  AssetHouse,
  calculateLiquidity,
  formatDollars,
} from "../store/assetSlice.ts";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Stack,
} from "@mui/material";

type IHouseLiquiditySelectorProps = {
  asset: AssetHouse;
  onChange: (willSell: boolean) => void;
};

const HouseLiquiditySelector = ({
  asset,
  onChange,
}: IHouseLiquiditySelectorProps) => {
  const liquidity = calculateLiquidity(asset);
  return (
    <Stack>
      <Box className="flex justify-between">
        {!asset.canSell ? (
          <>
            <FormLabel>Liquidity: $0</FormLabel>
          </>
        ) : (
          <>
            <FormLabel>
              Liquidity: {formatDollars(calculateLiquidity(asset))} (less 2%
              agent fees &amp; loan)
            </FormLabel>
          </>
        )}
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => onChange(e.target.checked)}
            checked={liquidity !== 0}
          />
        }
        label="Willing to sell"
      />
    </Stack>
  );
};

export default HouseLiquiditySelector;
