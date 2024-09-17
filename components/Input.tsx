import { Tooltip } from '@chakra-ui/react';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { useMask } from '@react-input/mask';
import { useRef } from 'react';

interface InputProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  dica?: string;
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
}: Readonly<InputProps>) {
  const telefoneRef = useMask({
    mask: '(__) _____-____',
    showMask: true,
    replacement: { _: /\d/ },
  });
  const semRef = useRef(null);
  return (
    <>
      {dica ? (
        <span className="relative flex items-center gap-2">
          <input
            ref={name.includes('telefone') ? telefoneRef : semRef}
            className={`bg-[#ffffff0e] border min-w-fit w-full transition-all ${
              value !== '' ? 'border-[#ffffff]' : 'border-[#ffffff27]'
            } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white ${
              invalid ? 'invalid border-red-600' : ''
            } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type ?? 'text'}
            disabled={disabled}
            onBlur={onBlur}
          />
          <Tooltip label={dica} fontSize="md">
            <span>
              <IoMdHelpCircleOutline className="text-white text-2xl" />
            </span>
          </Tooltip>
        </span>
      ) : (
        <input
          ref={name.includes('telefone') ? telefoneRef : semRef}
          className={`bg-[#ffffff0e] border min-w-fit w-full transition-all ${
            value !== '' ? 'border-[#ffffff]' : 'border-[#ffffff27]'
          } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white ${
            invalid ? 'invalid border-red-600' : ''
          } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type ?? 'text'}
          disabled={disabled}
          onBlur={onBlur}
        />
      )}
    </>
  );
}
