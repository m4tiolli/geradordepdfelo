import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
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
        to: "gabriel.fernandes@elosolutions.com.br",
        subject: "Finalização de Cadastro",
        text: "Finalize seu cadastro no gerador de propostas! Clique no link e crie a sua senha. https://elosolutions.com.br",
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
            <a href="https://elosolutions.com.br"
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
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}