"use client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
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
  Stack,
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
  const [propostas, setPropostas] = useState<Prop[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [sliderValues, setSliderValues] = useState([30000, 430000]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios.get("/api/buscar-proposta")
      .then((response) => setPropostas(response.data))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex flex-col w-2/5 gap-4 items-center justify-center relative z-20">
      <h1 className="font-semibold text-[#38457a] text-2xl">
        Visualizar Propostas
      </h1>
      <div className="flex items-center justify-between w-full bg-[#38457a] p-2 rounded-md">
        <input
          placeholder="Pesquisar por proposta"
          className="bg-transparent text-white placeholder:text-[#ffffffa6] outline-none"
          type="search"
          name="pesquisa"
          id="pesquisa"
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
                      Tempo de contrato
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Stack spacing={5} direction="column">
                    <Checkbox>12 meses</Checkbox>
                    <Checkbox>24 meses</Checkbox>
                    <Checkbox>36 meses</Checkbox>
                  </Stack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Valor
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <RangeSlider
                    min={100}
                    max={1000000}
                    onChange={(val) => setSliderValues(val)}
                    value={sliderValues}
                    step={100}
                  >
                    <RangeSliderMark value={100}>R$ 100</RangeSliderMark>
                    <RangeSliderMark value={1000000}>R$ 1.000.000</RangeSliderMark>
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Fechar
            </Button>
            <Button colorScheme="green">Aplicar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex flex-col items-center justify-start gap-4 scroll-m-[30dvh] h-[70dvh] overflow-y-scroll w-full">
        {isLoading ? (<><ActivityIndicator /><h3>Carregando...</h3></>) : propostas?.map((proposta, index) => (
          <Proposta key={index++} {...proposta} />
        ))}
      </div>
    </div>
  );
}

export default VisualizarPropostas;
