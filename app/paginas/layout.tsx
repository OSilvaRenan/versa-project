"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Menu from "@/components/menu";
import Sidebar from "@/components/sidebar";

export default function PaginasLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);


  if (status === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
           <p className="text-zinc-400 text-sm font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-950">
        <Menu />
        <Sidebar>{children}</Sidebar>
      </div>
    </SidebarProvider>
  );
}