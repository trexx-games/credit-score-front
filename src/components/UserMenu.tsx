"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Verificar o estado de login
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Se o token existir, o usuário está logado
  }, []);

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    router.push("/"); // Redirecionar para a página inicial ou de login
  };

  // Função para login (redireciona para a página de login)
  const handleLogin = () => {
    router.push("/login"); // Redirecionar para a página de login
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-[#3E894F] text-white rounded hover:bg-[#66E383]"
      >
        Menu
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          <ul className="py-1">
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLogin}
                  className="block px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-100"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
