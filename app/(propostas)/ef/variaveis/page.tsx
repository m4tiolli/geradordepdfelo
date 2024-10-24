"use client"
import ActivityIndicator from '@/components/ActivityIndicator'
import { ShowToast } from '@/utils/Toast'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  useDisclosure,
} from '@chakra-ui/react'
import { inputsVariaveisEF } from '@/mocks/InputsVarsEF'
import Input from '@/components/Input'

export interface Valores {
  id: number,
  meses: number,
  valor: number,
  porcentagem: number,
  implementacao: number
}

function Variaveis() {

  const [values, setValues] = useState<Valores[]>([])

  const [activeValue, setActiveValue] = useState<Valores>({ id: 0, meses: 0, valor: 0, porcentagem: 0, implementacao: 0 })

  const [novoValue, setNovoValue] = useState<Valores>({ id: 0, meses: 0, valor: 0, porcentagem: 0, implementacao: 0 })

  const [isLoading, setIsLoading] = useState(false)

  const { isOpen: isEditarOpen, onOpen: onEditarOpen, onClose: onEditarClose } = useDisclosure()

  const { isOpen: isNovoOpen, onOpen: onNovoOpen, onClose: onNovoClose } = useDisclosure()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<object>>) => {
    const { name, value } = e.target;
    setValue(prev => ({
      ...prev,
      [name]: value
    }))
  };

  useEffect(() => {
    axios.get("/api/ef/valores")
      .then(response => setValues(response.data))
      .catch(err => console.error(err))
  }, [])

  const AtualizarValores = () => {
    setIsLoading(true)
    axios.put("/api/ef/valores", activeValue)
      .then(() => {
        ShowToast({ type: "success", text: "Valores atualizados com sucesso!", options: { position: 'top-center' } });
        setIsLoading(false)
        onEditarClose()
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      })
      .catch((err) => {
        ShowToast({ type: "error", text: "Ocorreu um erro ao atualizar os dados, " + err, options: { position: 'top-center' } });
        setIsLoading(false)
      })
  }

  const CadastrarValor = () => {
    setIsLoading(true)
    axios.post("/api/ef/valores", novoValue)
      .then(() => {
        ShowToast({ type: "success", text: "Valores criados com sucesso!", options: { position: 'top-center' } });
        setIsLoading(false)
        onNovoClose()
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      })
      .catch((err) => {
        ShowToast({ type: "error", text: "Ocorreu um erro ao criar os dados, " + err, options: { position: 'top-center' } });
        setIsLoading(false)
      })
  }

  const DeletarValor = (id: number) => {
    setIsLoading(true);
    axios.delete("/api/ef/valores", {headers: {id: id}})
      .then(() => {
        ShowToast({ type: "success", text: "Valor deletado com sucesso!", options: { position: 'top-center' } });
        setIsLoading(false)
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      })
      .catch((err) => {
        ShowToast({ type: "error", text: "Ocorreu um erro ao deletar os dados, " + err, options: { position: 'top-center' } });
        setIsLoading(false)
      })
  }

  if (values.length === 0) return <ActivityIndicator color='azul' />

  return (
    <div className='relative flex flex-col items-center justify-center gap-4 w-fit h-fit p-4 '>
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>Fatores financeiros para cálculo de valores</TableCaption>
          <Thead>
            <Tr>
              <Th>Meses</Th>
              <Th>Valor por KVA</Th>
              <Th isNumeric>Conta mensal multiplicada por</Th>
              <Th isNumeric>Tempo para implementação</Th>
              <Th>Ação</Th>
            </Tr>
          </Thead>
          <Tbody>
            {values.map((value, index) => (
              <Tr key={index}>
                <Td>{value.meses} meses</Td>
                <Td>{value.valor} reais</Td>
                <Td isNumeric>{value.porcentagem}%</Td>
                <Td isNumeric>{value.implementacao} dias</Td>
                <Td><Button mr={'1rem'} onClick={() => { setActiveValue(value); onEditarOpen() }}>Editar</Button><Button colorScheme='red' onClick={() => DeletarValor(value.id)}>Excluir</Button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Button colorScheme='green' onClick={onNovoOpen}>Cadastrar novo</Button>

      <Modal isOpen={isEditarOpen} onClose={onEditarClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Editar fator financeiro
            <ModalCloseButton onClick={onEditarClose} />
          </ModalHeader>
          <ModalBody>
            <div className='flex flex-col items-center justify-center gap-5'>
              {inputsVariaveisEF({ values: activeValue, onChange, setValue: setActiveValue as React.Dispatch<React.SetStateAction<object>> }).map((input, index) => (
                <div key={index} className='w-full'>
                  <p className='text-md font-semibold text-azul'>{input.dica}</p>
                  <Input {...input} color='#38457a' type='number' />
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup gap={'1rem'}>
              <Button onClick={onEditarClose}>Cancelar</Button>
              <Button colorScheme='green' onClick={AtualizarValores}>{isLoading ? <ActivityIndicator /> : "Atualizar"}</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isNovoOpen} onClose={onNovoClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Criar novo fator financeiro
            <ModalCloseButton onClick={onNovoClose} />
          </ModalHeader>
          <ModalBody>
            <div className='flex flex-col items-center justify-center gap-5'>
              {inputsVariaveisEF({ values: novoValue, onChange, setValue: setNovoValue as React.Dispatch<React.SetStateAction<object>> }).map((input, index) => (
                <div key={index} className='w-full'>
                  <p className='text-md font-semibold text-azul'>{input.dica}</p>
                  <Input {...input} color='#38457a' type='number' />
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup gap={'1rem'}>
              <Button onClick={onNovoClose}>Cancelar</Button>
              <Button colorScheme='green' onClick={CadastrarValor}>{isLoading ? <ActivityIndicator /> : "Cadastrar"}</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Variaveis
