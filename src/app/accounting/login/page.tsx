"use client";

import { useSearchParams } from "next/navigation";
import LoginHeader from "../../../../components/LoginHeader";
import LoginIllustration from "../../../../components/LoginIllustration";
import LoginForm from "../../../../components/LoginForm";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage =
    error === "CredentialsSignin" ? "Usuario o contraseña incorrectos" : null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
        <LoginIllustration />

        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <LoginHeader />
          <LoginForm errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}
