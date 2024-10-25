import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Asset,
  makeSelectAssetBySlug,
  newAsset,
  selectNewSlug,
  updateAsset,
} from "../store/assetSlice.ts";
import {
  Alert,
  Box,
  Button,
  DialogActions,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import LiquiditySlider from "./LiquiditySlider.tsx";
import HouseLiquiditySelector from "./HouseLiquiditySelector.tsx";

const AssetForm = () => {
  const { slug } = useParams<{ slug: string }>();
  const originalAsset = useSelector(makeSelectAssetBySlug(slug!));
  const newSlug = useSelector(selectNewSlug);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(
    undefined,
  );

  useEffect(() => {
    setEditingAsset(
      originalAsset ?? {
        slug: newSlug,
        type: "misc",
        label: "New Asset",
        amount: 0,
        liquidity: 0,
      },
    );
  }, [originalAsset, newSlug]);

  if (editingAsset === undefined) {
    return <Alert color="error">Unknown asset</Alert>;
  }

  const handleLabelChange = (label: string) => {
    setEditingAsset({ ...editingAsset, label });
  };

  const handleAssetAmountChange = (amountString: string) => {
    const amount = parseInt(amountString, 10);
    setEditingAsset({ ...editingAsset, amount });
  };

  const handleLoanAmountChange = (amountString: string) => {
    if (editingAsset.type !== "house") {
      console.warn("Tried to update home loan for non-home asset. ", {
        asset: editingAsset,
      });
      return;
    }

    const loan = parseInt(amountString, 10);
    setEditingAsset({ ...editingAsset, loan });
    navigate("/");
  };

  if (slug == null) {
    navigate("/");
    return null;
  }

  const handleOnSave = () => {
    if (originalAsset === undefined) {
      dispatch(newAsset({ details: editingAsset }));
    } else {
      dispatch(updateAsset({ slug: slug!, details: editingAsset }));
    }
    navigate("/");
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
            value={editingAsset.amount}
            onChange={(e) => handleAssetAmountChange(e.target.value)}
            type="number"
          />
        </FormControl>
        {editingAsset.type === "house" && (
          <FormControl>
            <InputLabel htmlFor="loan">Loan</InputLabel>
            <OutlinedInput
              id="loan"
              label="Loan"
              startAdornment={
                <InputAdornment position="start">-$</InputAdornment>
              }
              value={-editingAsset.loan}
              onChange={(e) => handleLoanAmountChange(e.target.value)}
              type="number"
            />
          </FormControl>
        )}
      </Box>
      {editingAsset.type === "house" ? (
        <HouseLiquiditySelector
          asset={editingAsset}
          onChange={(canSell) =>
            setEditingAsset({
              ...editingAsset,
              canSell,
            })
          }
        />
      ) : (
        <LiquiditySlider
          amount={editingAsset.amount}
          liquidity={editingAsset.liquidity}
          onChange={(liquidity) =>
            setEditingAsset({ ...editingAsset, liquidity })
          }
        />
      )}
      <Box className="mt-8">
        <DialogActions>
          <Button component={Link} to="/">
            Cancel
          </Button>
          <Button
            component={Link}
            to="/"
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              handleOnSave();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Box>
    </div>
  );
};

export default AssetForm;
