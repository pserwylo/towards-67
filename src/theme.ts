import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    h1: {
      fontSize: "2.6rem",
    },
    h2: {
      fontSize: "2rem",
    },
    h3: {
      fontSize: "1.8rem",
    },
    h4: {
      fontSize: "1.5rem",
    },
    h5: {
      fontSize: "1.3rem",
    },
    h6: {
      fontSize: "1.2rem",
    },
    subtitle1: {
      lineHeight: 1.15,
      fontWeight: 600,
      marginBottom: "0.4rem",
    },
    subtitle2: {
      lineHeight: 1.15,
      fontWeight: 600,
      marginBottom: "0.4rem",
    },
    body1: {
      lineHeight: 1.15,
    },
    body2: {
      lineHeight: 1.15,
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: 12,
        },
      },
    },
  },
});

export default theme;
