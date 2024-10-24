import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import LiquiditySelector from "./LiquiditySlider.tsx";
import { Box } from "@mui/material";

const meta: Meta<typeof LiquiditySelector> = {
  component: LiquiditySelector,
};

export default meta;
type Story = StoryObj<typeof LiquiditySelector>;

export const Primary: Story = {
  args: {
    amount: 100000,
    liquidity: 75000,
  },
  decorators: [
    (Story) => (
      <Box className="max-w-md mt-8">
        <Story />
      </Box>
    ),
  ],
  render: function Render(args) {
    const [{ liquidity }, updateArgs] = useArgs();
    return (
      <LiquiditySelector
        {...args}
        liquidity={liquidity}
        onChange={(l) => updateArgs({ liquidity: l })}
      />
    );
  },
};
