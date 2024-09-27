import { ValuesSC } from '@/interfaces/SC';
import { getToken } from '@/utils/Auth';
import axios from 'axios';
import React from 'react';

export const fetchValores = async (
  setValues: React.Dispatch<React.SetStateAction<ValuesSC>>,
) => {
  await axios
    .get('/api/sc/valores')
    .then((response) =>
      setValues((prev) => ({
        ...prev,
        valorKM: response.data[0].valorKM,
        valorDiaria: response.data[0].valorDiaria,
      })),
    )
    .catch((error) => console.error(error));
};

export const fetchPropostas = async (
  setPropostas: React.Dispatch<
    React.SetStateAction<{
      propostasHH: {
        propostaSH: string;
        propostaRH: string;
      };
      propostasVF: {
        propostaSF: string;
        propostaRF: string;
      };
    }>
  >,
) => {
  axios
    .get('/api/sc/proxima-proposta')
    .then((response) => {
      const novasPropostas = response.data;
      setPropostas(novasPropostas);
    })
    .catch((err) => console.error(err));
};

export const fetchUsuario = async (
  setValues: React.Dispatch<React.SetStateAction<ValuesSC>>,
) => {
  const token = await getToken();
  await axios
    .get('/api/perfil', { headers: { Authorization: token } })
    .then((response) =>
      setValues((prev) => ({
        ...prev,
        nomeVendedor: response.data.nome,
        departamentoVendedor: response.data.departamento,
        telefone1Vendedor: response.data.telefone1,
        telefone2Vendedor: response.data.telefone2,
        emailVendedor: response.data.email,
        assinaturaVendedor: response.data.assinatura
      })),
    )
    .catch((error) => console.error(error));
};
