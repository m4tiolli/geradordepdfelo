import { Valores } from "@/app/(propostas)/ef/variaveis/page";
import { Inputs } from "./InputsSC";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface IDados {
  values: Valores,
  onChange: (e: ChangeEvent<HTMLInputElement>, setValue: Dispatch<SetStateAction<object>>) => void;
  setValue: Dispatch<SetStateAction<object>>
}

export const inputsVariaveisEF = ({ values, onChange, setValue }: IDados): Inputs[] => [
  {
    name: "meses",
    value: values.meses,
    onChange: (e) => onChange(e, setValue),
    placeholder: "Meses",
    dica: "Meses de contrato"
  },
  {
    name: "valor",
    value: values.valor,
    onChange: (e) => onChange(e, setValue),
    placeholder: "Valor por KVA",
    dica: "Valor por KVA"
  },
  {
    name: "porcentagem",
    value: values.porcentagem,
    onChange: (e) => onChange(e, setValue),
    placeholder: "Conta mensal multiplicada por",
    dica: "Conta mensal multiplicada por"
  },
  {
    name: "implementacao",
    value: values.implementacao,
    onChange: (e) => onChange(e, setValue),
    placeholder: "Tempo para implementação",
    dica: "Tempo para implementação"
  }
]