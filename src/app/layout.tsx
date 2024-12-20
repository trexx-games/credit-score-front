"use client";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "../utils/apolloClient";
import "./globals.css";
import UserMenu from "@/components/UserMenu";
import { WalletProvider } from "@/context/WalletContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <ApolloProvider client={apolloClient}>
          <WalletProvider>
            <header className="bg-[#3E894F] text-white py-4 px-8 flex justify-between items-center">
              <h1 className="text-xl font-bold">Score de Crédito</h1>
              <UserMenu />
            </header>
            <main className="p-4">{children}</main>
            <footer className="bg-gray-800 text-white text-center py-4">
              &copy; {new Date().getFullYear()} Score de Crédito
            </footer>
          </WalletProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
