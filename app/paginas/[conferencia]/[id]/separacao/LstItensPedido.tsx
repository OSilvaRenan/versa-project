import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { separacaoResponse } from '@/DTO/SeparacaoDTO'

interface Props {
  itens: separacaoResponse[]
  loading: boolean;
}

export const LstItensPedido = ({ itens, loading }: Props) => {
  return (
    <div className="py-5">
      <Card className="min-h-56 pt-2">
        <div className="flex w-full flex-row items-center justify-between">
          <span className="text-xl font-semibold pl-4 md:pl-8">Itens deste pedido</span>
        </div>
        <CardContent className='px-2 md:px-6'>
          <div className="mx-auto ">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 md:h-10 w-full bg-slate-200" />
                <Skeleton className="h-20 md:h-10 w-full bg-slate-200" />
                <Skeleton className="h-20 md:h-10 w-full bg-slate-200" />
              </div>
            ) : itens.length === 0 ? (
              <span className="text-muted-foreground pl-4">Nenhum item encontrado</span>
            ) : (
              <>
                {/* VERSÃO MOBILE: Lista de Cards (Oculta em md/lg) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {itens.map((item) => (
                    <div key={item.Codproduto} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start border-b pb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Cód: {item.Codproduto}</span>
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                          Loc: {item.Localizacao}
                        </span>
                      </div>
                      
                      <div className="py-1">
                        <p className="text-sm font-bold leading-tight">{item.Nomproduto}</p>
                        <p className="text-xs text-muted-foreground mt-1">ISBN: {item.Isbn}</p>
                      </div>

                      <div className="flex justify-between pt-2 border-t">
                        <div className="text-center">
                          <p className="text-[10px] uppercase text-slate-400">Qtd Pedida</p>
                          <p className="text-sm font-semibold">{item.Quantidade}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] uppercase text-slate-400">Qtd Separada</p>
                          <p className={`text-sm font-bold ${item.Qtdseparada === item.Quantidade ? 'text-green-600' : 'text-red-600'}`}>
                            {item.Qtdseparada}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* VERSÃO DESKTOP: Tabela (Oculta em mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Código</TableHead>
                        <TableHead>Isbn</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-center">Qtd Separada</TableHead>
                        <TableHead>Localização</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itens.map((item) => (
                        <TableRow key={item.Codproduto}>
                          <TableCell className="font-medium">{item.Codproduto}</TableCell>
                          <TableCell className="font-medium text-xs">{item.Isbn}</TableCell>
                          <TableCell className="font-medium max-w-xs truncate">{item.Nomproduto}</TableCell>
                          <TableCell className="font-medium text-center">{item.Quantidade}</TableCell>
                          <TableCell className="font-medium text-center">{item.Qtdseparada}</TableCell>
                          <TableCell className="font-medium">{item.Localizacao}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}