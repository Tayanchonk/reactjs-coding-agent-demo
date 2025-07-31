import React, { useState } from "react";
import { Checkbox } from "@headlessui/react";

type radioProps = {
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  color?: string;
  className?: string;
};
const index = ({
  className,
  checked,
  onChange,
  disabled,
  color = "var(--primary)",
}: radioProps) => {
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      style={{ borderColor: color, borderWidth: "1px", borderStyle: "solid" }}
      className={`
        ${className}
        ${disabledClass}
        ${
          checked ? `border-${color}` : " border-lilac-gray"
        } bg-white relative inline-flex items-center justify-center w-5 h-5 border rounded-full transition-colors duration-200 ease-in-out`}
    >
      <span
        style={{ backgroundColor: color }}
        className={`${
          checked ? `block w-[0.625rem] h-[0.625rem] rounded-full` : "hidden"
        }`}
      />
    </Checkbox>
  );
};

export default index;
