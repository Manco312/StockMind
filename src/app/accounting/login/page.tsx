"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("distributor");

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage =
    error === "CredentialsSignin" ? "Usuario o contraseña incorrectos" : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Usar redirect: true para que NextAuth maneje la redirección
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/inventory/store",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
        {/* Left side - Illustration Panel (Hidden on mobile) */}
        <div className="hidden lg:flex bg-slate-700 rounded-l-2xl p-6 items-center justify-center">
          <div className="text-center">
            <div className="bg-white rounded-xl p-4 mb-4 shadow-lg max-w-sm">
              <Image
                src="/landing/inventario.png"
                alt="Ilustración de inventario"
                width={280}
                height={180}
                className="object-contain w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          {/* Header with Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/landing/logo.png"
              alt="StockMind Logo"
              width={300}
              height={120}
              className="mb-4"
            />
          </div>

          {errorMessage && (
            <p className="mb-4 text-red-500 font-medium">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Role Selection */}
            <div className="flex rounded-full overflow-hidden border-2 border-gray-200">
              <button
                type="button"
                onClick={() => setUserType("distributor")}
                className={`flex-1 py-3 px-3 text-sm font-semibold transition-colors ${
                  userType === "distributor"
                    ? "bg-blue-400 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Soy distribuidor
              </button>
              <button
                type="button"
                onClick={() => setUserType("store")}
                className={`flex-1 py-3 px-3 text-sm font-semibold transition-colors ${
                  userType === "store"
                    ? "bg-blue-400 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Soy dueño de tienda
              </button>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-blue-400 text-white rounded-full font-semibold hover:bg-blue-500 transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
