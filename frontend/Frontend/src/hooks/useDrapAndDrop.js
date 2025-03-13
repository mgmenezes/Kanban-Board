import { useState, useCallback } from "react";
import useKanban from "./useKanban";

const useDragAndDrop = () => {
  const { moveCard, reorderLists, currentBoard } = useKanban();
  const [draggedItem, setDraggedItem] = useState(null);

  const onDragStart = useCallback((e, item) => {
    e.dataTransfer.effectAllowed = "move";
    e.target.classList.add("dragging");
    setDraggedItem(item);

    e.dataTransfer.setData("application/json", JSON.stringify(item));
  }, []);

  const onDragEnd = useCallback((e) => {
    e.target.classList.remove("dragging");
    setDraggedItem(null);

    document.querySelectorAll(".drag-over").forEach((element) => {
      element.classList.remove("drag-over");
    });
  }, []);

  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDropCard = useCallback(
    (e, targetListId) => {
      e.preventDefault();
      e.currentTarget.classList.remove("drag-over");

      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"));

        if (data.type === "card") {
          const targetCards = e.currentTarget.querySelectorAll(".kanban-card");
          const targetRect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - targetRect.top;

          let position = 0;
          for (let i = 0; i < targetCards.length; i++) {
            const card = targetCards[i];
            const cardRect = card.getBoundingClientRect();
            const cardMiddle =
              cardRect.top + cardRect.height / 2 - targetRect.top;

            if (y > cardMiddle) {
              position = i + 1;
            }
          }

          moveCard(data.id, data.listId, targetListId, position);
        }
      } catch (error) {
        console.error("Erro ao soltar o card:", error);
      }
    },
    [moveCard]
  );

  const onDropList = useCallback(
    (e) => {
      e.preventDefault();

      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"));

        if (data.type === "list" && currentBoard) {
          const lists = document.querySelectorAll(".kanban-list");
          const listPositions = {};

          const listsArray = Array.from(lists).map((list) => ({
            id: list.dataset.listId,
            rect: list.getBoundingClientRect(),
          }));

          listsArray.sort((a, b) => a.rect.left - b.rect.left);

          listsArray.forEach((list, index) => {
            listPositions[list.id] = index;
          });

          reorderLists(currentBoard.id, listPositions);
        }
      } catch (error) {
        console.error("Erro ao soltar a lista:", error);
      }
    },
    [reorderLists, currentBoard]
  );

  return {
    draggedItem,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDropCard,
    onDropList,
  };
};

export default useDragAndDrop;
