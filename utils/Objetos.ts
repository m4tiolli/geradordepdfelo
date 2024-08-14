import { Inputs } from "@/interfaces/Formulario";
import { consultarCNPJ } from "./Fetchs";

export const inputs = ({formData, handleChange, setFormData}: Inputs) => [
  {
    name: "data",
    value: formData.data,
    onChange: handleChange,
    placeholder: "Data",
  },
  {
    name: "cnpj",
    value: formData.cnpj,
    onChange: handleChange,
    placeholder: "CNPJ",
    onBlur: () => consultarCNPJ({formData, setFormData}),
  },
  {
    name: "nomeEmpresa",
    value: formData.nomeEmpresa,
    onChange: handleChange,
    placeholder: "Nome da Empresa",
  },
  {
    name: "razao",
    value: formData.razao,
    onChange: handleChange,
    placeholder: "Razão Social",
  },
  {
    name: "tomador",
    value: formData.tomador,
    onChange: handleChange,
    placeholder: "Tomador",
  },
  {
    name: "departamento",
    value: formData.departamento,
    onChange: handleChange,
    placeholder: "Departamento",
  },
  {
    name: "email",
    value: formData.email,
    onChange: handleChange,
    placeholder: "E-mail",
  },
  {
    name: "telefone",
    value: formData.telefone,
    onChange: handleChange,
    placeholder: "Telefone",
  },
  {
    name: "potencia",
    value: formData.potencia,
    onChange: handleChange,
    placeholder: "Potência",
  },
  // {
  //   name: "valor",
  //   value: formData.valor.toString(),
  //   onChange: handleChange,
  //   placeholder: "Valor",
  // },
  {
    name: "valorContaEnergia",
    value: formData.valorContaEnergia.toString(),
    onChange: handleChange,
    placeholder: "Valor da Conta de Energia",
  },
  {
    name: "vendedor",
    value: formData.vendedor,
    onChange: handleChange,
    placeholder: "Vendedor",
  },
  {
    name: "departamentoVendedor",
    value: formData.departamentoVendedor,
    onChange: handleChange,
    placeholder: "Departamento do Vendedor",
  },
  {
    name: "emailVendedor",
    value: formData.emailVendedor,
    onChange: handleChange,
    placeholder: "E-mail do Vendedor",
  },
  {
    name: "telefoneVendedor",
    value: formData.telefone1Vendedor,
    onChange: handleChange,
    placeholder: "Telefone do Vendedor",
  },
];