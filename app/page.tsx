"use client";
import { isTokenValid } from "@/utils/Auth";
import { ShowToast } from "@/utils/Toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    ShowToast({
      text: "Seja bem-vindo(a)!",
      type: "success",
      options: {
        position: "top-center",
      },
    })
  }, [])

  useEffect(() => {
    isTokenValid() ? router.push("/") : router.push("/login");
  });

  const Sair = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex flex-col z-10 items-center justify-center px-4 py-4 rounded-md w-fit h-fit gap-4">
      <h1 className="text-3xl font-semibold text-[#38457a]">Menu</h1>
      
      <button
        className="bg-[#38457a] text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
        onClick={() => router.push("/form")}
      >
        Gerar proposta
      </button>
      <button
        className="bg-[#38457a] text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
        onClick={() => router.push("/perfil")}
      >
        Atualizar dados do usuário
      </button>
      <button
        onClick={Sair}
        className="bg-[#38457a] text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
      >
        Sair
      </button>
    </div>
  );
}
