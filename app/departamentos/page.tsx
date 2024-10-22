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
import Input from '@/components/Input'
import { inputsVariaveisDepts } from '@/mocks/InputsVarsDepts'

export interface Valores {
  id: number,
  nome: string
}

function Variaveis() {

  const [values, setValues] = useState<Valores[]>([])

  const [activeValue, setActiveValue] = useState<Valores>({ id: 0, nome: "" })

  const [novoValue, setNovoValue] = useState<Valores>({ id: 0, nome: "" })

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
    axios.get("/api/departamentos")
      .then(response => setValues(response.data))
      .catch(err => console.error(err))
  }, [])

  const AtualizarValores = () => {
    setIsLoading(true)
    axios.put("/api/departamentos", activeValue)
      .then(() => {
        ShowToast({ type: "success", text: "Departamento atualizado com sucesso!", options: { position: 'top-center' } });
        setIsLoading(false)
        onEditarClose()
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      })
      .catch((err) => {
        ShowToast({ type: "error", text: "Ocorreu um erro ao atualizar o departamento, " + err, options: { position: 'top-center' } });
        setIsLoading(false)
      })
  }

  const CadastrarValor = () => {
    setIsLoading(true)
    axios.post("/api/departamentos", novoValue)
      .then(() => {
        ShowToast({ type: "success", text: "Departamento criado com sucesso!", options: { position: 'top-center' } });
        setIsLoading(false)
        onNovoClose()
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      })
      .catch((err) => {
        ShowToast({ type: "error", text: "Ocorreu um erro ao criar o departamento, " + err, options: { position: 'top-center' } });
        setIsLoading(false)
      })
  }

  const DeletarValor = (id: number) => {
    setIsLoading(true);
    axios.delete("/api/departamentos", { headers: { id: id } })
      .then(() => {
        ShowToast({ type: "success", text: "Departamento deletado com sucesso!", options: { position: 'top-center' } });
        setIsLoading(false)
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      })
      .catch((err) => {
        ShowToast({ type: "error", text: "Ocorreu um erro ao deletar o departamento, " + err, options: { position: 'top-center' } });
        setIsLoading(false)
      })
  }

  if (values.length === 0) return <ActivityIndicator color='azul' />

  return (
    <div className='relative flex flex-col items-center justify-center gap-4 w-fit h-fit p-4 '>
      <TableContainer>
        <Table variant='simple'>
          <TableCaption>Departamentos de tomadores e vendedores</TableCaption>
          <Thead>
            <Tr>
              <Th>Departamento</Th>
              <Th>Ação</Th>
            </Tr>
          </Thead>
          <Tbody>
            {values.map((value, index) => (
              <Tr key={index}>
                <Td>{value.nome}</Td>
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
              {inputsVariaveisDepts({ values: activeValue, onChange, setValue: setActiveValue as React.Dispatch<React.SetStateAction<object>> }).map((input, index) => (
                <div key={index} className='w-full'>
                  <p className='text-md font-semibold text-azul'>{input.dica}</p>
                  <Input {...input} color='#38457a' />
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
            Criar novo Departamento
            <ModalCloseButton onClick={onNovoClose} />
          </ModalHeader>
          <ModalBody>
            <div className='flex flex-col items-center justify-center gap-5'>
              {inputsVariaveisDepts({ values: novoValue, onChange, setValue: setNovoValue as React.Dispatch<React.SetStateAction<object>> }).map((input, index) => (
                <div key={index} className='w-full'>
                  <p className='text-md font-semibold text-azul'>{input.dica}</p>
                  <Input {...input} color='#38457a' />
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
