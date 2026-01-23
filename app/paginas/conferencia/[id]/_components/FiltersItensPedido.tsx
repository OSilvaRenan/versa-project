"use client";
import FilterEmbalagem from "@/app/Combobox/Filters/FilterEmbalagem";
import { formatarData } from "@/app/functions/functions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConferencia } from "./ConferenciaContext";

interface Props {
  params: { id: string };
}

export const FiltersItensPedido = ({ params }: Props) => {
  const { conferencia, codembalagem, setCodembalagem, setEmbalagem } =
    useConferencia();

  const FieldSkeleton = () => (
    <div className="flex flex-col p-2 w-full">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-8 w-full" />
    </div>
  );

  return (
    <Card className="min-h-56 p-0">
      <CardContent>
        <Tabs defaultValue="pedido">
          <div className=" flex flex-row justify-between py-2 self-center h-8 w-full">
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
          <TabsContent
            value="pedido"
            className="lg:min-h-[200px] lg:h-[200px] lg:max-h-[200px] min-h-auto"
          >
            {conferencia ? (
              <div className="flex flex-wrap items-start justify-start">
                <div className="flex flex-wrap w-full">
                  <div className="flex flex-col p-2 w-full lg:w-1/4">
                    <Label className="py-2" htmlFor="txtNomcliente">
                      Cliente:
                    </Label>
                    <Input
                      type="text"
                      id="txtNomcliente"
                      className="h-8 w-full bg-gray-200"
                      value={conferencia.Nomcliente}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col p-2 w-full lg:w-1/6">
                    <Label className="py-2" htmlFor="datConferencia">
                      Data Conferência:
                    </Label>
                    <Input
                      type="text"
                      id="datConferencia"
                      className="h-8 w-full bg-gray-200"
                      value={formatarData(conferencia.Datconferencia)}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col p-2 w-full lg:w-1/5">
                    <Label className="py-2" htmlFor="txtUsuario">
                      Usuario:
                    </Label>
                    <Input
                      type="text"
                      id="txtUsuario"
                      className="h-8 w-full bg-gray-200"
                      value={conferencia.Nomusuario}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col p-2 w-full lg:w-1/3">
                    <Label className="py-2" htmlFor="txtTransportadora">
                      Transportadora:
                    </Label>
                    <Input
                      id="txtTransportadora"
                      className="h-8 w-full bg-gray-200"
                      value={conferencia.Nomtransportadora}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col p-2 w-full lg:w-1/3">
                    <Label className="py-2" htmlFor="txtOperacao">
                      Operação:
                    </Label>
                    <Input
                      type="text"
                      id="txtOperacao"
                      className="h-8 w-full bg-gray-200"
                      value={conferencia.Nomoperacao}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col p-2 w-full lg:w-1/3">
                    <Label className="py-2" htmlFor="txtSituacao">
                      Situação:
                    </Label>
                    <Input
                      type="text"
                      id="txtSituacao"
                      className="h-8 w-full bg-gray-200"
                      value={conferencia.Situacaoconferencia}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col ">
                    <FilterEmbalagem
                      classNameCombo="lg:w-[170px] w-[160px] h-6 py-0 "
                      classNameLista="lg:w-[250px] p-0 w-screen"
                      value={codembalagem == "" ? -1 : parseInt(codembalagem)}
                      onSelect={setCodembalagem}
                      codconferencia={conferencia.Codconferencia}
                      setEmbalagem={setEmbalagem}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap w-full">
                <div className="w-full lg:w-1/4">
                  <FieldSkeleton />
                </div>
                <div className="w-full lg:w-1/6">
                  <FieldSkeleton />
                </div>
                <div className="w-full lg:w-1/5">
                  <FieldSkeleton />
                </div>
                <div className="w-full lg:w-1/3">
                  <FieldSkeleton />
                </div>
                <div className="w-full lg:w-1/3">
                  <FieldSkeleton />
                </div>
                <div className="w-full lg:w-1/3">
                  <FieldSkeleton />
                </div>
                <div className="w-full lg:w-1/6">
                  <FieldSkeleton />
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="destinatario"
            className="min-h-[200px] h-[200px] max-h-[200px]"
          >
            Destinatário
          </TabsContent>
          <TabsContent
            value="transporte"
            className="min-h-[200px] h-[200px] max-h-[200px]"
          >
            Transporte
          </TabsContent>
          <TabsContent
            value="fiscal"
            className="min-h-[200px] h-[200px] max-h-[200px]"
          >
            Fiscal
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};