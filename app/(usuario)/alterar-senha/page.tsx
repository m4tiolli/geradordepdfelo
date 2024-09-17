/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import Input from '@/components/Input';
import { getToken, isTokenValid } from '@/utils/Auth';
import { ShowToast } from '@/utils/Toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

function AlterarSenha() {
  const router = useRouter();
  const [senhas, setSenhas] = useState({
    senhaOriginal: '',
    senhaNova: '',
    confirmSenhaNova: '',
  });
  const [tipos, setTipos] = useState({
    senhaNova: 'password',
    confirmSenhaNova: 'password',
  });
  const token = getToken();

  useEffect(() => {
    if (!isTokenValid()) {
      router.push('/login');
    }
  }, [token]);

  const AtualizarDados = () => {
    if (
      senhas.senhaNova !== senhas.confirmSenhaNova ||
      senhas.senhaNova === '' ||
      senhas.confirmSenhaNova === ''
    ) {
      ShowToast({
        text: 'Senhas novas não conferem',
        type: 'error',
        options: {
          position: 'top-center',
        },
      });
      return;
    }
    axios
      .put(
        '/api/senha/',
        { senha: senhas.senhaNova },
        {
          headers: { Authorization: token },
        },
      )
      .then(() => {
        ShowToast({
          text: 'Senha alterada com sucesso',
          type: 'success',
          options: {
            position: 'top-center',
          },
        });
        router.push('/');
      });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSenhas((prev) => ({ ...prev, [name]: value }));
  };

  const inputs = [
    {
      name: 'senhaNova',
      placeholder: 'Nova Senha',
      value: senhas.senhaNova,
      onChange: onChange,
      type: tipos.senhaNova,
    },
    {
      name: 'confirmSenhaNova',
      placeholder: 'Confirmar Nova Senha',
      value: senhas.confirmSenhaNova,
      onChange: onChange,
      type: tipos.confirmSenhaNova,
    },
  ];

  const changeVisibility = (name: keyof typeof tipos, type: string): void => {
    setTipos((prev) => ({
      ...prev,
      [name]: type === 'password' ? 'text' : 'password',
    }));
  };
  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 rounded-md min-w-[90%] xl:min-w-[30vw] h-fit gap-4 bg-azul z-10">
      <h1 className="text-3xl font-semibold text-white">Alterar senha</h1>
      {inputs.map(({ name, placeholder, value, onChange, type }, index) => (
        <div
          className="-my-1 w-full relative flex items-start flex-col justify-center"
          key={index++}
        >
          <p className="font-medium text-white text-md">{placeholder}</p>
          <Input
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            type={type}
          />
          {inputs[index].name.endsWith('v') ? (
            <FaEye
              onClick={() => changeVisibility(name as keyof typeof tipos, type)}
              className="text-2xl text-white absolute right-2 top-8 cursor-pointer"
            />
          ) : (
            <FaEyeSlash
              onClick={() => changeVisibility(name as keyof typeof tipos, type)}
              className="text-2xl text-white absolute right-2 top-8 cursor-pointer"
            />
          )}
        </div>
      ))}
      <button
        className={`text-green-800 font-semibold bg-white px-4 py-2 rounded-md w-full transition-all hover:opacity-70`}
        onClick={AtualizarDados}
      >
        Salvar
      </button>
    </div>
  );
}

export default AlterarSenha;
