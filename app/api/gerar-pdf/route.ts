import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { promiseConnection } from "@/utils/Connections";
import { RowDataPacket } from "mysql2/promise";

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
    } = await req.json();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { auth: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, "secret_key");

    const pdfPath = path.resolve("./public/propostas/Template.pdf");
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const form = pdfDoc.getForm();
    form.getTextField("Tomador").setText(tomador);
    form.getTextField("Departamento").setText(departamento);
    form.getTextField("Email").setText(email);
    form.getTextField("Telefone").setText(telefone);
    form.getTextField("Data").setText(data);
    form.getTextField("DataExtensa").setText(dataFull);
    form.getTextField("Proposta").setText(proposta);
    form.getTextField("Empresa").setText(nomeEmpresa);
    form.getTextField("RazaoSocial").setText(razao);
    form.getTextField("CNPJ").setText(cnpj);
    form.getTextField("Potencia").setText(potencia);
    form.getTextField("ValorTotal").setText(valor.toString());
    form.getTextField("Vendedor").setText(vendedor);
    form.getTextField("DepartamentoVendedor").setText(departamentovendedor);
    form.getTextField("EmailVendedor").setText(emailvendedor);
    form.getTextField("Telefone1Vendedor").setText(telefone1vendedor);
    form.getTextField("Telefone2Vendedor").setText(telefone2vendedor);
    form.getTextField("Site").setText("www.elosolutions.com.br");

    form.flatten();
    const pdfBytesFilled = await pdfDoc.save();

    const propostaNome = "Proposta_" + proposta;

    const outputPath = path.resolve(
      "./public/propostas/" + propostaNome + ".pdf"
    );
    fs.writeFileSync(outputPath, pdfBytesFilled);

    const downloadLink = `${req.nextUrl.origin}/propostas/${propostaNome}.pdf`;
    const ano = new Date().getFullYear();

    const query =
      "INSERT INTO propostas (ano, id_usuario, proposta, nomeEmpresa, razaoEmpresa, cnpjEmpresa, tomador, departamento, email, telefone, potencia, valor, fatorFinanceiro_id, meses, link_pdf, data, contaEnergia) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    const [rows] = await promiseConnection.query<RowDataPacket[]>(query, [
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
      data,
      valorContaEnergia,
    ]);

    return NextResponse.json({ downloadLink });
  } catch (error) {
    console.error("Error filling PDF:", error);
    return NextResponse.json(
      { message: "Error filling PDF", error },
      { status: 500 }
    );
  }
}
