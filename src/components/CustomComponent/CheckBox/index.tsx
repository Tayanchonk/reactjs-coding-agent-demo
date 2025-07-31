import React, { useState } from "react";
import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

type checkboxProps = {
  className?: string;
  shape?: "rounded" | "square";
  checked?: boolean;
  onChange?: (e:any) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  color?: string;
};
const index = ({
  shape = "rounded",
  checked = false,
  onChange,
  disabled,
  color = "var(--primary)",
  className,
}: checkboxProps) => {
  const shapeClass = shape === "rounded" ? "rounded-full" : "rounded";
  const diasbledClass = disabled ? "cursor-not-allowed opacity-50" : "";

  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      style={{ backgroundColor: checked ? color : "white" }}
      className={`
        ${className}
        ${diasbledClass}
        ${
          checked ? ` border-transparent` : "bg-white border-lilac-gray"
        } relative inline-flex items-center justify-center w-5 h-5 border ${shapeClass} transition-colors duration-200 ease-in-out`}
    >
      {checked && <CheckIcon className="w-4 h-4 text-white" />}
    </Checkbox>
  );
};

export default index;
