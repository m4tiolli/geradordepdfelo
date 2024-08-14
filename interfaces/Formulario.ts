import React from 'react'

export interface FatoresFinanceiros {
  id: number;
  meses: number;
  valor: number;
  porcentagem: number;
  implementacao: number;
}

export interface FormData {
  tomador: string;
  departamento: string;
  email: string;
  razao: string;
  telefone: string;
  data: string; // Data no formato DD/MM/YYYY
  dataFull: string; // Data por extenso
  proposta: string;
  nomeEmpresa: string;
  cnpj: string;
  potencia: string; // Potência como string com unidade
  valor: number | string; // Valor como número
  valorContaEnergia: number | string; // Novo campo para valor da conta de energia
  fatorFinanceiroMes: string; // Seleção do mês do fator financeiro
  valorTotal: number | string;
  vendedor: string;
  departamentoVendedor: string;
  emailVendedor: string;
  telefone1Vendedor: string;
  telefone2Vendedor: string;
}

export interface SetMesesFatorFinanceiro {
  setMesesFatorFinanceiro: React.Dispatch<React.SetStateAction<FatoresFinanceiros[] | undefined>>
}

export interface SetFormData {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export interface Inputs {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export interface HandleChange {
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export interface HandleSubmit {
  e: React.FormEvent
  formData: FormData
  fatorFinanceiroId: number
}