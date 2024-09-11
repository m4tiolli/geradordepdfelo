"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import ActivityIndicator from "@/components/ActivityIndicator";
import { Usuario as Prop } from "@/interfaces/Usuario";
import Usuario from "@/components/Usuario";

function VisualizarUsuarios() {
  const [usuarios, setUsuarios] = useState<Prop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    nome: "",
    administrador: "", // Agora é uma string para compatibilidade com o Select
    departamento: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(usuarios);
  

  useEffect(() => {
    axios
      .get("/api/buscar-usuarios")
      .then((response) => setUsuarios(response.data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleFiltroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const usuariosFiltrados = usuarios
    .filter((usuario) =>
      usuario.nome.toLowerCase().includes(filtros.nome.toLowerCase())
    )
    .filter((usuario) =>
      filtros.administrador
        ? usuario.administrador == Number(filtros.administrador)
        : true
    )
    .filter((usuario) =>
      filtros.departamento
        ? usuario.departamento === filtros.departamento
        : true
    );

  return (
    <div className="flex flex-col w-3/5 h-dvh gap-4 items-center justify-center relative z-20">
      <h1 className="font-semibold text-[#38457a] text-2xl">
        Visualizar Usuários
      </h1>
      <div className="flex items-center justify-between w-full bg-[#38457a] p-2 rounded-md">
        <input
          placeholder="Pesquisar por nome"
          className="bg-transparent text-white placeholder:text-[#ffffffa6] outline-none"
          type="search"
          name="nome"
          value={filtros.nome}
          onChange={handleFiltroChange}
          id="nome"
        />
        <div className="flex items-center justify-center gap-3">
          <button
            className="text-white rounded-md border border-[#ffffffa6] hover:bg-[#ffffff42] transition-all cursor-pointer p-2"
            onClick={onOpen}
          >
            <IoFilter />
          </button>
          <button className="text-white rounded-md border border-[#ffffffa6] hover:bg-[#ffffff42] transition-all cursor-pointer p-2">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Modal de Filtros */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filtrar usuários</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion allowToggle>
              {/* Filtro por Administrador */}
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Administrador
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Select
                    name="administrador"
                    placeholder="Selecione uma opção"
                    value={filtros.administrador}
                    onChange={handleFiltroChange}
                  >
                    <option value="1">Administrador</option>
                    <option value="0">Usuário</option>
                  </Select>
                </AccordionPanel>
              </AccordionItem>

              {/* Filtro por Departamento */}
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Departamento
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Select
                    name="departamento"
                    placeholder="Selecione o departamento"
                    value={filtros.departamento}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todos</option>
                    <option value="Expedição">Expedição</option>
                    <option value="Engenharia">Engenharia</option>
                    <option value="Compras">Compras</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Diretoria">Diretoria</option>
                    <option value="Produção">Produção</option>
                    <option value="Manutenção">Manutenção</option>
                  </Select>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button colorScheme="green" onClick={onClose}>
              Aplicar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Lista de Usuários */}
      <div className="flex scroller ml-[10px] flex-col items-center justify-start gap-4 scroll-m-[30dvh] h-[70dvh] overflow-y-scroll w-full">
        {isLoading ? (
          <>
            <ActivityIndicator />
            <h3>Carregando...</h3>
          </>
        ) : (
          usuariosFiltrados?.map((usuario, index) => (
            <Usuario key={index} {...usuario} />
          ))
        )}
      </div>
    </div>
  );
}

export default VisualizarUsuarios;
