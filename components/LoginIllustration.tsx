import Image from "next/image";

export default function LoginIllustration() {
  return (
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
  );
}
