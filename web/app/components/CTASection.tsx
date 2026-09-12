import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-[#F0F2F8] py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-extrabold text-[#324462] mb-3">
                Empieza con el diagnóstico y mira tus datos en un solo panel
            </h3>
            <p className="text-gray-600 mb-6">
              Explora el dashboard analítico, el buscador de empresas por RUC
              y el módulo de formalización con recomendación de régimen
              societario.
            </p>

            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600">Score promedio de la muestra</span>
              <span className="font-bold text-gray-900">54%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mb-2">
              <div className="h-2 bg-brand-500 rounded-full w-[54%]"></div>
            </div>
            <p className="text-xs text-gray-400">
              Basado en 1,248 empresas analizadas
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
                Ir al dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/empresas"
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
            >
                <Search className="w-4 h-4" /> Buscar por RUC
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}