import React from "react";
import { MenuItem } from "@headlessui/react";

type DropdownOptionProps = {
  children?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};
const DropdownOption = ({
  children,
  selected,
  onClick,
  disabled,
  className,
  style
}: DropdownOptionProps) => {
  const selectedClass = selected
    ? "bg-primary-blue"
    : "data-[focus]:bg-ice-blue";
  const disabledClass = disabled
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer";
  return (
    <MenuItem disabled={disabled}>
      <div
        onClick={onClick}
        className={`
            ${className}
            ${disabledClass}
            block ${selectedClass} px-4 py-2 `}
        style={style}
      >
        {children}
      </div>
    </MenuItem>
  );
};

export default DropdownOption;
