import Image from "next/image";

export default function LoginIllustration() {
  return (
    <div className="hidden lg:flex bg-slate-700 rounded-l-xl sm:rounded-l-2xl p-4 sm:p-6 items-center justify-center">
      <div className="text-center w-full">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg max-w-sm mx-auto">
          <Image
            src="/landing/inventario.png"
            alt="Ilustración de inventario"
            width={280}
            height={180}
            className="object-contain w-full h-auto max-h-48 sm:max-h-56"
            priority
          />
        </div>
      </div>
    </div>
  );
}
