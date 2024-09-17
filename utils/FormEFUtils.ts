import { FormData } from "@/interfaces/Formulario";

export const desativado = (formData: FormData, calculado: boolean) =>
formData.proposta === "" ||
formData.fatorFinanceiroMes === "" ||
formData.data === "" ||
formData.cnpj === "" ||
formData.razao === "" ||
formData.nomeEmpresa === "" ||
formData.potencia === "" ||
formData.valorContaEnergia === "" ||
formData.valorTotal === "" ||
formData.tomador === "" ||
formData.departamento === "" ||
formData.email === "" ||
formData.telefone === "" ||
formData.vendedor === "" ||
formData.emailVendedor === "" ||
formData.telefone1Vendedor === "" ||
formData.telefone2Vendedor === "" ||
formData.departamentoVendedor === "" ||
!calculado;