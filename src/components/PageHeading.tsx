import { Typography } from "@mui/material";

type IProps = {
  title: string;
};

const PageHeading = ({ title }: IProps) => (
  <Typography variant="h2">{title}</Typography>
);

export default PageHeading;
