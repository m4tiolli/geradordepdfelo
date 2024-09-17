import { Sair } from "@/utils/ActionsHome";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const buttons = (router: AppRouterInstance) => [
  {
    label: "Gerar proposta",
    action: () => router.push("/selecionar-proposta"),
  },
  {
    label: "Visualizar propostas",
    action: () => router.push("/visualizar-propostas"),
  },
  {
    label: "Atualizar dados do perfil",
    action: () => router.push("/perfil"),
  },
  {
    label: "Alterar senha",
    action: () => router.push("/alterar-senha"),
  },
  {
    label: "Sair",
    action: Sair,
  },
];

export const adminButtons = (router: AppRouterInstance) => [
  {
    label: "Cadastrar usuário",
    action: () => router.push("/cadastrar-usuario"),
  },
  {
    label: "Visualizar usuários",
    action: () => router.push("/visualizar-usuario"),
  },
];