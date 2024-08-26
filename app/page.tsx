/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ActivityIndicator from "@/components/ActivityIndicator";
import { Usuario } from "@/interfaces/Usuario";
import { isTokenValid } from "@/utils/Auth";
import { fetchPrevilegios } from "@/utils/Fetchs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario>();

  useEffect(() => {
    const Verificar = async () => {
      if (!isTokenValid()) {
        router.push("/login");
      } else {
        await fetchPrevilegios({ setUsuario });
      }
    };
    Verificar();
  }, []);

  const Sair = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!usuario) {
    return <ActivityIndicator />;
  }

  return (
    <div className="flex flex-col z-10 items-center justify-center px-4 py-4 rounded-md w-fit h-fit gap-4">
      <p className="absolute top-3 font-semibold text-[#38457a]">
        Conectado como: {usuario.nome}
      </p>
      <h1 className="text-3xl font-semibold text-[#38457a]">Menu</h1>

      <button
        className="bg-[#38457a] text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
        onClick={() => router.push("/form")}
      >
        Gerar proposta
      </button>
      <button
        className="bg-[#38457a] text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
        onClick={() => router.push("/visualizar-propostas")}
      >
        Visualizar propostas
      </button>
      <button
        className="bg-[#38457a] text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
        onClick={() => router.push("/perfil")}
      >
        Atualizar dados do usuário
      </button>
      {usuario.administrador === 1 && (
        <button
          className="bg-[#38457a] text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
          onClick={() => router.push("/cadastrar-usuario")}
        >
          Cadastrar usuário
        </button>
      )}
      <button
        onClick={() => router.push("/alterar-senha")}
        className="bg-[#38457a] text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
      >
        Alterar senha
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
