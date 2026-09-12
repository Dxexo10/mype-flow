"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/empresas", label: "Empresas" },
  { href: "/formalizacion", label: "Formalización" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-[#F0F3FA]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src="/Logo.jpg" alt="MYPE Flow" width={40} height={40} />
            <span className="font-poppins font-extrabold text-lg tracking-tight">
                <span className="text-[#324F7C]">MYPE</span>{" "}
                <span className="text-[#5E88C0]">FLOW</span>
            </span>
            </div>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-brand-100 text-brand-700"
                    : "text-gray-600 hover:text-brand-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm text-gray-600 px-3 py-1.5 rounded-full transition-colors hover:bg-[#F8FAFD] hover:text-gray-900">
            Ingresar
          </a>
          <button className="bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
            Comenzar diagnóstico
          </button>
        </nav>
      </div>
    </header>
  );
}