"use client"
import { getToken, isTokenValid } from '@/utils/Auth';
import PDFAtivo from '@/utils/ContextSC';
import { ShowToast } from '@/utils/Toast';
import { Accordion, AccordionItem, AccordionButton, Box, AccordionIcon, AccordionPanel } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

interface IProposta {
  link_pdf: string;
  revisao: number
}

function Historico() {

  const pdfAtivoContext = useContext(PDFAtivo);
  const [, setToken] = useState("")
  const router = useRouter()
  const [width, setWidth] = useState(0)
  const [propostas, setPropostas] = useState<IProposta[]>([])

  if (!pdfAtivoContext) {
    throw new Error("useContext(PDFAtivo) must be used within a PDFAtivoProvider");
  }

  const [pdfAtivo,] = pdfAtivoContext; // Desestruturação correta do contexto

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
      setWidth(window.innerWidth * .6)
    }
  }, [setToken, router]);

  useEffect(() => {
    if (!pdfAtivo) {
      router.push("/sc/visualizar-proposta")
    } else {
      axios.get("/api/sc/historico?codigo=" + pdfAtivo?.codigoProposta)
        .then(response => setPropostas(response.data))
        .catch(err => console.error(err))
    }
  }, [pdfAtivo])

  console.log(propostas);
  

  return (
    <div className='relative flex flex-col gap-4 items-center'>
      <h1 className='text-3xl text-azul font-semibold text-center'>Histórico de revisões</h1>
      <h3 className='text-xl font-semibold text-center text-azul'>{pdfAtivo?.codigoProposta}</h3>
      <Accordion allowToggle w={width}>
        {propostas.map((proposta, index) => (
          <AccordionItem key={index++}>
            <h2>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  {pdfAtivo?.codigoProposta} Rev {proposta.revisao}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <iframe src={proposta.link_pdf} width={"100%"} height={"600px"} />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default Historico