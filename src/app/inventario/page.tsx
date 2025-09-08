import { auth } from "@/src/auth";

export default async function InventarioPage() {
  const session = await auth();

  if (!session?.user) {
    return <p>No tienes acceso. Inicia sesión.</p>;
  }

  return (
    <div>
      <h1>Bienvenido {session.user.name}</h1>

    </div>
  );
}
