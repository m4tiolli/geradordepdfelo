import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promiseConnection } from "@/utils/Connections";
import { RowDataPacket } from "mysql2/promise";

export async function POST(req: Request) {
  try {
    const { email, senha }: { email: string, senha: string }
      = await req.json();

    const query = "SELECT * FROM usuario WHERE email = ?";
    const [rows] = await promiseConnection.query<RowDataPacket[]>(query, [
      email.toLowerCase(),
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ emailInvalid: true }, { status: 404 });
    }

    const user = rows[0];
    const isPasswordValid = bcrypt.compareSync(senha, user.senha);
    const senhaValida = senha === user.senha;

    if (!isPasswordValid) {
      if (!senhaValida) {
        return NextResponse.json({ passwordInvalid: true }, { status: 401 });
      }
    }

    const token = jwt.sign({ id: user.id }, "secret_key", {
      expiresIn: "1h",
    });

    return NextResponse.json({ auth: true, token }, { status: 200 });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      { message: "Error logging in", error },
      { status: 500 }
    );
  }
}
