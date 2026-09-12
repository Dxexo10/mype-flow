"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Gauge, Layers, type LucideIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Header from "../components/Header";
import {
  getComparacionInformalidad,
  getPorDistrito,
  getPorSector,
  getResumen,
  type ComparacionInformalidad,
  type PorDistritoItem,
  type PorSectorItem,
  type Resumen,
} from "@/lib/api";

export default function Dashboard() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [porSector, setPorSector] = useState<PorSectorItem[]>([]);
  const [porDistrito, setPorDistrito] = useState<PorDistritoItem[]>([]);
  const [comparacion, setComparacion] =
    useState<ComparacionInformalidad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getResumen(), getPorSector(), getPorDistrito(), getComparacionInformalidad()])
      .then(([r, sector, distrito, comp]) => {
        setResumen(r);
        setPorSector(sector);
        setPorDistrito(distrito);
        setComparacion(comp);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Error al cargar los datos");
      })
      .finally(() => setLoading(false));
  }, []);

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

  const total = resumen?.total_empresas ?? 0;
  const porcentajeFormales = total > 0 ? Math.round((resumen!.formales / total) * 100) : 0;
  const scoreFormalizacion = resumen ? Math.round(100 - resumen.tasa_informalidad_muestra) : 0;

  const dataInformalidad = comparacion
    ? [
        {
          nombre: "Muestra MYPE Flow",
          valor: comparacion.tasa_informalidad_muestra,
          fill: "#8AAEE0",
        },
        {
          nombre: "Benchmark nacional",
          valor: comparacion.tasa_informalidad_nacional_2024 ?? 0,
          fill: "#FB923C",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-[#324462]">Dashboard analítico</h1>
        <p className="text-[#324462] mt-2 mb-8">
          Resumen general de la muestra de empresas analizadas y su comparación con los
          indicadores nacionales de informalidad.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            label="Empresas analizadas"
            value={total}
            icon={Building2}
            caption="Muestra acumulada"
          />
          <KpiCard
            label="Formales"
            value={`${porcentajeFormales}%`}
            icon={CheckCircle2}
            caption={`Informales: ${100 - porcentajeFormales}%`}
          />
          <KpiCard
            label="Micro / Pequeña"
            value={`${resumen?.micro ?? 0} / ${resumen?.pequena ?? 0}`}
            icon={Layers}
            caption="Distribución por tamaño"
          />
          <KpiCard
            label="Score promedio"
            value={`${scoreFormalizacion}/100`}
            icon={Gauge}
            caption="Índice de formalización"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#324462] mb-4">
              Informalidad: muestra vs. benchmark nacional
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Benchmark nacional de informalidad empresarial: {comparacion?.tasa_informalidad_nacional_2024}%
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataInformalidad} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                <YAxis type="category" dataKey="nombre" width={140} />
                <Tooltip />
                <Bar dataKey="valor" radius={[0, 8, 8, 0]} barSize={32}>
                  {dataInformalidad.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Informalidad de la muestra</p>
                  <p className="font-bold text-[#324462]">
                    {comparacion?.tasa_informalidad_muestra}%
                  </p>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden mt-2">
                  <div
                    className="h-2 rounded-full bg-[#8AAEE0]"
                    style={{ width: `${comparacion?.tasa_informalidad_muestra}%` }}
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Informalidad nacional</p>
                  <p className="font-bold text-[#324462]">
                    {comparacion?.tasa_informalidad_nacional_2024}%
                  </p>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden mt-2">
                  <div
                    className="h-2 rounded-full bg-orange-400"
                    style={{ width: `${comparacion?.tasa_informalidad_nacional_2024}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-[#324462] mb-4">
              Distribución por sector
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Total de empresas por sector en la muestra analizada.
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={porSector} margin={{ top: 8, right: 8, bottom: 8, left: 4 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="sector" tick={{ fontSize: 12 }} angle={-35} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8AAEE0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por distrito
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={porDistrito} layout="vertical" margin={{ left: 8 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="distrito" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#638ECB" barSize={60} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  caption,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  caption?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-700" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#324462]">{value}</p>
      {caption && <p className="text-xs text-gray-400 mt-1">{caption}</p>}
    </div>
  );
}