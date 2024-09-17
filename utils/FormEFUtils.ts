import { FormData } from "@/interfaces/Formulario";

export const desativado = (formData: FormData) =>
formData.proposta === "" ||
formData.fatorFinanceiroMes === "" ||
formData.data === "" ||
formData.cnpj === "" ||
formData.razao === "" ||
formData.nomeEmpresa === "" ||
formData.potencia === "" ||
formData.valorContaEnergia === "" ||
formData.valor === "" ||
formData.tomador === "" ||
formData.departamento === "" ||
formData.email === "" ||
formData.telefone === "" ||
formData.vendedor === "" ||
formData.emailVendedor === "" ||
formData.telefone1Vendedor === "" ||
formData.telefone2Vendedor === "" ||
formData.departamentoVendedor === ""