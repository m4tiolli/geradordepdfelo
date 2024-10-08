'use client';
import { buttons } from '@/mocks/ButtonsVisualizar';
import { useRouter } from 'next/navigation';
import React from 'react';

function SelecionarProposta() {
  const router = useRouter();
  const btns = buttons(router);
  return (
    <main className="flex flex-col items-center gap-4 relative">
      <h1 className="font-semibold text-2xl text-azul">
        Selecionar Modelo de Proposta
      </h1>
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        {btns.map((btn, index) => (
          <button
            className="bg-azul text-white font-semibold rounded-md text-xl p-4 transition-all hover:opacity-60 cursor-pointer"
            onClick={btn.action}
            key={index++}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </main>
  );
}

export default SelecionarProposta;
