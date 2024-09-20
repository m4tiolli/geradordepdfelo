import { Tooltip } from '@chakra-ui/react';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { useMask } from '@react-input/mask';
import React, { useRef } from 'react';

interface InputProps {
  name: string;
  value: string | number | Date;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  dica?: string;
  color?: string; // Cor opcional
}

export default function Input({
  name,
  value,
  onChange,
  placeholder,
  invalid,
  disabled,
  onBlur,
  type,
  dica,
  color, // Recebe o color opcional
}: Readonly<InputProps>) {
  const telefoneRef = useMask({
    mask: '(__) _____-____',
    showMask: true,
    replacement: { _: /\d/ },
  });
  const semRef = useRef(null);

  // Classe original
  const inputClassName = `appearance-none bg-[#ffffff0e] border min-w-fit w-full transition-all ${value ? 'border-[#ffffff]' : 'border-[#ffffff27]'
    } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white ${invalid ? 'invalid border-red-600' : ''
    } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`

  const inputAzul = `appearance-none bg-[#38457a0e] border min-w-fit w-full transition-all ${value ? 'border-[#38457a]' : 'border-[#38457a27]'
    } outline-none text-sm rounded-md p-2 placeholder:text-[#38457aa6] text-azul ${invalid ? 'invalid border-red-600' : ''
    } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`

  const inputRef = name.includes('telefone') ? telefoneRef : semRef;

  const renderInput = () => (
    <input
      ref={inputRef}
      className={color === "#38457a" ? inputAzul : inputClassName}
      name={name}
      value={value as string}
      onChange={onChange}
      placeholder={placeholder}
      type={type ?? 'text'}
      disabled={disabled}
      onBlur={onBlur}
    />
  );

  return dica ? (
    <span className="relative flex items-center gap-2">
      {renderInput()}
      <Tooltip label={dica} fontSize="md">
        <span>
          <IoMdHelpCircleOutline className={`${color === "#38457a" ? "text-[#38457a]" : "text-white"} text-2xl`} />
        </span>
      </Tooltip>
    </span>
  ) : (
    renderInput()
  );
}
