'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Input from '@/components/Input';
import { useRouter } from 'next/navigation';
import { isTokenValid } from '@/utils/Auth';
import { calcularValorTotal } from '@/utils/Calculos';
import {
  Departamentos,
  FatoresFinanceiros,
  FormData,
} from '@/interfaces/Formulario';
import {
  fetchDepartamentos,
  fetchMeses,
  fetchUltimaProposta,
  fetchUsuario,
} from '@/utils/Fetchs';
import { handleSubmit, handleChange } from '@/utils/Handles';
import {
  inputsDadosProposta,
  inputsDadosTomador,
  inputsDadosVendedor,
  inputsValores,
} from '@/mocks/Objetos';
import { Tooltip } from '@chakra-ui/react';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import ActivityIndicator from '@/components/ActivityIndicator';
import { desativado as desativadoPrev } from '@/utils/FormEFUtils';

const Form = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isTokenValid()) router.push('/login');
  }, [router]);

  const [formData, setFormData] = useState<FormData>({
    tomador: '',
    departamento: '',
    email: '',
    telefone: '',
    data: '',
    dataFull: '',
    proposta: '',
    nomeEmpresa: '',
    cnpj: '',
    potencia: '',
    valor: '',
    razao: '',
    valorContaEnergia: '',
    fatorFinanceiroMes: '',
    valorTotal: '',
    vendedor: '',
    departamentoVendedor: '',
    emailVendedor: '',
    telefone1Vendedor: '',
    telefone2Vendedor: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [letra, setLetra] = useState('S');
  const [propostas, setPropostas] = useState({
    propostaRecuperadora: '',
    propostaServicos: '',
  });
  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [mesesFatorFinanceiro, setMesesFatorFinanceiro] = useState<
    FatoresFinanceiros[]
  >([]);

  useEffect(() => {
    Promise.all([
      fetchDepartamentos({ setDepartamentos }),
      fetchUltimaProposta({ setPropostas }),
      fetchUsuario({ setFormData }),
      fetchMeses({ setMesesFatorFinanceiro }),
    ]);
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      proposta:
        letra === 'R'
          ? propostas.propostaRecuperadora
          : propostas.propostaServicos,
    }));
  }, [letra, propostas]);

  const fatorFinanceiroId = useMemo(() => {
    return (
      mesesFatorFinanceiro?.find(
        (mes) => mes.meses === parseInt(formData.fatorFinanceiroMes),
      )?.id ?? 1
    );
  }, [formData.fatorFinanceiroMes, mesesFatorFinanceiro]);

  const isDataLoading = useMemo(() => {
    return (
      !departamentos.length ||
      Object.values(propostas).some((val) => val === '')
    );
  }, [departamentos.length, propostas]);

  const desativado = useMemo(() => desativadoPrev(formData), [formData]);

  const camposProposta = inputsDadosProposta({
    formData,
    handleChange: (e) => handleChange({ e, setFormData }),
    setFormData,
  });

  const camposTomador = inputsDadosTomador({
    formData,
    handleChange: (e) => handleChange({ e, setFormData }),
  });

  const camposVendedor = inputsDadosVendedor({
    formData,
    handleChange: (e) => handleChange({ e, setFormData }),
  });

  const camposValores = inputsValores({
    formData,
    handleChange: (e) => handleChange({ e, setFormData }),
  });

  if (isDataLoading) {
    return <ActivityIndicator />;
  }

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
        className="flex flex-col z-10 items-center justify-center bg-azul px-4 py-4 rounded-md w-fit h-fit gap-4"
      >
        <h1 className="text-3xl text-white font-semibold">
          Gerador de Proposta de Eficiência Energética
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
              checked={letra === 'S'}
              onChange={() => setLetra('S')}
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
              checked={letra === 'R'}
              onChange={() => setLetra('R')}
            />
            Recuperadora
          </label>
        </div>

        <div className="grid grid-cols-2 items-start justify-center gap-3 w-full h-fit ">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-azul px py text-md text-[#ffffffce] font-semibold left-2">
                Dados da proposta
              </p>

              <Input
                name="proposta"
                value={formData.proposta}
                onChange={(e) => handleChange({ e, setFormData })}
                placeholder="Proposta"
                dica="Código da proposta"
              />
              <span className="relative flex items-center gap-2">
                <select
                  id="fatorFinanceiroMes"
                  name="fatorFinanceiroMes"
                  value={formData.fatorFinanceiroMes}
                  onChange={(e) => handleChange({ e, setFormData })}
                  className={`bg-[#ffffff0e] border transition-all ${
                    formData.fatorFinanceiroMes !== ''
                      ? 'border-[#ffffff]'
                      : 'border-[#ffffff27]'
                  } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
                >
                  <option className="text-azul" value="">
                    Duração do contrato
                  </option>
                  {mesesFatorFinanceiro?.map((mes, index) => (
                    <option className="text-azul" key={index} value={mes.meses}>
                      {mes.meses + ' meses de contrato'}
                    </option>
                  ))}
                </select>
                <Tooltip
                  label={'Duração do contrato da proposta'}
                  fontSize="md"
                >
                  <span>
                    <IoMdHelpCircleOutline className="text-white text-2xl" />
                  </span>
                </Tooltip>
              </span>

              {camposProposta.map((inputProps, index) => (
                <Input key={index} {...inputProps} />
              ))}
            </div>

            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-azul px py text-md text-[#ffffffce] font-semibold left-2">
                Dados do contrato
              </p>
              {camposValores.map((inputProps, index) => (
                <Input
                  key={index}
                  {...inputProps}
                  onBlur={() =>
                    calcularValorTotal({
                      formData,
                      setFormData,
                      mesesFatorFinanceiro,
                    })
                  }
                />
              ))}
            </div>
          </div>

          <div className="gap-6 flex flex-col">
            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-azul px py text-md text-[#ffffffce] font-semibold left-2">
                Dados do vendedor
              </p>
              {camposVendedor.map((inputProps, index) => (
                <Input key={index} {...inputProps} />
              ))}
              <span className="relative flex items-center gap-2">
                <select
                  id="departamentoVendedor"
                  name="departamentoVendedor"
                  value={formData.departamentoVendedor}
                  onChange={(e) => handleChange({ e, setFormData })}
                  className={`bg-[#ffffff0e] border transition-all ${
                    formData.departamentoVendedor !== ''
                      ? 'border-[#ffffff]'
                      : 'border-[#ffffff27]'
                  } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
                >
                  <option className="text-azul" value="">
                    Departamento
                  </option>
                  {departamentos?.map((departamento, index) => (
                    <option
                      className="text-azul"
                      key={index}
                      value={departamento.nome}
                    >
                      {departamento.nome}
                    </option>
                  ))}
                </select>
                <Tooltip label={'Departamento do vendedor'} fontSize="md">
                  <span>
                    <IoMdHelpCircleOutline className="text-white text-2xl" />
                  </span>
                </Tooltip>
              </span>
            </div>

            <div className="grid grid-cols-2 items-center justify-center gap-3 w-full h-fit border border-[#ffffff27] rounded-md px-2 py-3 relative">
              <p className="absolute -top-4 bg-azul px py text-md text-[#ffffffce] font-semibold left-2">
                Dados do comprador
              </p>
              {camposTomador.map((inputProps, index) => (
                <Input key={index} {...inputProps} />
              ))}
              <span className="relative flex items-center gap-2">
                <select
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={(e) => handleChange({ e, setFormData })}
                  className={`bg-[#ffffff0e] border transition-all ${
                    formData.departamento !== ''
                      ? 'border-[#ffffff]'
                      : 'border-[#ffffff27]'
                  } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
                >
                  <option className="text-azul" value="">
                    Departamento
                  </option>
                  {departamentos?.map((departamento, index) => (
                    <option
                      className="text-azul"
                      key={index}
                      value={departamento.nome}
                    >
                      {departamento.nome}
                    </option>
                  ))}
                </select>
                <Tooltip label={'Departamento do tomador'} fontSize="md">
                  <span>
                    <IoMdHelpCircleOutline className="text-white text-2xl" />
                  </span>
                </Tooltip>
              </span>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <span className="relative flex items-center gap-2">
            <input
              className={`bg-[#ffffff0e] border min-w-fit w-full transition-all ${
                formData.valor !== ''
                  ? 'border-[#ffffff]'
                  : 'border-[#ffffff27]'
              } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white`}
              name={'valor'}
              value={formData.valor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, valor: e.target.value }))
              }
              placeholder={'Valor total'}
              type={'text'}
              disabled={true}
            />
            <Tooltip label={'Valor total da proposta'} fontSize="md">
              <span>
                <IoMdHelpCircleOutline className="text-white text-2xl" />
              </span>
            </Tooltip>
          </span>
          <button
            type="submit"
            disabled={desativado}
            className={`text-azul bg-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold grid place-items-center ${
              desativado
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer opacity-100'
            }`}
          >
            {isLoading ? <ActivityIndicator /> : 'Gerar proposta'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Form;
