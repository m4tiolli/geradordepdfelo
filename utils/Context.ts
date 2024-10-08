import { createContext, Dispatch, SetStateAction } from 'react';
import { Proposta as Prop } from '@/interfaces/Proposta';

// Contexto que mantém tanto o estado quanto o setter
type PDFAtivoContextType = [Prop | undefined, Dispatch<SetStateAction<Prop | undefined>>];

const PDFAtivo = createContext<PDFAtivoContextType | undefined>(undefined);

export default PDFAtivo;
