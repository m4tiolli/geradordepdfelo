import { Tooltip } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import { IoMdHelpCircleOutline } from 'react-icons/io';

interface ISelect {
  options: [
    {
      value: string;
      text: string;
    },
  ];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  value: string;
  placeholder: string;
}

function Select({ options, onChange, value, placeholder }: ISelect) {
  return (
    <span className="relative flex items-center gap-2">
      <select
        id="fatorFinanceiroMes"
        name="fatorFinanceiroMes"
        value={value}
        onChange={onChange}
        className={`bg-[#ffffff0e] border transition-all ${
          value !== '' ? 'border-[#ffffff]' : 'border-[#ffffff27]'
        } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white appearance-none w-full`}
      >
        <option className="text-azul" value="">
          {placeholder}
        </option>
        {options?.map((option, index) => (
          <option className="text-azul" key={index++} value={option.value}>
            {option.text}
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
