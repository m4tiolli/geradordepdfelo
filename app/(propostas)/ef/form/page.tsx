"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { isTokenValid } from "@/utils/Auth";
import { calcularValorTotal } from "@/utils/Calculos";
import {
  Departamentos,
  FatoresFinanceiros,
  FormData,
} from "@/interfaces/Formulario";
import {
  fetchDepartamentos,
  fetchMeses,
  fetchUltimaProposta,
  fetchUsuario,
} from "@/utils/Fetchs";
import { handleSubmit, handleChange } from "@/utils/Handles";
import { inputs } from "@/mocks/Objetos";
import { Tooltip } from "@chakra-ui/react";
import { IoMdHelpCircleOutline } from "react-icons/io";
import ActivityIndicator from "@/components/ActivityIndicator";

const Form: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    !isTokenValid() ? router.push("/login") : "";
  });
  const [formData, setFormData] = useState<FormData>({
    tomador: "",
    departamento: "",
    email: "",
    telefone: "",
    data: "",
    dataFull: "",
    proposta: "",
    nomeEmpresa: "",
    cnpj: "",
    potencia: "",
    valor: "",
    razao: "",
    valorContaEnergia: "",
    fatorFinanceiroMes: "",
    valorTotal: "",
    vendedor: "",
    departamentoVendedor: "",
    emailVendedor: "",
    telefone1Vendedor: "",
    telefone2Vendedor: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [letra, setLetra] = useState("S");
  const [calculado, setCalculado] = useState(false);
  const [propostas, setPropostas] = useState({
    propostaRecuperadora: "",
    propostaServicos: "",
  });

  useEffect(() => {
    if (letra === "R") {
      setFormData((prev) => ({
        ...prev,
        proposta: propostas.propostaRecuperadora,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        proposta: propostas.propostaServicos,
      }));
    }
  }, [letra, propostas]);

  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);

  const [mesesFatorFinanceiro, setMesesFatorFinanceiro] = useState<
    FatoresFinanceiros[]
  >([]);

  useEffect(() => {
    fetchDepartamentos({ setDepartamentos });
    fetchUltimaProposta({ setPropostas });
    fetchUsuario({ setFormData });
    fetchMeses({ setMesesFatorFinanceiro });
  }, []);

  const campos = inputs({
    formData,
    handleChange: (e) => handleChange({ e, setFormData }),
    setFormData,
  });

  const fatorFinanceiroId =
    mesesFatorFinanceiro?.find(
      (mes) => mes.meses == parseInt(formData.fatorFinanceiroMes)
    )?.id ?? 1;

  if (!departamentos || Object.values(propostas).includes("")) {
    return <ActivityIndicator />;
  }

  const desativado =
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

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center z-10">
      <form
        onSubmit={(e) =>
          handleSubmit({
            e,
            formData,
            fatorFinanceiroId,
            elo: letra,
            setIsLoading,
          })
        }
        className="flex flex-col z-10 items-center justify-center bg-[#38457a] px-4 py-4 rounded-md w-fit h-fit gap-4"
      >
        <h1 className="text-3xl text-white font-semibold">
          Gerador de Proposta
        </h1>
        <div className="border border-[#ffffff27] rounded-md px-4 py-2 w-full flex items-center gap-3 justify-start">
          <p className="text-white font-medium">Qual Cadastro da Elo: </p>
          <label
            htmlFor="servicos"
            className="flex items-center gap-2 cursor-pointer text-white font-normal"
          >
            <input
              type="radio"
              name="servicos"
              id="servicos"
              checked={letra === "S"}
              onChange={() => setLetra("S")}
            />
            Serviços
          </label>
          <label
            htmlFor="recuperadora"
            className="flex items-center gap-2 cursor-pointer text-white font-normal"
          >
            <input
              type="radio"
              name="recuperadora"
              id="recuperadora"
              checked={letra === "R"}
              onChange={() => setLetra("R")}
            />
            Recuperadora
          </label>
        </div>
        <div className="grid grid-cols-2 items-start justify-center gap-3 w-full h-fit ">
          {/* parte esquerda */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-[#38457a] px py text-md text-[#ffffffce] font-semibold left-2">
                Dados da proposta
              </p>
              <span className="relative flex items-center gap-2">
                <input
                  className={`bg-[#ffffff0e] border transition-all ${
                    formData.proposta !== ""
                      ? "border-[#ffffff]"
                      : "border-[#ffffff27]"
                  } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white`}
                  name={"proposta"}
                  value={formData.proposta}
                  onChange={(e) => handleChange({ e, setFormData })}
                  placeholder={"Proposta"}
                  type="text"
                />
                <Tooltip label="Código da proposta" fontSize="md">
                  <span>
                    <IoMdHelpCircleOutline className="text-white text-2xl" />
                  </span>
                </Tooltip>
              </span>
              <span className="relative flex items-center gap-2">
                <select
                  id="fatorFinanceiroMes"
                  name="fatorFinanceiroMes"
                  value={formData.fatorFinanceiroMes}
                  onChange={(e) => handleChange({ e, setFormData })}
                  className={`bg-[#ffffff0e] border transition-all ${
                    formData.fatorFinanceiroMes !== ""
                      ? "border-[#ffffff]"
                      : "border-[#ffffff27]"
                  } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
                >
                  <option className="text-[#38457a]" value="">
                    Duração do contrato
                  </option>
                  {mesesFatorFinanceiro?.map((mes, index) => (
                    <option
                      className="text-[#38457a]"
                      key={index++}
                      value={mes.meses}
                    >
                      {mes.meses + " meses de contrato"}
                    </option>
                  ))}
                </select>
                <Tooltip label="Duração do contrato da proposta" fontSize="md">
                  <span>
                    <IoMdHelpCircleOutline className="text-white text-2xl" />
                  </span>
                </Tooltip>
              </span>
              {campos
                .slice(0, 4)
                .map(
                  (
                    { name, value, onChange, placeholder, onBlur, type, dica },
                    index
                  ) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
                      type={type}
                      dica={dica}
                    />
                  )
                )}
            </div>
            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-[#38457a] px py text-md text-[#ffffffce] font-semibold left-2">
                Dados do contrato
              </p>
              {campos
                .slice(8, 10)
                .map(
                  (
                    { name, value, onChange, placeholder, onBlur, dica },
                    index
                  ) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
                      dica={dica}
                    />
                  )
                )}
            </div>
          </div>
          {/* parte direita */}
          <div className="gap-6 flex flex-col">
            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-[#38457a] px py text-md text-[#ffffffce] font-semibold left-2">
                Dados do vendedor
              </p>
              {campos
                .slice(10, 11)
                .map(
                  (
                    { name, value, onChange, placeholder, onBlur, dica },
                    index
                  ) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
                      dica={dica}
                    />
                  )
                )}
                <span className="relative flex items-center gap-2">
                <select
                  id="departamentoVendedor"
                  name="departamentoVendedor"
                  value={formData.departamentoVendedor}
                  onChange={(e) => handleChange({ e, setFormData })}
                  className={`bg-[#ffffff0e] border transition-all ${
                    formData.departamentoVendedor !== ""
                      ? "border-[#ffffff]"
                      : "border-[#ffffff27]"
                  } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
                >
                  <option className="text-[#38457a]" value="">
                    Departamento
                  </option>
                  {departamentos?.map((departamento, index) => (
                    <option
                      className="text-[#38457a]"
                      key={index++}
                      value={departamento.nome}
                    >
                      {departamento.nome}
                    </option>
                  ))}
                </select>
                <Tooltip
                  label="Departamento do vendedor da proposta"
                  fontSize="md"
                >
                  <span>
                    <IoMdHelpCircleOutline className="text-white text-2xl" />
                  </span>
                </Tooltip>
              </span>
              {campos
                .slice(12, 15)
                .map(
                  (
                    { name, value, onChange, placeholder, onBlur, dica },
                    index
                  ) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
                      dica={dica}
                    />
                  )
                )}
            </div>
            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-[#38457a] px py text-md text-[#ffffffce] font-semibold left-2">
                Dados do comprador
              </p>
              {campos
                .slice(4, 5)
                .map(
                  (
                    { name, value, onChange, placeholder, onBlur, dica },
                    index
                  ) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
                      dica={dica}
                    />
                  )
                )}

              <span className="relative flex items-center gap-2">
                <select
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={(e) => handleChange({ e, setFormData })}
                  className={`bg-[#ffffff0e] border transition-all ${
                    formData.departamento !== ""
                      ? "border-[#ffffff]"
                      : "border-[#ffffff27]"
                  } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
                >
                  <option className="text-[#38457a]" value="">
                    Departamento
                  </option>
                  {departamentos?.map((departamento, index) => (
                    <option
                      className="text-[#38457a]"
                      key={index++}
                      value={departamento.nome}
                    >
                      {departamento.nome}
                    </option>
                  ))}
                </select>
                <Tooltip
                  label="Departamento do comprador da proposta"
                  fontSize="md"
                >
                  <span>
                    <IoMdHelpCircleOutline className="text-white text-2xl" />
                  </span>
                </Tooltip>
              </span>
              {campos
                .slice(6, 8)
                .map(
                  (
                    { name, value, onChange, placeholder, onBlur, dica },
                    index
                  ) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
                      dica={dica}
                    />
                  )
                )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start w-full gap-4">
          <button
            type="button"
            onClick={() => {
              calcularValorTotal({
                formData,
                setFormData,
                mesesFatorFinanceiro,
              });
              setCalculado(true);
            }}
            disabled={
              formData.valorContaEnergia === "" ||
              formData.potencia === "" ||
              formData.fatorFinanceiroMes === ""
            }
            className={`bg-white text-[#38457a] px-4 py-2 transition-all hover:opacity-60 rounded-md font-semibold ${
              formData.valorContaEnergia === "" ||
              formData.potencia === "" ||
              formData.fatorFinanceiroMes === ""
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer opacity-100"
            }`}
          >
            Calcular
          </button>
          <span className="relative w-full flex items-center gap-2">
            <input
              placeholder="Valor total do contrato"
              value={formData.valorTotal}
              onChange={(e) => handleChange({ e, setFormData })}
              className={`bg-[#ffffff0e] border transition-all ${
                formData.valorTotal != ""
                  ? "border-[#ffffff]"
                  : "border-[#ffffff27]"
              } outline-none text-sm rounded-md p-2 w-full placeholder:text-[#ffffffa6] text-white`}
            />
            <Tooltip
              label="Valor total do contrato da proposta em R$"
              fontSize="md"
            >
              <span>
                <IoMdHelpCircleOutline className="text-white text-2xl" />
              </span>
            </Tooltip>
          </span>
        </div>
        <button
          disabled={desativado || isLoading}
          className={`text-[#38457a] bg-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold grid place-items-center ${
            desativado
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer opacity-100"
          }`}
          type="submit"
        >
          {isLoading ? <ActivityIndicator /> : "Gerar"}
        </button>
      </form>
    </main>
  );
};

export default Form;
