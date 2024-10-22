import { Valores } from "@/app/departamentos/page";
import { Inputs } from "./InputsSC";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface IDados {
  values: Valores,
  onChange: (e: ChangeEvent<HTMLInputElement>, setValue: Dispatch<SetStateAction<object>>) => void;
  setValue: Dispatch<SetStateAction<object>>
}

export const inputsVariaveisDepts = ({ values, onChange, setValue }: IDados): Inputs[] => [
  {
    name: "nome",
    value: values.nome,
    onChange: (e) => onChange(e, setValue),
    placeholder: "Nome do departamento",
    dica: "Nome do departamento"
  }
]