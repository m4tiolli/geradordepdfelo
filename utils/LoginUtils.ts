import axios from "axios";
import { ShowToast } from "./Toast";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface IHandleLogin {
  e: FormEvent
  setIsLoading: Dispatch<SetStateAction<boolean>>
  formData: {
    email: string
    senha: string
  }
  setInvalid: Dispatch<SetStateAction<{
    email: boolean;
    senha: boolean;
  }>>
  router: AppRouterInstance
}

export const handleLogin = async ({ e, setIsLoading, formData, setInvalid, router }: IHandleLogin) => {
  e.preventDefault();
  setIsLoading(true);
  if (formData.email === "" || formData.senha === "") {
    setInvalid({
      email: formData.email === "",
      senha: formData.senha === "",
    });
    ShowToast({
      text: "Preencha todos os campos",
      type: "error",
      options: {
        position: "top-center",
      },
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return;
  }

  try {
    const response = await axios.post("/api/login", formData);
    setIsLoading(false);
    const { token, auth } = response.data;
    if (auth) {
      ShowToast({
        type: "success",
        text: "Bem vindo!",
        options: {
          position: "top-center"
        }
      })
      localStorage.setItem("token", token);
      setTimeout(() => {
        router.push("/");
      }, 2000)
    } else {
      ShowToast({
        type: "error",
        text: "Algo deu errado.",
        options: {
          position: "top-center"
        }
      })
      console.error("Autenticação falhou.");
    }
  } catch (error: any) {
    console.error("Erro ao realizar login:", error);
    const emailInvalid = error.response?.status === 404;
    const passwordInvalid = error.response?.status === 401;
    if (emailInvalid || passwordInvalid) {
      setInvalid({ email: emailInvalid, senha: passwordInvalid });
      ShowToast({
        text: "Email ou senha inválidos",
        type: "error",
        options: {
          position: "top-center",
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }
};

interface Inputs {
  formData: {
    email: string;
    senha: string;
  }
  invalid: {
    email: boolean;
    senha: boolean;
  }
  setFormData: Dispatch<SetStateAction<{
    email: string;
    senha: string;
  }>>
  setInvalid: Dispatch<SetStateAction<{
    email: boolean;
    senha: boolean;
  }>>
}

export const inputs = ({ formData, invalid, setFormData, setInvalid }: Inputs) => [
  {
    name: "email",
    value: formData.email,
    placeholder: "Email",
    invalid: invalid.email,
  },
  {
    name: "senha",
    value: formData.senha,
    placeholder: "Senha",
    invalid: invalid.senha,
    type: "password"
  },
];