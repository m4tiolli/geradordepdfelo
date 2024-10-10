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
  Input,
  Select,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";

export interface FiltroPropostas {
  nomeEmpresa: string;
  nomeVendedor: string;
  tipoContato: string;
  dataProposta: string;
  codigoProposta: string;
}

function FiltroPropostasModal({
  onAplicarFiltros,
  onClose,
  isOpen
}: {
  onAplicarFiltros: (filtros: FiltroPropostas) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [filtros, setFiltros] = useState<FiltroPropostas>({
    nomeEmpresa: "",
    nomeVendedor: "",
    tipoContato: "",
    dataProposta: "",
    codigoProposta: "",
  });

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filtrar Propostas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion allowToggle>
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
                  <Input
                    type="text"
                    name="nomeEmpresa"
                    placeholder="Nome da Empresa"
                    value={filtros.nomeEmpresa}
                    onChange={handleFiltroChange}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Nome do Vendedor
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Input
                    type="text"
                    name="nomeVendedor"
                    placeholder="Nome do Vendedor"
                    value={filtros.nomeVendedor}
                    onChange={handleFiltroChange}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Tipo de Contato
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Select
                    name="tipoContato"
                    placeholder="Selecione o tipo de contato"
                    value={filtros.tipoContato}
                    onChange={handleFiltroChange}
                  >
                    <option value="Email">Email</option>
                    <option value="Telefone">Telefone</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </Select>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      Data da Proposta
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Input
                    type="date"
                    name="dataProposta"
                    value={filtros.dataProposta}
                    onChange={handleFiltroChange}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup gap={"16px"}>
              <Button variant="ghost" onClick={() => setFiltros({
                nomeEmpresa: "",
                nomeVendedor: "",
                tipoContato: "",
                dataProposta: "",
                codigoProposta: ""
              })}>
                Limpar
              </Button>

              <Button colorScheme="green" onClick={() => onAplicarFiltros(filtros)}>
                Aplicar Filtros
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FiltroPropostasModal;
