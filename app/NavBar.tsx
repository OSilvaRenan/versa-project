"use client";

import DadosUsuario from "@/components/DadosUsuario";
import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "@/components/nav-user";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-sidebar-foreground text-sidebar-foreground fixed top-0 left-0 w-full shadow-md px-6 py-4 border-b z-50 flex items-center ">
      {/* <div className='flex items-center justify-start '>
                <MobileNav />
                <div className='flex space-x-6 lg:p-2 pl-2'>
                    <Link href="/paginas/home" className='text-zinc-900 font-bold hover:text-zinc-400 transition-colors'>
                        Logo
                    </Link>
                    <ul className='flex'>
                        <li>
                            <Link href="/paginas/home" className='text-zinc-900 hover:text-zinc-400 transition-colors'>
                                Inicio
                            </Link>
                        </li>
                    </ul>
                </div>
            </div> */}

      <div className="text-lg font-bold w-50 mr-6 h-10 ">
        <img
          src="/logoPartnerHorizontal.png"
          alt="Logo versa Partner"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <NavUser
          user={{
            name: session?.user?.Nome!,
            email: session?.user?.Email!,
            avatar: "/defaultAvatar.png",
          }}
        />
        {/* <ModeToggle /> */}
      </div>

      {status === "authenticated" ? (
        <DadosUsuario nomeUsuario={session?.user?.Nome ?? "Usuário"} />
      ) : (
        <div className="flex space-x-2 items-center pr-2">
          <Link
            href="/"
            className="text-zinc-900 hover:text-zinc-400 transition-colors"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
