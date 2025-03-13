import api from "./api";

const listService = {
  getLists: async (boardId) => {
    const response = await api.get(`/lists/${boardId}/board`);
    return response.data;
  },

  getListDetails: async (listId) => {
    const response = await api.get(`/lists/${listId}`);
    return response.data;
  },

  createList: async (listData) => {
    const response = await api.post("/lists", listData);
    return response.data;
  },

  updateList: async (listId, listData) => {
    const response = await api.put(`/lists/${listId}`, listData);
    return response.data;
  },

  deleteList: async (listId) => {
    const response = await api.delete(`/lists/${listId}`);
    return response.data;
  },

  reorderLists: async (boardId, listPositions) => {
    const response = await api.patch("/lists/reorder", {
      boardId,
      listPositions,
    });
    return response.data;
  },
};

export default listService;
