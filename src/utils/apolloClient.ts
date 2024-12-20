import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Configura o link HTTP
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
});

// Middleware para adicionar o token ao cabeçalho
const authLink = setContext((_, { headers }) => {
  // Obtém o token do localStorage
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Cria o Apollo Client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;
