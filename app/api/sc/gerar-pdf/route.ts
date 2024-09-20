import fs, { PathOrFileDescriptor } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import jwt from "jsonwebtoken";
import path from "path";
import { Client } from "basic-ftp";
import { Readable } from "stream";
import { fields } from "./fields";
import { formatCNPJ, formatDate, formatValor } from "./formats";
import { ValuesSC } from "@/interfaces/SC";

export async function POST(req: NextRequest) {
  try {
    const {
      cnpjEmpresa,
      razaoEmpresa,
      nomeEmpresa,
      nomeTomador,
      emailTomador,
      telefone1Tomador,
      telefone2Tomador,
      departamentoTomador,
      nomeVendedor,
      emailVendedor,
      telefone1Vendedor,
      telefone2Vendedor,
      departamentoVendedor,
      assinaturaVendedor,
      tipoContato,
      entradaProposta,
      dataProposta,
      dataFullProposta,
      codigoProposta,
      validadeProposta,
      valorTecnico,
      valorKM,
      valorDiaria,
      condicaoPagamento,
      elo
    } = await req.json();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { auth: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, "secret_key");

    const pdfPathRecuperadora = path.resolve("./public/propostas/sc/MODELO HH RECUPERADORA.pdf")
    const pdfPathServicos = path.resolve("./public/propostas/sc/MODELO HH SERVICOS.pdf")

    const pdfPath = elo === "Recuperadora" ? pdfPathRecuperadora : pdfPathServicos

    const pdfBytes = fs.readFileSync(pdfPath as PathOrFileDescriptor);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const fontLightBytes = fs.readFileSync(
      path.resolve("app/api/ef/gerar-pdf/SignikaNegative-Light.ttf")
    );
    const fontLight = await pdfDoc.embedFont(fontLightBytes);
    const fontBoldBytes = fs.readFileSync(
      path.resolve("app/api/ef/gerar-pdf/SignikaNegative-Regular.ttf")
    );
    const fontBold = await pdfDoc.embedFont(fontBoldBytes);

    const form = pdfDoc.getForm();

    const body: ValuesSC = {
      cnpjEmpresa,
      nomeEmpresa,
      razaoEmpresa,
      nomeTomador,
      emailTomador,
      telefone1Tomador,
      telefone2Tomador,
      departamentoTomador,
      nomeVendedor,
      emailVendedor,
      telefone1Vendedor,
      telefone2Vendedor,
      departamentoVendedor,
      tipoContato,
      entradaProposta,
      dataProposta,
      dataFullProposta,
      codigoProposta,
      validadeProposta,
      valorDiaria,
      valorKM,
      valorTecnico,
      condicaoPagamento,
      assinaturaVendedor
    }

    const assinaturaBytes = await fetch(assinaturaVendedor).then(res => res.arrayBuffer())

    const assinatura = await pdfDoc.embedPng(assinaturaBytes)

    fields({
      body,
      fontBold,
      fontLight,
      formatDate,
      formatCNPJ,
      formatValor,
    }).forEach(({ name, value, font, size }) => {
      const field = form.getTextField(name);
      field.setFontSize(size);
      field.setText(value);
      field.updateAppearances(font);
    });

    form.getButton("Assinatura").setImage(assinatura)

    const pdfBytesFilled = await pdfDoc.save();
    codigoProposta.replace(/ /g, "_");
    const propostaNome = "Proposta_" + codigoProposta;

    const client = new Client();
    try {
      await client.access({
        host: "77.37.127.193",
        user: "u867338340.GeradorProposta1122",
        password: "Elo@1122",
        secure: false,
      });

      const bufferStream = new Readable();
      bufferStream.push(pdfBytesFilled);
      bufferStream.push(null);

      await client.uploadFrom(
        bufferStream,
        "/propostas/" + propostaNome + ".pdf"
      );
      console.log("PDF salvo com sucesso no servidor FTP!");

      const downloadLink = `https://elosolutions.com.br/propostas/${propostaNome}.pdf`;

      // const query = `
      //   INSERT INTO propostasSCHH 
      //   (proposta, cnpjEmpresa, razaoEmpresa, nomeEmpresa, nomeTomador, emailTomador, telefone1Tomador, telefone2Tomador, departamentoTomador, tipoContato, entradaProposta, dataProposta, dataFullProposta, validadeProposta, valorTecnico, condicaoPagamento, elo, link_pdf, ano, id_vendedor) 
      //   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      // `;

      // await promiseConnection.query<RowDataPacket[]>(query, [
      //   codigoProposta,
      //   cnpjEmpresa,
      //   razaoEmpresa,
      //   nomeEmpresa,
      //   nomeTomador,
      //   emailTomador,
      //   telefone1Tomador,
      //   telefone2Tomador,
      //   departamentoTomador,
      //   tipoContato,
      //   entradaProposta,
      //   dataProposta,
      //   dataFullProposta,
      //   validadeProposta,
      //   valorTecnico,
      //   condicaoPagamento,
      //   elo,
      //   downloadLink,
      //   new Date().getFullYear(),
      //   decoded.id,
      // ]);

      return NextResponse.json({ downloadLink });
    } catch (error) {
      console.error("Erro ao salvar PDF no FTP:", error);
      return NextResponse.json(
        { message: "Error saving PDF to FTP", error },
        { status: 500 }
      );
    } finally {
      client.close();
    }
  } catch (error) {
    console.error("Error filling PDF:", error);
    return NextResponse.json(
      { message: "Error filling PDF", error },
      { status: 500 }
    );
  }
}
