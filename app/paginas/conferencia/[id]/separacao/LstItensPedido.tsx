import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { separacaoResponse } from '@/DTO/SeparacaoDTO'

interface Props {
    itens: separacaoResponse[]
    loading: boolean;
}

export const LstItensPedido = ({ itens, loading }: Props) => {
    return (
        <div className='py-5' >
            <Card className="min-h-56">
                <CardTitle className='container flex flex-row justify-between py-2 self-center space-x-2 h-8'>
                    <span className='h-8 '>Itens deste pedido</span>
                </CardTitle>
                <CardContent className='py-2'>
                    <div className="mx-auto min-h-14 py-2">
                        {loading ? <>
                            <Skeleton className="h-50 w-[300] bg-slate-300 my-2" />
                        </>
                            :
                            itens.length === 0 ? <span>Nenhum item encontrado</span> :
                                <Table className="max-h-20">
                                    <TableHeader>
                                        <TableRow >
                                            <TableHead className="w-25">Código</TableHead>
                                            <TableHead>Isbn </TableHead>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>Qtd</TableHead>
                                            <TableHead>Qtd Separada</TableHead>
                                            <TableHead>Localização</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {itens.map((item) => (
                                            <TableRow key={item.Codproduto} className='h-2 p-0 w-full'>
                                                <TableCell className="font-medium w-25">{item.Codproduto}</TableCell>
                                                <TableCell className="font-medium w-25 ">{item.Isbn}</TableCell>
                                                <TableCell className="font-medium min-w-100 w-100 ">{item.Nomproduto}</TableCell>
                                                <TableCell className="font-medium w-25 ">{item.Quantidade}</TableCell>
                                                <TableCell className="font-medium w-25 ">{item.Qtdseparada}</TableCell>
                                                <TableCell className="font-medium w-25 ">{item.Localizacao}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
