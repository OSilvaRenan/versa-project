import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useConferencia } from "./ConferenciaContext";
import {
  RegistraCaixaConferencia,
  RegistraLeitura,
  RegistraPesoCaixa,
} from "@/dbs/ConferenciaDb";
import { ObtemCodigoProduto } from "@/dbs/ProdutoDb";
import { toast } from "@/components/ui/use-toast";
import {
  RegistraCaixaRequest,
  RegistraPesoRequest,
  RegistraLeituraRequest,
} from "@/DTO/ConferenciaDTO";

export function DrawerConfereProduto() {
  const [open, setOpen] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [peso, setPeso] = useState("");
  const [habilitaFechamentoCaixa, setHabilitaFechamentoCaixa] = useState(false);
  const [habilitaQuantidade, setHabilitaQuantidade] = useState(false);

  const handlePesoChange = (e: any) => {
    const valor = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(valor) && valor.length <= 5) {
      setPeso(valor);
    }
  };

  const {
    RegistraCaixa,
    RegistraLeituraAvulsaConferencia,
    RegistraLeituraConferencia,
    conferencia,
    embalagem,
    setCaixa,
    caixa,
    itensLidosLocal,
    produtosConferencia,
    setLoading,
    FinalizaConferencia,
  } = useConferencia();

  const FechaConferencia = async () => {
    FinalizaConferencia();
    OpenDialog();
  };

  const RegistrarCaixa = async () => {
    if (
      conferencia != null &&
      conferencia.Codconferencia > 0 &&
      conferencia.Codempresa > 0
    ) {
      const request: RegistraCaixaRequest = {
        Codempresa: conferencia.Codempresa,
        Nrocaixa: caixa.Nrocaixa + 1,
        Codembalagem: parseInt(embalagem.Value),
      };

      const seqconferenciacaixa = await RegistraCaixaConferencia(
        conferencia.Codconferencia,
        request,
      );

      if (seqconferenciacaixa != null && seqconferenciacaixa > 0) {
        RegistraCaixa(request.Nrocaixa, seqconferenciacaixa);
      }
    }
  };

  const RegistraCaixaPeso = async () => {
    try {
      setLoading(true);

      const request: RegistraPesoRequest = {
        Pesobruto: peso,
        PesoLiquido: caixa.PesoLiquido,
      };

      const seqconferenciacaixa = await RegistraPesoCaixa(
        conferencia!.Codconferencia,
        caixa.Nrocaixa,
        request,
      );

      if (seqconferenciacaixa != null && seqconferenciacaixa > 0) {
        setCaixa({ ...caixa, Seqconferenciacaixa: seqconferenciacaixa });
        setPeso("");
        toast({
          variant: "default",
          description: "Caixa Fechada!",
        });
        HabilitaPeso();
        RegistrarCaixa();
      }
    } catch (error) {
      toast({
        variant: "default",
        description: "Erro ao atualizar a quantidade separada: " + error,
      });
    }
  };

  const OpenDialog = () => {
    setOpen(!open);
    if (open == false) {
      setHabilitaQuantidade(false);
      setHabilitaFechamentoCaixa(false);
    }
  };

  const HabilitaPeso = () => {
    setHabilitaFechamentoCaixa(!habilitaFechamentoCaixa);
    setHabilitaQuantidade(false);
  };

  const HabilitaQuantidade = () => {
    setHabilitaQuantidade(!habilitaQuantidade);
    setHabilitaFechamentoCaixa(false);
  };

  const RegistraLeituraAvulsa = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (habilitaQuantidade) {
      if (quantidade <= 0) {
        setCaixa({
          ...caixa,
          Nrocaixa: 1,
          Codembalagem: parseInt(embalagem.Value),
        });
        toast({
          variant: "default",
          description: "Informe a quantidade!",
        });
      }
      HabilitaQuantidade();
      return;
    }

    if (habilitaFechamentoCaixa) {
      if (peso !== "") {
        await RegistraCaixaPeso();
        await RegistrarCaixa();
      } else {
        toast({
          variant: "destructive",
          description: "Insira o peso!",
        });
      }
      return;
    }

    try {
      setLoading(true);

      let itemEncontrado = itensLidosLocal.find((p) => p.Isbn === isbn);

      if (!itemEncontrado?.Codproduto) {
        const codproduto = await ObtemCodigoProduto(isbn);
        if (codproduto > 0) {
          if (!itemEncontrado) {
            itemEncontrado = { Isbn: isbn, Codproduto: codproduto } as any;
          } else {
            itemEncontrado.Codproduto = codproduto;
          }
        }
      }

      if (
        conferencia &&
        conferencia.Codconferencia > 0 &&
        itemEncontrado?.Codproduto
      ) {
        const request: RegistraLeituraRequest = {
          Codempresa: conferencia.Codempresa,
          Nrocaixa: caixa.Nrocaixa,
          Codembalagem: parseInt(embalagem.Value),
          Codproduto: itemEncontrado.Codproduto,
          Quantidade: quantidade,
        };

        const seqconferenciaitem = await RegistraLeitura(
          conferencia.Codconferencia,
          request,
        );

        RegistraLeituraAvulsaConferencia(
          seqconferenciaitem,
          itemEncontrado,
          quantidade,
          isbn,
        );

        setQuantidade(1);
        setIsbn("");
      }

      const possuiItensPendentes = produtosConferencia.some(
        (item) => item.Qtdconferida < item.Quantidade,
      );

      if (!possuiItensPendentes) {
        if (peso !== "" && parseFloat(peso) > 0) {
          FinalizaConferencia();
        } else {
          HabilitaPeso();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Erro ao registrar leitura avulsa: " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  const AtualizaQtdSeparada = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (habilitaQuantidade) {
      if (quantidade <= 0) {
        setCaixa({
          Nrocaixa: 1,
          Codembalagem: parseInt(embalagem.Value),
          Dscembalagem: embalagem.Description,
          Seqconferenciacaixa: caixa.Seqconferenciacaixa,
          PesoBruto: 0,
          PesoLiquido: 0,
        });
        toast({ variant: "default", description: "Informe a quantidade!" });
        return;
      }
      HabilitaQuantidade();
      return;
    }

    if (habilitaFechamentoCaixa) {
      const pesoValido = peso !== "" && parseFloat(peso) > 0;

      if (!pesoValido) {
        toast({ variant: "destructive", description: "Insira o peso!" });
        return;
      }

      RegistraCaixaPeso();

      const possuiItensPendentes = produtosConferencia.some(
        (item) => item.Qtdconferida < item.Quantidade,
      );

      if (!possuiItensPendentes) {
        FechaConferencia();
      }
      return;
    }

    const itemEncontrado = produtosConferencia.find(
      (item) => item.Isbn.trim() === isbn.trim(),
    );
    setIsbn("");

    if (!itemEncontrado) {
      toast({ variant: "destructive", description: "Item não encontrado!" });
      return;
    }

    if (itemEncontrado.Quantidade <= itemEncontrado.Qtdconferida) {
      toast({ variant: "destructive", description: "Item já lido!" });
      return;
    }

    if (quantidade + itemEncontrado.Qtdconferida > itemEncontrado.Quantidade) {
      toast({
        variant: "destructive",
        description: "A quantidade selecionada excede a quantidade do pedido!",
      });
      return;
    }

    if (quantidade <= 0) {
      toast({
        variant: "destructive",
        description: "Não é possível conferir a quantidade!",
      });
      return;
    }

    try {
      setLoading(true);
      itemEncontrado.Qtdconferida += quantidade;

      const request: RegistraLeituraRequest = {
        Codempresa: itemEncontrado.Codempresa,
        Nrocaixa: caixa.Nrocaixa,
        Codembalagem: parseInt(embalagem.Value),
        Codproduto: itemEncontrado.Codproduto,
        Quantidade: quantidade,
      };

      const seqconferenciaitem = await RegistraLeitura(
        conferencia!.Codconferencia,
        request,
      );
      RegistraLeituraConferencia(
        seqconferenciaitem,
        itemEncontrado,
        quantidade,
      );
      setQuantidade(1);

      const aindaPossuiItensPendentes = produtosConferencia.some(
        (item) => item.Qtdconferida < item.Quantidade,
      );

      if (!aindaPossuiItensPendentes) {
        const pesoInformado = peso !== "" && parseFloat(peso) > 0;
        if (pesoInformado) {
          FechaConferencia();
        } else {
          HabilitaPeso();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={OpenDialog} modal={true}>
        <DialogTrigger asChild>
          <Button className="bg-primary ml-auto mr-4 text-xs md:text-sm">
            Realizar Leitura
          </Button>
        </DialogTrigger>

        <DialogContent
          className="w-[95vw] max-w-106.25 rounded-lg p-4 md:p-6"
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg md:text-xl">
              Conferência de Produto
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <form
            onSubmit={
              conferencia != undefined && conferencia.Indavulso == 0
                ? AtualizaQtdSeparada
                : RegistraLeituraAvulsa
            }
            className="grid items-start gap-4 py-2"
          >
            {!habilitaQuantidade && !habilitaFechamentoCaixa && (
              <div className="grid gap-2">
                <Label htmlFor="txtIsbn" className="text-sm font-medium">
                  ISBN:
                </Label>
                <Input
                  type="text"
                  id="txtIsbn"
                  autoFocus={true}
                  required
                  value={isbn}
                  className="h-10"
                  onChange={(e) => setIsbn(e.target.value)}
                  minLength={10}
                  maxLength={13}
                />
                
              </div>
            )}

            {habilitaQuantidade && (
              <div className="grid gap-2">
                <Label htmlFor="txtQuantidade" className="text-sm font-medium ">
                  Quantidade:
                </Label>
                <Input
                  type="number"
                  id="txtQuantidade"
                  autoFocus={true}
                  required
                  value={quantidade}
                  className="h-10"
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.length > 7) {
                      input.value = input.value.slice(0, 7);
                    }
                    setQuantidade(parseInt(input.value));
                  }}
                />
              </div>
            )}

            {habilitaFechamentoCaixa && (
              <div className="grid gap-2">
                <Label htmlFor="txtPeso" className="text-sm font-medium">
                  Peso:
                </Label>
                <Input
                  type="text"
                  id="txtPeso"
                  autoFocus={true}
                  required
                  value={peso}
                  className="h-10"
                  onChange={handlePesoChange}
                />
              </div>
            )}

            <div className="grid pt-2">
              <Button
                id="btnConfirmar"
                type="submit"
                className="sm:text-xs h-11 md:h-10"
              >
                Confirmar
              </Button>
            </div>

            <div className="flex flex-row gap-2 items-center justify-between pt-2">
              <Button
                id="btnQuantidade"
                className="flex-1 text-[10px] sm:text-xs h-11 md:h-10"
                type="button"
                onClick={HabilitaQuantidade}
              >
                Quantidade
              </Button>
              <Button
                id="btnFecharCaixa"
                className="flex-1 text-[10px] sm:text-xs h-11 md:h-10"
                type="button"
                onClick={HabilitaPeso}
              >
                Fechar Caixa
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
