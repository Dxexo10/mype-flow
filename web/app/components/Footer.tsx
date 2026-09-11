import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-[#F8FAFD] py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <div className="flex items-center gap-2">
                <Image src="/Logo.jpg" alt="MYPE Flow" width={35} height={35} />
            <span className="font-poppins font-extrabold tracking-tight">
                <span className="text-[#324F7C]">MYPE</span>{" "}
                <span className="text-[#5E88C0]">FLOW</span>
            </span>
            </div>
        </div>
        <span>Datos de demostración</span>
      </div>
    </footer>
  );
}