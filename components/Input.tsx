interface InputProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

export default function Input({
  name,
  value,
  onChange,
  placeholder,
  invalid,
  disabled,
  onBlur
}: Readonly<InputProps>) {
  return (
    <input
      className={`bg-[#ffffff0e] border min-w-fit w-full transition-all ${
        value !== "" ? "border-[#ffffff]" : "border-[#ffffff27]"
      } outline-none text-sm rounded-md p-2 placeholder:text-[#ffffffa6] text-white ${
        invalid ? "invalid border-red-600" : ""
      } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={name == "senha" ? "password" : name == "data" ? "date" : "text"}
      disabled={disabled}
      onBlur={onBlur}
    />
  );
}
