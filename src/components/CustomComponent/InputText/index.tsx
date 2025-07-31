import React, { useState } from "react";
import { Input } from "@headlessui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

type inputTextProps = {
  className?: string;
  value?: string;
  onChange?: (e: any) => void;
  onClick?: (e: any) => void;
  onKeyUp?: (e: any) => void;
  disabled?: boolean;
  placeholder?: string;
  isError?: boolean;
  minWidth?: string;
  type?: "text" | "password" | "number" | "search";
  height?: string;
  id?: string;
};
const index = ({
  className,
  value,
  onChange,
  onClick,
  disabled,
  placeholder,
  isError,
  minWidth,
  type = "text",
  height,
  id="",
}: inputTextProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  const errorClass = isError
    ? "focus:ring-danger-red focus:border-danger-red border-danger-red"
    : "focus:ring-primary-blue focus:border-primary-blue border-lilac-gray";

  const minWidthClass: React.CSSProperties = minWidth
    ? { minWidth: minWidth }
    : { minWidth: "100%" };
  const heightClass: React.CSSProperties = height
    ? { height: height }
    : { height: "2.625rem" };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="relative" style={minWidthClass}>
      {type === "search" && (
        <div className="absolute inset-y-0 bottom-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-500" />
        </div>
      )}
      <Input
        id={id}
        onClick={onClick}
        type={showPassword ? "text" : type === "search" ? "text" : type}
        disabled={disabled}
        style={heightClass}
        className={`${className} ${disabledClass} text-base  border rounded-md focus:outline-none ${errorClass}
        w-full
        ${type === "search" ? "pl-10" : "px-4 py-2"}
        ${type === "number" ? "text-center" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        >
          {showPassword ? (
            <AiOutlineEye size={20} />
          ) : (
            <AiOutlineEyeInvisible size={20} />
          )}
        </button>
      )}
    </div>
  );
};

export default index;
