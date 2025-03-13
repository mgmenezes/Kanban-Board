import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown, { DropdownItem, DropdownDivider } from "../ui/Dropdown";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                Kanban Board
              </Link>
            </div>
            <nav className="ml-6 flex space-x-4 items-center">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/boards"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Meus Quadros
              </Link>
            </nav>
          </div>

          <div className="flex items-center">
            {user ? (
              <Dropdown
                align="right"
                width="md"
                trigger={
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                      {user.userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {user.userName}
                    </span>
                    <svg
                      className="ml-1 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                }
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.userName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <DropdownDivider />
                <DropdownItem onClick={() => navigate("/profile")}>
                  Perfil
                </DropdownItem>
                <DropdownItem onClick={() => navigate("/settings")}>
                  Configurações
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleLogout}>Sair</DropdownItem>
              </Dropdown>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
