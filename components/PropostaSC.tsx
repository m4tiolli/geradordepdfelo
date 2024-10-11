'use client'
import PDFAtivo from '@/utils/ContextSC';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import ActivityIndicator from './ActivityIndicator';
import { ValuesSC } from '@/interfaces/SC';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.4.168/legacy/build/pdf.worker.min.mjs`;

interface IPropostaSC extends ValuesSC {
  onOpen: () => void;
  onLoadSuccess: () => void;
  link_pdf: string;
}

function Proposta({ onLoadSuccess, ...prop }: Readonly<IPropostaSC>) {
  const [isLoading, setIsLoading] = useState(false);

  const link = prop.link_pdf;
  const downloadPdf = async () => {
    setIsLoading(true);
    const res = await axios.get(link, { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = prop.codigoProposta;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    setIsLoading(false);
  };

  const [,setNumPages] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    onLoadSuccess(); // Notifica que o PDF foi carregado
  }

  const pdfAtivoContext = useContext(PDFAtivo);

  if (!pdfAtivoContext) {
    throw new Error("useContext(PDFAtivo) must be used within a PDFAtivoProvider");
  }

  const [, setPdfAtivo] = pdfAtivoContext; // Desestruturação correta do contexto

  return (
    <div className='h-fit w-fit p-4 rounded-md bg-[#efefef] shadow-lg flex flex-col items-center justify-center gap-6'>
      <Document onClick={() => { setPdfAtivo(prop); prop.onOpen(); }} className={"cursor-pointer transition-all hover:opacity-60"} file={prop.link_pdf} onLoadSuccess={onDocumentLoadSuccess}>
        <Page className={"cursor-pointer"} pageNumber={1} height={200} width={150} />
      </Document>
      <div className='flex items-center justify-center flex-col gap-1'>
        <h1 className='font-bold text-xl'>{prop.codigoProposta}</h1>
        <h3 className='font-normal text-lg'>{prop.nomeEmpresa}</h3>
      </div>
      <div className='flex gap-4 items-center justify-center'>
        <Button variant={"outline"} onClick={() => { setPdfAtivo(prop); prop.onOpen(); }} colorScheme='green'>Ver</Button>
        <Button colorScheme='green' onClick={downloadPdf}>{isLoading ? <ActivityIndicator /> : "Baixar"}</Button>
      </div>
    </div>
  );
}

export default Proposta;
