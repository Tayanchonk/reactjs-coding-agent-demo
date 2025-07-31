import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { Tag, InputText } from "../";
import { IoIosArrowDown } from "react-icons/io";
import { Fragment, useState } from "react";

type MutipleSelectValue = {
  label: string;
  selected: boolean;
} & Record<string, any>;

type MutipleSelectProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  width?: string;
  isError?: boolean;
  className?: string;
  value: MutipleSelectValue[];
  search?: boolean;
  onSearch?: (e: any) => void;
  onClose?: () => void;
  backgroundColor?: string;
  textColor?: string;
  variant?: "contained" | "outlined";
  height?: string;
  customVerticalAlign?: boolean;
};

const index = ({
  children,
  disabled,
  width,
  isError,
  search,
  onSearch,
  className,
  value,
  onClose,
  backgroundColor = "var(--primary)",
  textColor = "white",
  variant = "contained",
  height,
  customVerticalAlign 
}: MutipleSelectProps) => {
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  const widthClass: React.CSSProperties = width
    ? { width: width }
    : { width: "14rem" };
  const heightClass: React.CSSProperties = height
    ? { height: height }
    : { height: "2.625rem" };
  const errorClass = isError
    ? "focus:ring-danger-red focus:border-danger-red border-danger-red"
    : "focus:ring-primary-blue focus:border-primary-blue";

  const textColorClass: React.CSSProperties = {
    color: textColor,
  };

  return (
    <Menu as="div" className="relative">
      {({ open }) => {
        if (!open && onClose) {
          onClose();
        }
        return (
          <>
            <MenuButton
              style={{ ...widthClass, ...heightClass }}
              disabled={disabled}
              className={`
                ${className}
                ${disabledClass}
                ${errorClass}
                px-4 py-2
             
                rounded-md border flex items-center justify-between `}
            >
              <div className={`${customVerticalAlign ? "":`flex flex-wrap gap-1`}`}>
                {value.map((item, index) => {
                  return item.selected ? (
                    <Tag
                      variant={variant}
                      key={index}
                      color={backgroundColor}
                      minHeight="1.625rem"
                      className={`${customVerticalAlign ? "my-2" : ""}`}
                    >
                      <p style={textColorClass} className=" text-sm">
                        {item.label}
                      </p>
                    </Tag>
                  ) : null;
                })}
              </div>
              <IoIosArrowDown className="text-steel-gray" />
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems
                anchor="bottom"
                style={widthClass}
                className="py-2   origin-top-right bg-white border border-lilac-gray divide-y
                  divide-gray-100 rounded-md shadow-lg outline-none"
              >
                {search && (
                  <MenuItem key={-1}>
                    <div className="py-2flex items-center justify-center">
                      <InputText
                        minWidth="100%"
                        type="search"
                        placeholder="Search"
                        onClick={(e) => e.stopPropagation()}
                        onChange={onSearch}
                      />
                    </div>
                  </MenuItem>
                )}
                {children}
              </MenuItems>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
};

export default index;
