"use client"
import ActivityIndicator from "@/components/ActivityIndicator"
import { ShowToast } from "@/utils/Toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

type PasswordFields = {
  senha: {
    value: string;
    name: string;
    placeholder: string;
    type: string;
  };
  confirmarSenha: {
    value: string;
    name: string;
    placeholder: string;
    type: string;
  };
};

function CriarSenha() {
  const router = useRouter();
  const [values, setValues] = useState<PasswordFields>({
    senha: {
      value: "",
      name: "senha",
      placeholder: "Senha",
      type: "password",
    },
    confirmarSenha: {
      value: "",
      name: "confirmarSenha",
      placeholder: "Confirmar Senha",
      type: "password",
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlSearchParams.get('token');
    if (!tokenFromURL) {
      ShowToast({
        type: "error", options: {
          position: "top-center"
        }, text: "Token não fornecido."
      })
    }
    setToken(tokenFromURL);
  }, []);



  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof typeof prevState], value }
    }));
  };

  const ChangeVisibility = (index: keyof PasswordFields) => {
    setValues((prevState) => ({
      ...prevState,
      [index]: {
        ...prevState[index],
        type: prevState[index].type === "password" ? "text" : "password"
      }
    }));
  };

  const AtualizarSenha = async () => {
    setIsLoading(true)
    if (values.confirmarSenha.value !== values.senha.value) {
      ShowToast({
        type: "error", options: {
          position: "top-center"
        }, text: "As senhas não coincidem."
      })
      setTimeout(() => {
        setIsLoading(false)
      }, 2000);
    }
    const body = {
      senha: values.senha.value
    }
    try {
      await axios.post("/api/criar-senha", body, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          ShowToast({
            type: "success", options: {
              position: "top-center"
            }, text: "Senha alterada com sucesso!"
          })
          setTimeout(() => {
            router.push("/")
          }, 3000);
        })
    } catch (erro: any) {
      console.error(erro.response.data.error);
      ShowToast({
        type: "error", options: {
          position: "top-center"
        }, text: erro.response.data.error as string
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#38457a] rounded-md flex flex-col items-center gap-4 p-4 relative z-90">
      <h1 className="font-semibold text-white text-3xl">Criação de Senha</h1>
      <p className="text-white">Crie uma senha única para você.</p>

      {Object.entries(values).map(([key, value], index) => (
        <div key={index++} className="relative w-full flex items-center justify-center">
          <input
            className={`bg-[#ffffff0e] border min-w-fit w-full transition-all ${value.value !== "" ? "border-[#ffffff]" : "border-[#ffffff27]"
              } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white`}
            name={value.name}
            value={value.value}
            onChange={onChange}
            placeholder={value.placeholder}
            type={value.type ?? "text"}
          />
          {value.type === "text" ? (
            <FaEyeSlash onClick={() => ChangeVisibility(key as keyof PasswordFields)} className="text-white cursor-pointer font-2xl absolute right-2" />
          ) : (
            <FaEye onClick={() => ChangeVisibility(key as keyof PasswordFields)} className="text-white cursor-pointer font-2xl absolute right-2" />
          )}
        </div>
      ))}

      <button onClick={AtualizarSenha} className="text-[#38457a] bg-white py-2 px-4 rounded-md w-full transition-all hover:opacity-60 cursor-pointer font-semibold grid place-items-center">
        {isLoading ? <ActivityIndicator /> : "Confirmar"}
      </button>
    </div>
  )
}

export default CriarSenha
