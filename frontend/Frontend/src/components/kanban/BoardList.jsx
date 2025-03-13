import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import KanbanCard from "./KanbanCard";
import api from "../../services/api";

/**
 * Componente que representa uma lista (coluna) no quadro Kanban
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.list - Dados da lista
 * @param {Array} props.cards - Array de cards da lista
 * @param {Function} props.onCardClick - Função chamada ao clicar em um card
 * @param {Function} props.onAddCard - Função chamada ao adicionar um novo card
 * @param {Function} props.onEditList - Função chamada ao editar o título da lista
 * @param {Function} props.onDeleteList - Função chamada ao excluir a lista
 * @param {Object} props.dragHandlers - Funções para arrastar e soltar
 * @returns {JSX.Element} - Componente BoardList
 */
const BoardList = ({ list, index, onDeleteList }) => {
  const [cards, setCards] = useState(list.cards || []);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) return;

    try {
      const response = await api.post("/cards", {
        title: newCardTitle,
        boardListId: list.id,
        position: cards.length,
      });

      setCards([...cards, response.data]);
      setNewCardTitle("");
      setIsAddingCard(false);
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await api.delete(`/cards/${cardId}`);
      setCards(cards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Erro ao excluir cartão:", error);
    }
  };

  const handleUpdateListName = async () => {
    if (!listName.trim() || listName === list.name) {
      setIsEditing(false);
      setListName(list.name);
      return;
    }

    try {
      await api.put(`/boardlists/${list.id}`, {
        name: listName,
        boardId: list.boardId,
        position: list.position,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar nome da lista:", error);
      setListName(list.name);
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          elevation={0}
          sx={{
            minWidth: 280,
            maxWidth: 280,
            maxHeight: "calc(100vh - 160px)",
            display: "flex",
            flexDirection: "column",
            mr: 2,
            mt: 1,
            mb: 1,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            {...provided.dragHandleProps}
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "background.paper",
              borderTopLeftRadius: 1,
              borderTopRightRadius: 1,
            }}
          >
            {isEditing ? (
              <TextField
                autoFocus
                fullWidth
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                onBlur={handleUpdateListName}
                onKeyPress={(e) => e.key === "Enter" && handleUpdateListName()}
                size="small"
                sx={{ mr: 1 }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                onClick={() => setIsEditing(true)}
                sx={{ cursor: "pointer", flexGrow: 1 }}
              >
                {list.name} ({cards.length})
              </Typography>
            )}
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  setIsEditing(true);
                  handleMenuClose();
                }}
              >
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Editar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteList(list.id);
                  handleMenuClose();
                }}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Excluir
              </MenuItem>
            </Menu>
          </Box>

          <Droppable droppableId={list.id} type="card">
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  p: 1,
                  flexGrow: 1,
                  minHeight: 100,
                  overflowY: "auto",
                  backgroundColor: snapshot.isDraggingOver
                    ? "action.hover"
                    : "background.default",
                }}
              >
                {cards.map((card, cardIndex) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    index={cardIndex}
                    onDeleteCard={handleDeleteCard}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

          {isAddingCard ? (
            <Box sx={{ p: 1 }}>
              <TextField
                autoFocus
                fullWidth
                multiline
                placeholder="Digite um título para este cartão..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                size="small"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddCard}
                >
                  Adicionar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setIsAddingCard(false);
                    setNewCardTitle("");
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          ) : (
            <Button
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => setIsAddingCard(true)}
              sx={{
                justifyContent: "flex-start",
                p: 1,
                m: 1,
                borderRadius: 1,
                textTransform: "none",
              }}
            >
              Adicionar um cartão
            </Button>
          )}
        </Paper>
      )}
    </Draggable>
  );
};

export default BoardList;
