'use client';
import React, { ChangeEvent, useMemo } from 'react';
import Input from '@/components/Input';
import { Departamentos } from '@/interfaces/Formulario';
import { Usuario } from '@/interfaces/Usuario';
import { getToken, isTokenValid } from '@/utils/Auth';
import { fetchDepartamentos } from '@/utils/Fetchs';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { ShowToast } from '@/utils/Toast';
import ActivityIndicator from '@/components/ActivityIndicator';

function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: '',
    departamento: '',
    telefone1: '',
    telefone2: '',
    email: '',
    assinatura: '',
    administrador: 0,
  });
  const [editing, setEditing] = useState(false);
  const token = getToken();
  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [currentSignature, setCurrentSignature] = useState<string | null>(null); // Assinatura atual salva no banco
  const [file, setFile] = useState<File | null>(null); // Novo arquivo de assinatura selecionado
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // URL para pré-visualizar a nova assinatura
  const [clicked, setClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDepartamentos({ setDepartamentos });
  }, []);

  useEffect(() => {
    async function BuscarDados() {
      try {
        const response = await axios.get('api/perfil', {
          headers: { Authorization: token },
        });
        setUsuario(response.data);
        setCurrentSignature(response.data.assinatura);
      } catch (error) {
        const erro = error as AxiosError;
        console.error(erro.response);
        if (erro.response?.status === 401) {
          router.push('/login');
        }
      }
    }
    BuscarDados();
  }, [token, router]);

  useEffect(() => {
    if (!isTokenValid()) {
      ShowToast({
        type: 'error',
        text: 'Sessão expirada, faça o login novamente',
        options: { position: 'top-center' },
      });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  });

  const AtualizarDados = () => {
    axios
      .put('/api/perfil/', usuario, {
        headers: { Authorization: token },
      })
      .then(() => {
        alert('Dados atualizados com sucesso!');
        router.push('/perfil');
      });
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({ ...prevState, [name]: value }));
  };

  const inputs = [
    {
      name: 'nome',
      placeholder: 'Nome',
      value: usuario.nome,
      onChange: onChange,
    },
    {
      name: 'email',
      placeholder: 'Email',
      value: usuario.email,
      onChange: onChange,
    },
    {
      name: 'telefone1',
      placeholder: 'Telefone 1',
      value: usuario.telefone1,
      onChange: onChange,
    },
    {
      name: 'telefone2',
      placeholder: 'Telefone 2',
      value: usuario.telefone2,
      onChange: onChange,
    },
  ];

  // Quando o arquivo for selecionado, cria uma URL de pré-visualização
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Verifica se há arquivo selecionado
    if (selectedFile) {
      setFile(selectedFile);

      // Cria uma URL de pré-visualização do arquivo selecionado
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);

      // Substitui a assinatura atual pela nova (pré-visualização) até o upload ser feito
      setCurrentSignature(preview);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecione um arquivo!');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file); // O arquivo selecionado
    formData.append('filename', file.name); // Nome do arquivo

    try {
      const response = await axios.post('/api/enviar-assinatura', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      if (response.status === 200) {
        ShowToast({
          text: `Assinatura enviada com sucesso!`,
          type: 'success',
          options: { position: 'top-center' },
        });
        setPreviewUrl(null); // Limpa a pré-visualização
        setCurrentSignature(result.url); // Atualiza a assinatura com a URL da imagem
        setIsLoading(false);
      } else {
        ShowToast({
          text: `Falha no upload: ${result.error}`,
          type: 'error',
          options: { position: 'top-center' },
        });
        setIsLoading(false);
      }
    } catch (error) {
      ShowToast({
        text: `Erro ao realizar upload: ${error}`,
        type: 'error',
        options: { position: 'top-center' },
      });
      setIsLoading(false);
    }
  };

  const isDataLoading = useMemo(() => {
    return (
      !departamentos.length ||
      !currentSignature ||
      Object.values(usuario).some((val) => val === '')
    );
  }, [departamentos.length, usuario, currentSignature]);

  if (isDataLoading) {
    return <ActivityIndicator />;
  }

  return (
    <div className="flex relative items-center justify-center gap-8 w-full h-dvh">
      <div className="flex flex-col items-center justify-center px-4 py-4 rounded-md min-w-[90%] xl:min-w-[30vw] h-fit gap-4 bg-azul">
        <h1 className="text-3xl font-semibold text-white">Dados do perfil</h1>
        <CgProfile className="text-white text-7xl" />
        {inputs
          .slice(0, 1)
          .map(({ name, placeholder, value, onChange }, index) => (
            <div className="-my-1 w-full" key={index++}>
              <p className="font-medium text-white text-md">{placeholder}</p>
              <Input
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={!editing}
              />
            </div>
          ))}
        <div className="-my-1 w-full">
          <p className="font-medium text-white text-md">Departamento</p>
          <select
            id="departamento"
            name="departamento"
            value={usuario.departamento}
            onChange={onChange}
            disabled={!editing}
            className={`bg-[#ffffff0e] border transition-all ${
              usuario.departamento !== ''
                ? 'border-[#ffffff]'
                : 'border-[#ffffff27]'
            } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
          >
            <option className="text-azul" value="">
              Departamento
            </option>
            {departamentos?.map((departamento, index) => (
              <option
                className="text-azul"
                key={index++}
                value={departamento.nome}
              >
                {departamento.nome}
              </option>
            ))}
          </select>
        </div>
        {inputs
          .slice(1, 6)
          .map(({ name, placeholder, value, onChange }, index) => (
            <div className="-my-1 w-full" key={index++}>
              <p className="font-medium text-white text-md">{placeholder}</p>
              <Input
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={!editing}
              />
            </div>
          ))}
        <div className="flex justify-between w-full w items-center">
          <button
            className="text-azul font-semibold bg-white px-4 py-2 rounded-md w-[45%] transition-all hover:opacity-70"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
          <button
            className={`text-green-800 font-semibold bg-white px-4 py-2 rounded-md w-[45%] transition-all hover:opacity-70 ${
              editing
                ? 'opacity-100 cursor-pointer'
                : 'opacity-70 cursor-not-allowed'
            }`}
            disabled={!editing}
            onClick={AtualizarDados}
          >
            Salvar
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start rounded-md bg-azul p-4 gap-4">
        <h1 className="text-white text-3xl font-semibold">Assinatura</h1>
        {currentSignature ? (
          <img
            src={currentSignature}
            alt="Assinatura Atual"
            style={{ width: 200, height: 'auto', borderRadius: 5 }}
          />
        ) : (
          <p className="text-white font-semibold">Sem assinatura cadastrada.</p>
        )}
        <label
          onClick={() => setClicked(true)}
          htmlFor="assinatura"
          className="text-white bg-[#ffffff0e] rounded-md border cursor-pointer transition-all hover:opacity-60 w-full p-2 font-semibold grid place-items-center border-[#ffffff27"
        >
          Selecionar arquivo
        </label>
        <input
          type="file"
          name="assinatura"
          id="assinatura"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          className={`text-green-800 font-semibold bg-white px-4 py-2 rounded-md grid place-items-center w-full transition-all hover:opacity-70 ${
            !clicked || isLoading
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer opacity-100'
          }`}
          onClick={handleUpload}
          disabled={!clicked || isLoading}
        >
          {isLoading ? <ActivityIndicator /> : 'Enviar Assinatura'}
        </button>
      </div>
    </div>
  );
}

export default Perfil;
