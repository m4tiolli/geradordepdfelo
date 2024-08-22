import { Inputs } from "@/interfaces/Formulario";
import { consultarCNPJ } from "./Fetchs";

export const inputs = ({formData, handleChange, setFormData}: Inputs) => [
  {
    name: "data",
    value: formData.data,
    onChange: handleChange,
    placeholder: "Data",
    type: "date",
    dica: "Data da proposta"
  },
  {
    name: "cnpj",
    value: formData.cnpj,
    onChange: handleChange,
    placeholder: "CNPJ",
    onBlur: () => consultarCNPJ({formData, setFormData}),
    dica: "CNPJ da empresa da proposta"
  },
  {
    name: "nomeEmpresa",
    value: formData.nomeEmpresa,
    onChange: handleChange,
    placeholder: "Nome da Empresa",
    dica: "Nome da empresa da proposta"
  },
  {
    name: "razao",
    value: formData.razao,
    onChange: handleChange,
    placeholder: "Razão Social",
    dica: "Razão social da empresa da proposta"
  },
  {
    name: "tomador",
    value: formData.tomador,
    onChange: handleChange,
    placeholder: "Tomador",
    dica: "Tomador da proposta"
  },
  {
    name: "departamento",
    value: formData.departamento,
    onChange: handleChange,
    placeholder: "Departamento",
    dica: "Departamento do tomador da proposta"
  },
  {
    name: "email",
    value: formData.email,
    onChange: handleChange,
    placeholder: "E-mail",
    dica: "E-mail do tomador da proposta",
  },
  {
    name: "telefone",
    value: formData.telefone,
    onChange: handleChange,
    placeholder: "Telefone",
    dica: "Telefone do tomador da proposta",
  },
  {
    name: "potencia",
    value: formData.potencia,
    onChange: handleChange,
    placeholder: "Potência",
    dica: "Potência em KVA do equipamento",
  },
  {
    name: "valorContaEnergia",
    value: formData.valorContaEnergia.toString(),
    onChange: handleChange,
    placeholder: "Valor da Conta de Energia",
    dica: "Valor da conta de energia em R$",
  },
  {
    name: "vendedor",
    value: formData.vendedor,
    onChange: handleChange,
    placeholder: "Vendedor",
    dica: "Vendedor da proposta",
  },
  {
    name: "departamentoVendedor",
    value: formData.departamentoVendedor,
    onChange: handleChange,
    placeholder: "Departamento do Vendedor",
    dica: "Departamento do vendedor da proposta",
  },
  {
    name: "emailVendedor",
    value: formData.emailVendedor,
    onChange: handleChange,
    placeholder: "E-mail do Vendedor",
    dica: "E-mail do vendedor da proposta",
  },
  {
    name: "telefoneVendedor",
    value: formData.telefone1Vendedor,
    onChange: handleChange,
    placeholder: "Telefone do Vendedor",
    dica: "Telefone do vendedor da proposta",
  },
];