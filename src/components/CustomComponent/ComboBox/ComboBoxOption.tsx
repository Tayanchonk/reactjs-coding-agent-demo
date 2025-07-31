import React from "react";
import { ComboboxOption } from "@headlessui/react";

type ComboBoxOptionProps = {
  className?: string;
  children?: React.ReactNode;
  value?: any;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
};
const ComboBoxOption = ({
  className,
  children,
  value,
  disabled,
  selected,
  onClick,
}: ComboBoxOptionProps) => {
  const selectedClass = selected
    ? "bg-primary-blue"
    : "data-[focus]:bg-ice-blue";
  const disabledClass = disabled
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer";
  return (
    <ComboboxOption onMouseDown={onClick} disabled={disabled} value={value}>
      <div
        className={`
            ${className}
            ${disabledClass}
            block ${selectedClass} px-4 py-2 `}
      >
        {children}
      </div>
    </ComboboxOption>
  );
};

export default ComboBoxOption;
