import { Usuario as Prop } from "@/interfaces/Usuario"
import { ShowToast } from "@/utils/Toast";
import { useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, Checkbox } from "@chakra-ui/react"
import axios from "axios";
import { useRef, useState } from "react"

function Usuario(prop: Readonly<Prop>) {

  const [newParams, setNewParams] = useState<boolean>(prop.administrador as boolean)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const cancelRef1 = useRef(null);

  const ExcluirUsuario = () => {
    axios.delete(`/api/usuario/${prop.id}`)
      .then(() => {
        ShowToast({
          text: "Usuário excluído com sucesso!",
          type: "success",
          options: {
            position: "top-center"
          }
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)

      })
      .catch((erro) => {
        ShowToast({
          text: erro,
          type: "error",
          options: {
            position: "top-center"
          }
        })
      })
  }

  const EditarUsuario = () => {
    axios.put(`/api/usuario/${prop.id}`, { administrador: newParams })
      .then(() => {
        ShowToast({
          text: "Usuário editado com sucesso!",
          type: "success",
          options: {
            position: "top-center"
          }
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch((erro) => {
        ShowToast({
          text: erro,
          type: "error",
          options: {
            position: "top-center"
          }
        })
      })
  }

  console.log(newParams)

  return (
    <div className="bg-[#38457a] w-full flex items-center justify-between rounded-md px-3 py-2">
      <div>
        <p className="text-white text-md font-semibold">{prop.nome}</p>
        <p className="text-white text-sm font-semibold">{prop.departamento}</p>
        <p className="text-white text-sm font-normal">{prop.email}</p>
      </div>
      <div className="text-right">
        <p className="text-white text-md font-semibold">{prop.telefone1}</p>
        <p className="text-white text-md font-semibold">{prop.telefone2}</p>
        <p className="text-white text-md font-semibold">Administrador: {prop.administrador == 1 ? "sim" : "não"}</p>
      </div>
      <div className="flex gap-3 flex-col flex-wrap items-stretch">
        <button className="font-semibold border border-[#ffffffa6] hover:bg-[#f87171a6] transition-all text-white rounded-md p-2" onClick={onOpen}>Excluir</button>
        <button className="font-semibold border bg-[#ffffffa6] text-[#38457a] transition-all hover:opacity-60 rounded-md p-2" onClick={onEditOpen}>Editar</button>
      </div>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Excluir Usuário
            </AlertDialogHeader>

            <AlertDialogBody>
              Você tem certeza? Essa ação é irreversível.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme='red' onClick={ExcluirUsuario} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isEditOpen}
        leastDestructiveRef={cancelRef1}
        onClose={onEditClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Editar Usuário
            </AlertDialogHeader>

            <AlertDialogBody>
              <Checkbox defaultChecked={newParams} checked={newParams} onChange={(e) => setNewParams(e.target.checked)}>Administrador</Checkbox>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef1} onClick={onEditClose}>
                Cancelar
              </Button>
              <Button colorScheme='green' onClick={EditarUsuario} ml={3}>
                Editar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  )
}

export default Usuario