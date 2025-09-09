import Image from "next/image";

export default function LandingHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-2">
        <Image
          src="/landing/logo.png"
          alt="StockMind Logo"
          width={250}
          height={100}
        />
      </div>
    </div>
  );
}
