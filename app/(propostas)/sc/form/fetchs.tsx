import { ValuesSC } from '@/interfaces/SC';
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
