import fs, { PathOrFileDescriptor } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import jwt from "jsonwebtoken";
import path from "path";
import { promiseConnection } from "@/utils/Connections";
import { RowDataPacket } from "mysql2/promise";
import { Client } from "basic-ftp";
import { Readable } from "stream";
import { fields } from "./fields";
import { formatCNPJ, formatDate, formatValor } from "./formats";

export async function POST(req: NextRequest) {
  try {
    const {
      vendedor,
      telefone1vendedor,
      telefone2vendedor,
      emailvendedor,
      departamentovendedor,
      tomador,
      departamento,
      email,
      telefone,
      data,
      dataFull,
      proposta,
      nomeEmpresa,
      razao,
      cnpj,
      potencia,
      valor,
      meses,
      valorContaEnergia,
      fatorFinanceiroId,
      elo
    } = await req.json();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { auth: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, "EloSolutions");

    let mes;
    if (fatorFinanceiroId == 1) {
      mes = "12";
    } else if (fatorFinanceiroId == 2) {
      mes = "24";
    } else {
      mes = "36";
    }

    const body = {
      vendedor,
      telefone1vendedor,
      telefone2vendedor,
      emailvendedor,
      departamentovendedor,
      tomador,
      departamento,
      email: email.toLowerCase(),
      telefone,
      data,
      dataFull,
      proposta,
      nomeEmpresa,
      razao,
      cnpj,
      potencia,
      valor,
      meses,
      valorContaEnergia,
      fatorFinanceiroId,
    };

    const pdfPathRecuperadora = path.resolve("./public/propostas/TemplateRecuperadora.pdf")
    const pdfPathServicos = path.resolve("./public/propostas/Template.pdf")

    const pdfPath = elo === "R" ? pdfPathRecuperadora : pdfPathServicos

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

    fields({
      mes,
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

    form.flatten();
    const pdfBytesFilled = await pdfDoc.save();
    proposta.replace(/ /g, "_");
    const propostaNome = "Proposta_" + proposta;

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

      const numeroProposta = (proposta as string).slice(-5)

      const ano = new Date().getFullYear();
      const query =
        "INSERT INTO propostasEF (ano, id_usuario, proposta, nomeEmpresa, razaoEmpresa, cnpjEmpresa, tomador, departamento, email, telefone, potencia, valor, fatorFinanceiro_id, meses, link_pdf, data, contaEnergia, elo, numeroProposta) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      await promiseConnection.query<RowDataPacket[]>(query, [
        ano,
        decoded.id,
        proposta,
        nomeEmpresa,
        razao,
        cnpj,
        tomador,
        departamento,
        email,
        telefone,
        potencia,
        valor,
        fatorFinanceiroId,
        meses.toString(),
        downloadLink,
        formatDate(body.data),
        valorContaEnergia,
        elo,
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
