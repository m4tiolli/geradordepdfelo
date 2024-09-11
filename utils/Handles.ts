import { HandleChange, HandleSubmit } from "@/interfaces/Formulario";
import axios from "axios";

export const handleChange = ({ e, setFormData }: HandleChange) => {
  const { name, value } = e.target;
  setFormData((prevState) => {
    const updatedData = { ...prevState, [name]: value };
    if (name === "data") {
      updatedData.dataFull = formatarData(value);
    }
    if (name === "valor") {
      updatedData.valor = parseFloat(value.replace(",", ".")) || 0; // Ajusta para número
    }
    if (name === "valorContaEnergia") {
      updatedData.valorContaEnergia = parseFloat(value.replace(",", ".")) || 0; // Ajusta para número
    }
    return updatedData;
  });
};

export const handleSubmit = async ({
  e,
  formData,
  fatorFinanceiroId,
  elo,
  setIsLoading
}: HandleSubmit) => {
  e.preventDefault();
  setIsLoading(true)
  const dados = {
    vendedor: formData.vendedor,
    telefone1vendedor: formData.telefone1Vendedor,
    telefone2vendedor: formData.telefone2Vendedor,
    emailvendedor: formData.emailVendedor,
    departamentovendedor: formData.departamentoVendedor,
    tomador: formData.tomador,
    departamento: formData.departamento,
    email: formData.email,
    telefone: formData.telefone,
    data: formData.data,
    dataFull: formData.dataFull,
    proposta: formData.proposta,
    nomeEmpresa: formData.nomeEmpresa,
    razao: formData.razao,
    cnpj: formData.cnpj,
    potencia: formData.potencia,
    valor: formData.valorTotal,
    meses: formData.fatorFinanceiroMes,
    valorContaEnergia: formData.valorContaEnergia,
    fatorFinanceiroId: fatorFinanceiroId,
    elo: elo
  };
  try {
    console.log(dados);
    const response = await axios.post("/api/gerar-pdf", dados, {
      headers: { authorization: localStorage.getItem("token") },
    });
    const { downloadLink } = response.data;
    if (downloadLink) {
      setIsLoading(false)
      window.location.href = downloadLink;
    } else {
      console.error("Link de download não encontrado na resposta.");
    }
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
  }
};

function formatarData(data: string): string {
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  if (data.length === 10) {
    const [ano, mes, dia] = data.split("-");
    const mesNome = meses[parseInt(mes, 10) - 1];
    return `${dia} de ${mesNome} de ${ano}`;
  } else {
    return "";
  }
}
