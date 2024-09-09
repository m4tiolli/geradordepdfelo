import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'
import { promiseConnection } from '@/utils/Connections';

export async function POST(req: Request) {
  const token = req.headers.get('authorization');
  const { senha } = await req.json()

  if (token) {
    try {
      const decoded: any = jwt.verify(token.replace('Bearer ', ''), 'secret_key');
      const id = decoded.id;

      const hashedPassword = bcrypt.hashSync(senha, 10);

      const query = "UPDATE usuario SET senha = ? WHERE id = ?"

      const [rows]: any = await promiseConnection.query(query, [hashedPassword, id]);

      if (rows.affectedRows === 0) {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
      }

      return NextResponse.json({ message: 'Senha alterada com sucesso' }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

  } else {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });

  }

}