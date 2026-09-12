"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import {
  listarEmpresas,
  buscarEmpresaPorRuc,
  getScoringFactoring,
  type Empresa,
} from "@/lib/api";

const SECTORES = [
  "ALIMENTOS_BEBIDAS",
  "ALMACENAMIENTO_LOGISTICA",
  "COMERCIO_MINORISTA",
  "EDUCACION",
  "FINANCIERO",
  "HOTELERIA",
  "OTROS",
  "RECREACION_DEPORTE",
  "SALUD",
  "SERVICIOS_ADMINISTRATIVOS",
  "SERVICIOS_DIVERSOS",
  "SERVICIOS_PERSONALES",
  "SERVICIOS_PROFESIONALES",
  "SERVICIOS_TECNICOS",
  "SIN_DATO",
];

const DISTRITOS = ["CHORRILLOS", "SAN ISIDRO"];

const LIMIT = 10;

interface Filtros {
  sector: string;
  tamano: string;
  distrito: string;
  condicion: string;
}

export default function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sector, setSector] = useState("");
  const [tamano, setTamano] = useState("");
  const [distrito, setDistrito] = useState("");
  const [condicion, setCondicion] = useState("all");

  const [rucInput, setRucInput] = useState("");
  const [rucMensaje, setRucMensaje] = useState<string | null>(null);

  const [skip, setSkip] = useState(0);

  async function cargarScores(datos: Empresa[]) {
    const resultados = await Promise.all(
      datos.map(async (empresa) => {
        try {
          const scoring = await getScoringFactoring(empresa.ruc);
          return {
            ruc: empresa.ruc,
            score: Math.round(scoring.probabilidad_elegible_factoring * 100),
          };
        } catch {
          return null;
        }
      })
    );

    const nuevosScores: Record<string, number> = {};
    for (const resultado of resultados) {
      if (resultado) {
        nuevosScores[resultado.ruc] = resultado.score;
      }
    }
    setScores(nuevosScores);
  }

  async function cargarEmpresas(nuevoSkip: number, filtros: Filtros) {
    const esFormalParam =
      filtros.condicion === "all" ? undefined : filtros.condicion === "true";

    setLoading(true);
    setError(null);
    setRucMensaje(null);
    setScores({});
    try {
      const datos = await listarEmpresas({
        sector: filtros.sector || undefined,
        tamano: filtros.tamano || undefined,
        distrito: filtros.distrito || undefined,
        es_formal: esFormalParam,
        skip: nuevoSkip,
        limit: LIMIT,
      });
      setEmpresas(datos);
      cargarScores(datos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar las empresas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    listarEmpresas({ limit: LIMIT })
      .then((datos) => {
        if (!cancelled) {
          setEmpresas(datos);
          setLoading(false);
          cargarScores(datos);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error al cargar las empresas");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function cambiarPagina(nuevoSkip: number) {
    setSkip(nuevoSkip);
    cargarEmpresas(nuevoSkip, { sector, tamano, distrito, condicion });
  }

  useEffect(() => {
    const ruc = rucInput.trim();

    const timeout = setTimeout(() => {
      if (ruc === "") {
        cargarEmpresas(skip, { sector, tamano, distrito, condicion });
        return;
      }

      if (!/^\d{11}$/.test(ruc)) {
        return;
      }

      setLoading(true);
      setError(null);
      setRucMensaje(null);
      buscarEmpresaPorRuc(ruc)
        .then((empresa) => {
          setRucMensaje(
            empresa ? null : "No se encontró ninguna empresa con ese RUC."
          );
          setEmpresas(empresa ? [empresa] : []);
          setScores({});
        })
        .catch((e) => {
          setError(e instanceof Error ? e.message : "Error al buscar el RUC");
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rucInput]);

  const fila = (empresa: Empresa) => {
    const score = scores[empresa.ruc];

    return (
      <tr key={empresa.id} className="border-b border-gray-100 last:border-0">
        <td className="px-4 py-3 text-sm font-medium text-gray-900">{empresa.ruc}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{empresa.razon_social ?? "—"}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{empresa.sector ?? "—"}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{empresa.tamano}</td>
        <td className="px-4 py-3 text-sm text-gray-700">{empresa.distrito ?? "—"}</td>
        <td className="px-4 py-3 text-sm">
          {empresa.es_formal ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Formal
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              Informal
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-sm">
          {score !== undefined ? (
            <div className="flex items-center gap-2">
              <div className="h-1.5 rounded-full bg-gray-100 w-16 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-brand-500"
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-sm text-gray-700">{score}</span>
            </div>
          ) : (
            "—"
          )}
        </td>
        <td className="px-4 py-3 text-sm">
          <Link
            href={`/empresas/${empresa.ruc}`}
            className="text-brand-700 hover:text-brand-500 font-medium"
          >
            Ver detalle
          </Link>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Empresas analizadas</h1>
        <p className="text-gray-600 mt-2 mb-8">
          Busca por RUC y filtra la muestra para revisar el detalle de cada empresa.
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            value={rucInput}
            onChange={(e) => setRucInput(e.target.value)}
            placeholder="Buscar por RUC exacto"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          />

          <select
            value={sector}
            onChange={(e) => {
              const nuevo = e.target.value;
              setSector(nuevo);
              setSkip(0);
              cargarEmpresas(0, { sector: nuevo, tamano, distrito, condicion });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Todos los sectores</option>
            {SECTORES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={tamano}
            onChange={(e) => {
              const nuevo = e.target.value;
              setTamano(nuevo);
              setSkip(0);
              cargarEmpresas(0, { sector, tamano: nuevo, distrito, condicion });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Todo tamaño</option>
            <option value="micro">micro</option>
            <option value="pequeña">pequeña</option>
          </select>

          <select
            value={distrito}
            onChange={(e) => {
              const nuevo = e.target.value;
              setDistrito(nuevo);
              setSkip(0);
              cargarEmpresas(0, { sector, tamano, distrito: nuevo, condicion });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Todos los distritos</option>
            {DISTRITOS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={condicion}
            onChange={(e) => {
              const nuevo = e.target.value;
              setCondicion(nuevo);
              setSkip(0);
              cargarEmpresas(0, { sector, tamano, distrito, condicion: nuevo });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="all">Formal e informal</option>
            <option value="true">Formal</option>
            <option value="false">Informal</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">Cargando...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : rucMensaje ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">{rucMensaje}</p>
            </div>
          ) : empresas.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">No hay empresas que coincidan con los filtros.</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3">RUC</th>
                    <th className="px-4 py-3">Razón Social</th>
                    <th className="px-4 py-3">Sector</th>
                    <th className="px-4 py-3">Tamaño</th>
                    <th className="px-4 py-3">Distrito</th>
                    <th className="px-4 py-3">Condición</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>{empresas.map(fila)}</tbody>
              </table>
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => cambiarPagina(skip - LIMIT)}
                  disabled={skip === 0}
                  className="text-sm text-brand-700 px-3 py-1.5 rounded-full border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {skip / LIMIT + 1}
                </span>
                <button
                  onClick={() => cambiarPagina(skip + LIMIT)}
                  className="text-sm text-brand-700 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}