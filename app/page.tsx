'use client';
import ActivityIndicator from '@/components/ActivityIndicator';
import { Usuario } from '@/interfaces/Usuario';
import { adminButtons, buttons } from '@/mocks/ButtonsHome';
import { VerificarPrivilegios } from '@/utils/Verificacoes';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario>();
  const router = useRouter();

  useEffect(() => {
    VerificarPrivilegios({ setUsuario, router });
  }, [router]);

  if (!usuario) {
    return <ActivityIndicator />;
  }

  return (
    <div className="flex flex-col z-10 items-center justify-center px-4 py-4 rounded-md w-fit h-fit gap-4">
      <p className="absolute top-3 font-semibold text-azul">
        Conectado como: {usuario.nome}
      </p>
      <h1 className="text-3xl font-semibold text-azul">Menu</h1>

      {buttons(router).map((button, index) => (
        <button
          key={index}
          className="bg-azul text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
          onClick={button.action}
        >
          {button.label}
        </button>
      ))}

      {usuario.administrador === 1 &&
        adminButtons(router).map((button, index) => (
          <button
            key={index}
            className="bg-azul text-white px-4 py-2 w-full transition-all hover:opacity-60 rounded-md font-semibold"
            onClick={button.action}
          >
            {button.label}
          </button>
        ))}
    </div>
  );
}
