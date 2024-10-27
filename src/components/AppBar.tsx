import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import VillaIcon from "@mui/icons-material/Villa";
import { Link } from "react-router-dom";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

type IPage = {
  label: string;
  href: string;
};

const pages: IPage[] = [
  {
    label: "My Assets",
    href: "/",
  },
  {
    label: "Examples",
    href: "/examples",
  },
];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ResponsiveAppBar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawerWidth = 240;

  const container =
    window !== undefined ? () => window.document.body : undefined;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Link to="/">
        <Typography variant="h6" sx={{ my: 2 }}>
          Towards 67
        </Typography>
      </Link>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.href} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              component={Link}
              to={page.href}
            >
              <ListItemText primary={page.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" className="flex space-x-1">
            <VillaIcon />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Towards 67
            </Typography>
          </Link>
          <Box sx={{ ml: 4, display: { xs: "none", sm: "block" } }}>
            {pages.map((page) => (
              <Button
                key={page.href}
                sx={{ color: "#fff" }}
                component={Link}
                to={page.href}
              >
                {page.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
};

export default ResponsiveAppBar;
