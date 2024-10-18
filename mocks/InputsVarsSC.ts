import { IDados, Inputs } from "./InputsSC";

export const inputsVariaveisSC = ({ values, onChange  }: IDados): Inputs[] => [
  {
    name: "valorKM",
    value: values.valorKM,
    onChange: onChange,
    placeholder: "Valor do KM",
    dica: "Valor por KM rodado"
  },
  {
    name: "valorDiaria",
    value: values.valorDiaria,
    onChange: onChange,
    placeholder: "Valor da diária",
    dica: "Valor da diária"
  }
]