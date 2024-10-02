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
import { promiseConnection } from "@/utils/Connections";
import { RowDataPacket } from "mysql2";
import { JwtPayload } from "jwt-decode";
import { formatarData } from "@/utils/Handles";

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
      codigoProposta,
      validadeProposta,
      valorTecnico,
      valorKM,
      valorDiaria,
      condicaoPagamento,
      escopo,
      dataAtendimento,
      elo,
      revisao,
      tipoProposta
    } = await req.json();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { auth: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded: JwtPayload | string = jwt.verify(token, "EloSolutions");

    const pdfPathRecuperadora = path.resolve("./public/propostas/sc/MODELO HH RECUPERADORA.pdf")
    const pdfPathServicos = path.resolve("./public/propostas/sc/MODELO HH SERVICOS.pdf")

    const pdfPath = elo === "R" ? pdfPathRecuperadora : pdfPathServicos

    const pdfBytes = fs.readFileSync(pdfPath as PathOrFileDescriptor);
    const pdfDoc = await PDFDocument.load(pdfBytes as unknown as ArrayBuffer);
    pdfDoc.registerFontkit(fontkit);

    const fontLightBytes = fs.readFileSync(
      path.resolve("app/api/sc/gerar-pdf/SignikaNegative-Light.ttf")
    );
    const fontLight = await pdfDoc.embedFont(fontLightBytes as unknown as ArrayBuffer);
    const fontBoldBytes = fs.readFileSync(
      path.resolve("app/api/sc/gerar-pdf/SignikaNegative-Regular.ttf")
    );
    const fontBold = await pdfDoc.embedFont(fontBoldBytes as unknown as ArrayBuffer);

    const fontArialBytes = fs.readFileSync(
      path.resolve("app/api/sc/gerar-pdf/Arial.ttf")
    );
    const fontArial = await pdfDoc.embedFont(fontArialBytes as unknown as ArrayBuffer)

    const form = pdfDoc.getForm();
    const dataFullProposta = formatarData(dataProposta)
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
      assinaturaVendedor,
      dataAtendimento,
      escopo
    }

    const assinaturaBytes = await fetch(assinaturaVendedor).then(res => res.arrayBuffer())

    const assinatura = await pdfDoc.embedPng(assinaturaBytes)

    fields({
      body,
      fontBold,
      fontLight,
      fontArial,
      formatDate,
      formatCNPJ,
      formatValor,
    }).forEach(({ name, value, font, size }) => {
      const field = form.getTextField(name);
      field.setFontSize(size);
      field.setText(value as string);
      field.updateAppearances(font);
    });

    form.getButton("Assinatura").setImage(assinatura)
    form.flatten()
    const pdfBytesFilled = await pdfDoc.save();
    codigoProposta.replace(/ /g, "_");
    const propostaNome = codigoProposta + " Rev" + revisao;

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

      const tabela = tipoProposta === "Valor Final" ? "propostasSCVF" : "propostasSCHH"
      const numeroProposta = (codigoProposta as string).slice(7, 11)
      const query = `
        INSERT INTO ${tabela} 
        (proposta, cnpjEmpresa, razaoEmpresa, nomeEmpresa, nomeTomador, emailTomador, telefone1Tomador, telefone2Tomador, departamentoTomador, tipoContato, entradaProposta, dataProposta, dataFullProposta, validadeProposta, valorTecnico, condicaoPagamento, elo, link_pdf, ano, id_vendedor, revisao, dataAtendimento, escopo, numeroProposta) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

      await promiseConnection.query<RowDataPacket[]>(query, [
        codigoProposta,
        cnpjEmpresa,
        razaoEmpresa,
        nomeEmpresa,
        nomeTomador,
        emailTomador,
        telefone1Tomador,
        telefone2Tomador,
        departamentoTomador,
        tipoContato,
        entradaProposta,
        dataProposta,
        dataFullProposta,
        validadeProposta,
        valorTecnico,
        condicaoPagamento,
        elo,
        downloadLink,
        new Date().getFullYear(),
        (decoded as { id: string }).id,
        revisao,
        dataAtendimento,
        escopo,
        parseInt(numeroProposta)
      ]);

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

export const runtime = "edge"