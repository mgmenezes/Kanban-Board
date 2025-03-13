import api from "./api";

const labelService = {
  getLabels: async () => {
    const response = await api.get("/labels");
    return response.data;
  },

  getLabel: async (labelId) => {
    const response = await api.get(`/labels/${labelId}`);
    return response.data;
  },

  getLabelsByCard: async (cardId) => {
    const response = await api.get(`/labels/card/${cardId}`);
    return response.data;
  },

  createLabel: async (labelData) => {
    const response = await api.post("/labels", labelData);
    return response.data;
  },

  updateLabel: async (labelId, labelData) => {
    const response = await api.put(`/labels/${labelId}`, labelData);
    return response.data;
  },

  deleteLabel: async (labelId) => {
    const response = await api.delete(`/labels/${labelId}`);
    return response.data;
  },

  addLabelToCard: async (cardId, labelId) => {
    const response = await api.post("/labels/card", {
      cardId,
      labelId,
    });
    return response.data;
  },

  removeLabelFromCard: async (cardId, labelId) => {
    const response = await api.delete("/labels/card", {
      data: {
        cardId,
        labelId,
      },
    });
    return response.data;
  },
};

export default labelService;
