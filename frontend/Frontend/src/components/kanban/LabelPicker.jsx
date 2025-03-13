import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import labelService from "../../services/labelService";

const LabelPicker = ({ isOpen, onClose, onSelect, selectedLabels = [] }) => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3182CE");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLabels = async () => {
      setLoading(true);
      try {
        const data = await labelService.getLabels();
        setLabels(data);
      } catch (error) {
        console.error("Erro ao carregar labels:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchLabels();
    }
  }, [isOpen]);

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;

    setLoading(true);
    try {
      const newLabel = await labelService.createLabel({
        name: newLabelName,
        color: newLabelColor,
      });

      setLabels((prev) => [...prev, newLabel]);
      setNewLabelName("");
      setNewLabelColor("#3182CE");
      setIsCreatingLabel(false);
    } catch (error) {
      console.error("Erro ao criar label:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLabel = async (labelId, newData) => {
    setLoading(true);
    try {
      await labelService.updateLabel(labelId, newData);
      setLabels((prev) =>
        prev.map((label) =>
          label.id === labelId ? { ...label, ...newData } : label
        )
      );
    } catch (error) {
      console.error("Erro ao editar label:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLabel = async (labelId) => {
    if (window.confirm("Tem certeza que deseja excluir este label?")) {
      setLoading(true);
      try {
        await labelService.deleteLabel(labelId);
        setLabels((prev) => prev.filter((label) => label.id !== labelId));
      } catch (error) {
        console.error("Erro ao excluir label:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredLabels = searchTerm
    ? labels.filter((label) =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : labels;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Labels" size="md">
      <div className="space-y-4">
        <div className="mb-4">
          <Input
            placeholder="Buscar labels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-0"
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {loading && !labels.length ? (
            <div className="text-center py-4 text-gray-500">
              Carregando labels...
            </div>
          ) : filteredLabels.length > 0 ? (
            <div className="space-y-2">
              {filteredLabels.map((label) => (
                <LabelItem
                  key={label.id}
                  label={label}
                  isSelected={selectedLabels.includes(label.id)}
                  onSelect={() => onSelect(label.id)}
                  onEdit={handleEditLabel}
                  onDelete={handleDeleteLabel}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchTerm
                ? "Nenhum label encontrado com este termo"
                : "Nenhum label disponível"}
            </div>
          )}
        </div>

        {isCreatingLabel ? (
          <div className="border p-3 rounded-md bg-gray-50">
            <h4 className="text-sm font-medium mb-2">Novo Label</h4>
            <Input
              placeholder="Nome do label"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 mr-2">
                Cor:
              </label>
              <input
                type="color"
                value={newLabelColor}
                onChange={(e) => setNewLabelColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateLabel}
                disabled={!newLabelName.trim() || loading}
              >
                Criar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCreatingLabel(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setIsCreatingLabel(true)}
            className="w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Criar Novo Label
          </Button>
        )}
      </div>
    </Modal>
  );
};

const LabelItem = ({ label, isSelected, onSelect, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(label.name);
  const [color, setColor] = useState(label.color);

  const handleSave = () => {
    if (name.trim()) {
      onEdit(label.id, { name, color });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    setName(label.name);
    setColor(label.color);
  }, [label]);

  return (
    <div className="flex items-center border rounded-md p-2">
      {isEditing ? (
        <div className="flex-grow">
          <div className="flex items-center mb-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do label"
              className="text-sm mb-0 mr-2 flex-grow"
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 rounded cursor-pointer"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              Salvar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="w-4 h-4 rounded mr-2"
            style={{ backgroundColor: label.color }}
          ></div>
          <span className="flex-grow">{label.name}</span>
          <div className="flex space-x-1">
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsEditing(true)}
              title="Editar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              className="text-gray-400 hover:text-red-500"
              onClick={() => onDelete(label.id)}
              title="Excluir"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              className={`ml-1 ${
                isSelected
                  ? "text-primary-600 hover:text-primary-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={onSelect}
              title={isSelected ? "Remover" : "Adicionar"}
            >
              {isSelected ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LabelPicker;
