import router from "next/router";

export const Sair = () => {
  localStorage.removeItem("token");
  router.push("/login");
};