import LandingHeader from "@/components/LandingHeader";
import LandingIllustration from "@/components/LandingIllustration";
import FeatureList from "@/components/FeatureList";
import LandingCTA from "@/components/LandingCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-7xl bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px] sm:min-h-[600px]">
          {/* Left side - Illustration (Hidden on mobile, shown on tablet and desktop) */}
          <div className="hidden md:flex bg-slate-700 rounded-l-2xl sm:rounded-l-3xl items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="text-center w-full">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg max-w-sm mx-auto">
                <LandingIllustration />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-4 sm:space-y-6">
              {/* Logo and tagline */}
              <div className="mb-4 sm:mb-6">
                <LandingHeader />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
                  Transforma tu gestión de inventario con inteligencia
                  artificial
                </h1>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Optimiza tu negocio con análisis predictivos, control
                  automatizado y decisiones basadas en datos. StockMind te ayuda
                  a mantener el equilibrio perfecto en tu inventario.
                </p>
              </div>

              <FeatureList />

              <div className="pt-2 sm:pt-4">
                <LandingCTA />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
