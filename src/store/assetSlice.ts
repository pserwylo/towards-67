import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store.ts";

export type AssetHouse = {
  type: "house";
  label: string;
  slug: string;
  amount: number;
  loan: number;
  repayments: {
    amount: number;
    frequency: "weekly" | "fortnightly" | "monthly";
  };
  canSell: boolean;
};

export type Liquidity = number | "all";

export type AssetShares = {
  type: "shares";
  label: string;
  slug: string;
  amount: number;
  liquidity: Liquidity;
};

export type AssetOffset = {
  type: "offset";
  label: string;
  slug: string;
  amount: number;
  liquidity: Liquidity;
};

export type AssetMisc = {
  type: "misc";
  label: string;
  slug: string;
  amount: number;
  liquidity: Liquidity;
};

export type Asset = AssetHouse | AssetOffset | AssetMisc | AssetShares;

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
        amount: 60000,
        liquidity: 55000,
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
        amount: 720000,
        loan: -425000,
        repayments: {
          amount: 2400,
          frequency: "fortnightly",
        },
        canSell: true,
      },
      {
        type: "offset",
        label: "Offset",
        slug: "offset",
        amount: 35000,
        liquidity: 25000,
      },
      {
        type: "shares",
        label: "VAS",
        slug: "vas",
        amount: 8000,
        liquidity: 5000,
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
        amount: 900000,
        loan: -260000,
        repayments: {
          amount: 2100,
          frequency: "fortnightly",
        },
        canSell: false,
      },
      {
        type: "offset",
        label: "Offset",
        slug: "offset",
        amount: 225000,
        liquidity: 225000 - 30000,
      },
      {
        type: "shares",
        label: "VAS",
        slug: "vas",
        amount: 65000,
        liquidity: 20000,
      },
    ],
  },
  {
    label: "Second Investment",
    description:
      "You have one home and one investment property, and want to buy a second investment property",
    assets: [
      {
        type: "house",
        label: "Current House",
        slug: "current-house",
        amount: 900000,
        loan: -260000,
        repayments: {
          amount: 2100,
          frequency: "fortnightly",
        },
        canSell: false,
      },
      {
        type: "offset",
        label: "Offset",
        slug: "offset",
        amount: 225000,
        liquidity: 225000 - 30000,
      },
      {
        type: "house",
        label: "1st Investment",
        slug: "1st-investment",
        amount: 750000,
        loan: -580000,
        repayments: {
          amount: 6150,
          frequency: "monthly",
        },
        canSell: false,
      },
      {
        type: "offset",
        label: "Offset (investment)",
        slug: "offset-investment",
        amount: 20000,
        liquidity: 20000,
      },
      {
        type: "shares",
        label: "VAS",
        slug: "vas",
        amount: 65000,
        liquidity: 20000,
      },
    ],
  },
];

const assetSlice = createSlice({
  name: "assets",
  initialState: {
    assets: mockData[1].assets,
  },
  reducers: {
    setMockData(state, action: PayloadAction<MockData>) {
      state.assets = action.payload.assets;
    },
    newAsset(state, action: PayloadAction<{ details: Asset }>) {
      const { details } = action.payload;

      const preferredSlug = details.label.toLowerCase().replace(/\W+/g, "-");
      let slug = preferredSlug;
      let counter = 0;
      while (state.assets.find((a) => a.slug === slug) !== undefined) {
        counter++;
        slug = `${preferredSlug}-${counter}`;
      }

      state.assets.push({
        ...details,
        slug,
      });
    },
    updateAsset(
      state,
      action: PayloadAction<{ slug: string; details: Asset }>,
    ) {
      const { slug, details } = action.payload;
      const asset = state.assets.find((a) => a.slug === slug);
      if (asset == null) {
        console.warn(`Tried to update asset ${slug} which doesn't exist. `, {
          details,
        });
        return;
      }

      Object.assign(asset, details);
    },
  },
  selectors: {
    selectAllAssets: (state) => state.assets,
  },
});

export const { selectAllAssets } = assetSlice.selectors;

export const makeSelectAssetBySlug = (slug: string) => (state: RootState) =>
  state.assets.assets.find((a) => a.slug === slug);

export const selectNewSlug = createSelector([selectAllAssets], (assets) => {
  let slug = "new-asset";
  let counter = 0;
  while (assets.find((a) => a.slug === slug) !== undefined) {
    counter++;
    slug = `new-asset-${counter}`;
  }

  return slug;
});

export const selectNetPosition = createSelector([selectAllAssets], (assets) => {
  let total = 0;
  assets.forEach((asset) => {
    total += calculateLiquidity(asset);
  });

  return total;
});

export const calculateLiquidity = (asset: Asset) => {
  if (asset.type !== "house") {
    return asset.liquidity === "all" ? asset.amount : asset.liquidity;
  }

  if (!asset.canSell) {
    return 0;
  }

  const fees = asset.amount * 0.02;
  return asset.amount - fees + asset.loan;
};

export const formatDollars = (
  amount: number,
  includeCurrency: boolean = true,
) => {
  const prefix = (amount < 0 ? "-" : "") + (includeCurrency ? "$" : "");

  const absDollars = Math.abs(Number(amount.toPrecision(3)));

  if (absDollars > 1000000) {
    return prefix + absDollars / 1000000 + "m";
  }

  if (absDollars) {
    return prefix + absDollars / 1000 + "k";
  }

  return prefix + absDollars;
};

export const selectHouseWithMortgage = createSelector(
  [selectAllAssets],
  (assets): AssetHouse | undefined =>
    assets.find((a) => a.type === "house" && a.loan !== 0) as
      | AssetHouse
      | undefined,
);

export const { setMockData, updateAsset, newAsset } = assetSlice.actions;

export const assetReducer = assetSlice.reducer;
