import { Box, FormLabel, Slider } from "@mui/material";
import { formatDollars } from "../store/assetSlice.ts";

type ILiquiditySliderProps = {
  amount: number;
  liquidity: number;
  onChange: (liquidity: number) => void;
};

const LiquiditySlider = ({
  amount,
  liquidity,
  onChange,
}: ILiquiditySliderProps) => {
  return (
    <Box>
      <FormLabel id="liquidity-type">
        Liquidity: {formatDollars(liquidity)}
      </FormLabel>
      <Box className="pl-4 pr-4">
        <Slider
          onChange={(_, value) => onChange(value as number)}
          min={0}
          max={amount}
          marks={[
            { value: 0, label: "$0" },
            { value: amount, label: "$" + amount },
          ]}
          step={1000}
          value={liquidity}
          valueLabelDisplay="off"
        />
      </Box>
    </Box>
  );
};

export default LiquiditySlider;
