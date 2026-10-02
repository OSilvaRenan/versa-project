import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ListaEditorasGrupo from "../../Combobox/ListaEditorasGrupo";
import { EditoraDTO } from "./EditoraDTO";
import { useState, useEffect } from "react";
import { CboData } from "@/app/Combobox/CboEstatica";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { InputText } from "@/components/Inputs/InputText";
import { CadastroEditora } from "@/dbs/EditoraDb";

interface PropsForm {
  item?: EditoraDTO | null;
  className?: React.ComponentProps<"form">;
  onOpenChange: () => void;
}

// Schema de validação Zod
const editoraSchema = z.object({
  Codeditora: z.string().optional(),
  Nomeditora: z.string().min(1, "O nome da editora é obrigatório"),
});

type FormEditoraValues = z.infer<typeof editoraSchema>;

export function FormEditora({ item, className, onOpenChange }: PropsForm) {
  const isEditing = Boolean(item?.Codeditora);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormEditoraValues>({
    resolver: zodResolver(editoraSchema),
    defaultValues: {
      Codeditora: item?.Codeditora?.toString() || "",
      Nomeditora: item?.Nomeditora || "",
    },
  });

  const [itemSelecionado, setItemSelecionado] = useState<CboData>({
    Value: item?.Codeditoragrupo?.toString() || "-1",
    Description: item?.Nomeditoragrupo || "",
  });

  const [data, setData] = useState<CboData[]>([]);

  const carregarOpcoes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}api/produto/editoragrupo`
      );
      const dadosTransformados: CboData[] = response.data.Dados.map(
        (item: EditoraDTO) => ({
          Value: item.Codeditoragrupo.toString(),
          Description: item.Nomeditoragrupo,
        })
      );
      setData(dadosTransformados);
    } catch (erro) {
      console.error("Erro ao carregar opções:", erro);
    }
  };

  useEffect(() => {
    carregarOpcoes();
    if (item) {
      form.reset({
        Codeditora: item?.Codeditora?.toString() || "",
        Nomeditora: item?.Nomeditora || "",
      });
      setItemSelecionado({
        Value: item?.Codeditoragrupo?.toString() || "-1",
        Description: item?.Nomeditoragrupo || "",
      });
    }
  }, [item, form]);

  const PostEditora = async (values: FormEditoraValues) => {
    try {
      setIsLoading(true);
      const request: EditoraDTO = {
        Codeditora: item?.Codeditora ?? 0,
        Nomeditora: values.Nomeditora,
        Codeditoragrupo:
          itemSelecionado.Value !== "-1" ? Number(itemSelecionado.Value) : 0,
        Nomeditoragrupo: itemSelecionado.Description,
      };

      await CadastroEditora(request);

      onOpenChange();
    } catch (error) {
      console.error("Erro ao salvar editora:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormEditoraValues) => {
    PostEditora(data);
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          {/* Código */}
          <FormField
            control={form.control}
            name="Codeditora"
            render={({ field, fieldState }) => (
              <InputText
                id="codeditora"
                label="Código"
                readOnly
                tabIndex={-1}
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />

          {/* Nome */}
          <FormField
            control={form.control}
            name="Nomeditora"
            render={({ field, fieldState }) => (
              <InputText
                id="nomeditora"
                label="Nome"
                placeholder="Informe o nome da editora"
                disabled={isLoading}
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />

          {/* Editora Grupo */}
          <div className="flex flex-col gap-2">
            <ListaEditorasGrupo
              classNameCombo="h-9 bg-card"
              classNameLista="h-9 bg-card"
              value={itemSelecionado}
              onChange={setItemSelecionado}
              id="Codeditoragrupo"
            />
          </div>
        </div>

        {/* Rodapé com Botões */}
        <div className="flex flex-col gap-3 pt-6 border-t mt-2">
          <div className="flex justify-end items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenChange}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isEditing ? "Atualizar Editora" : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}