import {
  SetFormData,
  SetMesesFatorFinanceiro,
  FormData,
  SetDepartamentos,
  Departamentos,
} from "@/interfaces/Formulario";
import { Usuario } from "@/interfaces/Usuario";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export const fetchMeses = async ({
  setMesesFatorFinanceiro,
}: SetMesesFatorFinanceiro) => {
  try {
    const response = await axios.get(
      "/api/ef/fatores-financeiros"
    );
    setMesesFatorFinanceiro(response.data);
  } catch (error) {
    console.error("Erro ao buscar meses do fator financeiro:", error);
  }
};

export const fetchUsuario = async ({ setFormData }: SetFormData) => {
  try {
    const response = await axios.get("/api/perfil", {
      headers: { authorization: localStorage.getItem("token") },
    });
    setFormData((prev) => ({
      ...prev,
      vendedor: response.data.nome,
      emailVendedor: response.data.email,
      telefone1Vendedor: response.data.telefone1,
      telefone2Vendedor: response.data.telefone2,
      departamentoVendedor: response.data.departamento,
    }));
  } catch (error) {
    console.error("Erro ao buscar dados do vendedor:", error);
  }
};

export const fetchPrevilegios = async (setUsuario: Dispatch<SetStateAction<Usuario | undefined>>) => {
  try {
    const response = await axios.get("/api/perfil", {
      headers: { authorization: localStorage.getItem("token") },
    });
    return setUsuario(response.data);
  } catch (error) {
    console.error("Erro ao buscar dados do usuario:", error);
  }
}

export const fetchUltimaProposta = async ({ setPropostas }: any) => {
  try {
    const response = await axios.get("/api/ef/proxima-proposta");
    setPropostas(response.data.proposta)
  } catch (error) {
    console.error("Erro ao buscar proposta:", error);
  }
};

export const fetchDepartamentos = async ({ setDepartamentos }: SetDepartamentos) => {
  try {
    const response = await axios.get("/api/departamentos");
    const data: Departamentos[] = response.data;
    setDepartamentos(data);
  } catch (error) {
    console.error("Erro ao buscar departamentos:", error);
  }
};

export type SetformData = React.Dispatch<React.SetStateAction<FormData>>;
export const consultarCNPJ = async ({
  setFormData,
  formData,
}: {
  setFormData: SetformData;
  formData: FormData;
}) => {
  await axios
    .get("https://api.cnpja.com/office/" + formData.cnpj, {
      headers: {
        Authorization:
          "ffaafa01-3f8a-43eb-b361-6033430f3f98-55be84d3-2df7-4987-b151-49d9a0b6b0a6",
      },
    })
    .then((response) => {
      setFormData((prev) => ({
        ...prev,
        nomeEmpresa: response.data.alias,
        razao: response.data.company.name,
      }));
    })
    .catch((error) => console.error(error));
};
