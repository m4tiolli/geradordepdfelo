import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { promiseConnection } from "@/utils/Connections";
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export async function GET(req: Request) {
  const token = req.headers.get('authorization');

  if (!token) {
    return NextResponse.json({ auth: false, message: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token.replace('Bearer ', ''), 'EloSolutions');
    const query = "SELECT * FROM usuario WHERE id = ?";
    const [results] = await promiseConnection.query<RowDataPacket[]>(query, [decoded.id]);

    if (results.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = results[0];
    return NextResponse.json(user, { status: 200 });

  } catch (err) {
    console.error('Erro ao verificar token ou buscar dados do usuário:', err);
    return NextResponse.json({ auth: false, message: 'Failed to authenticate token' }, { status: 401 });
  }
}

export const revalidate = 0

export async function PUT(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ auth: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, 'EloSolutions');

    const { nome, email, telefone1, telefone2, departamento } = await req.json();

    const query = `
      UPDATE usuario
      SET nome = ?, email = ?, telefone1 = ?, telefone2 = ?, departamento = ?
      WHERE id = ?
    `;

    const [result] = await promiseConnection.query<ResultSetHeader>(query, [nome, email, telefone1, telefone2, departamento, decoded.id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User data updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ message: 'Error updating user data', error }, { status: 500 });
  }
}
