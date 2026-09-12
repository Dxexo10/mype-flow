import Link from "next/link";
import { ArrowRight, Play, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-brand-50">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
            Plataforma para micro y pequeñas empresas
          </span>

          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-2">
            MYPE FLOW
          </h1>
          <h2 className="text-4xl font-extrabold text-brand-500 leading-tight mb-6">
            Formaliza. Analiza. Crece.
          </h2>

          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Una plataforma digital que te ayuda a entender el estado de tu
            empresa, gestionar tu formalización y tomar mejores decisiones
            basadas en datos.
          </p>

          <div className="flex gap-4 mb-6">
            <Link
              href="/formalizacion"
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Comenzar diagnóstico <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-full hover:bg-gray-50 transition-colors"
            >
              <Play className="w-4 h-4" /> Ver cómo funciona
            </a>
          </div>

          <div className="flex gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" /> Datos de demostración
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" /> Sin instalaciones
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-500" /> Diagnóstico en 5 minutos
            </span>
          </div>
        </div>

        {/* Tarjeta demo (sin cambios respecto a lo que ya tenías) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-brand-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Panel de Textiles Andinos S.A.C.
            </div>
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
              Demo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Formalización</p>
              <p className="text-2xl font-bold text-gray-900">
                78<span className="text-sm text-gray-400">/100</span>
              </p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-2">
                <div className="h-1.5 bg-brand-500 rounded-full w-[78%]"></div>
              </div>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Probabilidad de crecimiento</p>
              <p className="text-2xl font-bold text-gray-900">72%</p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-2">
                <div className="h-1.5 bg-green-500 rounded-full w-[72%]"></div>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-2">Estado de trámites</p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-4 h-4 text-green-500" /> RUC y régimen tributario
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-4 h-4 text-green-500" /> Registro empresarial
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-orange-500">⚠</span> Comprobantes electrónicos
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}