import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import axios from "axios";
import { useState } from "react";
import { EditoraDTO } from "./EditoraDTO";
import { Button } from "@/components/ui/button";
import { FormEditora } from "./FormEditora";

interface Props {
    codeditora?: number;
    className?: React.ComponentProps<"form">;
    setAtualizaLista?: (value: boolean) => void;
    atualizaLista?: boolean;
}

export function DialogCadastroEditora({ codeditora }: Props) {
    const [open, setOpen] = useState(false);
    const [editora, setEditora] = useState<EditoraDTO>();

    const buscaDadosEditora = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/produto/editora/${codeditora}`).then(response => {
            setEditora(response.data);
            setOpen(true);
        });
    };

    function OpenDialog() {
        if (open == false) {
            if (codeditora || codeditora == 0) {
                buscaDadosEditora();
            } else {
                setOpen(true);
            }
        } else {
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={OpenDialog} modal={true}>
            <DialogTrigger asChild>
                {codeditora || codeditora == 0 ?
                    <div className="font-bold text-gray-900 text-base cursor-pointer">
                        {codeditora}
                    </div>
                    :
                    <Button className="min-w-25 w-25 max-w-25" >
                        Cadastrar
                    </Button>
                }
            </DialogTrigger>

            <DialogContent 
                className="sm:max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto bg-card" 
                onPointerDownOutside={event => event.preventDefault()}
            >
                <DialogHeader className="border-b pb-2">
                    <DialogTitle >
                        {codeditora || codeditora == 0 ? "Editar Editora - " + editora?.Nomeditora : "Nova Editora"}
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <FormEditora item={editora} onOpenChange={OpenDialog}/>
            </DialogContent>
        </Dialog>
    )
}