import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Asset,
  Liquidity,
  LiquidityType,
  makeSelectAssetBySlug,
} from "../store/assetSlice.ts";
import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import LiquidityPercentage from "./LiquidityPercentage.tsx";

const AssetForm = () => {
  const { id } = useParams<{ id: string }>();
  const originalAsset = useSelector(makeSelectAssetBySlug(id!));

  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(
    undefined,
  );
  const [cachedLiquidityValues, setCachedLiquidityValues] = useState<
    Liquidity[]
  >([]);

  useEffect(() => {
    setEditingAsset(
      originalAsset ?? {
        slug: "new-asset",
        type: "misc",
        label: "New Asset",
        amountInDollars: 0,
        liquidity: {
          type: "all",
        },
      },
    );
  }, [originalAsset]);

  if (id === "net") {
    return <div>NET</div>;
  }

  if (editingAsset === undefined) {
    return <Alert color="error">Unknown asset</Alert>;
  }

  const handleLabelChange = (label: string) => {
    setEditingAsset({ ...editingAsset, label });
  };

  const handleAssetAmountChange = (amount: string) => {
    const amountInDollars = parseInt(amount, 10);
    setEditingAsset({ ...editingAsset, amountInDollars });
  };

  const handleLiquidityChange = (liquidityType: LiquidityType) => {
    if (editingAsset.type === "loan") {
      return;
    }

    const createNewLiquidity = (type: LiquidityType): Liquidity => {
      switch (type) {
        case "percent":
          return { type: "percent", percent: 1 };

        case "all":
          return { type: "all" };

        case "none":
          return { type: "none" };

        case "amount-remaining":
          return { type: "amount-remaining", amountInDollars: 0 };

        case "amount-spendable":
          return { type: "amount-spendable", amountInDollars: 0 };
      }

      return { type: "all" };
    };

    const liquidity =
      cachedLiquidityValues.find((l) => l.type === liquidityType) ??
      createNewLiquidity(liquidityType);

    setCachedLiquidityValues(
      cachedLiquidityValues
        .filter((l) => l.type !== editingAsset.liquidity.type)
        .concat(liquidity),
    );

    setEditingAsset({
      ...editingAsset,
      liquidity,
    });
  };

  const renderLiquidityWidget = () => {
    if (editingAsset.type === "loan") {
      return null;
    }

    if (editingAsset.liquidity.type === "none") {
      return null;
    }

    switch (editingAsset.liquidity.type) {
      case "percent":
        return (
          <LiquidityPercentage
            amountInDollars={editingAsset.amountInDollars}
            percent={editingAsset.liquidity.percent}
            onPercentChange={(percent) =>
              setEditingAsset({
                ...editingAsset,
                liquidity: {
                  type: "percent",
                  percent,
                },
              })
            }
          />
        );

      case "amount-spendable":
        return (
          <AmountSpendable
            amountInDollars={editingAsset.amountInDollars}
            amountSpendableInDollars={editingAsset.liquidity.amountInDollars}
            onChange={(amountInDollars) =>
              setEditingAsset({
                ...editingAsset,
                liquidity: {
                  type: "amount-spendable",
                  amountInDollars,
                },
              })
            }
          />
        );

      case "amount-remaining":
        return (
          <AmountRemaining
            amountInDollars={editingAsset.amountInDollars}
            amountRemainingInDollars={editingAsset.liquidity.amountInDollars}
            onChange={(amountInDollars) =>
              setEditingAsset({
                ...editingAsset,
                liquidity: {
                  type: "amount-remaining",
                  amountInDollars,
                },
              })
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <Typography variant="h3" className="!mb-8">
        Asset details
      </Typography>
      <Box className="!mb-8 flex gap-x-8 w-full">
        <TextField
          label="Label"
          variant="outlined"
          value={editingAsset.label}
          onChange={(e) => handleLabelChange(e.target.value)}
        />
        <FormControl>
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <OutlinedInput
            id="amount"
            label="Amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            value={editingAsset.amountInDollars}
            onChange={(e) => handleAssetAmountChange(e.target.value)}
            type="number"
          />
        </FormControl>
      </Box>
      {editingAsset.type !== "loan" && (
        <>
          <FormControl className="!mb-4">
            <FormLabel id="liquidity-type">Liquidity</FormLabel>
            <RadioGroup
              row
              aria-labelledby="liquidity-type"
              name="liquidity-type-radio"
              value={editingAsset.liquidity.type}
              onChange={(e) =>
                handleLiquidityChange(e.target.value as LiquidityType)
              }
            >
              <Box>
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="some"
                  control={<Radio />}
                  label="None"
                />
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label="None"
                />
              </Box>
              <Box>
                <FormControlLabel
                  value="percent"
                  control={<Radio />}
                  label="Percentage"
                />
                <FormControlLabel
                  value="amount-remaining"
                  control={<Radio />}
                  label="Amount remaining"
                />
                <FormControlLabel
                  value="amount-spendable"
                  control={<Radio />}
                  label="Amount spendable"
                />
              </Box>
            </RadioGroup>
          </FormControl>
          {renderLiquidityWidget()}
        </>
      )}
    </div>
  );
};

type IAmountSpendableProps = {
  amountInDollars: number;
  amountSpendableInDollars: number;
  onChange: (amountInDollars: number) => void;
};

const AmountSpendable = ({
  amountInDollars,
  amountSpendableInDollars,
  onChange,
}: IAmountSpendableProps) => {
  return (
    <FormControl>
      <InputLabel htmlFor="amount-spendable">Amount Spendable</InputLabel>
      <OutlinedInput
        id="amount-spendable"
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
        label="Amount Spendable"
        value={amountInDollars}
        type="number"
      />
      <FormHelperText title="Amount you are willing to spend from this asset" />
    </FormControl>
  );
};

type IAmountRemainingProps = {
  amountInDollars: number;
  amountRemainingInDollars: number;
  onChange: (amountInDollars: number) => void;
};

const AmountRemaining = ({
  amountInDollars,
  amountRemainingInDollars,
  onChange,
}: IAmountRemainingProps) => {
  return (
    <div className="flex gap-4 w-full">
      <FormControl>
        <InputLabel htmlFor="amount-remaining">Amount Remaining</InputLabel>
        <OutlinedInput
          id="amount-remaining"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Amount Remaining"
          value={amountInDollars}
          type="number"
        />
        <FormHelperText title="Amount you need to save, e.g. for emergencies, new house renovations, etc." />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="amount-liquidity">Amount Available</InputLabel>
        <OutlinedInput
          id="amount-liquidity"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          disabled
          label="Amount Available"
          value={amountInDollars - amountRemainingInDollars}
          type="number"
        />
      </FormControl>
    </div>
  );
};

export default AssetForm;
