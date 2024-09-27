'use client';
import React from 'react';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function MyApp() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="h-[90dvh] w-full relative grid place-items-center">
      <div className="flex items-center justify-center rounded-md shadow-md gap-4 px-4 py-2">
        <button
          onClick={() => setPageNumber(pageNumber - 1)}
          className="text-2xl hover:opacity-60 transition-all h-full font-semibold"
          disabled={pageNumber === 1}
        >
          &lt;
        </button>
        <p className="text-xl font-semibold">
          {pageNumber} de {numPages}
        </p>
        <button
          onClick={() => setPageNumber(pageNumber + 1)}
          className="text-2xl hover:opacity-60 transition-all h-full font-semibold"
          disabled={pageNumber === numPages}
        >
          &gt;
        </button>
      </div>
      <Document
        className={'border-azul border-2 p-2 rounded-md shadow-md'}
        file="/propostas/sc/MODELO HH SERVICOS.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page height={500} className={'rounded-xl'} pageNumber={pageNumber} />
      </Document>
    </div>
  );
}

export default MyApp;
