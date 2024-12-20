"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LOGIN_USER = gql`
  mutation authenticate($email: String!, $password: String!) {
    authenticate(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Apollo Client Mutation
  const [authenticate, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      setSuccessMessage("Bem vindo");
      localStorage.setItem("accessToken", data.authenticate.accessToken);
      // Limpa o formulário
      setFormData({ email: "", password: "" });
      router.push("/");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Envia a mutation com os dados do formulário
    authenticate({ variables: formData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#66E383] focus:border-[#66E383] sm:text-sm text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#66E383] focus:border-[#66E383] sm:text-sm text-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white text-sm font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3E894F] hover:bg-[#66E383] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66E383]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {errorMessage && (
          <p className="mt-4 text-red-600 text-sm">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-green-600 text-sm">{successMessage}</p>
        )}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-[#3E894F] hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
