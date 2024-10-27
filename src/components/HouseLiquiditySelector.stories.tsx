import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { Box } from "@mui/material";
import HouseLiquiditySelector from "./HouseLiquiditySelector.tsx";
import { AssetHouse } from "../store/assetSlice.ts";

type IArgs = React.ComponentProps<typeof HouseLiquiditySelector> & AssetHouse;

const meta: Meta<typeof HouseLiquiditySelector> = {
  component: HouseLiquiditySelector,
};

export default meta;
type Story = StoryObj<IArgs>;

export const Primary: Story = {
  args: {
    amount: 980000,
    loan: -385000,
    canSell: true,
  },
  decorators: [
    (Story) => (
      <Box className="max-w-md mt-8">
        <Story />
      </Box>
    ),
  ],
  render: function Render(args) {
    const [{ amount, loan, canSell }, updateArgs] = useArgs();
    return (
      <HouseLiquiditySelector
        {...args}
        asset={{
          type: "house",
          amount,
          loan,
          repayments: {
            amount: 1000,
            frequency: "weekly",
          },
          canSell,
          label: "",
          slug: "",
        }}
        onChange={(s) => updateArgs({ canSell: s })}
      />
    );
  },
};
