import { Textarea } from "@headlessui/react";
type inputTextAreaProps = {
  className?: string;
  value?: string;
  onChange?: (e: any) => void;
  onClick?: (e: any) => void;
  disabled?: boolean;
  placeholder?: string;
  isError?: boolean;
  minWidth?: string;
  minHeight?: string;
};
const index = ({
  className,
  value,
  onChange,
  disabled,
  placeholder,
  isError,
  minWidth,
  minHeight,
  onClick,
}: inputTextAreaProps) => {
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  const errorClass = isError
    ? "focus:ring-danger-red border-dark-red focus:border-danger-red border-danger-red"
    : "focus:ring-primary-blue focus:border-primary-blue border-lilac-gray";
  const minWidthClass: React.CSSProperties = minWidth
    ? { minWidth: minWidth }
    : { minWidth: "100%" };
  const minHeightClass: React.CSSProperties = minHeight
    ? { minHeight: minHeight }
    : { minHeight: "8rem" };

  return (
    <Textarea
      value={value}
      onChange={onChange}
      onClick={onClick}
      disabled={disabled}
      style={{ ...minWidthClass, ...minHeightClass }}
      className={`border rounded-md focus:outline-none
         ${errorClass} ${disabledClass} ${className} `}
      placeholder={placeholder}
    />
  );
};

export default index;
