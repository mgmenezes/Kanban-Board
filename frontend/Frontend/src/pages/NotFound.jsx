import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Página não encontrada
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A página que você está procurando pode ter sido removida, renomeada
            ou está temporariamente indisponível.
          </p>
          <div className="flex justify-center space-x-4">
            <Button as={Link} to="/" variant="primary">
              Voltar para a página inicial
            </Button>
            <Button
              as="a"
              href="mailto:suporte@kanbanboard.com"
              variant="secondary"
            >
              Reportar problema
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
