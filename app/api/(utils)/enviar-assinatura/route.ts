import { Client } from 'basic-ftp';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promiseConnection } from '@/utils/Connections';
import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob;
  const originalFilename = formData.get('filename') as string;
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { auth: false, message: "No token provided" },
      { status: 401 }
    );
  }

  const decoded = jwt.verify(token, "EloSolutions");

  if (!file || !originalFilename) {
    return NextResponse.json({ error: 'No file or filename provided' }, { status: 400 });
  }

  // Obter o nome do usuário a partir do token decodificado
  const userId = (decoded as { id: string, nome: string }).id;
  const userName = (decoded as { id: string, nome: string }).nome


  // Novo nome do arquivo: "Assinatura Nome do Usuário"
  const newFilename = `Assinatura ${userName}.png`;

  const filePath = path.join(process.cwd(), 'uploads', newFilename);

  // Converte o Blob em um Buffer para salvar no servidor temporariamente
  const buffer = Buffer.from(await file.arrayBuffer());

  // Salva o arquivo no sistema de arquivos temporariamente
  fs.writeFileSync(filePath, buffer);

  try {
    await uploadToFTP(filePath, newFilename);
    fs.unlinkSync(filePath); // Remove o arquivo temporário após o upload

    const fileUrl = `https://elosolutions.com.br/propostas/assinaturas/${newFilename}`;

    // Atualiza o campo de assinatura no banco de dados com a nova URL
    const query = "UPDATE usuario SET assinatura = ? WHERE id = ?";

    await promiseConnection.query(query, [fileUrl, userId]);

    return NextResponse.json({ message: "Sucesso!", url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error('Error during FTP upload:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

const uploadToFTP = async (localPath: string, remoteFilename: string) => {
  const client = new Client();

  try {
    await client.access({
      host: "77.37.127.193",
      user: "u867338340.GeradorProposta1122",
      password: "Elo@1122",
      secure: false,
    });

    await client.ensureDir("/propostas/assinaturas");

    const remotePath = `/propostas/assinaturas/${remoteFilename}`;

    // Faz o upload do arquivo local para o servidor FTP
    await client.uploadFrom(localPath, remotePath);

    console.log('File uploaded to FTP successfully!');
  } finally {
    client.close();
  }
};
