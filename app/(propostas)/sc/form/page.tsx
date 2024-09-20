'use client';
import React, { useEffect, useMemo } from 'react';
import Input from '@/components/Input';
import { ValuesSC } from '@/interfaces/SC';
import {
  inputsDadosEmpresa,
  inputsDadosProposta,
  inputsDadosTomador,
  inputsDadosVendedor,
  inputsValoresProposta,
} from '@/mocks/InputsSC';
import { ChangeEvent, useState } from 'react';
import { Stepper, Step } from '@material-tailwind/react';
import { CgArrowsExchange } from 'react-icons/cg';
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { ShowToast } from '@/utils/Toast';
import ActivityIndicator from '@/components/ActivityIndicator';
import { Departamentos } from '@/interfaces/Formulario';
import { fetchDepartamentos } from '@/utils/Fetchs';
import { fetchPropostas, fetchUsuario, fetchValores } from './fetchs';
import Select from '@/components/Select';
import { VerificarPrivilegios } from '@/utils/Verificacoes';
import { useRouter } from 'next/navigation';
import { Usuario } from '@/interfaces/Usuario';

function Form() {
  const router = useRouter();
  useEffect(() => {
    VerificarPrivilegios({
      router,
      setUsuario: setUsuario as unknown as React.Dispatch<
        React.SetStateAction<Usuario | undefined>
      >,
    });
  }, []);

  const steps = [
    'Dados da Proposta',
    'Dados da Empresa',
    'Valores da Proposta',
    'Dados do Tomador',
    'Dados do Vendedor',
  ];

  const setUsuario = '';
  const [tipoProposta, setTipoProposta] = useState('Valor Final');
  const [elo, setElo] = useState('Serviços');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEloOpen,
    onOpen: onEloOpen,
    onClose: onEloClose,
  } = useDisclosure();
  const [values, setValues] = useState<ValuesSC>({
    cnpjEmpresa: '',
    razaoEmpresa: '',
    nomeEmpresa: '',
    nomeTomador: '',
    emailTomador: '',
    telefone1Tomador: '',
    telefone2Tomador: '',
    departamentoTomador: '',
    nomeVendedor: '',
    emailVendedor: '',
    telefone1Vendedor: '',
    telefone2Vendedor: '',
    departamentoVendedor: '',
    assinaturaVendedor: '',
    tipoContato: '',
    entradaProposta: new Date().toISOString().slice(0, 10),
    dataProposta: new Date().toISOString().slice(0, 10),
    dataFullProposta: '',
    codigoProposta: '',
    validadeProposta: '05 (cinco) dias contado a partir desta data.',
    valorTecnico: '',
    valorKM: '',
    valorDiaria: '',
    condicaoPagamento:
      '100% (cem por cento) a 7 DDL a partir da conclusão dos serviços, mediante aprovação de cadastro',
  });
  const [activeStep, setActiveStep] = useState(0);

  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [propostas, setPropostas] = useState({
    propostasHH: {
      propostaSH: '',
      propostaRH: '',
    },
    propostasVF: {
      propostaSF: '',
      propostaRF: '',
    },
  });
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const inputs = [
    inputsDadosProposta({ values, onChange, setValues }),
    inputsDadosEmpresa({ values, onChange, setValues }),
    inputsValoresProposta({ values, onChange, setValues }),
    inputsDadosTomador({ values, onChange, setValues }),
    inputsDadosVendedor({ values, onChange, setValues }),
  ];

  useEffect(() => {
    Promise.all([
      fetchDepartamentos({ setDepartamentos }),
      fetchPropostas(setPropostas),
      fetchValores(setValues),
      fetchUsuario(setValues),
    ]);
  }, []);

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      codigoProposta:
        tipoProposta === 'Homem Hora'
          ? elo === 'Serviços'
            ? propostas.propostasHH.propostaSH
            : propostas.propostasHH.propostaRH
          : elo === 'Serviços'
          ? propostas.propostasVF.propostaSF
          : propostas.propostasVF.propostaRF,
    }));
  }, [propostas, tipoProposta, elo]);

  const isDataLoading = useMemo(() => {
    return (
      !departamentos.length ||
      Object.values(propostas.propostasHH).some((val) => val === '') ||
      Object.values(propostas.propostasVF).some((val) => val === '')
    );
  }, [departamentos.length, propostas]);

  if (isDataLoading) {
    return <ActivityIndicator />;
  }

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center z-10">
      <div className="w-3/5 flex flex-col items-center gap-8 relative">
        <h1 className="text-3xl text-azul font-semibold">
          Gerador de Proposta de Serviço de Campo
        </h1>
        <div className="flex items-center gap-4 w-[100dvw] justify-center">
          <div className="flex items-center justify-center gap-4">
            <h3>
              Modelo de proposta atual: <u>{tipoProposta}</u>
            </h3>
            <button
              onClick={onOpen}
              className="flex items-center px-3 py-2 rounded-md border hover:bg-[#38457a0e] transition-all border-[#00000031] text-xl font-semibold gap-3"
            >
              Trocar
              <CgArrowsExchange />
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <h3>
              Cadastro da Elo Selecionado: <u>{elo}</u>
            </h3>
            <button
              onClick={onEloOpen}
              className="flex items-center px-3 py-2 rounded-md border hover:bg-[#38457a0e] transition-all border-[#00000031] text-xl font-semibold gap-3"
            >
              Trocar
              <CgArrowsExchange />
            </button>
          </div>
        </div>
        <Stepper
          className="w-full"
          activeLineClassName="bg-azul"
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {steps.map((step, index) => (
            <Step
              key={index + 1}
              className="bg-[#8d99c9] text-white"
              activeClassName="bg-azul text-white"
              completedClassName="bg-azul text-white"
              onClick={() => setActiveStep(index)}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {index + 1}
              <div className="absolute -bottom-[2rem] w-max text-center">
                <p
                  className={`font-semibold transition-all ${
                    activeStep < index ? 'text-[#8d99c9]' : 'text-azul'
                  }`}
                >
                  {step}
                </p>
              </div>
            </Step>
          ))}
        </Stepper>
        <div className="mt-10 grid grid-cols-2 place-items-stretch justify-stretch items-stretch gap-3 w-full h-[40dvh]">
          {inputs[activeStep].map((input, index) => (
            <div key={index}>
              <Input {...input} color="#38457a" />
              <p className="text-md font-medium">{input.placeholder}</p>
            </div>
          ))}
          {activeStep === 3 && (
            <div>
              <Select
                departamentos={departamentos}
                onChange={onChange}
                value={values.departamentoTomador}
                placeholder={'Departamento do tomador'}
                color="#38457a"
              />
              <p className="text-md font-medium">Departamento do tomador</p>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <Select
                departamentos={departamentos}
                onChange={onChange}
                value={values.departamentoVendedor}
                placeholder={'Departamento do vendedor'}
                color="#38457a"
              />
              <p className="text-md font-medium">Departamento do vendedor</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-4 w-full">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`text-white font-semibold rounded-md
                        text-xl px-4 py-2 transition-all hover:opacity-60 ${
                          isFirstStep
                            ? 'bg-[#8d99c9] cursor-not-allowed'
                            : 'bg-azul cursor-pointer'
                        }`}
          >
            Voltar
          </button>
          <button
            onClick={handleNext}
            disabled={isLastStep}
            className={`text-white font-semibold rounded-md
                        text-xl px-4 py-2 cursor-pointer transition-all hover:opacity-60 bg-azul `}
          >
            {isLastStep ? 'Finalizar' : 'Avançar'}
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecionar modelo de proposta</ModalHeader>
          <ModalBody>
            <RadioGroup onChange={setTipoProposta} value={tipoProposta}>
              <Stack direction={'row'} gap={'16px'}>
                <Radio value="Valor Final">Valor Final</Radio>
                <Radio value="Homem Hora">Homem Hora</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup gap={'16px'}>
              <Button
                variant={'ghost'}
                onClick={() => {
                  setTipoProposta('Valor Final');
                  onClose();
                }}
              >
                Voltar
              </Button>
              <Button
                colorScheme={'green'}
                onClick={() => {
                  ShowToast({
                    type: 'success',
                    text: 'Modelo de proposta alterado!',
                    options: { position: 'top-center' },
                  });
                  onClose();
                }}
              >
                Confirmar
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEloOpen} onClose={onEloClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecionar Cadastro da Elo</ModalHeader>
          <ModalBody>
            <RadioGroup onChange={setElo} value={elo}>
              <Stack direction={'row'} gap={'16px'}>
                <Radio value="Serviços">Serviços</Radio>
                <Radio value="Recuperadora">Recuperadora</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup gap={'16px'}>
              <Button
                variant={'ghost'}
                onClick={() => {
                  setElo('Serviços');
                  onEloClose();
                }}
              >
                Voltar
              </Button>
              <Button
                colorScheme={'green'}
                onClick={() => {
                  ShowToast({
                    type: 'success',
                    text: 'Cadastro da Elo alterado!',
                    options: { position: 'top-center' },
                  });
                  onEloClose();
                }}
              >
                Confirmar
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}

export default Form;
