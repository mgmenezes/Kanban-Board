import api from "./api";

const cardService = {
  getCardsByList: async (listId) => {
    const response = await api.get(`/cards/${listId}/list`);
    return response.data;
  },

  getAssignedCards: async () => {
    const response = await api.get("/cards/assigned");
    return response.data;
  },

  getCardDetails: async (cardId) => {
    const response = await api.get(`/cards/${cardId}`);
    return response.data;
  },

  createCard: async (cardData) => {
    const response = await api.post("/cards", cardData);
    return response.data;
  },

  updateCard: async (cardId, cardData) => {
    const response = await api.put(`/cards/${cardId}`, cardData);
    return response.data;
  },

  deleteCard: async (cardId) => {
    const response = await api.delete(`/cards/${cardId}`);
    return response.data;
  },

  moveCard: async (cardId, targetListId, position) => {
    const response = await api.patch("/cards/move", {
      cardId,
      targetListId,
      position,
    });
    return response.data;
  },

  reorderCards: async (listId, cardPositions) => {
    const response = await api.patch("/cards/reorder", {
      listId,
      cardPositions,
    });
    return response.data;
  },

  assignCard: async (cardId, userId) => {
    const response = await api.patch("/cards/assign", {
      cardId,
      userId,
    });
    return response.data;
  },
};

export default cardService;
