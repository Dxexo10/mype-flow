import { ClipboardCheck, Shuffle, BarChart3, CreditCard } from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Diagnosticar",
    description:
      "Responde unas preguntas y conoce en minutos el nivel de formalización real de tu negocio.",
  },
  {
    icon: Shuffle,
    title: "Formalizar",
    description:
      "Recibe una ruta ordenada con los trámites que te faltan, paso a paso y sin tecnicismos.",
  },
  {
    icon: BarChart3,
    title: "Analizar",
    description:
      "Visualiza cómo se compara tu empresa contra benchmarks nacionales reales de formalización.",
  },
  {
    icon: CreditCard,
    title: "Prepararte para financiamiento",
    description:
      "Descubre tu elegibilidad para factoring y qué mejorar para acceder a mejores condiciones.",
  },
];

export default function Features() {
  return (
    <section className="bg-[#F8FAFD] py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-[#324462] mb-2">
            ¿Qué puedes hacer con MYPE FLOW?
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Cuatro capacidades pensadas para empresarios que necesitan claridad,
          no reportes complicados.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-700" />
                </div>
                <h3 className="font-bold text-[#324462] mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}