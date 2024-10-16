'use client';
import ActivityIndicator from '@/components/ActivityIndicator';
import { Usuario } from '@/interfaces/Usuario';
import { adminButtons, buttons } from '@/mocks/ButtonsHome';
import { VerificarPrivilegios } from '@/utils/Verificacoes';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ButtonGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario>();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    VerificarPrivilegios({ setUsuario, router });
  }, [router]);

  useEffect(() => {
    if (usuario && !usuario.assinatura) {
      onOpen();
    }
  }, [usuario]);

  if (!usuario) {
    return <ActivityIndicator />;
  }

  return (
    <div className="flex flex-row z-10 items-stretch justify-center px-4 py-4 rounded-md w-2/5 h-fit gap-10">
      <p className="absolute top-3 font-semibold text-azul">
        Conectado como: {usuario.nome}
      </p>
      <div className='flex flex-col items-center justify-start gap-3 w-1/2'>
        <h1 className="text-3xl font-semibold text-azul">Menu</h1>
        {buttons(router).map((button, index) => (
          <button
            key={index}
            className="bg-azul text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
            onClick={() => button.action(router)}
          >
            {button.label}
          </button>
        ))}
      </div>
      {usuario.administrador === 1 ?

        <div className='flex flex-col items-center justify-start gap-3 w-1/2'>
          <h1 className="text-3xl font-semibold text-azul text-center">Administrativo</h1>
          {usuario.administrador === 1 &&
            adminButtons(router).map((button, index) => (
              <button
                key={index}
                className="bg-azul text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
                onClick={button.action}
              >
                {button.label}
              </button>
            ))}
        </div>
        : ""}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lembrete</ModalHeader>
          <ModalBody>Você ainda não cadastrou a sua assinatura. Propostas geradas por você não terão sua assinatura</ModalBody>
          <ModalFooter>
            <ButtonGroup gap={'16px'}>
              <Button onClick={onClose} variant={'ghost'}>Fechar</Button>
              <Button onClick={() => router.push("/perfil")} colorScheme='green'>Cadastrar assinatura</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
