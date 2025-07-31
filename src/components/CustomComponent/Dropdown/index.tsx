import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

type DropdownProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  minWidth?: string;
  title?: string;
  isError?: boolean;
  className?: string;
  selectedName?: string;
  selectedLabel?: string;
  id?: string;
  height?: string;
  isEmpty?: boolean;
  longText?: boolean;
  customeHeight?: boolean;
  customInModal?: boolean;
  customeHeightValue?: string;
};

const index = ({
  children,
  disabled,
  minWidth,
  title = "Select",
  isError,
  className,
  selectedLabel,
  selectedName,
  id,
  height,
  isEmpty,
  longText,
  customeHeight,
  customInModal,
  customeHeightValue,
}: DropdownProps) => {
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  const minWidthClass: React.CSSProperties = minWidth
    ? { minWidth: minWidth }
    : { minWidth: "14rem" };
  const heightClass: React.CSSProperties = height
    ? { height: height }
    : { height: "2.625rem" };

  const errorClass = isError
    ? "focus:ring-danger-red focus:border-danger-red border-danger-red"
    : "focus:ring-primary-blue focus:border-primary-blue";
  const dropdownTitle = isEmpty
    ? selectedName !== ""
      ? selectedName
      : ""
    : selectedName && selectedName.length > 0
    ? selectedName
    : title;

  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined
  );

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
  return (
    <Menu>
      <MenuButton
        disabled={disabled}
        style={{ ...minWidthClass, ...heightClass }}
        id={id}
        className={`
        ${className}
        ${disabledClass}
        px-4 py-2
       rounded-md ${errorClass} border flex items-center justify-between`}
      >
        <p className={`${selectedName ? "text-black" : "text-steel-gray"} ${longText ? "text-ellipsis overflow-hidden max-w-[95%]" : ""}`}>
          {selectedLabel ? selectedLabel : dropdownTitle}
        </p>
        <IoIosArrowDown className="text-steel-gray" />
      </MenuButton>
      <MenuItems
        anchor="bottom"
        style={{ width: dropdownWidth + "px", height: customeHeightValue ? customeHeightValue : "" }}
        className={`py-2 origin-top-right bg-white border border-lilac-gray divide-y
         divide-gray-100 rounded-md shadow-lg outline-none !overflow-y-scroll ${customInModal ? "z-[100000000] h-[150px]":""} ${customeHeight ?  "t-[-340.909px] h-[260px]" :"!max-h-[7.875rem]"}`}
      >
        {children}
      </MenuItems>
    </Menu>
  );
};

export default index;
