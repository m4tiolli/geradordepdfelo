'use client';
import React from 'react';
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

function Form() {
  const steps = [
    'Dados da Proposta',
    'Dados da Empresa',
    'Valores da Proposta',
    'Dados do Tomador',
    'Dados do Vendedor',
  ];
  const [tipoProposta, setTipoProposta] = useState('vf');
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
    entradaProposta: '',
    dataProposta: '',
    dataFullProposta: '',
    codigoProposta: '',
    validadeProposta: '',
    valorTecnico: '',
    valorKM: '',
    valorDiaria: '',
    condicaoPagamento: '',
  });
  const [activeStep, setActiveStep] = useState(0);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const inputs = [
    inputsDadosProposta({ values, onChange }),
    inputsDadosEmpresa({ values, onChange }),
    inputsValoresProposta({ values, onChange }),
    inputsDadosTomador({ values, onChange }),
    inputsDadosVendedor({ values, onChange }),
  ];

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center z-10">
      <div className="w-3/5 flex flex-col items-center gap-8 relative">
        <h1 className="text-3xl text-azul font-semibold">
          Gerador de Proposta de Serviço de Campo
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
            <Input {...input} key={index} color="#38457a" />
          ))}
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
    </main>
  );
}

export default Form;
