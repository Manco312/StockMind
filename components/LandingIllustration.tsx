import Image from "next/image";

export default function LandingIllustration() {
  return (
    <Image
      src="/landing/inventario.png"
      alt="Ilustración de gestión de inventario"
      width={300}
      height={200}
      className="object-contain w-full h-auto"
    />
  );
}
