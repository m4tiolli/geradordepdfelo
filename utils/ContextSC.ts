import { createContext, Dispatch, SetStateAction } from 'react';
import { ValuesSC } from '@/interfaces/SC';

// Contexto que mantém tanto o estado quanto o setter
type PDFAtivoContextType = [ValuesSC | undefined, Dispatch<SetStateAction<ValuesSC | undefined>>];

const PDFAtivo = createContext<PDFAtivoContextType | undefined>(undefined);

export default PDFAtivo;
