import React, { createContext, useState, useCallback } from "react";
import boardService from "../services/boardService";
import listService from "../services/listService";
import cardService from "../services/cardService";

export const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBoards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await boardService.getBoards();
      setBoards(data);
    } catch (err) {
      console.error("Erro ao carregar boards:", err);
      setError("Não foi possível carregar os quadros. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBoardDetails = useCallback(async (boardId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await boardService.getBoardDetails(boardId);
      setCurrentBoard(data);
      setLists(data.lists || []);
      return data;
    } catch (err) {
      console.error(`Erro ao carregar detalhes do board ${boardId}:`, err);
      setError(
        "Não foi possível carregar os detalhes do quadro. Tente novamente."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBoard = useCallback(async (boardData) => {
    setLoading(true);
    setError(null);
    try {
      const newBoard = await boardService.createBoard(boardData);
      setBoards((prev) => [...prev, newBoard]);
      return newBoard;
    } catch (err) {
      console.error("Erro ao criar board:", err);
      setError("Não foi possível criar o quadro. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBoard = useCallback(
    async (boardId, boardData) => {
      setLoading(true);
      setError(null);
      try {
        await boardService.updateBoard(boardId, boardData);
        setBoards((prev) =>
          prev.map((board) =>
            board.id === boardId ? { ...board, ...boardData } : board
          )
        );
        if (currentBoard?.id === boardId) {
          setCurrentBoard((prev) => ({ ...prev, ...boardData }));
        }
      } catch (err) {
        console.error(`Erro ao atualizar board ${boardId}:`, err);
        setError("Não foi possível atualizar o quadro. Tente novamente.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentBoard]
  );

  const deleteBoard = useCallback(
    async (boardId) => {
      setLoading(true);
      setError(null);
      try {
        await boardService.deleteBoard(boardId);
        setBoards((prev) => prev.filter((board) => board.id !== boardId));
        if (currentBoard?.id === boardId) {
          setCurrentBoard(null);
          setLists([]);
        }
      } catch (err) {
        console.error(`Erro ao excluir board ${boardId}:`, err);
        setError("Não foi possível excluir o quadro. Tente novamente.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentBoard]
  );

  const createList = useCallback(async (listData) => {
    setLoading(true);
    setError(null);
    try {
      const newList = await listService.createList(listData);
      setLists((prev) => [...prev, newList]);
      return newList;
    } catch (err) {
      console.error("Erro ao criar lista:", err);
      setError("Não foi possível criar a lista. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateList = useCallback(async (listId, listData) => {
    setLoading(true);
    setError(null);
    try {
      await listService.updateList(listId, listData);
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId ? { ...list, ...listData } : list
        )
      );
    } catch (err) {
      console.error(`Erro ao atualizar lista ${listId}:`, err);
      setError("Não foi possível atualizar a lista. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteList = useCallback(async (listId) => {
    setLoading(true);
    setError(null);
    try {
      await listService.deleteList(listId);
      setLists((prev) => prev.filter((list) => list.id !== listId));
    } catch (err) {
      console.error(`Erro ao excluir lista ${listId}:`, err);
      setError("Não foi possível excluir a lista. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderLists = useCallback(
    async (boardId, listPositions) => {
      setError(null);
      try {
        const updatedLists = [...lists];
        Object.entries(listPositions).forEach(([listId, position]) => {
          const list = updatedLists.find((l) => l.id === listId);
          if (list) {
            list.position = position;
          }
        });

        updatedLists.sort((a, b) => a.position - b.position);
        setLists(updatedLists);

        await listService.reorderLists(boardId, listPositions);
      } catch (err) {
        console.error("Erro ao reordenar listas:", err);
        setError("Não foi possível reordenar as listas. Tente novamente.");

        loadBoardDetails(boardId);
        throw err;
      }
    },
    [lists, loadBoardDetails]
  );

  const createCard = useCallback(async (cardData) => {
    setLoading(true);
    setError(null);
    try {
      const newCard = await cardService.createCard(cardData);

      setLists((prev) =>
        prev.map((list) => {
          if (list.id === cardData.boardListId) {
            const updatedList = { ...list };
            updatedList.cards = [...(list.cards || []), newCard];
            return updatedList;
          }
          return list;
        })
      );

      return newCard;
    } catch (err) {
      console.error("Erro ao criar card:", err);
      setError("Não foi possível criar o cartão. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCard = useCallback(async (cardId, cardData, listId) => {
    setLoading(true);
    setError(null);
    try {
      await cardService.updateCard(cardId, cardData);

      setLists((prev) =>
        prev.map((list) => {
          if (list.id === listId) {
            const updatedList = { ...list };
            updatedList.cards = (list.cards || []).map((card) =>
              card.id === cardId ? { ...card, ...cardData } : card
            );
            return updatedList;
          }
          return list;
        })
      );
    } catch (err) {
      console.error(`Erro ao atualizar card ${cardId}:`, err);
      setError("Não foi possível atualizar o cartão. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCard = useCallback(async (cardId, listId) => {
    setLoading(true);
    setError(null);
    try {
      await cardService.deleteCard(cardId);

      setLists((prev) =>
        prev.map((list) => {
          if (list.id === listId) {
            const updatedList = { ...list };
            updatedList.cards = (list.cards || []).filter(
              (card) => card.id !== cardId
            );
            return updatedList;
          }
          return list;
        })
      );
    } catch (err) {
      console.error(`Erro ao excluir card ${cardId}:`, err);
      setError("Não foi possível excluir o cartão. Tente novamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const moveCard = useCallback(
    async (cardId, sourceListId, targetListId, position) => {
      setError(null);
      try {
        const updatedLists = [...lists];

        const sourceList = updatedLists.find((l) => l.id === sourceListId);
        const targetList = updatedLists.find((l) => l.id === targetListId);

        if (sourceList && targetList) {
          const cardIndex = sourceList.cards.findIndex((c) => c.id === cardId);
          if (cardIndex !== -1) {
            const [movedCard] = sourceList.cards.splice(cardIndex, 1);

            movedCard.boardListId = targetListId;
            movedCard.position = position;

            targetList.cards = [...targetList.cards];
            targetList.cards.splice(position, 0, movedCard);

            targetList.cards.forEach((card, index) => {
              card.position = index;
            });

            if (sourceListId !== targetListId) {
              sourceList.cards.forEach((card, index) => {
                card.position = index;
              });
            }

            setLists(updatedLists);
          }
        }

        await cardService.moveCard(cardId, targetListId, position);
      } catch (err) {
        console.error("Erro ao mover card:", err);
        setError("Não foi possível mover o cartão. Tente novamente.");

        if (currentBoard) {
          loadBoardDetails(currentBoard.id);
        }
        throw err;
      }
    },
    [lists, currentBoard, loadBoardDetails]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    boards,
    currentBoard,
    lists,
    loading,
    error,
    loadBoards,
    loadBoardDetails,
    createBoard,
    updateBoard,
    deleteBoard,
    createList,
    updateList,
    deleteList,
    reorderLists,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    clearError,
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};

export default KanbanContext;
