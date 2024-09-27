import { ValuesSC } from "@/interfaces/SC";
import axios from "axios";
import React, { SetStateAction } from "react";
import { ChangeEvent } from "react";

interface Inputs {
  name: string;
  value: string | number | Date;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  dica: string;
  type?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

interface IDados {
  values: ValuesSC;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setValues: React.Dispatch<SetStateAction<ValuesSC>>
}

// 1. Dados da Empresa
export const inputsDadosEmpresa = ({ values, onChange, setValues }: IDados): Inputs[] => [
  {
    name: "cnpjEmpresa",
    value: values.cnpjEmpresa,
    onChange: onChange,
    placeholder: "CNPJ da Empresa",
    dica: "CNPJ da Empresa",
    onBlur: () => fetchDadosEmpresa({ values, setValues })
  }, {
    name: "razaoEmpresa",
    value: values.razaoEmpresa,
    onChange: onChange,
    placeholder: "Razão da Empresa",
    dica: "Razão da Empresa"
  },
  {
    name: "nomeEmpresa",
    value: values.nomeEmpresa,
    onChange: onChange,
    placeholder: "Nome da Empresa",
    dica: "Nome da Empresa"
  }
];

// 2. Dados da Proposta
export const inputsDadosProposta = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "codigoProposta",
    value: values.codigoProposta,
    onChange: onChange,
    placeholder: "Código da Proposta",
    dica: "Código da Proposta"
  },
  {
    name: "entradaProposta",
    value: values.entradaProposta,
    onChange: onChange,
    placeholder: "Entrada da Proposta",
    dica: "Entrada da Proposta",
    type: "date"
  },
  {
    name: "dataProposta",
    value: values.dataProposta,
    onChange: onChange,
    placeholder: "Data da Proposta",
    dica: "Data da Proposta",
    type: "date"
  },

  {
    name: "validadeProposta",
    value: values.validadeProposta,
    onChange: onChange,
    placeholder: "Validade da Proposta",
    dica: "Ex: 05 (Cinco) dias contado a partir desta data."
  }
];

// 3. Valores da Proposta
export const inputsValoresProposta = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "valorTecnico",
    value: values.valorTecnico,
    onChange: onChange,
    placeholder: "Valor por Hora do Técnico",
    dica: "Valor por Hora do Técnico"
  },
  {
    name: "valorKM",
    value: values.valorKM,
    onChange: onChange,
    placeholder: "Valor por KM",
    dica: "Valor por KM"
  },
  {
    name: "valorDiaria",
    value: values.valorDiaria,
    onChange: onChange,
    placeholder: "Valor da Diária",
    dica: "Valor da Diária"
  },
  {
    name: "condicaoPagamento",
    value: values.condicaoPagamento,
    onChange: onChange,
    placeholder: "Condição de Pagamento",
    dica: "Ex: 100% (cem por cento) a 7 DDL a partir da conclusão dos serviços, mediante aprovação de cadastro"
  }
];

// 4. Dados do Tomador
export const inputsDadosTomador = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "nomeTomador",
    value: values.nomeTomador,
    onChange: onChange,
    placeholder: "Nome do Tomador",
    dica: "Nome do Tomador"
  },
  {
    name: "emailTomador",
    value: values.emailTomador,
    onChange: onChange,
    placeholder: "Email do Tomador",
    dica: "Email do Tomador"
  },
  {
    name: "telefone1Tomador",
    value: values.telefone1Tomador,
    onChange: onChange,
    placeholder: "Telefone 1 do Tomador",
    dica: "Telefone 1 do Tomador"
  },
  {
    name: "telefone2Tomador",
    value: values.telefone2Tomador,
    onChange: onChange,
    placeholder: "Telefone 2 do Tomador",
    dica: "Telefone 2 do Tomador"
  },
  {
    name: "tipoContato",
    value: values.tipoContato,
    onChange: onChange,
    placeholder: "Meio de contato com o tomador",
    dica: "Ex: WhatsApp"
  },
];

// 5. Dados do Vendedor
export const inputsDadosVendedor = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "nomeVendedor",
    value: values.nomeVendedor,
    onChange: onChange,
    placeholder: "Nome do Vendedor",
    dica: "Nome do Vendedor"
  },
  {
    name: "emailVendedor",
    value: values.emailVendedor,
    onChange: onChange,
    placeholder: "Email do Vendedor",
    dica: "Email do Vendedor"
  },
  {
    name: "telefone1Vendedor",
    value: values.telefone1Vendedor,
    onChange: onChange,
    placeholder: "Telefone 1 do Vendedor",
    dica: "Telefone 1 do Vendedor"
  },
  {
    name: "telefone2Vendedor",
    value: values.telefone2Vendedor,
    onChange: onChange,
    placeholder: "Telefone 2 do Vendedor",
    dica: "Telefone 2 do Vendedor"
  },
];

const fetchDadosEmpresa = async ({ values, setValues }: { values: ValuesSC, setValues: React.Dispatch<SetStateAction<ValuesSC>> }) => {
  await axios.get("https://api.cnpja.com/office/" + values.cnpjEmpresa, {
    headers: {
      Authorization:
        "ffaafa01-3f8a-43eb-b361-6033430f3f98-55be84d3-2df7-4987-b151-49d9a0b6b0a6",
    },
  })
    .then((response) => {
      setValues((prev) => ({
        ...prev,
        nomeEmpresa: response.data.alias,
        razaoEmpresa: response.data.company.name,
      }));
    })
    .catch((error) => console.error(error));
}
