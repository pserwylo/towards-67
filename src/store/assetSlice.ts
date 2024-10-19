import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store.ts";

export type LiquidityAmountRemaining = {
  type: "amount-remaining";
  amountInDollars: number;
};

export type LiquidityAmountSpendable = {
  type: "amount-spendable";
  amountInDollars: number;
};

export type LiquidityPercent = {
  type: "percent";
  percent: number;
};

export type LiquidityAll = {
  type: "all";
};

export type LiquidityNone = {
  type: "none";
};

export type Liquidity =
  | LiquidityAmountRemaining
  | LiquidityAmountSpendable
  | LiquidityPercent
  | LiquidityNone
  | LiquidityAll;

export type LiquidityType = Liquidity["type"];

export type AssetHouse = {
  type: "house";
  label: string;
  slug: string;
  amountInDollars: number;
  liquidity: Liquidity;
};

export type AssetShares = {
  type: "shares";
  label: string;
  slug: string;
  amountInDollars: number;
  liquidity: Liquidity;
};

export type AssetLoan = {
  type: "loan";
  label: string;
  slug: string;
  amountInDollars: number;
};

export type AssetOffset = {
  type: "offset";
  label: string;
  slug: string;
  amountInDollars: number;
  liquidity: Liquidity;
};

export type AssetMisc = {
  type: "misc";
  label: string;
  slug: string;
  amountInDollars: number;
  liquidity: Liquidity;
};

export type LiquidAsset = Exclude<Asset, AssetLoan>;

export type Asset =
  | AssetHouse
  | AssetOffset
  | AssetMisc
  | AssetShares
  | AssetLoan;

export type MockData = {
  label: string;
  description: string;
  assets: Asset[];
};

export const mockData: MockData[] = [
  {
    label: "First home",
    description: "Purchasing your first home",
    assets: [
      {
        type: "misc",
        label: "Savings",
        slug: "savings",
        amountInDollars: 60000,
        liquidity: {
          type: "amount-remaining",
          amountInDollars: 5000,
        },
      },
    ],
  },
  {
    label: "Upsizing",
    description: "You have one home, want to move to a bigger one",
    assets: [
      {
        type: "house",
        label: "Current House",
        slug: "current-house",
        amountInDollars: 720000,
        liquidity: {
          type: "all",
        },
      },
      {
        type: "loan",
        label: "Home loan",
        slug: "home-loan",
        amountInDollars: -425000,
      },
      {
        type: "offset",
        label: "Offset",
        slug: "offset",
        amountInDollars: 35000,
        liquidity: {
          type: "amount-remaining",
          amountInDollars: 10000,
        },
      },
      {
        type: "shares",
        label: "VAS",
        slug: "vas",
        amountInDollars: 8000,
        liquidity: {
          type: "amount-spendable",
          amountInDollars: 5000,
        },
      },
    ],
  },
  {
    label: "First Investment",
    description: "You have one home, want to buy an investment property",
    assets: [
      {
        type: "house",
        label: "Current House",
        slug: "current-house",
        amountInDollars: 900000,
        liquidity: {
          type: "none",
        },
      },
      {
        type: "loan",
        label: "Home loan",
        slug: "home-loan",
        amountInDollars: -260000,
      },
      {
        type: "offset",
        label: "Offset",
        slug: "offset",
        amountInDollars: 225000,
        liquidity: {
          type: "amount-remaining",
          amountInDollars: 30000,
        },
      },
      {
        type: "shares",
        label: "VAS",
        slug: "vas",
        amountInDollars: 65000,
        liquidity: {
          type: "amount-spendable",
          amountInDollars: 20000,
        },
      },
    ],
  },
];

const assetSlice = createSlice({
  name: "assets",
  initialState: {
    assets: mockData[0].assets,
  },
  reducers: {
    setMockData(state, action: PayloadAction<MockData>) {
      state.assets = action.payload.assets;
    },
  },
  selectors: {
    selectAllAssets: (state) => state.assets,
  },
});

export const { selectAllAssets } = assetSlice.selectors;

export const calculateLiquidity = (asset: LiquidAsset) => {
  const liquidity = asset.liquidity;
  let amountInDollars = asset.amountInDollars;
  if (asset.type === "house") {
    amountInDollars -= amountInDollars * 0.02; // Subtract agent's fees.
  }

  if (liquidity.type === "all") {
    return amountInDollars;
  } else if (liquidity.type === "none") {
    return 0;
  } else if (liquidity.type === "amount-spendable") {
    return liquidity.amountInDollars;
  } else if (liquidity.type === "amount-remaining") {
    return amountInDollars - liquidity.amountInDollars;
  } else if (liquidity.type === "percent") {
    return amountInDollars * (liquidity.percent / 100);
  }

  return asset.amountInDollars;
};

export const isLiquidAsset = (asset: Asset): asset is LiquidAsset => {
  return asset.type !== "loan";
};

export const makeSelectAssetBySlug = (slug: string) => (state: RootState) =>
  state.assets.assets.find((a) => a.slug === slug);

export const selectNetPosition = createSelector([selectAllAssets], (assets) => {
  let total = 0;
  assets.forEach((asset) => {
    total +=
      asset.type === "loan" ? asset.amountInDollars : calculateLiquidity(asset);
  });

  return total;
});

export const { setMockData } = assetSlice.actions;

export const assetReducer = assetSlice.reducer;
