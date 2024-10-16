import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
export const Sair = (router: AppRouterInstance) => {
  localStorage.removeItem("token");
  router.push("/login");
};