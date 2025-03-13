import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import api from "../services/api";

const NewBoardPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome do quadro é obrigatório");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/boards", {
        name,
        description,
      });

      navigate(`/board/${response.data.id}`);
    } catch (err) {
      console.error("Erro ao criar quadro:", err);
      setError(
        err.response?.data?.message ||
          "Ocorreu um erro ao criar o quadro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Novo Quadro
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box mt={4}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Criar Novo Quadro
            </Typography>

            {error && (
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "error.light",
                  color: "error.dark",
                  borderRadius: 1,
                }}
              >
                {error}
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Nome do Quadro"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Descrição (opcional)"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                  >
                    <Button variant="outlined" onClick={() => navigate("/")}>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? "Criando..." : "Criar Quadro"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default NewBoardPage;
