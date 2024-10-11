import { createContext, Dispatch, SetStateAction } from 'react';
import { IPropostas } from '@/components/VisualizarPropostaSC';

// Contexto que mantém tanto o estado quanto o setter
type PDFAtivoContextType = [IPropostas | undefined, Dispatch<SetStateAction<IPropostas | undefined>>];

const PDFAtivo = createContext<PDFAtivoContextType | undefined>(undefined);

export default PDFAtivo;
