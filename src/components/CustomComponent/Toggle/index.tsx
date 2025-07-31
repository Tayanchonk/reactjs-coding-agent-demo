import React, { useState } from "react";
import { Switch } from "@headlessui/react";

type toggleProps = {
  className?: string;
  onChange?: () => void;
  checked?: boolean;
  disabled?: boolean;
  color?: string;
};

const index = ({
  checked,
  onChange,
  disabled,
  color = "var(--primary)",
  className,
}: toggleProps) => {
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  const colorClass: React.CSSProperties = checked
    ? { backgroundColor: color }
    : { backgroundColor: "#CCCCCE" };
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      style={colorClass}
      disabled={disabled}
      className={`${className} ${disabledClass} 
      relative inline-flex items-center rounded-full min-w-12 w-12 h-6`}
    >
      <span
        className={`${checked ? "translate-x-7" : "translate-x-1"} 
        inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
    </Switch>
  );
};

export default index;
