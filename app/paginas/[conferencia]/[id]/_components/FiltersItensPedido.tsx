"use client";
import FilterEmbalagem from "@/app/Combobox/Filters/FilterEmbalagem";
import { formatarData } from "@/app/functions/functions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConferencia } from "./ConferenciaContext";
import { Indseparacao } from "@/DTO/ConferenciaListaDto";

interface Props {
  params: { id: string };
}

export const FiltersItensPedido = ({ params }: Props) => {
  const { conferencia, codembalagem, setCodembalagem, setEmbalagem } =
    useConferencia();

  const FieldSkeleton = () => (
    <div className="flex flex-col p-2 w-full">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h7 w-full" />
    </div>
  );

  return (
    <Card className="min-h-56 p-0">
      <CardContent>
        <Tabs defaultValue="pedido">
          <div className="flex flex-row justify-between py-2 self-center w-full">
            <TabsList>
              <TabsTrigger value="pedido" className="font-medium w-full">
                Pedido
              </TabsTrigger>
              <TabsTrigger value="destinatario" className="font-medium w-full">
                Destinatário
              </TabsTrigger>
              <TabsTrigger value="transporte" className="font-medium w-full">
                Transporte
              </TabsTrigger>
              <TabsTrigger value="fiscal" className="font-medium w-full">
                Fiscal
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="pedido" className="lg:min-h-40 min-h-auto">
            {conferencia ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 w-full space-x-2 pb-2">
                <div className="lg:col-span-4 flex flex-col">
                  <Label className="py-2" htmlFor="txtNomcliente">
                    Cliente:
                  </Label>
                  <Input
                    id="txtNomcliente"
                    className="h7 w-full bg-gray-200"
                    value={conferencia.Nomcliente}
                    readOnly
                  />
                </div>
                <div className="lg:col-span-2 flex flex-col ">
                  <Label className="py-2" htmlFor="datConferencia">
                    Data Conferência:
                  </Label>
                  <Input
                    id="datConferencia"
                    className="h7 w-full bg-gray-200"
                    value={formatarData(conferencia.Datconferencia)}
                    readOnly
                  />
                </div>
                <div className="lg:col-span-2 flex flex-col ">
                  <Label className="py-2" htmlFor="txtUsuario">
                    Usuário:
                  </Label>
                  <Input
                    id="txtUsuario"
                    className="h7 w-full bg-gray-200"
                    value={conferencia.Nomusuario}
                    readOnly
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col">
                  <Label className="py-2" htmlFor="txtSituacao">
                    Situação:
                  </Label>
                  <Input
                    id="txtSituacao"
                    className="h7 w-full bg-gray-200"
                    value={conferencia.Situacaoconferencia}
                    readOnly
                  />
                </div>

                <div className="lg:col-span-4 flex flex-col ">
                  <Label className="py-2" htmlFor="txtOperacao">
                    Operação:
                  </Label>
                  <Input
                    id="txtOperacao"
                    className="h7 w-full bg-gray-200"
                    value={conferencia.Nomoperacao}
                    readOnly
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col">
                  <Label className="py-2" htmlFor="txtTransportadora">
                    Transportadora:
                  </Label>
                  <Input
                    id="txtTransportadora"
                    className="h7 w-full bg-gray-200"
                    value={conferencia.Nomtransportadora}
                    readOnly
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col ">
                  <FilterEmbalagem
                    classNameCombo="w-[20] h8 "
                    classNameLista="w-[20]"
                    value={codembalagem == "" ? -1 : parseInt(codembalagem)}
                    onSelect={setCodembalagem}
                    codconferencia={conferencia.Codconferencia}
                    setEmbalagem={setEmbalagem}
                    disabled={
                      conferencia.Indseparacao === Indseparacao.Finalizado
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-2 w-full">
                <div className="lg:col-span-4">
                  <FieldSkeleton />
                </div>
                <div className="lg:col-span-2">
                  <FieldSkeleton />
                </div>
                <div className="lg:col-span-2">
                  <FieldSkeleton />
                </div>
                <div className="lg:col-span-4">
                  <FieldSkeleton />
                </div>
                <div className="lg:col-span-4">
                  <FieldSkeleton />
                </div>
                <div className="lg:col-span-4">
                  <FieldSkeleton />
                </div>
                <div className="lg:col-span-4">
                  <FieldSkeleton />
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="destinatario" className="min-h-50">
            Destinatário
          </TabsContent>
          <TabsContent value="transporte" className="min-h-50">
            Transporte
          </TabsContent>
          <TabsContent value="fiscal" className="min-h-50">
            Fiscal
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
