"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Building2, ClipboardList } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/empresas", label: "Empresas", icon: Building2 },
  { href: "/formalizacion", label: "Formalización", icon: ClipboardList },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-[#F0F3FA]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo.jpg" alt="MYPE Flow" width={40} height={40} />
            <span className="font-poppins font-extrabold text-lg tracking-tight">
                <span className="text-[#324F7C]">MYPE</span>{" "}
                <span className="text-[#5E88C0]">FLOW</span>
            </span>
          </Link>
        </div>

        {pathname !== "/" && (
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-brand-100 text-brand-700"
                      : "text-gray-600 hover:text-brand-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 px-3 py-1.5 rounded-full transition-colors hover:bg-[#F8FAFD] hover:text-gray-900"
          >
            Ingresar
          </Link>
          <Link
            href="/formalizacion"
            className="bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            Comenzar diagnóstico
          </Link>
        </nav>
      </div>
    </header>
  );
}