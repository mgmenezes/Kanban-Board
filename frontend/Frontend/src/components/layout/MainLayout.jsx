import React from "react";
import Header from "./Header";

const MainLayout = ({ children, withPadding = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main
        className={`flex-grow ${
          withPadding ? "py-6 px-4 sm:px-6 lg:px-8" : ""
        }`}
      >
        {children}
      </main>
      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Kanban Board - Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
