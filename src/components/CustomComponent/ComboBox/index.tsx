import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";
type ComboBoxProps = {
  onChange?: (value: any) => void;
  onClose?: () => void;
  disabled?: boolean;
  minWidth?: string;
  select?: Object;
  isError?: boolean;
  children?: React.ReactNode;
  displayName?: any;
  height?: string;
  id?: string;
  className?: string;
  defaultValue?: any;
  placeholder?: string;
  customeHeight?: boolean;
};

const index = ({
  onChange,
  onClose,
  disabled,
  minWidth,
  select,
  isError,
  children,
  displayName,
  height,
  id,
  className,
  defaultValue,
  placeholder,
  customeHeight
}: ComboBoxProps) => {
  //   const selectedClass = selected
  //     ? "bg-primary-blue"
  //     : "data-[focus]:bg-ice-blue";
  const disabledClass = disabled
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer";

  const minWidthClass: React.CSSProperties = minWidth
    ? { minWidth: minWidth }
    : { minWidth: "14rem" };
  const heightClass: React.CSSProperties = height
    ? { height: height }
    : { height: "2.625rem" };
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined
  );
  const defaultSelectValue = select ? select : defaultValue;

  useEffect(() => {
    const updateDropdownWidth = () => {
      if (id) {
        setDropdownWidth(document.getElementById(id)?.offsetWidth);
      }
    };

    updateDropdownWidth();
    window.addEventListener("resize", updateDropdownWidth);

    return () => {
      window.removeEventListener("resize", updateDropdownWidth);
    };
  }, []);

  const isErrorClass = isError
    ? "focus:ring-danger-red focus:border-danger-red border-danger-red"
    : "focus:ring-primary-blue focus:border-primary-blue border-lilac-gray";

  return (
    <Combobox value={defaultSelectValue} onClose={onClose}>
      <div
        style={{ width: minWidth ? minWidth : "14rem", ...heightClass }}
        className="relative"
      >
        <ComboboxInput
          aria-label="Assignee"
          id={id}
          disabled={disabled}
          displayValue={() => displayName}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{ ...minWidthClass, ...heightClass }}
          placeholder={placeholder}
          className={` ${className} px-4 py-2 ${disabledClass} 
       rounded-md ${isErrorClass} border flex items-center justify-between text-black `}
        />
        <ComboboxButton
          disabled={disabled}
          className={`absolute inset-y-0 right-0 flex items-center pr-2 ${disabledClass}`}
        >
          <ChevronDownIcon className="w-5 h-5 text-steel-gray" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom"
        style={{ width: dropdownWidth + "px" }}
        className={`
            ${disabledClass} 
          py-2 origin-top-right bg-white border border-lilac-gray divide-y
          overflow-scroll z-50
         divide-gray-100 rounded-md shadow-lg outline-none cursor-pointer ${customeHeight ?  "t-[-340.909px] h-[260px]" :"!max-h-[7.875rem]"} `}
      >
        {children}
      </ComboboxOptions>
    </Combobox>
  );
};

export default index;
