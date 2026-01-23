"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { NavUser } from "./nav-user";
// import { ClipboardList, Contact, LampDesk, LayoutGrid, NotebookPen, Paintbrush, Wallet, Warehouse } from "lucide-react";

const Menu = () => {
  const { data: session, status } = useSession();

  const user = {
    name: session?.user.Nome!,
    email: "m@example.com",
    avatar: "",
  };
  return (
    <nav className="bg-sidebar text-sidebar-foreground fixed top-0 left-0 w-full shadow-md px-6 py-4 border-b z-50 flex items-center ">
      {/* Logo na esquerda */}
      <div className="text-lg font-bold w-50 mr-6 h-10 ">
        <img
          src="/logoPartnerHorizontal.png"
          alt="Logo versa Partner"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Menu alinhado próximo à logo */}
      {/* <ul className="md:flex md:gap-6 md:ml-6 font-bold ">
        <li><a href="#" className="flex items-center gap-1"><Contact size={24} /> Cadastros</a></li>
        <li><a href="#" className="flex items-center gap-1"><NotebookPen size={24} />Vendas</a></li>
        <li><a href="#" className="flex items-center gap-1"><ClipboardList size={24} />Controladoria</a></li>
        <li><a href="#" className="flex items-center gap-1"><Warehouse size={24} />Estoque</a></li>
        <li><a href="#" className="flex items-center gap-1"><Wallet size={24} />Financeiro</a></li>
        <li><a href="#" className="flex items-center gap-1"><LampDesk size={24} />Editorial</a></li>
        <li><a href="#" className="flex items-center gap-1"><Paintbrush size={24} />Serviço</a></li>
        <li><a href="#" className="flex items-center gap-1"><LayoutGrid size={24} />Aplicativos</a></li>
      </ul> */}

      {/* Ícones no canto direito */}
      {status === "authenticated" ? (
        <div className="flex items-center gap-3 ml-auto">
          <NavUser
            user={{
              name: session?.user?.Nome!,
              email: session?.user?.Email!,
              avatar: "/defaultAvatar.png",
            }}
          />
          <ModeToggle />
        </div>
      ) : (
        <div className="flex space-x-2 items-center pr-2">
          <Link
            href="/login"
            className="text-zinc-900 hover:text-zinc-400 transition-colors"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Menu;
