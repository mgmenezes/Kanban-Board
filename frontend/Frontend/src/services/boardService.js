import api from "./api";

const boardService = {
  getBoards: async () => {
    const response = await api.get("/boards");
    return response.data;
  },

  getBoardDetails: async (boardId) => {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  },

  createBoard: async (boardData) => {
    const response = await api.post("/boards", boardData);
    return response.data;
  },

  updateBoard: async (boardId, boardData) => {
    const response = await api.put(`/boards/${boardId}`, boardData);
    return response.data;
  },

  deleteBoard: async (boardId) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data;
  },
};

export default boardService;
