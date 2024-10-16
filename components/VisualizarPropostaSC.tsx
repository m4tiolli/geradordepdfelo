'use client';
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import axios from 'axios';
import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ButtonGroup, Input } from '@chakra-ui/react';
import Proposta from '@/components/PropostaSC';
import ActivityIndicator from '@/components/ActivityIndicator';
import { pdfjs, Document, Page } from 'react-pdf';
import PDFAtivo from '@/utils/ContextSC';
import FiltroPropostasModal, { FiltroPropostas } from './ModalFiltrosSC';
import { ValuesSC } from '@/interfaces/SC';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/legacy/build/pdf.worker.min.mjs`;

export interface IPropostas extends ValuesSC {
  revisao: number;
  link_pdf: string;
  elo: string
}

function VisualizarPropostas() {
  const router = useRouter()
  const [propostas, setPropostas] = useState<IPropostas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePropostas, setVisiblePropostas] = useState<IPropostas[]>([]);
  const [codigoPropostaFiltro, setCodigoPropostaFiltro] = useState('');
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { isOpen: isVerOpen, onOpen: onVerOpen, onClose: onVerClose } = useDisclosure();
  
  const [numPages, setNumPages] = useState<number>();

  // Estado para armazenar os filtros
  const [filtros,] = useState<FiltroPropostas>({
    nomeEmpresa: "",
    nomeVendedor: "",
    tipoContato: "",
    dataProposta: "",
    codigoProposta: "",
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  useEffect(() => {
    // Carregar propostas da API
    axios.get('/api/sc/buscar-proposta').then((response) => {
      const propostas = response.data;
      setPropostas(propostas);
      setVisiblePropostas(propostas.slice(0, 10)); // Carrega os primeiros 10 propostas
      setIsLoading(false);
    });
  }, []);

  // Função para aplicar os filtros
  const aplicarFiltros = (filtros: FiltroPropostas) => {
    const propostasFiltradas = propostas.filter((proposta: IPropostas) => {
      return (
        (filtros.nomeEmpresa === "" || proposta.nomeEmpresa?.toLowerCase().includes(filtros.nomeEmpresa.toLowerCase())) &&
        (filtros.nomeVendedor === "" || proposta.nomeVendedor?.toLowerCase().includes(filtros.nomeVendedor.toLowerCase())) &&
        (filtros.tipoContato === "" || proposta.tipoContato.toLowerCase() === filtros.tipoContato.toLowerCase()) &&
        (filtros.dataProposta === "" || proposta.dataProposta === filtros.dataProposta) &&
        (filtros.codigoProposta === "" || proposta.codigoProposta?.toLowerCase().includes(filtros.codigoProposta.toLowerCase()))
      );
    });
    setVisiblePropostas(propostasFiltradas.slice(0, 10)); // Atualiza a lista visível com os primeiros 10 filtrados
    onClose()
  };

  // Atualiza o estado do filtro de código da proposta
  const handleCodigoPropostaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCodigoPropostaFiltro(value);

    // Atualiza os filtros e aplica a filtragem
    const updatedFiltros = { ...filtros, codigoProposta: value };
    aplicarFiltros(updatedFiltros);
  };

  // Função para baixar o PDF
  const downloadPdf = async () => {
    setIsLoading(true);
    const res = await axios.get(pdfAtivo?.link_pdf as string, { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfAtivo?.codigoProposta as string;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    setIsLoading(false)
  };

  const { isOpen, onOpen, onClose } = useDisclosure()

  const loadMorePropostas = useCallback(() => {
    setVisiblePropostas((prev) => [
      ...prev,
      ...propostas.slice(prev.length, prev.length + 10),
    ]);
  }, [propostas]);

  // Configurar o Intersection Observer
  useEffect(() => {
    if (isLoading || propostas.length <= visiblePropostas.length) return; // Não observar se já carregou tudo
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePropostas();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [isLoading, visiblePropostas.length, loadMorePropostas]);

  const divFull = useRef<HTMLDivElement>(null)

  function pegarLarguraRelativa() {
    const larguraTotal = divFull.current?.offsetWidth
    if (larguraTotal) {
      const sixty = larguraTotal * 0.6
      return sixty
    }
  }

  const pdfAtivoContext = useContext(PDFAtivo);
  if (!pdfAtivoContext) {
    return <div>Proposta não encontrada.</div>; // Verificação para garantir que o contexto foi carregado
  }
  const [pdfAtivo] = pdfAtivoContext;

  return (<>
    {isLoading && (
      <div className='flex flex-col items-center justify-center fixed top-0 left-0 z-[999] w-screen h-dvh bg-white'>
        <ActivityIndicator color='azul' />
        <h3>Carregando...</h3>
      </div>
    )}
    <div ref={divFull} className="flex flex-col w-screen mt-[18dvh] pb-[10dvh] gap-4 items-center justify-center relative z-20">
      {/* Campo de Filtro para Código da Proposta */}
      <div className='bg-white p-4 rounded-md flex flex-col items-center justify-center gap-4 fixed top-4 z-[999] shadow-lg'>
        <div className='flex items-center justify-center gap-4'>
          <Input
            type="text"
            placeholder="Filtrar pelo Código da Proposta"
            value={codigoPropostaFiltro}
            onChange={handleCodigoPropostaChange}
            focusBorderColor='#38457a'
            variant={'filled'}
            className='w-1/3'
          />
          <Button>
            <FaSearch />
          </Button>
          <Button onClick={onOpen}>
            Filtros
          </Button>
        </div>
        <p>Mostrando {visiblePropostas.length} resultados de {propostas.length} propostas</p>
      </div>

      {/* Botão de Filtro */}
      <FiltroPropostasModal isOpen={isOpen} onClose={onClose} onAplicarFiltros={aplicarFiltros} />

      {/* Lista de Propostas */}
      <div className="grid grid-cols-5 gap-8 items-center justify-center place-items-center">
        {
          visiblePropostas ? visiblePropostas.map((proposta, index) => {
            return (
              <Proposta key={index++} {...proposta} onOpen={onVerOpen} onLoadSuccess={() => { }} />
            );
          }) : (
            <div className='flex flex-col items-center justify-center'>
              <h3>Sem resultados.</h3>
            </div>
          )
        }
      </div>

      {/* Elemento Observado para Carregar Mais */}
      <div ref={observerRef} className="h-10" />

      {/* Modal de Visualização */}
      <Modal isOpen={isVerOpen} onClose={onVerClose} size={"4xl"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
            Visualizar dados da proposta
          </ModalHeader>
          <ModalBody>
            <div className='overflow-y-auto w-full h-[65dvh]'>
              <Document file={pdfAtivo?.link_pdf} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from({ length: numPages as number }, (_, index) => (
                  <Page key={index} pageNumber={index + 1} width={pegarLarguraRelativa()} />
                ))}
              </Document>
            </div>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup gap={"16px"}>
              <Button variant="ghost" onClick={onVerClose}>Fechar</Button>
              <Button colorScheme='green' onClick={() => router.push("/sc/historico")}>Revisões</Button>
              <Button colorScheme='green' onClick={downloadPdf}>Baixar</Button>
              <Button colorScheme='green' onClick={() => router.push("/sc/editar-proposta")}>Editar</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  </>
  );
}

export default VisualizarPropostas;
