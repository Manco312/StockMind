'use client';

import { useSearchParams } from "next/navigation";
import LoginHeader from "../../../../components/LoginHeader";
import LoginIllustration from "../../../../components/LoginIllustration";
import LoginForm from "../../../../components/LoginForm";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage =
    error === "CredentialsSignin" ? "Usuario o contraseña incorrectos" : null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden min-h-[500px] sm:min-h-[600px]">
        <LoginIllustration />

        <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
          <LoginHeader />
          <LoginForm errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
}
