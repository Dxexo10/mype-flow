"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Gauge, Layers, type LucideIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

  const comparacionData = comparacion
    ? [
        {
          nombre: "Tasa de informalidad (%)",
          "Muestra MYPE Flow": comparacion.tasa_informalidad_muestra,
          "Benchmark nacional": comparacion.tasa_informalidad_nacional_2024 ?? 0,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard analítico</h1>
        <p className="text-gray-600 mt-2 mb-8">
          Resumen general de la muestra de empresas analizadas y su comparación con los
          indicadores nacionales de informalidad.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard label="Empresas analizadas" value={total} icon={Building2} />
          <KpiCard label="Formales" value={`${porcentajeFormales}%`} icon={CheckCircle2} />
          <KpiCard
            label="Micro / Pequeña"
            value={`${resumen?.micro ?? 0} / ${resumen?.pequena ?? 0}`}
            icon={Layers}
          />
          <KpiCard label="Score promedio" value={`${scoreFormalizacion}/100`} icon={Gauge} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informalidad: muestra vs. benchmark nacional
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={comparacionData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" tickFormatter={(v: number) => `${v}%`} />
                <YAxis type="category" dataKey="nombre" width={140} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Muestra MYPE Flow" fill="#638ECB" barSize={22} radius={[0, 8, 8, 0]} />
                <Bar dataKey="Benchmark nacional" fill="#395886" barSize={22} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución por sector
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={porSector} margin={{ left: 4, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
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
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-brand-700" />
      </div>
      <p className="text-sm text-gray-500 mb-3">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}