import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get("/boards");
        setBoards(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar quadros:", error);
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuId = "primary-account-menu";
  const isMenuOpen = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <DashboardIcon sx={{ mr: 1 }} />
            Kanban Board
          </Typography>
          <TextField
            placeholder="Pesquisar..."
            size="small"
            sx={{
              mr: 2,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                color: "white",
              },
              width: 250,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            edge="end"
            aria-label="account"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.secondary.main,
              }}
            >
              {user?.userName?.charAt(0) || "U"}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            top: 64,
            height: "calc(100% - 64px)",
          },
        }}
      >
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Meus Quadros" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </ListItem>
        </List>
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
          Perfil
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          Configurações
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            logout();
            handleProfileMenuClose();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: drawerOpen ? "240px" : 0,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Meus Quadros
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/board/new"
            >
              Novo Quadro
            </Button>
          </Box>

          {loading ? (
            <Typography>Carregando...</Typography>
          ) : (
            <Grid container spacing={3}>
              {boards.map((board) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={board.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.15s ease-in-out",
                      "&:hover": { transform: "scale3d(1.05, 1.05, 1)" },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      to={`/board/${board.id}`}
                      sx={{ flexGrow: 1 }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            noWrap
                            sx={{ fontWeight: "bold" }}
                          >
                            {board.name}
                          </Typography>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {board.description || "Sem descrição"}
                        </Typography>
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ display: "flex" }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                fontSize: "0.75rem",
                                bgcolor: theme.palette.primary.main,
                              }}
                            >
                              {user?.userName?.charAt(0) || "U"}
                            </Avatar>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Atualizado:{" "}
                            {new Date(
                              board.updatedAt || board.createdAt
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
