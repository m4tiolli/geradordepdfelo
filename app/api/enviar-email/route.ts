import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: Request) {
  try {
    const transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: "windows",
    });
    transporter.sendMail({
      from: "gabriel.fernandes@elosolutions.com.br",
      to: "gabriel.fernandes@elosolutions.com.br",
      subject: "Teste de envio de email",
      text: "Testando o envio de email pelo Nodemailer",
    });
    return NextResponse.json({ emailEnviado: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ emailEnviado: false }, { status: 500 });
  }
}
