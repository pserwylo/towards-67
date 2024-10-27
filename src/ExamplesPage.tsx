import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MockData, mockData, setMockData } from "./store/assetSlice.ts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppBar from "./components/AppBar.tsx";
import PageHeading from "./components/PageHeading.tsx";

const ExamplesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelectExample = (example: MockData) => {
    dispatch(setMockData(example));
    navigate("/");
  };

  return (
    <Stack spacing={2}>
      <AppBar />

      <Box className="pt-12">
        <PageHeading title="Examples" />
      </Box>

      <Grid container spacing={2}>
        {mockData.map((data) => (
          <Grid key={data.label} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h3">{data.label}</Typography>
                <Typography variant="body1">{data.description}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleSelectExample(data)}>View</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ExamplesPage;
