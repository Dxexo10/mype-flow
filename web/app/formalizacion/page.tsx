"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import Header from "../components/Header";
import {
  recomendarRegimen,
  crearTramite,
  listarTramites,
  completarTramite,
  buscarEmpresaPorRuc,
  type Empresa,
  type RecomendacionRegimen,
  type Tramite,
} from "@/lib/api";

const TRAMITES_DEFINICION = [
  {
    tipo: "constitucion",
    label: "Constitución de empresa",
    descripcion: "Escritura pública e inscripción en Registros Públicos.",
  },
  {
    tipo: "aumento_capital",
    label: "Aumento de capital",
    descripcion: "Acuerdo de socios y modificación del estatuto.",
  },
  {
    tipo: "nombramiento_gerente",
    label: "Nombramiento de gerente",
    descripcion: "Acta de designación e inscripción del cargo.",
  },
  {
    tipo: "disolucion",
    label: "Disolución y liquidación",
    descripcion: "Procedimiento de cierre formal (solo si aplica).",
  },
];

export default function Formalizacion() {
  const [capitalSocial, setCapitalSocial] = useState("");
  const [numeroSocios, setNumeroSocios] = useState("");
  const [dniElectronico, setDniElectronico] = useState<boolean | null>(null);
  const [conoceSacs, setConoceSacs] = useState<boolean | null>(null);
  const [recomendacion, setRecomendacion] = useState<RecomendacionRegimen | null>(null);
  const [recomendacionError, setRecomendacionError] = useState<string | null>(null);
  const [recomendacionLoading, setRecomendacionLoading] = useState(false);

  const [rucInput, setRucInput] = useState("");
  const [empresaBusqueda, setEmpresaBusqueda] = useState<Empresa | null>(null);
  const [rucMensaje, setRucMensaje] = useState<string | null>(null);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [tramitesError, setTramitesError] = useState<string | null>(null);

  async function obtenerRecomendacion() {
    setRecomendacionLoading(true);
    setRecomendacionError(null);
    try {
      const resultado = await recomendarRegimen({
        capital_social: Number(capitalSocial) || 0,
        numero_socios: Number(numeroSocios) || 0,
        tiene_dni_electronico: dniElectronico ?? false,
        conoce_regimen_sacs: conoceSacs ?? false,
      });
      setRecomendacion(resultado);
    } catch (e) {
      setRecomendacionError(
        e instanceof Error ? e.message : "Error al obtener la recomendación"
      );
    } finally {
      setRecomendacionLoading(false);
    }
  }

  useEffect(() => {
    const ruc = rucInput.trim();

    const timeout = setTimeout(() => {
      if (!/^\d{11}$/.test(ruc)) {
        setEmpresaBusqueda(null);
        setRucMensaje(null);
        setTramites([]);
        setTramitesError(null);
        return;
      }

      setRucMensaje(null);
      buscarEmpresaPorRuc(ruc)
        .then((empresa) => {
          setEmpresaBusqueda(empresa);
          setTramites([]);
          setRucMensaje(
            empresa ? null : "No se encontró ninguna empresa con ese RUC."
          );
        })
        .catch((e) => {
          setEmpresaBusqueda(null);
          setTramites([]);
          setRucMensaje(
            e instanceof Error ? e.message : "Error al buscar el RUC"
          );
        });
    }, 400);

    return () => clearTimeout(timeout);
  }, [rucInput]);

  useEffect(() => {
    if (!empresaBusqueda) return;

    let cancelled = false;
    listarTramites(empresaBusqueda.id)
      .then((data) => {
        if (!cancelled) setTramites(data);
      })
      .catch((e) => {
        if (!cancelled) {
          setTramitesError(
            e instanceof Error ? e.message : "Error al cargar los trámites"
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [empresaBusqueda]);

  async function refrescarTramites() {
    if (!empresaBusqueda) return;
    try {
      const data = await listarTramites(empresaBusqueda.id);
      setTramites(data);
      setTramitesError(null);
    } catch (e) {
      setTramitesError(
        e instanceof Error ? e.message : "Error al cargar los trámites"
      );
    }
  }

  async function alCompletarTramite(tramiteId: number) {
    try {
      const actualizado = await completarTramite(tramiteId);
      setTramites((prev) =>
        prev.map((t) => (t.id === actualizado.id ? actualizado : t))
      );
    } catch (e) {
      setTramitesError(
        e instanceof Error ? e.message : "Error al completar el trámite"
      );
    }
  }

  async function alCrearTramite(tipo: string) {
    if (!empresaBusqueda) return;
    try {
      await crearTramite({
        empresa_id: empresaBusqueda.id,
        tipo,
        requiere_notaria: true,
      });
      await refrescarTramites();
    } catch (e) {
      setTramitesError(
        e instanceof Error ? e.message : "Error al crear el trámite"
      );
    }
  }

  const completados = TRAMITES_DEFINICION.filter((def) => {
    const tramite = tramites.find((t) => t.tipo === def.tipo);
    return tramite?.estado === "completado";
  }).length;
  const porcentajeAvance = Math.round(
    (completados / TRAMITES_DEFINICION.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#F8FAFD]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Módulo de formalización</h1>
        <p className="text-gray-600 mt-2 mb-8">
          Responde cuatro datos clave para conocer el régimen societario
          recomendado y gestiona el avance de tus trámites.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Datos de constitución
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="capital-social"
                  className="block text-xs text-gray-500 uppercase mb-1.5"
                >
                  Capital social (S/)
                </label>
                <input
                  id="capital-social"
                  type="number"
                  min="0"
                  value={capitalSocial}
                  onChange={(e) => setCapitalSocial(e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="numero-socios"
                  className="block text-xs text-gray-500 uppercase mb-1.5"
                >
                  Número de socios
                </label>
                <input
                  id="numero-socios"
                  type="number"
                  min="1"
                  value={numeroSocios}
                  onChange={(e) => setNumeroSocios(e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  ¿Cuentas con DNI electrónico?
                </p>
                <div className="flex gap-2">
                  <ToggleButton
                    active={dniElectronico === true}
                    label="Sí"
                    onClick={() => setDniElectronico(true)}
                  />
                  <ToggleButton
                    active={dniElectronico === false}
                    label="No"
                    onClick={() => setDniElectronico(false)}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-700 mb-2">
                  ¿Conoces el régimen SACS?
                </p>
                <div className="flex gap-2">
                  <ToggleButton
                    active={conoceSacs === true}
                    label="Sí"
                    onClick={() => setConoceSacs(true)}
                  />
                  <ToggleButton
                    active={conoceSacs === false}
                    label="No"
                    onClick={() => setConoceSacs(false)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={obtenerRecomendacion}
              disabled={recomendacionLoading}
              className="w-full bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {recomendacionLoading ? "Consultando..." : "Obtener recomendación"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Régimen recomendado
            </h2>

            {recomendacionError ? (
              <p className="text-red-600">{recomendacionError}</p>
            ) : recomendacion ? (
              <div>
                <p className="text-2xl font-bold text-brand-700">
                  {recomendacion.regimen_recomendado}
                </p>
                <p className="text-gray-700 mt-3 text-sm leading-relaxed">
                  {recomendacion.justificacion}
                </p>
                {recomendacion.barreras_detectadas.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {recomendacion.barreras_detectadas.map((barrera, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-amber-700"
                      >
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{barrera}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Completa el formulario para ver el régimen societario sugerido,
                su justificación y las barreras detectadas.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Checklist de trámites
          </h2>

          <input
            type="text"
            value={rucInput}
            onChange={(e) => setRucInput(e.target.value)}
            placeholder="Buscar empresa por RUC"
            className="w-full sm:w-72 border border-gray-200 rounded-lg px-3 py-2 text-sm mb-6"
          />

          {!empresaBusqueda && !rucMensaje ? (
            <p className="text-gray-500 text-sm">
              Busca una empresa por RUC para gestionar sus trámites.
            </p>
          ) : rucMensaje ? (
            <p className="text-gray-600 text-sm">{rucMensaje}</p>
          ) : empresaBusqueda ? (
            <>
              <p className="text-sm text-gray-500 mb-3">
                Empresa:{" "}
                <span className="font-medium text-gray-900">
                  {empresaBusqueda.razon_social ?? `RUC ${empresaBusqueda.ruc}`}
                </span>{" "}
                · {completados} de 4 completados
              </p>
              <div className="h-1.5 rounded-full bg-gray-100 w-full overflow-hidden mb-6">
                <div
                  className="h-1.5 rounded-full bg-brand-500"
                  style={{ width: `${porcentajeAvance}%` }}
                />
              </div>

              {tramitesError ? (
                <p className="text-red-600 text-sm">{tramitesError}</p>
              ) : (
                <ul className="space-y-3">
                  {TRAMITES_DEFINICION.map((def) => {
                    const tramite = tramites.find((t) => t.tipo === def.tipo);
                    const completado = tramite?.estado === "completado";

                    return (
                      <li
                        key={def.tipo}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-start gap-3">
                          {completado ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {def.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {def.descripcion}
                            </p>
                          </div>
                        </div>

                        {!tramite ? (
                          <button
                            onClick={() => alCrearTramite(def.tipo)}
                            className="text-sm px-3 py-1.5 rounded-full border border-brand-200 text-brand-700 hover:bg-brand-50 transition-colors shrink-0"
                          >
                            Crear trámite
                          </button>
                        ) : completado ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 shrink-0">
                            Completado
                          </span>
                        ) : (
                          <button
                            onClick={() => alCompletarTramite(tramite.id)}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors shrink-0"
                          >
                            Pendiente
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-500 text-white"
          : "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}