import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BoardList from "./BoardList";
import api from "../../services/api";

const Board = ({ id }) => {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await api.get(`/boards/${id}`);
        setBoard(response.data);

        if (!response.data.lists || response.data.lists.length === 0) {
          const demoLists = [
            {
              id: "demo-list-1",
              name: "A Fazer",
              boardId: id,
              position: 0,
              cards: [
                {
                  id: "demo-card-1",
                  title: "Adicionar usuários ao projeto",
                  description:
                    "Configurar permissões e convidar membros da equipe",
                  position: 0,
                  labels: [
                    { id: "label-1", name: "Importante", color: "#FF5630" },
                  ],
                },
                {
                  id: "demo-card-2",
                  title: "Revisar documentação",
                  description: "Atualizar a documentação com os novos recursos",
                  position: 1,
                  labels: [
                    { id: "label-2", name: "Documentação", color: "#4C9AFF" },
                  ],
                },
              ],
            },
            {
              id: "demo-list-2",
              name: "Em Progresso",
              boardId: id,
              position: 1,
              cards: [
                {
                  id: "demo-card-3",
                  title: "Implementar autenticação",
                  description: "Adicionar login com Google e GitHub",
                  position: 0,
                  labels: [
                    {
                      id: "label-3",
                      name: "Desenvolvimento",
                      color: "#36B37E",
                    },
                  ],
                },
              ],
            },
            {
              id: "demo-list-3",
              name: "Concluído",
              boardId: id,
              position: 2,
              cards: [
                {
                  id: "demo-card-4",
                  title: "Configurar projeto",
                  description: "Inicializar repositório e configurar ambiente",
                  position: 0,
                  labels: [
                    { id: "label-4", name: "Concluído", color: "#00B8D9" },
                  ],
                },
              ],
            },
          ];

          setLists(demoLists);
        } else {
          setLists(response.data.lists || []);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar quadro:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchBoard();
    }
  }, [id]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    if (type === "list") {
      const newLists = Array.from(lists);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);

      setLists(newLists);

      try {
        await api.put(`/boards/${id}/lists/reorder`, {
          listId: draggableId,
          newPosition: destination.index,
        });
      } catch (error) {
        console.error("Erro ao reordenar listas:", error);
      }
      return;
    }

    const sourceList = lists.find((list) => list.id === source.droppableId);
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId
    );

    if (!sourceList || !destinationList) return;

    // Cópia das listas atuais
    const newLists = [...lists];
    const sourceListIndex = newLists.findIndex(
      (list) => list.id === source.droppableId
    );
    const destListIndex = newLists.findIndex(
      (list) => list.id === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const newCards = Array.from(sourceList.cards || []);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      newLists[sourceListIndex] = {
        ...sourceList,
        cards: newCards,
      };

      setLists(newLists);

      try {
        await api.put(`/cards/${draggableId}/move`, {
          boardListId: destination.droppableId,
          position: destination.index,
        });
      } catch (error) {
        console.error("Erro ao mover cartão:", error);
      }
    } else {
      const sourceCards = Array.from(sourceList.cards || []);
      const [movedCard] = sourceCards.splice(source.index, 1);

      const destCards = Array.from(destinationList.cards || []);
      destCards.splice(destination.index, 0, {
        ...movedCard,
        boardListId: destination.droppableId,
      });

      newLists[sourceListIndex] = {
        ...sourceList,
        cards: sourceCards,
      };

      newLists[destListIndex] = {
        ...destinationList,
        cards: destCards,
      };

      setLists(newLists);

      try {
        await api.put(`/cards/${draggableId}/move`, {
          boardListId: destination.droppableId,
          position: destination.index,
        });
      } catch (error) {
        console.error("Erro ao mover cartão entre listas:", error);
      }
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;

    try {
      const response = await api.post("/boardlists", {
        name: newListName,
        boardId: id,
        position: lists.length,
      });

      setLists([...lists, { ...response.data, cards: [] }]);
      setNewListName("");
      setIsAddingList(false);
    } catch (error) {
      console.error("Erro ao adicionar lista:", error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await api.delete(`/boardlists/${listId}`);
      setLists(lists.filter((list) => list.id !== listId));
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
    }
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!board) {
    return <Typography variant="h6">Quadro não encontrado</Typography>;
  }

  return (
    <Box sx={{ height: "100%" }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          backgroundColor: "white",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            {board?.name || "Meu Quadro"}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              size="small"
              sx={{ borderRadius: 3 }}
            >
              Filtrar
            </Button>

            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              size="small"
              sx={{ borderRadius: 3 }}
            >
              Compartilhar
            </Button>

            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                display: "flex",
                overflowX: "auto",
                p: 1,
                height: "calc(100vh - 130px)",
              }}
            >
              {lists.map((list, index) => (
                <BoardList
                  key={list.id}
                  list={list}
                  index={index}
                  onDeleteList={handleDeleteList}
                />
              ))}
              {provided.placeholder}

              {isAddingList ? (
                <Box
                  sx={{
                    minWidth: 280,
                    maxWidth: 280,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    p: 1,
                    mr: 2,
                    boxShadow: 1,
                  }}
                >
                  <TextField
                    autoFocus
                    fullWidth
                    placeholder="Nome da lista"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddList()}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAddList}
                    >
                      Adicionar
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setIsAddingList(false);
                        setNewListName("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button
                  onClick={() => setIsAddingList(true)}
                  startIcon={<AddIcon />}
                  sx={{
                    minWidth: 280,
                    maxWidth: 280,
                    height: 50,
                    justifyContent: "flex-start",
                    bgcolor: "rgba(0, 0, 0, 0.06)",
                    color: "text.primary",
                    p: 1,
                    my: 1,
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: "medium",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.09)",
                    },
                  }}
                >
                  Adicionar nova lista
                </Button>
              )}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default Board;
