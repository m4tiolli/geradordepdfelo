"use client";
import { isTokenValid } from "./Auth";
import { fetchPrevilegios } from "./Fetchs";
import { Dispatch, SetStateAction } from "react";
import { Usuario } from "@/interfaces/Usuario";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ShowToast } from "./Toast";

interface IVerificarPrivilegios {
  setUsuario?: Dispatch<SetStateAction<Usuario | undefined>>;
  router: AppRouterInstance;
}

export const VerificarPrivilegios = async ({
  setUsuario,
  router,
}: IVerificarPrivilegios) => {
  if (!isTokenValid()) {
    ShowToast({
      type: "error",
      text: "Sessão expirada, faça o login novamente",
      options: { position: "top-center" },
    });
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } else {
    if(setUsuario){
      await fetchPrevilegios(setUsuario);
    }
  }
};
