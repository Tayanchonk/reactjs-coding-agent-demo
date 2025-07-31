import React from "react";
import { Button } from "@headlessui/react";
type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "text" | "outlined" | "contained";
  minWidth?: string;
  color?: string;
  disabled?: boolean;
  minHeight?: string;
};
const index = ({
  children,
  className,
  onClick,
  size,
  minWidth,
  variant,
  color = "var(--primary)",
  disabled,
  minHeight,
}: ButtonProps) => {
  const sizeClass =
    size === "sm"
      ? "px-3 py-1"
      : size === "md"
      ? "px-4 py-2"
      : size === "lg"
      ? "px-5 py-3"
      : "px-4 py-2";
  const minWidthClass: React.CSSProperties = minWidth
    ? { minWidth: minWidth }
    : { minWidth: "6.6875rem" };
  const minHeightClass: React.CSSProperties = minHeight
    ? { minHeight: minHeight }
    : { minHeight: "2.625rem" };
  const colorClass: React.CSSProperties =
    variant === "contained"
      ? { backgroundColor: color }
      : variant === "outlined"
      ? { borderColor: color, borderWidth: "1px", borderStyle: "solid" }
      : {};
  const disabledClass = disabled
    ? `cursor-not-allowed opacity-50`
    : "hover:opacity-80 ";
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{ ...colorClass, ...minWidthClass, ...minHeightClass }}
      className={`${
        className ? className : ""
      } ${disabledClass} ${sizeClass} ${minWidthClass} ${colorClass} rounded-md `}
    >
      {children}
    </Button>
  );
};

export default index;
