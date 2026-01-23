"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const schema = yup.object({
  nome: yup.string().required("Este campo é obrigatório"),
  senha: yup.string().required("Este campo é obrigatório"),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
        setApiError("Erro na autenticação. Verifique sua conexão.");
    }
  }, [searchParams]);

  async function logar(data: { nome: string; senha: string }) {
    setApiError(null);
    setIsLoading(true); 

    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false, 
      });

      if (result?.error) {
        setIsLoading(false);
        
        if (result.error === "fetch failed" || result.status === 500) {
          setApiError("A API parece estar offline. Tente novamente mais tarde.");
        } else {
          setApiError("Usuário ou senha inválidos.");
        }
      } else if (result?.ok) {
        router.push("/paginas/home");
      }
    } catch (err) {
      setIsLoading(false);
      setApiError("Erro inesperado ao conectar com o servidor.");
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-card text-card-foreground border border-border rounded-2xl shadow-lg transition-all duration-200">
      <div className="text-center space-y-2 flex flex-col items-center">
        <Image
          src="/logoPartnerHorizontal.png"
          alt="Logo Dark"
          width={200}
          height={50}
          priority
          className="hidden dark:block mb-4 object-contain"
        />

        <Image
          src="/logoHorizontal.jpg"
          alt="Logo Light"
          width={200}
          height={50}
          priority
          className="block dark:hidden mb-4 object-contain"
        />

        <h2 className="text-3xl font-bold tracking-tight">Bem-vindo</h2>
      </div>

      <form onSubmit={handleSubmit(logar)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="ml-1">Usuário</Label>
            <Input
              id="name"
              {...register("nome")}
              className="bg-background border-input focus-visible:ring-orange-500 h-11 transition-all"
              placeholder="Seu usuário"
              disabled={isLoading}
            />
            {errors.nome && (
              <p className="text-destructive text-xs mt-1 ml-1">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="ml-1">Senha</Label>
            <Input
              type="password"
              id="password"
              {...register("senha")}
              className="bg-background border-input focus-visible:ring-orange-500 h-11 transition-all"
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.senha && (
              <p className="text-destructive text-xs mt-1 ml-1">{errors.senha.message}</p>
            )}
          </div>
        </div>

        {apiError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm text-center animate-in fade-in zoom-in duration-300">
            {apiError}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Logar"
          )}
        </Button>
      </form>
    </div>
  );
}