import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const buttons = (router: AppRouterInstance) => [
  {
    label: "Eficiência Energética",
    action: () => router.push("/ef/visualizar-proposta")
  },
  {
    label: "Serviço de Campo",
    action: () => router.push("/sc/visualizar-proposta")
  }
]