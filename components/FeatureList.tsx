const features = [
  "Control en tiempo real",
  "Reportes inteligentes",
  "Análisis predictivo",
  "Decisiones automatizadas",
];

export default function FeatureList() {
  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
          <span className="text-gray-600">{feature}</span>
        </div>
      ))}
    </div>
  );
}
