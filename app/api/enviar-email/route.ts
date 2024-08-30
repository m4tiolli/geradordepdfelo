import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtplw.com.br",
      port: 587,
      secure: false,
      auth: {
        user: "propostas@elosolutions.com.br",
        pass: "GdP#Elo.2024",
      },
    });
    transporter.sendMail(
      {
        from: 'propostas@elosolutions.com.br',
        to: "gabriel.fernandes@elosolutions.com.br",
        subject: "Email de teste",
        text: "Email de teste",
        html: "<h1>Email de teste</h1>",
      },
      (err, info) => {
        if (err) {
          return NextResponse.json(err, { status: 500 });
        } else {
          return NextResponse.json({ mensagem: "Mensagem enviada" }, { status: 200 });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ emailEnviado: false }, { status: 500 });
  }
}
