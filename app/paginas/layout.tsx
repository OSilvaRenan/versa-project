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
           <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
           <p className="text-zinc-400 text-[11px] font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <SidebarProvider>
      <div className="flex bg-background min-h-screen w-full overflow-hidden text-xs">
        <Menu />
        <Sidebar>
          <div className="h-full w-full lg:p-2 ">
            {children}
          </div>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}