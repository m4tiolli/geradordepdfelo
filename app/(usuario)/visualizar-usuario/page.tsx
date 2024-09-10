"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import ActivityIndicator from "@/components/ActivityIndicator";
import { Usuario as Prop } from "@/interfaces/Usuario";
import Usuario from "@/components/Usuario";

function VisualizarPropostas() {
  const [usuarios, setUsuarios] = useState<Prop[]>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios.get("/api/buscar-usuarios")
      .then((response) => setUsuarios(response.data))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex flex-col w-2/5 h-dvh gap-4 items-center justify-center relative z-20">
      <h1 className="font-semibold text-[#38457a] text-2xl">
        Visualizar Usuarios
      </h1>
      <div className="flex items-center justify-between w-full bg-[#38457a] p-2 rounded-md">
        <input
          placeholder="Pesquisar por usuario"
          className="bg-transparent text-white placeholder:text-[#ffffffa6] outline-none"
          type="search"
          name="pesquisa"
          id="pesquisa"
        />
        <div className="flex items-center justify-center gap-3">
          <button
            className="text-white rounded-md border border-[#ffffffa6] hover:bg-[#ffffff42] transition-all cursor-pointer p-2"
          >
            <IoFilter />
          </button>
          <button className="text-white rounded-md border border-[#ffffffa6] hover:bg-[#ffffff42] transition-all cursor-pointer p-2">
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start gap-4 scroll-m-[30dvh] h-[70dvh] overflow-y-scroll w-full">
        {isLoading ? (<><ActivityIndicator /><h3>Carregando...</h3></>) : usuarios?.map((proposta, index) => (
          <Usuario key={index++} {...proposta} />
        ))}
      </div>
    </div>
  );
}

export default VisualizarPropostas;
