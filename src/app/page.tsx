"use client";

import { useEffect, useState } from "react";
import WalletConnector from "../components/WalletConnector";
import { gql, useQuery } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useWallet } from "@/context/WalletContext";
import { creditAvailable, quantityAvailable } from "@/utils/creditAvailable";

type JwtPayload = {
  sub: string;
};

const GET_USER = gql`
  query GetUser($slug: ID!) {
    user(slug: $slug) {
      score {
        value
      }
      name
    }
  }
`;

const GET_SCORES = gql`
  query GetUserScores($slug: ID!) {
    scores(slug: $slug) {
      value
      createdAt
    }
  }
`;

const GET_USER_EVENT = gql`
  query GetEvent($slug: ID!) {
    event(slug: $slug) {
      value
      blockchain
      createdAt
    }
  }
`;

export default function Home() {
  const { walletAddress } = useWallet();
  const [slug, setSlug] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messageQuantity, setMessageQuantity] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setSlug(decoded.sub);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { slug },
    skip: !slug,
  });

  const {
    data: scoresData,
    loading: scoresLoading,
    error: scoresError,
  } = useQuery(GET_SCORES, {
    variables: { slug },
    skip: !slug,
  });

  const {
    data: userEventData,
    loading: userEventLoading,
    error: userEventError,
  } = useQuery(GET_USER_EVENT, {
    variables: { slug },
    skip: !slug,
  });

  useEffect(() => {
    if (data && data.user) {
      const level = data.user.score.value;
      try {
        const message = creditAvailable(level);
        setMessage(message);
      } catch (error) {
        console.error("Nível de risco inválido:", error);
      }
    }
  }, [data]);

  useEffect(() => {
    if (userEventData && userEventData.event) {
      try {
        const message = quantityAvailable(userEventData.event.value);
        setMessageQuantity(message);
      } catch (error) {
        console.error("Nível de risco inválido:", error);
      }
    }
  }, [userEventData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Bem vindo ao Score de Crédito
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Conecte sua carteira e explore a internet descentralizada!
        </p>
        <WalletConnector />
        <p className="text-gray-700 text-center">Seu Trexx Score</p>
        <div>
          <p className="text-gray-700 text-center text-5xl">
            {data ? data.user.score.value : 0}
          </p>
        </div>
        <p className="text-gray-700 mt-4">No caso do usuário {walletAddress}</p>
        <p className="text-gray-700 mt-4 text-justify">
          {userEventData && (
            <>
              O usuário costuma transacionar mais na rede{" "}
              {userEventData.event.blockchain}. Devido ao usuário ter
              transacionado {userEventData.event.value} vezes na rede{" "}
              {userEventData.event.blockchain} no último mês, isso indica que o
              usuário {messageQuantity}
            </>
          )}
        </p>
        <p className="text-gray-700 mt-4">
          {scoresData && "Seus scores passados foram "}
          {scoresData &&
            scoresData.scores
              .map((obj: { value: number }) => `${obj.value}`)
              .join(" | ")}
          .
        </p>
        {message && (
          <p className="text-gray-700 mt-4 text-justify">
            Concluímos que {message}
          </p>
        )}
      </div>
    </div>
  );
}
