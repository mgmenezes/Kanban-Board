import { useContext } from "react";
import KanbanContext from "../context/KanbanContext";

const useKanban = () => {
  const context = useContext(KanbanContext);

  if (context === undefined) {
    throw new Error("useKanban deve ser usado dentro de um KanbanProvider");
  }

  return context;
};

export default useKanban;
