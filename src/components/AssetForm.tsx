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
  Button,
  DialogActions,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import LiquiditySlider from "./LiquiditySlider.tsx";
import HouseLiquiditySelector from "./HouseLiquiditySelector.tsx";
import Grid from "@mui/material/Grid2";

type IProps = {
  addNew?: "house" | "misc";
};
const AssetForm = ({ addNew }: IProps) => {
  const { slug } = useParams<{ slug: string }>();
  const originalAsset = useSelector(makeSelectAssetBySlug(slug!));
  const newSlug = useSelector(selectNewSlug);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(
    undefined,
  );

  useEffect(() => {
    if (originalAsset != null) {
      setEditingAsset(originalAsset);
    } else if (addNew === "house") {
      setEditingAsset({
        slug: newSlug,
        type: "house",
        label: "New House",
        amount: 0,
        loan: 0,
        repayments: {
          amount: 0,
          frequency: "fortnightly",
        },
        canSell: false,
      });
    } else if (addNew === "misc") {
      setEditingAsset({
        slug: newSlug,
        type: "misc",
        label: "New Asset",
        amount: 0,
        liquidity: 0,
      });
    }
  }, [addNew, originalAsset, newSlug]);

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

    const loan = -parseInt(amountString, 10);
    setEditingAsset({ ...editingAsset, loan });
  };

  const handleOnSave = () => {
    if (originalAsset === undefined) {
      dispatch(newAsset({ details: editingAsset }));
    } else {
      dispatch(updateAsset({ slug: slug!, details: editingAsset }));
    }
    navigate("/");
  };

  const handleRepaymentsAmountChange = (amountString: string) => {
    if (editingAsset.type !== "house") {
      return;
    }

    const amount = parseInt(amountString, 10);

    setEditingAsset({
      ...editingAsset,
      repayments: {
        ...editingAsset.repayments,
        amount,
      },
    });
  };

  const handleRepaymentsFrequencyChange = (frequency: string) => {
    if (editingAsset.type !== "house") {
      return;
    }

    setEditingAsset({
      ...editingAsset,
      repayments: {
        ...editingAsset.repayments,
        frequency: frequency as "fortnightly" | "weekly" | "monthly",
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h3" className="!mb-8">
          Asset details
        </Typography>
      </Grid>
      <Grid size={6}>
        <TextField
          label="Label"
          variant="outlined"
          value={editingAsset.label}
          fullWidth
          onChange={(e) => handleLabelChange(e.target.value)}
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor="amount">
            {editingAsset.type === "house" ? "Approx value" : "Amount"}
          </InputLabel>
          <OutlinedInput
            id="amount"
            label={editingAsset.type === "house" ? "Approx value" : "Amount"}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            value={editingAsset.amount}
            onChange={(e) => handleAssetAmountChange(e.target.value)}
            type="number"
          />
        </FormControl>
      </Grid>
      {editingAsset.type === "house" && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
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
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="repayments">Repayments</InputLabel>
              <OutlinedInput
                id="repayments"
                label="Repayments"
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                value={editingAsset.repayments.amount}
                onChange={(e) => handleRepaymentsAmountChange(e.target.value)}
                type="number"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="frequency">Frequency</InputLabel>
              <Select
                variant="outlined"
                label="Frequency"
                id="frequency"
                value={editingAsset.repayments.frequency}
                onChange={(e) =>
                  handleRepaymentsFrequencyChange(e.target.value)
                }
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="fortnightly">Fortnightly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </>
      )}
      <Grid size={12}>
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
            liquidity={
              editingAsset.liquidity === "all"
                ? editingAsset.amount
                : editingAsset.liquidity
            }
            onChange={(liquidity) =>
              setEditingAsset({
                ...editingAsset,
                liquidity:
                  liquidity === editingAsset.amount ? "all" : liquidity,
              })
            }
          />
        )}
      </Grid>
      <Grid size={12} className="mt-8">
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
      </Grid>
    </Grid>
  );
};

export default AssetForm;
