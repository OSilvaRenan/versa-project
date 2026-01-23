"use client";
import LoginForm from "@/components/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/paginas/conferencia");
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <LoginForm />
    </main>
  );
}