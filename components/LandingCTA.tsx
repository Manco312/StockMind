"use client";

import { useRouter } from "next/navigation";

export default function LandingCTA() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/accounting/login")}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      Entrar
    </button>
  );
}
