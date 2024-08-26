import { promiseConnection } from "@/utils/Connections";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { nome, departamento, telefone1, telefone2, email, administrador } =
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

    return NextResponse.json(
      { message: "Usuário criado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
