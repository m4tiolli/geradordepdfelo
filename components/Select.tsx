import { Departamentos } from '@/interfaces/Formulario';
import { Tooltip } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import { IoMdHelpCircleOutline } from 'react-icons/io';

interface ISelect {
  departamentos: Departamentos[]
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  value: string;
  placeholder: string;
  color?: string
}

function Select({ onChange, value, placeholder, departamentos, color }: ISelect) {

const classe = `bg-[#ffffff0e] border transition-all ${
          value !== '' ? 'border-[#ffffff]' : 'border-[#ffffff27]'
        } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`

    const classeAzul = `bg-[#38457a0e] border transition-all ${
          value !== '' ? 'border-[#38457a]' : 'border-[#38457a27]'
        } outline-none text-sm rounded-md p-2 placeholder:text-[#38457aa6] text-[#38457a] appearance-none w-full`

  return (
    <span className="relative flex items-center gap-2">
      <select
        id="fatorFinanceiroMes"
        name="fatorFinanceiroMes"
        value={value}
        onChange={onChange}
        className={color === "#38457a" ? classeAzul : classe}
      >
        <option className="text-azul" value="">
          {placeholder}
        </option>
        {departamentos.map((option, index) => (
          <option className="text-azul" key={index++} value={option.nome}>
            {option.nome}
          </option>
        ))}
      </select>
      <Tooltip label={placeholder} fontSize="md">
        <span>
          <IoMdHelpCircleOutline className="text-white text-2xl" />
        </span>
      </Tooltip>
    </span>
  );
}

export default Select;
