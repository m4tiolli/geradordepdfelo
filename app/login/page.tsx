"use client";
import ActivityIndicator from "@/components/ActivityIndicator";
import Input from "@/components/Input";
import { ShowToast } from "@/utils/Toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [invalid, setInvalid] = useState({
    email: false,
    senha: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        localStorage.setItem("token", token);
        router.push("/");
      } else {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setInvalid((prevState) => ({ ...prevState, [name]: false }));
  };

  const inputs = [
    {
      name: "email",
      value: formData.email,
      onChange: handleChange,
      placeholder: "Email",
      invalid: invalid.email,
    },
    {
      name: "senha",
      value: formData.senha,
      onChange: handleChange,
      placeholder: "Senha",
      invalid: invalid.senha,
    },
  ];

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center z-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col z-10 items-center justify-center bg-[#38457a] px-4 py-4 rounded-md min-w-[20vw] h-fit gap-8"
      >
        <h1 className="text-white font-semibold text-3xl">Login</h1>
        {inputs.map(
          ({ name, value, onChange, placeholder, invalid }, index) => (
            <span key={index++} className="relative w-full">
              <Input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                invalid={invalid}
              />
              <p
                className={`transition-all absolute -top-5 text-red-600 text-md font-semibold ${
                  invalid ? "opacity-100" : "opacity-0"
                }`}
              >
                {placeholder} invalid{placeholder === "Senha" ? "a" : "o"}
              </p>
            </span>
          )
        )}
        <button
          className={`text-[#38457a] bg-white px-4 py-2 w-full flex items-center justify-center transition-all hover:opacity-60 rounded-md font-semibold ${
            isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator /> : "Entrar"}
        </button>
      </form>
    </main>
  );
}

export default Login;
