import Image from "next/image";

export default function LoginHeader() {
  return (
    <div className="mb-8 flex justify-center">
      <Image
        src="/landing/logo.png"
        alt="StockMind Logo"
        width={300}
        height={120}
        className="mb-4"
      />
    </div>
  );
}
