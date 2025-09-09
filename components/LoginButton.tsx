interface LoginButtonProps {
  isLoading?: boolean;
}

export default function LoginButton({ isLoading = false }: LoginButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full p-3 bg-blue-400 text-white rounded-full font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
    </button>
  );
}
