/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Input from "@/components/Input";
import { Departamentos } from "@/interfaces/Formulario";
import { Usuario } from "@/interfaces/Usuario";
import { getToken, isTokenValid } from "@/utils/Auth";
import { fetchDepartamentos } from "@/utils/Fetchs";
import { ShowToast } from "@/utils/Toast";
import { Checkbox, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdHelpCircleOutline } from "react-icons/io";

function CadastrarUsuario() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario>({
    nome: "",
    departamento: "",
    telefone1: "",
    telefone2: "",
    email: "",
    administrador: false,
  });
  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const token = getToken();
  useEffect(() => {
    if (!isTokenValid()) {
      router.push("/");
    }
    fetchDepartamentos({ setDepartamentos });
  }, []);

  const CadastrarUsuario = () => {
    axios
      .post("/api/cadastrar-usuario/", usuario, {
        headers: { Authorization: token },
      })
      .then(() => {
        ShowToast({
          text: "Usuário cadastrado com sucesso!",
          type: "success",
          options: { position: "top-center" },
        });
        router.push("/");
      });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({ ...prevState, [name]: value }));
  };

  const inputs = [
    {
      name: "nome",
      placeholder: "Nome",
      value: usuario.nome,
      onChange: onChange,
    },
    {
      name: "email",
      placeholder: "Email",
      value: usuario.email,
      onChange: onChange,
    },
    {
      name: "telefone1",
      placeholder: "Telefone 1",
      value: usuario.telefone1,
      onChange: onChange,
    },
    {
      name: "telefone2",
      placeholder: "Telefone 2",
      value: usuario.telefone2,
      onChange: onChange,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 rounded-md min-w-[90%] xl:min-w-[30vw] h-fit gap-4 bg-[#38457a] z-10">
      <h1 className="text-3xl font-semibold text-white">Cadastrar usuário</h1>
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
            />
          </div>
        ))}
        <div className="-my-1 w-full">
        <p className="font-medium text-white text-md">Departamento</p>
      <select
        id="departamento"
        name="departamento"
        value={usuario.departamento}
        onChange={(e) =>
          setUsuario((prev) => ({ ...prev, departamento: e.target.value }))
        }
        className={`bg-[#ffffff0e] border transition-all ${
          usuario.departamento !== ""
            ? "border-[#ffffff]"
            : "border-[#ffffff27]"
        } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
      >
        <option className="text-[#38457a]" value="">
          Departamento
        </option>
        {departamentos?.map((departamento, index) => (
          <option
            className="text-[#38457a]"
            key={index++}
            value={departamento.nome}
          >
            {departamento.nome}
          </option>
        ))}
      </select>
      </div>
      {inputs
        .slice(1, 7)
        .map(({ name, placeholder, value, onChange }, index) => (
          <div className="-my-1 w-full" key={index++}>
            <p className="font-medium text-white text-md">{placeholder}</p>
            <Input
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
          </div>
        ))}
      <div className="flex items-center justify-start gap-3 w-full relative">
        <Checkbox
          name="administrador"
          id="administrador"
          checked={usuario.administrador}
          onChange={() =>
            setUsuario((prev) => ({
              ...prev,
              administrador: !usuario.administrador,
            }))
          }
        />
        <label
          htmlFor="administrador"
          className="text-white cursor-pointer font-medium"
        >
          Administrador
        </label>
        <Tooltip
          label="O usuário terá permissões para adicionar e remover usuários"
          fontSize="md"
        >
          <span>
            <IoMdHelpCircleOutline className="text-white text-2xl" />
          </span>
        </Tooltip>
      </div>
      <button
        className={`text-green-800 font-semibold bg-white px-4 py-2 rounded-md w-full transition-all hover:opacity-70`}
        onClick={CadastrarUsuario}
      >
        Cadastrar usuário
      </button>
    </div>
  );
}

export default CadastrarUsuario;
