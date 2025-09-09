"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration Card */}
        <Card className="bg-slate-700 p-8 rounded-3xl shadow-xl">
          <Image src="/landing/inventario.png" alt="inventario" width={600} height={300} className="mx-auto"/>
        </Card>

        {/* Right side - Content */}
        <div className="space-y-8">
          {/* Logo and branding */}
          <div className="flex items-center space-x-4">
            <Image src="/landing/logo.png" alt="Logo" width={400} height={400} />
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-700 mb-4 text-balance">
                Transforma tu gestión de inventario con inteligencia artificial
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Optimiza tu negocio con análisis predictivos, control automatizado y decisiones basadas en datos.
                StockMind te ayuda a mantener el equilibrio perfecto en tu inventario.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-slate-600">Control en tiempo real</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-slate-600">Análisis predictivo</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-slate-600">Reportes inteligentes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-slate-600">Decisiones automatizadas</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/accounting/login")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
