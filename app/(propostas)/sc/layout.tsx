"use client"
import React, { useState } from "react";
import PDFAtivo from "@/utils/ContextSC";
import { IPropostas } from "@/components/VisualizarPropostaSC";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pdfAtivo, setPdfAtivo] = useState<IPropostas | null>(null);
  return (
    <PDFAtivo.Provider value={[pdfAtivo, setPdfAtivo] as never}>
      {children}
    </PDFAtivo.Provider>
  );
}