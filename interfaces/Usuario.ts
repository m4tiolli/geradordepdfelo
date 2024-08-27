export interface Usuario {
  id?: number;
  nome: string;
  departamento: string;
  telefone1: string;
  telefone2: string;
  email: string;
  administrador: boolean | number;
}

export interface SetUsuario {
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | undefined>>;
}
