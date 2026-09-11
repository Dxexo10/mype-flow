export default function Header() {
  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">
            M
          </div>
          <span className="font-bold text-lg text-gray-900">
            MYPE <span className="text-brand-500">FLOW</span>
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm text-gray-600 hover:text-brand-700">
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