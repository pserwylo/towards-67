import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import LiquidityPercentage from "./LiquidityPercentage.tsx";
import { Box } from "@mui/material";

const meta: Meta<typeof LiquidityPercentage> = {
  component: LiquidityPercentage,
};

export default meta;
type Story = StoryObj<typeof LiquidityPercentage>;

export const Primary: Story = {
  args: {
    amountInDollars: 100000,
    percent: 0.8,
  },
  decorators: [
    (Story) => (
      <Box className="max-w-md">
        <Story />
      </Box>
    ),
  ],
  render: function Render(args) {
    const [{ percent }, updateArgs] = useArgs();
    return (
      <LiquidityPercentage
        {...args}
        onPercentChange={(percent) => updateArgs({ percent })}
        percent={percent}
      />
    );
  },
};
