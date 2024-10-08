"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const PDFViewer = dynamic(
  () => import('../../../../components/VisualizarPropostaSC'),
  { ssr: false }
);


function Page() {
  return (
    <PDFViewer />
  )
}

export default Page