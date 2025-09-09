"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import RoleSelector from "./RoleSelector";
import LoginButton from "./LoginButton";

interface LoginFormProps {
  errorMessage?: string | null;
}

export default function LoginForm({ errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("distributor");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <p className="mb-4 text-red-500 font-medium">{errorMessage}</p>
      )}

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Usuario
        </label>
        <input
          type="email"
          placeholder="Ingresa tu usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border-2 border-gray-200 p-4 text-gray-900 bg-white focus:border-blue-500 focus:outline-none transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border-2 border-gray-200 p-4 text-gray-900 bg-white focus:border-blue-500 focus:outline-none transition-colors"
          required
        />
      </div>

      <RoleSelector userType={userType} onUserTypeChange={setUserType} />

      <LoginButton isLoading={isLoading} />
    </form>
  );
}
