import LandingHeader from "@/components/LandingHeader";
import LandingIllustration from "@/components/LandingIllustration";
import FeatureList from "@/components/FeatureList";
import LandingCTA from "@/components/LandingCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
          {/* Left side - Illustration (Hidden on mobile) */}
          <div className="hidden lg:flex bg-slate-700 rounded-l-3xl items-center justify-center p-8">
            <div className="text-center">
              <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg max-w-sm">
                <LandingIllustration />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Logo and tagline */}
              <div className="mb-6">
                <LandingHeader />
              </div>

              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                  Transforma tu gestión de inventario con inteligencia
                  artificial
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Optimiza tu negocio con análisis predictivos, control
                  automatizado y decisiones basadas en datos. StockMind te ayuda
                  a mantener el equilibrio perfecto en tu inventario.
                </p>
              </div>

              <FeatureList />

              <div className="pt-4">
                <LandingCTA />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
