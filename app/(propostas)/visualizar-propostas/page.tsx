"use client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { Proposta as Prop } from "@/interfaces/Proposta";
import Proposta from "@/components/Proposta";
import ActivityIndicator from "@/components/ActivityIndicator";

function VisualizarPropostas() {
  const [propostas, setPropostas] = useState<Prop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maiorValor, setMaiorValor] = useState(50000); // Valor inicial padrão
  const [filtros, setFiltros] = useState({
    valor: [100, 50000],
    nomeEmpresa: "",
    ano: "",
    elo: "",
    codigoProposta: "", // Filtro pelo código da proposta
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Carregar as propostas e calcular o maior valor
  useEffect(() => {
    axios
      .get("/api/ef/buscar-proposta")
      .then((response) => {
        setPropostas(response.data);
        const maxValue = Math.max(...response.data.map((p: Prop) => parseInt(p.valor)));
        setMaiorValor(maxValue);
        setFiltros((prev) => ({
          ...prev,
          valor: [100, maxValue],
        }));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const propostasFiltradas = propostas
    .filter(
      (proposta) =>
        parseInt(proposta.valor) >= filtros.valor[0] &&
        parseInt(proposta.valor) <= filtros.valor[1]
    )
    .filter((proposta) =>
      proposta.nomeEmpresa
        .toLowerCase()
        .includes(filtros.nomeEmpresa.toLowerCase())
    )
    .filter((proposta) =>
      filtros.ano ? proposta.ano === parseInt(filtros.ano) : true
    )
    .filter((proposta) => (filtros.elo ? proposta.elo === filtros.elo : true))
    .filter((proposta) => proposta.proposta.includes(filtros.codigoProposta)); // Filtro por código da proposta

  return (
    <div className="flex flex-col w-3/5 gap-4 items-center justify-center relative z-20">
      <h1 className="font-semibold text-[#38457a] text-2xl">
        Visualizar Propostas
      </h1>
      <div className="flex items-center justify-between w-full bg-[#38457a] p-2 rounded-md">
        <input
          placeholder="Pesquisar por proposta"
          className="bg-transparent text-white placeholder:text-[#ffffffa6] outline-none"
          type="search"
          name="codigoProposta"
          value={filtros.codigoProposta}
          onChange={handleFiltroChange}
          id="codigoProposta"
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filtrar propostas</ModalHeader>
          <ModalBody>
            <ModalCloseButton />
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Valor da Proposta
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <RangeSlider
                    min={100}
                    max={maiorValor} // Usa o maior valor calculado
                    onChange={(val) =>
                      setFiltros((prev) => ({ ...prev, valor: val }))
                    }
                    value={filtros.valor}
                    step={100}
                  >
                    <RangeSliderMark value={100}>R$ 100</RangeSliderMark>
                    <RangeSliderMark value={maiorValor - 1000}>
                      R$ {maiorValor.toLocaleString("pt-BR")}
                    </RangeSliderMark>
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                </AccordionPanel>
              </AccordionItem>

              {/* Filtro por Nome da Empresa */}
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Nome da Empresa
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <input
                    type="text"
                    name="nomeEmpresa"
                    placeholder="Nome da Empresa"
                    value={filtros.nomeEmpresa}
                    onChange={handleFiltroChange}
                  />
                </AccordionPanel>
              </AccordionItem>

              {/* Filtro por Ano */}
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Ano da Proposta
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <input
                    type="text"
                    name="ano"
                    placeholder="Ano"
                    value={filtros.ano}
                    onChange={handleFiltroChange}
                  />
                </AccordionPanel>
              </AccordionItem>

              {/* Filtro por Elo */}
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Cadastro Elo
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Select
                    name="elo"
                    placeholder="Selecione o cadastro da Elo"
                    value={filtros.elo}
                    onChange={(e) =>
                      setFiltros({ ...filtros, elo: e.target.value })
                    }
                  >
                    <option value="S">Serviços</option>
                    <option value="R">Recuperadora</option>
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
      <p className="text-xl font-medium -my-2 text-[#38457a]">
        {!isLoading
          ? propostasFiltradas
            ? propostasFiltradas.length > 1
              ? propostasFiltradas.length + " propostas"
              : propostasFiltradas.length + " proposta"
            : "Sem propostas cadastradas"
          : ""}
      </p>
      <div className="flex flex-col items-center justify-start gap-4 scroll-m-[30dvh] h-[70dvh] overflow-y-scroll relative scroller ml-[30px]">
        {isLoading ? (
          <>
            <ActivityIndicator />
            <h3>Carregando...</h3>
          </>
        ) : (
          propostasFiltradas?.map((proposta, index) => (
            <Proposta key={index++} {...proposta} />
          ))
        )}
      </div>
    </div>
  );
}

export default VisualizarPropostas;
