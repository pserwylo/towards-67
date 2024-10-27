import type { Meta, StoryObj } from "@storybook/react";
import AppBar from "./AppBar.tsx";

const meta: Meta<typeof AppBar> = {
  component: AppBar,
};

export default meta;
type Story = StoryObj<typeof AppBar>;

export const Primary: Story = {
  render: function Render() {
    return <AppBar />;
  },
};
