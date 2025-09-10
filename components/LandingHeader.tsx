import Image from "next/image";

export default function LandingHeader() {
  return (
    <div className="text-center mb-4 sm:mb-6 lg:mb-8">
      <div className="flex items-center justify-center mb-2">
        <Image
          src="/landing/logo.png"
          alt="StockMind Logo"
          width={200}
          height={80}
          className="w-40 h-16 sm:w-48 sm:h-20 md:w-56 md:h-22 lg:w-64 lg:h-24 object-contain"
          priority
        />
      </div>
    </div>
  );
}
