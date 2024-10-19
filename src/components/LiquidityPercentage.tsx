import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";

type IProps = {
  amountInDollars: number;
  percent: number;
  onPercentChange: (percent: number) => void;
};

const LiquidityPercentage = ({
  amountInDollars,
  percent,
  onPercentChange,
}: IProps) => {
  const value = Math.max(0, Math.min(100, Math.round(percent * 100)));

  const handleChange = (amountString: string) => {
    const digits = amountString.replace(/\D/, "");
    const amount = digits.length === 0 ? 0 : parseInt(digits, 10);
    onPercentChange(Math.max(0, Math.min(100, amount)) / 100);
  };

  return (
    <div className="flex gap-4 w-full">
      <FormControl className="flex-grow !mb-8">
        <InputLabel htmlFor="percent-liquidity">Liquidity</InputLabel>
        <OutlinedInput
          id="percent-liquidity"
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
          label="Liquidity"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-grow !mb-8"
        />
      </FormControl>
      <FormControl className="flex-grow !mb-8">
        <InputLabel htmlFor="percent-liquidity">Amount Available</InputLabel>
        <OutlinedInput
          id="amount-liquidity"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          disabled
          label="Amount Available"
          value={amountInDollars * percent}
          type="number"
          onChange={(e) => onPercentChange(parseFloat(e.target.value))}
        />
      </FormControl>
    </div>
  );
};

export default LiquidityPercentage;
