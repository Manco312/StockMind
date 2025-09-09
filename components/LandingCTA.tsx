"use client";

import { useRouter } from "next/navigation";

export default function LandingCTA() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/accounting/login")}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
    >
      Entrar
    </button>
  );
}
