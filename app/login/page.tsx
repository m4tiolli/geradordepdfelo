'use client';
import ActivityIndicator from '@/components/ActivityIndicator';
import Input from '@/components/Input';
import { handleLogin, inputs } from '@/utils/LoginUtils';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [invalid, setInvalid] = useState({
    email: false,
    senha: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setInvalid((prevState) => ({ ...prevState, [name]: false }));
  };

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center z-10">
      <form
        onSubmit={(e) =>
          handleLogin({ e, setIsLoading, formData, setInvalid, router })
        }
        className="flex flex-col z-10 items-center justify-center bg-azul px-4 py-4 rounded-md min-w-[20vw] h-fit gap-8"
      >
        <h1 className="text-white font-semibold text-3xl">Login</h1>
        {inputs({ formData, invalid, setFormData, setInvalid }).map(
          ({ name, value, placeholder, invalid, type }, index) => (
            <span key={index++} className="relative w-full">
              <Input
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                invalid={invalid}
                type={type}
              />
              <p
                className={`transition-all absolute -top-5 text-red-600 text-md font-semibold ${
                  invalid ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {placeholder} invalid{placeholder === 'Senha' ? 'a' : 'o'}
              </p>
            </span>
          ),
        )}
        <button
          className={`text-azul bg-white px-4 py-2 w-full flex items-center justify-center transition-all hover:opacity-60 rounded-md font-semibold ${
            isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator /> : 'Entrar'}
        </button>
      </form>
    </main>
  );
}

export default Login;
