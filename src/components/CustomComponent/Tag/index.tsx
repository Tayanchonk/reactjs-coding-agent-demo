import React from "react";

type TagProps = {
  className?: string;
  children?: React.ReactNode;
  color?: string;
  size?: "sm" | "md" | "lg";
  variant?: "text" | "outlined" | "contained";
  minWidth?: string;
  minHeight?: string;
};
const index = ({
  className,
  children,
  color = "var(--primary)",
  size,
  variant,
  minWidth,
  minHeight,
}: TagProps) => {
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
    : { minWidth: "3.5rem" };
  const minHeightClass: React.CSSProperties = minHeight
    ? { minHeight: minHeight }
    : { minHeight: "2.5rem" };
  const colorClass: React.CSSProperties =
    variant === "contained"
      ? { backgroundColor: color }
      : variant === "outlined"
      ? { borderColor: color, borderWidth: "1px", borderStyle: "solid" }
      : {};

  return (
    <div
      style={{ ...minWidthClass, ...minHeightClass, ...colorClass }}
      className={`${
        className ? className : ""
      } ${sizeClass} ${minWidthClass} ${colorClass} rounded-md flex items-center justify-center`}
    >
      {children}
    </div>
  );
};

export default index;
