export interface Usuario {
  id?: number;
  nome: string;
  departamento: string;
  telefone1: string;
  telefone2: string;
  email: string;
  administrador: boolean | number;
  assinatura: string;
}