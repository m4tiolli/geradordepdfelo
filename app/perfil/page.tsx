"use client";
import Input from "@/components/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";

interface Usuario {
  id: number;
  nome: string;
  departamento: string;
  telefone1: string;
  telefone2: string;
  email: string;
}

function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario>({
    id: 0,
    nome: "",
    departamento: "",
    telefone1: "",
    telefone2: "",
    email: "",
  });
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function BuscarDados() {
      await axios
        .get("api/perfil", {
          headers: { Authorization: token },
        })
        .then((response) => {
          setUsuario(response.data);
        })
        .catch((error) => {
          console.error(error.response);
          if (error.response.status === 401) {
            router.push("/login");
          }
        });
    }
    BuscarDados();
  }, [token]);

  const AtualizarDados = () => {
    axios.put("/api/perfil/", usuario, {
      headers: { Authorization: token },
    })
    .then(() => {alert("Dados atualizados com sucesso!"); router.push("/perfil")})
  }

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
      name: "departamento",
      placeholder: "Departamento",
      value: usuario.departamento,
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
      <h1 className="text-3xl font-semibold text-white">Dados do perfil</h1>
      <CgProfile className="text-white text-7xl" />
      {inputs.map(({ name, placeholder, value, onChange }, index) => (
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
          className="text-[#38457a] font-semibold bg-white px-4 py-2 rounded-md w-[45%] transition-all hover:opacity-70"
          onClick={() => setEditing(true)}
        >
          Editar
        </button>
        <button
          className={`text-green-800 font-semibold bg-white px-4 py-2 rounded-md w-[45%] transition-all hover:opacity-70 ${
            editing
              ? "opacity-100 cursor-pointer"
              : "opacity-70 cursor-not-allowed"
          }`}
          disabled={!editing}
          onClick={AtualizarDados}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

export default Perfil;
