import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Board from "../components/kanban/Board";
import CardDetail from "../components/kanban/CardDetail";
import Button from "../components/ui/Button";
import useKanban from "../hooks/useKanban";
import authService from "../services/authService";

const BoardDetails = () => {
  const BoardDetails = () => {
    const { boardId } = useParams();
    const [selectedCard, setSelectedCard] = useState(null);
    const [showCardModal, setShowCardModal] = useState(false);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const {
      currentBoard,
      lists,
      loadBoardDetails,
      loading,
      error,
      deleteBoard,
    } = useKanban();

    useEffect(() => {
      if (boardId) {
        loadBoardDetails(boardId);
      }
    }, [boardId, loadBoardDetails]);

    useEffect(() => {
      const currentUser = authService.getStoredUser();
      if (currentUser) {
        setUsers([currentUser]);
      }
    }, []);

    const handleCardClick = (card) => {
      setSelectedCard(card);
      setShowCardModal(true);
    };

    const handleCloseCardModal = () => {
      setShowCardModal(false);
      setTimeout(() => setSelectedCard(null), 200);
    };

    const handleDeleteBoard = async () => {
      if (
        window.confirm(
          "Tem certeza que deseja excluir este quadro? Esta ação não pode ser desfeita."
        )
      ) {
        try {
          await deleteBoard(boardId);
          navigate("/");
        } catch (error) {
          console.error("Erro ao excluir board:", error);
        }
      }
    };

    const handleBackToDashboard = () => {
      navigate("/");
    };

    return (
      <MainLayout withPadding={false}>
        <div className="h-screen">
          {loading && !currentBoard ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-500">Carregando quadro...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-red-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Erro ao carregar o quadro
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => loadBoardDetails(boardId)}>
                    Tentar novamente
                  </Button>
                  <Button variant="secondary" onClick={handleBackToDashboard}>
                    Voltar ao Dashboard
                  </Button>
                </div>
              </div>
            </div>
          ) : currentBoard ? (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <Board
                board={currentBoard}
                lists={lists}
                onCardClick={handleCardClick}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Quadro não encontrado
                </h2>
                <p className="text-gray-600 mb-6">
                  O quadro que você está procurando não existe ou você não tem
                  permissão para acessá-lo.
                </p>
                <Button onClick={handleBackToDashboard}>
                  Voltar ao Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>

        {selectedCard && (
          <CardDetail
            isOpen={showCardModal}
            onClose={handleCloseCardModal}
            card={selectedCard}
            listId={selectedCard?.boardListId}
            users={users}
          />
        )}
      </MainLayout>
    );
  };
};
export default BoardDetails;
