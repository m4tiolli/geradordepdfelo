import bcrypt from "bcryptjs";
import { promiseConnection } from "@/utils/Connections";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const token = req.headers.get("authorization");
  const { senha } = await req.json();

  if (!token) {
    return NextResponse.json(
      { auth: false, message: "No token provided" },
      { status: 401 }
    );
  }

  try {
    const decoded: any = jwt.verify(token, 'EloSolutions');
    const senhaNova = bcrypt.hashSync(senha, 10);
    const [result]: any = await promiseConnection.query(
      "UPDATE usuario SET senha = ? WHERE id = ?",
      [senhaNova, decoded.id]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User data updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { message: "Error updating user data", error },
      { status: 500 }
    );
  }
}
