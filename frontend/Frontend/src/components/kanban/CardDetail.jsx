import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  LinearProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  Label as LabelIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import api from "../../services/api";

const CardDetail = ({ open, onClose, card }) => {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveTitle = async () => {
    if (!title.trim() || title === card.title) {
      setTitle(card.title);
      setEditingTitle(false);
      return;
    }

    setLoading(true);
    try {
      await api.put(`/cards/${card.id}`, {
        ...card,
        title,
      });
      setEditingTitle(false);
    } catch (error) {
      console.error("Erro ao atualizar título:", error);
      setTitle(card.title);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDescription = async () => {
    if (description === card.description) {
      setEditingDescription(false);
      return;
    }

    setLoading(true);
    try {
      await api.put(`/cards/${card.id}`, {
        ...card,
        description,
      });
      setEditingDescription(false);
    } catch (error) {
      console.error("Erro ao atualizar descrição:", error);
      setDescription(card.description);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: "90vh" },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {editingTitle ? (
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyPress={(e) => e.key === "Enter" && handleSaveTitle()}
            autoFocus
            size="small"
          />
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1 }}
              onClick={() => setEditingTitle(true)}
              style={{ cursor: "pointer" }}
            >
              {card.title}
            </Typography>
            <IconButton size="small" onClick={() => setEditingTitle(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LabelIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="subtitle2">Etiquetas</Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {(card.labels || []).map((label) => (
              <Chip
                key={label.id}
                label={label.name}
                size="small"
                sx={{
                  backgroundColor: label.color,
                  color: "#fff",
                }}
              />
            ))}
            <Chip
              icon={<AttachFileIcon fontSize="small" />}
              label="Adicionar"
              size="small"
              variant="outlined"
              onClick={() => {}}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PersonIcon
              fontSize="small"
              sx={{ mr: 1, color: "text.secondary" }}
            />
            <Typography variant="subtitle2">Responsáveis</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {(card.assignedUsers || []).map((user) => (
              <Avatar key={user.id} sx={{ width: 32, height: 32 }}>
                {user.avatar}
              </Avatar>
            ))}
            <Chip
              icon={<AttachFileIcon fontSize="small" />}
              label="Adicionar"
              size="small"
              variant="outlined"
              onClick={() => {}}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2">Descrição</Typography>
            {!editingDescription && (
              <IconButton
                size="small"
                onClick={() => setEditingDescription(true)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          {editingDescription ? (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione uma descrição mais detalhada..."
                autoFocus
              />
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveDescription}
                >
                  Salvar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setDescription(card.description || "");
                    setEditingDescription(false);
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                minHeight: "1.5rem",
                p: 1,
                borderRadius: 1,
                bgcolor: "action.hover",
                cursor: "pointer",
              }}
              onClick={() => setEditingDescription(true)}
            >
              {card.description || "Adicione uma descrição..."}
            </Typography>
          )}
        </Box>

        {card.checklists && card.checklists.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Checklist
            </Typography>
            {card.checklists.map((list) => (
              <Box key={list.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {list.title}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (list.items.filter((item) => item.checked).length /
                      list.items.length) *
                    100
                  }
                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                />
                <List dense disablePadding>
                  {list.items.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox edge="start" checked={item.checked} />
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box>
        )}

        {card.comments && card.comments.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Comentários
            </Typography>
            <List>
              {card.comments.map((comment) => (
                <ListItem
                  key={comment.id}
                  alignItems="flex-start"
                  sx={{ px: 0 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {comment.user.avatar}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {comment.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={comment.text}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button startIcon={<DeleteIcon />} color="error">
          Excluir Cartão
        </Button>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardDetail;
