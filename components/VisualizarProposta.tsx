'use client';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoFilter } from 'react-icons/io5';
import { Proposta as Prop } from '@/interfaces/Proposta';
import Proposta from '@/components/Proposta';
import ActivityIndicator from '@/components/ActivityIndicator';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import PDFAtivo from '@/utils/Context';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

function VisualizarPropostas() {
  const [propostas, setPropostas] = useState<Prop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maiorValor, setMaiorValor] = useState(50000); // Valor inicial padrão
  const [filtros, setFiltros] = useState({
    valor: [100, 50000],
    nomeEmpresa: '',
    ano: '',
    elo: '',
    codigoProposta: '', // Filtro pelo código da proposta
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Carregar as propostas e calcular o maior valor
  useEffect(() => {
    axios
      .get('/api/ef/buscar-proposta')
      .then((response) => {
        setPropostas(response.data);
        const maxValue = Math.max(
          ...response.data.map((p: Prop) => parseInt(p.valor)),
        );
        setMaiorValor(maxValue);
        setFiltros((prev) => ({
          ...prev,
          valor: [100, maxValue],
        }));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const propostasFiltradas = propostas
    .filter(
      (proposta) =>
        parseInt(proposta.valor) >= filtros.valor[0] &&
        parseInt(proposta.valor) <= filtros.valor[1],
    )
    .filter((proposta) =>
      proposta.nomeEmpresa
        .toLowerCase()
        .includes(filtros.nomeEmpresa.toLowerCase()),
    )
    .filter((proposta) =>
      filtros.ano ? proposta.ano === parseInt(filtros.ano) : true,
    )
    .filter((proposta) => (filtros.elo ? proposta.elo === filtros.elo : true))
    .filter((proposta) => proposta.proposta.includes(filtros.codigoProposta)); // Filtro por código da proposta

  const { isOpen: isVerOpen, onOpen: onVerOpen, onClose: onVerClose } = useDisclosure()
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const [pdfAtivo, setPdfAtivo] = useState<Prop>()

  const downloadPdf = async () => {
    setIsLoading(true);
    const res = await axios.get(pdfAtivo?.link_pdf as string, { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfAtivo?.proposta as string;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    setIsLoading(false)
  };

  return (
    <PDFAtivo.Provider value={[pdfAtivo, setPdfAtivo] as never}>
      <div className="flex flex-col w-screen mt-[15dvh] pb-[20dvh] gap-4 items-center justify-center relative z-20">
        <div className='top-0 left-0 fixed w-screen h-[10dvh] backdrop-blur-sm shadow-md flex items-center justify-center z-50'>
          <div className="flex items-center justify-between w-1/3 bg-azul p-2 rounded-md">
            <input
              placeholder="Pesquisar por proposta"
              className="bg-transparent text-white placeholder:text-[#ffffffa6] outline-none"
              type="search"
              name="codigoProposta"
              value={filtros.codigoProposta}
              onChange={handleFiltroChange}
              id="codigoProposta"
            />
            <div className="flex items-center justify-center gap-3">
              <button
                className="text-white rounded-md border border-[#ffffffa6] hover:bg-[#ffffff42] transition-all cursor-pointer p-2"
                onClick={onOpen}
              >
                <IoFilter />
              </button>
              <button className="text-white rounded-md border border-[#ffffffa6] hover:bg-[#ffffff42] transition-all cursor-pointer p-2">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Filtrar propostas</ModalHeader>
            <ModalBody>
              <ModalCloseButton />
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Valor da Proposta
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <RangeSlider
                      min={100}
                      max={maiorValor} // Usa o maior valor calculado
                      onChange={(val) =>
                        setFiltros((prev) => ({ ...prev, valor: val }))
                      }
                      value={filtros.valor}
                      step={100}
                    >
                      <RangeSliderMark value={100}>R$ 100</RangeSliderMark>
                      <RangeSliderMark value={maiorValor - 1000}>
                        R$ {maiorValor.toLocaleString('pt-BR')}
                      </RangeSliderMark>
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                  </AccordionPanel>
                </AccordionItem>

                {/* Filtro por Nome da Empresa */}
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Nome da Empresa
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <input
                      type="text"
                      name="nomeEmpresa"
                      placeholder="Nome da Empresa"
                      value={filtros.nomeEmpresa}
                      onChange={handleFiltroChange}
                    />
                  </AccordionPanel>
                </AccordionItem>

                {/* Filtro por Ano */}
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Ano da Proposta
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <input
                      type="text"
                      name="ano"
                      placeholder="Ano"
                      value={filtros.ano}
                      onChange={handleFiltroChange}
                    />
                  </AccordionPanel>
                </AccordionItem>

                {/* Filtro por Elo */}
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Cadastro Elo
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Select
                      name="elo"
                      placeholder="Selecione o cadastro da Elo"
                      value={filtros.elo}
                      onChange={(e) =>
                        setFiltros({ ...filtros, elo: e.target.value })
                      }
                    >
                      <option value="S">Serviços</option>
                      <option value="R">Recuperadora</option>
                    </Select>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Fechar
              </Button>
              <Button colorScheme="green" onClick={onClose}>
                Aplicar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <p className="text-xl font-medium -my-2 text-azul">
          {!isLoading
            ? propostasFiltradas
              ? propostasFiltradas.length > 1
                ? propostasFiltradas.length + ' propostas'
                : propostasFiltradas.length + ' proposta'
              : 'Sem propostas cadastradas'
            : ''}
        </p>
        <div className="grid grid-cols-4 gap-8 items-center justify-center place-items-center">
          {isLoading ? (
            <div className='flex flex-col items-center justify-center absolute'>
              <ActivityIndicator />
              <h3>Carregando...</h3>
            </div>
          ) : (
            propostasFiltradas?.map((proposta, index) => (
              <Proposta key={index++} {...proposta} onOpen={onVerOpen} />
            ))
          )}
        </div>

        <Modal isOpen={isVerOpen} onClose={onVerClose} size={"6xl"} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton />
              Visualizar dados da proposta
            </ModalHeader>
            <ModalBody>
              <div className='flex items-stretch justify-between'>
                <div className='overflow-y-auto w-[50vw] h-[65dvh]'>
                  <Document file={"https://elosolutions.com.br/propostas/ELOSCH%200005R24%20Rev1.pdf"} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from({ length: numPages as number }, (_, index) => (
                      <Page key={index} pageNumber={index + 1} width={650} />
                    ))}
                  </Document>
                </div>
                <div className='w-[30vw] flex flex-col items-center justify-start'>
                  <h1>{pdfAtivo?.proposta}</h1>
                  <h3>{pdfAtivo?.nomeEmpresa}</h3>
                  <p>{pdfAtivo?.data}</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup gap={"16px"}>
                <Button variant="ghost">Fechar</Button>
                <Button colorScheme='green'>Editar</Button>
                <Button colorScheme='green' onClick={downloadPdf}>Baixar</Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </PDFAtivo.Provider>
  );
}

export default VisualizarPropostas;
