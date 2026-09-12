"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "../../components/Header";
import GaugeChart from "../../components/GaugeChart";
import {
  buscarEmpresaPorRuc,
  getScoringFactoring,
  getScoringTransicion,
  type Empresa,
  type ScoringFactoring,
  type ScoringTransicion,
} from "@/lib/api";

export default function DetalleEmpresa() {
  const { ruc } = useParams<{ ruc: string }>();

  const [empresa, setEmpresa] = useState<Empresa | null | undefined>(undefined);
  const [scoringFactoring, setScoringFactoring] =
    useState<ScoringFactoring | null>(null);
  const [scoringTransicion, setScoringTransicion] =
    useState<ScoringTransicion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const emp = await buscarEmpresaPorRuc(ruc);
      if (cancelled) return;
      setEmpresa(emp);

      if (!emp) return;

      const [factoring, transicion] = await Promise.all([
        getScoringFactoring(ruc),
        getScoringTransicion(ruc),
      ]);
      if (cancelled) return;
      setScoringFactoring(factoring);
      setScoringTransicion(transicion);
    })().catch((e) => {
      if (!cancelled) {
        setError(e instanceof Error ? e.message : "Error al cargar la empresa");
      }
    }).finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [ruc]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD]">
        <Header />
        <div className="flex items-center justify-center py-40">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFD]">
        <Header />
        <div className="flex items-center justify-center py-40">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-[#F8FAFD]">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <p className="text-gray-600">No se encontró ninguna empresa con RUC {ruc}.</p>
          <Link href="/empresas" className="text-sm text-brand-700 hover:text-brand-500 font-medium">
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const titulo = empresa.razon_social ?? `RUC ${empresa.ruc}`;
  const subtitulo = [empresa.sector ?? "—", empresa.distrito ?? "—", `RUC ${empresa.ruc}`].join(
    " · "
  );

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{titulo}</h1>
            <p className="text-gray-500 mt-2">{subtitulo}</p>
          </div>
          <Link
            href="/empresas"
            className="flex items-center gap-2 border border-brand-200 text-brand-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al listado
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Datos de la empresa</h2>
              {empresa.es_formal ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Formal
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  Informal
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Dato label="RUC" value={empresa.ruc} />
              <Dato label="Sector" value={empresa.sector ?? "—"} />
              <Dato label="Tamaño" value={empresa.tamano} />
              <Dato label="Distrito" value={empresa.distrito ?? "—"} />
              <Dato label="Año de licencia" value={empresa.anio !== null ? String(empresa.anio) : "—"} />
              <Dato
                label="Número de locales"
                value={empresa.num_locales !== null ? String(empresa.num_locales) : "—"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Probabilidad de crecer a pequeña empresa
              </h2>
              {scoringTransicion ? (
                <>
                  <GaugeChart
                    value={scoringTransicion.probabilidad_crecer_a_pequena * 100}
                    color="#638ECB"
                  />
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Estimación de un modelo de Random Forest entrenado sobre datos reales
                    de licencias municipales.
                  </p>
                </>
              ) : (
                <p className="text-gray-500">
                  Este indicador solo aplica a microempresas.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Elegibilidad para factoring
              </h2>
              {scoringFactoring && (
                <>
                  <GaugeChart
                    value={scoringFactoring.probabilidad_elegible_factoring * 100}
                    color="#22C55E"
                  />
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Estimación de un modelo de Random Forest; depende fuertemente de si
                    la empresa es formal.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}