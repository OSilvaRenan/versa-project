"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BuscarAutor, CadastroAutor } from "@/dbs/AutorDb";
import { useSearchParams } from "next/navigation";
import { AutorDTO } from "@/DTO/AutorDTO";
import { InputText } from "@/components/Inputs/InputText";

const autorSchema = z.object({
  cod: z.string().optional(),
  nomautor: z.string().min(1, "O nome do autor é obrigatório"),
});

type AutorFormValues = z.infer<typeof autorSchema>;

export default function AutorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Captura o ID da URL se for uma edição
  const codautor = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AutorFormValues>({
    resolver: zodResolver(autorSchema),
    defaultValues: {
      cod: "",
      nomautor: "",
    },
  });

  useEffect(() => {
    async function carregarAutor() {
      if (!codautor) return;

      try {
        setIsLoading(true);

        const response = await BuscarAutor(codautor.toString());

        if (response) {
          const codigo = response.Codautor ?? codautor;
          const nome = response.Nomautor ?? "";

          form.reset({
            cod: String(codigo),
            nomautor: nome,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do autor:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarAutor();
  }, [codautor, form]);

  async function onSubmit(values: AutorFormValues) {
    try {
      setIsLoading(true);

      const request: AutorDTO = {
        Codautor: Number(values.cod),
        Nomautor: values.nomautor,
      };

      await CadastroAutor(request);

      router.back();
    } catch (error) {
      console.error("Erro ao salvar autor:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleVoltar() {
    router.back();
  }

  return (
    <div className="w-full p-6 space-y-6">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-bold">Cadastro de Autor</h1>
        <Button
          type="button"
          variant="secondary"
          onClick={handleVoltar}
          disabled={isLoading}
        >
          Voltar
        </Button>
      </div>

      <div className="w-full p-6 border rounded-lg shadow-sm bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-4 max-w-lg">
              {/* Campo Código */}
              <FormField
                control={form.control}
                name="cod"
                render={({ field, fieldState }) => (
                  <InputText
                    id="cod"
                    label="Código"
                    readOnly
                    tabIndex={-1}
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />

              {/* Campo Nome do Autor */}
              <FormField
                control={form.control}
                name="nomautor"
                render={({ field, fieldState }) => (
                  <InputText
                    id="nomautor"
                    label="Nome"
                    placeholder="Informe o nome do autor"
                    disabled={isLoading}
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Botões Voltar e Salvar */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="submit" disabled={isLoading}>
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}