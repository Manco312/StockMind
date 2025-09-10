import Image from "next/image";

export default function LoginHeader() {
  return (
    <div className="mb-6 sm:mb-8 flex justify-center">
      <Image
        src="/landing/logo.png"
        alt="StockMind Logo"
        width={250}
        height={100}
        className="w-48 h-20 sm:w-56 sm:h-22 md:w-64 md:h-24 lg:w-72 lg:h-28 object-contain"
        priority
      />
    </div>
  );
}
