import React from "react";
import { FatoresFinanceiros, FormData } from "@/interfaces/Formulario";

interface CalcularValorTotal {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  mesesFatorFinanceiro: FatoresFinanceiros[] | undefined;
}

export const calcularValorTotal = ({
  formData,
  setFormData,
  mesesFatorFinanceiro,
}: CalcularValorTotal) => {
  const potencia = parseInt(formData.potencia);
  const contaEnergia = parseInt(formData.valorContaEnergia as string);
  const fator = mesesFatorFinanceiro?.find(
    (mes) => mes.meses === parseInt(formData.fatorFinanceiroMes)
  )?.porcentagem;
  console.table([
    "Potência * Fator: " + potencia * (fator as number),
    "5% Conta de energia: " + (contaEnergia / 100) * 5,
    "10% Conta de energia: " + (contaEnergia / 100) * 10,
  ]);
  if (potencia * (fator as number) < (contaEnergia / 100) * 5) {
    setFormData((prev) => ({
      ...prev,
      valor: (contaEnergia / 100) * 5,
    }));
  } else if (potencia * (fator as number) > (contaEnergia / 100) * 10) {
    setFormData((prev) => ({
      ...prev,
      valor: (contaEnergia / 100) * 10,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      valor: potencia * (fator as number),
    }));
  }
};
