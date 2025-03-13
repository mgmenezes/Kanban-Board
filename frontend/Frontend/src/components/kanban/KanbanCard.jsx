import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  AvatarGroup,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  CheckBox as CheckBoxIcon,
} from "@mui/icons-material";
import CardDetail from "./CardDetail";
import { useTheme } from "@mui/material/styles";

const KanbanCard = ({ card, index, onDeleteCard }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const theme = useTheme();

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleCardClick = () => {
    setDetailOpen(true);
  };

  const getLabels = () => {
    const mockLabels = [
      { id: 1, name: "Bug", color: "#FF5630" },
      { id: 2, name: "Feature", color: "#36B37E" },
      { id: 3, name: "Urgent", color: "#FFAB00" },
      { id: 4, name: "Documentation", color: "#4C9AFF" },
    ];

    return mockLabels.slice(0, Math.floor(Math.random() * 3));
  };

  const getAssignees = () => {
    const mockUsers = [
      { id: 1, name: "Alice", avatar: "A" },
      { id: 2, name: "Bob", avatar: "B" },
      { id: 3, name: "Carol", avatar: "C" },
    ];

    return mockUsers.slice(0, Math.floor(Math.random() * 3));
  };

  const labels = card.labels || getLabels();
  const assignees = card.assignedUsers || getAssignees();
  const hasAttachments = card.attachments && card.attachments.length > 0;
  const hasComments = card.comments && card.comments.length > 0;
  const hasChecklist = card.checklists && card.checklists.length > 0;

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleCardClick}
            sx={{
              mb: 1,
              cursor: "pointer",
              boxShadow: snapshot.isDragging
                ? theme.shadows[8]
                : theme.shadows[1],
              "&:hover": {
                boxShadow: theme.shadows[3],
              },
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              {labels.length > 0 && (
                <Box
                  sx={{ mb: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}
                >
                  {labels.map((label) => (
                    <Chip
                      key={label.id}
                      label={label.name}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.7rem",
                        backgroundColor: label.color,
                        color: "#fff",
                      }}
                    />
                  ))}
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ wordBreak: "break-word", mr: 1 }}
                >
                  {card.title}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ p: 0.5, mt: -0.5, mr: -0.5 }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              {card.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {card.description}
                </Typography>
              )}

              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {hasAttachments && (
                    <AttachFileIcon fontSize="small" color="action" />
                  )}
                  {hasComments && (
                    <CommentIcon fontSize="small" color="action" />
                  )}
                  {hasChecklist && (
                    <CheckBoxIcon fontSize="small" color="action" />
                  )}
                </Box>

                {assignees.length > 0 && (
                  <AvatarGroup max={3} sx={{ justifyContent: "flex-end" }}>
                    {assignees.map((user) => (
                      <Avatar
                        key={user.id}
                        alt={user.name}
                        src={user.avatar}
                        sx={{ width: 24, height: 24, fontSize: "0.8rem" }}
                      >
                        {user.avatar}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Draggable>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteCard(card.id);
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>

      <CardDetail
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        card={card}
      />
    </>
  );
};

export default KanbanCard;
