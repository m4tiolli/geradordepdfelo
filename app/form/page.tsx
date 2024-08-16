"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { isTokenValid } from "@/utils/Auth";
import { calcularValorTotal } from "@/utils/Calculos";
import { Departamentos, FatoresFinanceiros, FormData } from "@/interfaces/Formulario";
import { fetchDepartamentos, fetchMeses, fetchUltimaProposta, fetchUsuario } from "@/utils/Fetchs";
import { handleSubmit, handleChange } from "@/utils/Handles";
import { inputs } from "@/utils/Objetos";

const Form: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    isTokenValid() ? router.push("/form") : router.push("/login");
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

  const [departamentos, setDepartamentos] = useState<Departamentos[]>([])

  const [mesesFatorFinanceiro, setMesesFatorFinanceiro] =
    useState<FatoresFinanceiros[]>([]);

  useEffect(() => {
    fetchDepartamentos({setDepartamentos})
    fetchUltimaProposta({ setFormData });
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

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center z-10">
      <form
        onSubmit={(e) => handleSubmit({ e, formData, fatorFinanceiroId })}
        className="flex flex-col z-10 items-center justify-center bg-[#38457a] px-4 py-4 rounded-md w-fit h-fit gap-4"
      >
        <h1 className="text-3xl text-white font-semibold">
          Gerador de Proposta
        </h1>
        <div className="grid grid-cols-2 items-start justify-center gap-3 w-full h-fit ">
          {/* parte esquerda */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-[#38457a] px py text-md text-[#ffffffce] font-semibold left-2">
                Dados da proposta
              </p>
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
              <select
                id="fatorFinanceiroMes"
                name="fatorFinanceiroMes"
                value={formData.fatorFinanceiroMes}
                onChange={(e) => handleChange({ e, setFormData })}
                className={`bg-[#ffffff0e] border transition-all ${
                  formData.fatorFinanceiroMes !== ""
                    ? "border-[#ffffff]"
                    : "border-[#ffffff27]"
                } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none`}
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
              {campos
                .slice(0, 4)
                .map(
                  ({ name, value, onChange, placeholder, onBlur }, index) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
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
                  ({ name, value, onChange, placeholder, onBlur }, index) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
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
                .slice(10, 15)
                .map(
                  ({ name, value, onChange, placeholder, onBlur }, index) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
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
                  ({ name, value, onChange, placeholder, onBlur }, index) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
                    />
                  )
                )}
                 <select
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={(e) => handleChange({ e, setFormData })}
                className={`bg-[#ffffff0e] border transition-all ${
                  formData.departamento !== ""
                    ? "border-[#ffffff]"
                    : "border-[#ffffff27]"
                } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none`}
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
                {campos
                .slice(6, 8)
                .map(
                  ({ name, value, onChange, placeholder, onBlur }, index) => (
                    <Input
                      key={index++}
                      name={name}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      onBlur={onBlur}
                    />
                  )
                )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start w-full gap-4">
          <button
            type="button"
            onClick={() =>
              calcularValorTotal({
                formData,
                setFormData,
                mesesFatorFinanceiro,
              })
            }
            className="bg-white text-[#38457a] px-4 py-2 transition-all hover:opacity-60 rounded-md font-semibold"
          >
            Calcular
          </button>
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
        </div>
        <button
          className="text-[#38457a] bg-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
          type="submit"
        >
          Gerar
        </button>
      </form>
    </main>
  );
};

export default Form;
