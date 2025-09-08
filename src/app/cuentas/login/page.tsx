"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage =
    error === "CredentialsSignin"
      ? "Usuario o contraseña incorrectos"
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Usar redirect: true para que NextAuth maneje la redirección
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/inventario",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Left side - Logo */}
        <div className="flex items-center justify-center p-8 ">
          <Image
            src="/landing/logo.png"
            alt="Logo"
            width={350}
            height={350}
            className="object-contain"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="p-10 lg:p-16">
          <h2 className="text-3xl font-bold text-slate-700 mb-8">
            Inicia sesión en <span className="text-blue-600">StockMind</span>
          </h2>

          {errorMessage && (
            <p className="mb-4 text-red-500 font-medium">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-600 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 placeholder-gray-600 text-gray-900 bg-white/70 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-2">Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 placeholder-gray-600 text-gray-900 bg-white/70 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
