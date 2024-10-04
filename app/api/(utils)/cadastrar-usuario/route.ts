import { promiseConnection } from "@/utils/Connections";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { nome, departamento, telefone1, telefone2, email, administrador }: { nome: string, departamento: string, telefone1: string, telefone2: string, email: string, administrador: boolean } =
      await req.json();

    const senha = bcrypt.hashSync("Elo1234", 10);
    const query = `INSERT INTO usuario (nome, email, telefone1, telefone2, departamento, administrador, senha) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await promiseConnection.query<ResultSetHeader>(query, [
      nome,
      email,
      telefone1,
      telefone2,
      departamento,
      administrador,
      senha,
    ]);

    const [rows]: any = await promiseConnection.query<ResultSetHeader>(
      "SELECT id FROM usuario WHERE email = ? AND nome = ?", [email.toLowerCase(), nome]
    )

    const id = rows[0].id

    const token = jwt.sign({ id: id }, "EloSolutions", {
      expiresIn: "7d",
    });

    const url = `https://geradordepdfelo.vercel.app/criar-senha?token=${token}`

    try {
      const transporter = nodemailer.createTransport({
        host: "email-ssl.com.br",
        port: 465,
        secure: true,
        auth: {
          user: "propostas@elosolutions.com.br",
          pass: "GdP#Elo.2024",
        },
      });
      await transporter.sendMail(
        {
          from: 'propostas@elosolutions.com.br',
          to: email,
          subject: "Finalização de Cadastro",
          text: "Finalize seu cadastro no gerador de propostas! Clique no link e crie a sua senha. " + url,
          html: `<table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td>
        <h1 style="font-weight: 600;color: #38457a;font-size: 19pt; font-family: 'Inter', sans-serif;">Finalização do
          cadastro</h1>
        <h3 style="font-weight: 300;color: #38457a;font-size:15pt;font-family: 'Inter', sans-serif;">Olá! Seu cadastro foi
          concluído com sucesso. Agora vamos criar uma senha nova e única para você. Clique no botão abaixo e crie uma
          senha.</h3>
  
        <table cellspacing="0" cellpadding="0">
          <tr>
            <td style="border-radius: 5px;" bgcolor="#38457a; padding: 10">
              <a href="${url}"
                style="color: #fff; background-color: #38457a; border-radius: 5px; padding: 10; font-weight: 600; font-family: 'Inter', sans-serif;text-decoration: none;">Criar
                senha</a>
            </td>
          </tr>
        </table>
        <br>
        <br>
        <img width="150" height="44" alt="Logo EloSolutions" style="margin-top: 70"
          src="https://elosolutions.com.br/wp-content/uploads/2024/09/Logo-Principal-Horizontal.gif"></img>
      </td>
    </tr>
  </table>`,
        }
      );
      return NextResponse.json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}


export const revalidate = 0