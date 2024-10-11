"use client"
import ActivityIndicator from '@/components/ActivityIndicator';
import Input from '@/components/Input';
import { Departamentos } from '@/interfaces/Formulario';
import { inputsDadosProposta, inputsDadosTomador, inputsDadosVendedor, inputsDadosEmpresa, inputsValoresProposta } from '@/mocks/InputsSC';
import PDFAtivo from '@/utils/ContextSC'
import { Button, ButtonGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tooltip, useDisclosure } from '@chakra-ui/react';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { Stepper, Step } from '@material-tailwind/react';
import { fetchDepartamentos } from '@/utils/Fetchs';
import Select from '@/components/Select';
import { IPropostas } from '@/components/VisualizarPropostaSC';
import { useRouter } from 'next/navigation';
import { ShowToast } from '@/utils/Toast';
import axios from 'axios';
import { getToken, isTokenValid } from '@/utils/Auth';

function EditarProposta() {
  const router = useRouter()
  const pdfAtivoContext = useContext(PDFAtivo);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkPdf, setLinkPdf] = useState("")
  const [token, setToken] = useState('');
  const [values, setValues] = useState<IPropostas>({
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
    validadeProposta: '',
    valorTecnico: '',
    valorKM: '',
    valorDiaria: '',
    condicaoPagamento:
      '',
    dataAtendimento:
      '',
    escopo:
      '',
    link_pdf: "",
    revisao: 1
  });
  const { isOpen: isSucessoOpen, onOpen: onSucessoOpen, onClose: onSucessoClose } = useDisclosure()

  if (!pdfAtivoContext) {
    throw new Error("Sem PDF Ativo.");
  }

  const [pdfAtivo] = pdfAtivoContext;

  useEffect(() => {
    if (!isTokenValid()) {
      ShowToast({
        type: 'error',
        text: 'Sessão expirada, faça o login novamente',
        options: { position: 'top-center' },
      });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setToken(getToken() as string);
    }
  }, [setToken, router]);

  useEffect(() => {
    if (pdfAtivo) {
      setValues(pdfAtivo)
      setValues((prev) => ({ ...prev, dataProposta: new Date().toISOString().slice(0, 10) }))
    } else {
      router.push("/sc/visualizar-proposta")
    }
  }, [pdfAtivo])

  const handleNext = () => {
    if (!isLastStep) {
      setActiveStep((cur) => cur + 1);
    } else {
      gerarPdf();
    }
  };
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handle = () => {
    if (isLastStep) {
      gerarPdf();
    } else {
      handleNext();
    }
  };

  const steps = [
    'Dados da Proposta',
    'Dados da Empresa',
    'Valores da Proposta',
    'Dados do Tomador',
    'Dados do Vendedor',
  ];

  const inputs = [
    inputsDadosProposta({ values, onChange, setValues }),
    inputsDadosEmpresa({ values, onChange, setValues }),
    inputsValoresProposta({ values, onChange, setValues }),
    inputsDadosTomador({ values, onChange, setValues }),
    inputsDadosVendedor({ values, onChange, setValues }),
  ];

  useEffect(() => {
    fetchDepartamentos({ setDepartamentos })
  }, [])

  const gerarPdf = async () => {
    setIsLoading(true);
    const body = {
      ...values,
      revisao: values.revisao + 1,
    };

    await axios
      .post('/api/sc/gerar-pdf', body, {
        headers: { Authorization: token },
        timeout: 30000
      })
      .then((response) => {
        setLinkPdf(response.data.downloadLink)
        setIsLoading(false);
        ShowToast({
          text: 'Proposta gerada com sucesso!',
          type: 'success',
          options: {
            position: 'top-center',
          },
        });
        onSucessoOpen()
      })
      .catch((err) => {
        console.log(err);
        ShowToast({
          text: 'Ocorreu um erro ao gerar a proposta.',
          type: 'error',
          options: {
            position: 'top-center',
          },
        });
        setIsLoading(false);
      });
  };

  console.log(values)
  console.log(pdfAtivo)

  return (
    <div className="w-3/5 flex flex-col items-center gap-8 relative">
      <h1 className="text-3xl text-azul font-semibold">
        Criar Revisão Proposta Serviço de Campo
      </h1>
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
                className={`font-semibold transition-all ${activeStep < index ? 'text-[#8d99c9]' : 'text-azul'
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
          <div key={index++}>
            <Input {...input} color="#38457a" />
            <p className="text-md font-medium">{input.placeholder}</p>
          </div>
        ))}

        {activeStep === 0 && (
          <>
            <div className="w-full">
              <span className="relative flex items-center gap-2">
                <textarea
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      escopo: e.target.value,
                    }))
                  }
                  name=""
                  id=""
                  rows={3}
                  cols={1}
                  className={`appearance-none bg-[#38457a0e] border min-w-fit w-full transition-all ${values.escopo !== ''
                    ? 'border-[#38457a]'
                    : 'border-[#38457a27]'
                    } outline-none text-sm rounded-md p-2 placeholder:text-[#38457aa6] text-azul`}
                  defaultValue={values.escopo}
                />
                <Tooltip label={'Escopo do serviço'} fontSize="md">
                  <span>
                    <IoMdHelpCircleOutline className="text-azul text-2xl" />
                  </span>
                </Tooltip>
              </span>
              <p className="text-md font-medium">Escopo</p>
            </div>

            <div className="w-full">
              <span className="relative flex items-center gap-2">
                <textarea
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      dataAtendimento: e.target.value,
                    }))
                  }
                  name=""
                  id=""
                  rows={3}
                  cols={1}
                  className={`appearance-none bg-[#38457a0e] border min-w-fit w-full transition-all ${values.dataAtendimento !== ''
                    ? 'border-[#38457a]'
                    : 'border-[#38457a27]'
                    } outline-none text-sm rounded-md p-2 placeholder:text-[#38457aa6] text-azul`}
                  defaultValue={values.dataAtendimento}
                />
                <Tooltip
                  label={'Data do atendimento do serviço'}
                  fontSize="md"
                >
                  <span>
                    <IoMdHelpCircleOutline className="text-azul text-2xl" />
                  </span>
                </Tooltip>
              </span>
              <p className="text-md font-medium">Data do Atendimento</p>
            </div>
          </>
        )}

        {activeStep === 3 && (
          <div>
            <Select
              departamentos={departamentos}
              onChange={onChange}
              value={values.departamentoTomador}
              placeholder={'Departamento do tomador'}
              color="#38457a"
              name="departamentoTomador"
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
              name="departamentoVendedor"
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
                          text-xl px-4 py-2 transition-all hover:opacity-60 ${isFirstStep
              ? 'bg-[#8d99c9] cursor-not-allowed'
              : 'bg-azul cursor-pointer'
            }`}
        >
          Voltar
        </button>
        <button
          onClick={handle}
          className={`text-white font-semibold rounded-md grid place-items-center
                          text-xl w-32 px-4 py-2 cursor-pointer transition-all hover:opacity-60 bg-azul `}
        >
          {isLoading ? (
            <ActivityIndicator color={'azul'} />
          ) : isLastStep ? (
            'Finalizar'
          ) : (
            'Avançar'
          )}
        </button>
      </div>

      <Modal isOpen={isSucessoOpen} onClose={onSucessoClose} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Proposta gerada!</ModalHeader>
          <ModalBody>A proposta foi gerada com sucesso e já está disponível para visualização.</ModalBody>
          <ModalFooter>
            <ButtonGroup gap={'16px'}>
              <Button
                variant={'ghost'}
                onClick={() => router.push("/")}
              >
                Voltar
              </Button>
              <Button
                colorScheme={'green'}
                onClick={() => window.open(linkPdf, "_blank")}
              >
                Visualizar
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default EditarProposta