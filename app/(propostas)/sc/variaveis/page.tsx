"use client"
import ActivityIndicator from '@/components/ActivityIndicator'
import Input from '@/components/Input'
import { IPropostas } from '@/components/VisualizarPropostaSC'
import { inputsVariaveisSC } from '@/mocks/InputsVarsSC'
import { ShowToast } from '@/utils/Toast'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Variaveis() {

  const [values, setValues] = useState<Pick<IPropostas, 'valorKM' | 'valorDiaria'>>({
    valorKM: '',
    valorDiaria: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    axios.get("/api/sc/valores")
      .then(response => setValues(response.data[0]))
      .catch(err => console.error(err))
  }, [])

  const AtualizarValores = () => {
    setIsLoading(true)
    axios.put("/api/sc/valores", values)
      .then(() => {
        ShowToast({ type: "success", text: "Valores atualizados com sucesso!", options: { position: 'top-center' } });
        setIsLoading(false)
      })
      .catch((err) => {
        ShowToast({ type: "error", text: "Ocorreu um erro ao atualizar os dados, " + err, options: { position: 'top-center' } });
        setIsLoading(false)
      })
  }

  return (
    <div className='relative flex flex-col items-center justify-center gap-4 w-fit h-fit p-4 '>
      <h1 className='text-xl font-semibold text-azul'>Alterar valores das propostas de serviço de campo</h1>
      <div className='w-full flex flex-col items-stretch justify-center gap-3'>
        {inputsVariaveisSC({
          values: values as IPropostas,
          onChange,
          setValues: setValues as React.Dispatch<React.SetStateAction<IPropostas>>
        }).map((input, index) => (
          <div key={index++}>
            <Input {...input} color='#38457a' />
            <p className="text-md font-medium">{input.placeholder}</p>
          </div>
        ))}
      </div>
      <button
        className={`text-white bg-azul px-4 py-2 w-full flex items-center justify-center transition-all hover:opacity-60 rounded-md font-semibold ${isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
        onClick={AtualizarValores}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator /> : 'Atualizar'}
      </button>
    </div>
  )
}

export default Variaveis
