import { useState, Fragment, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Popover,
  Transition,
  PopoverPanel,
  PopoverButton,
} from "@headlessui/react";
import { format } from "date-fns";

import { CalendarIcon } from "@heroicons/react/24/outline";
type DatePickerProps = {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  inline?: boolean;
  minWidth?: string;
  disabled?: boolean;
  isError?: boolean;
  placeholder?: string;
  height?: string;
  id?: string;
};
const index = ({
  selectedDate,
  onChange,
  inline = true,
  minWidth,
  disabled,
  isError,
  height,
  placeholder = "Select Date",
  id="",
}: DatePickerProps) => {
  const [formatDate, setFormatDate] = useState<string>("");
  const minWidthClass: React.CSSProperties = minWidth
    ? { minWidth: minWidth }
    : { minWidth: "14rem" };
  const heightClass: React.CSSProperties = height
    ? { height: height }
    : { height: "2.625rem" };
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  const errorClass = isError
    ? "focus:ring-danger-red focus:border-danger-red border-danger-red"
    : "";
  useEffect(() => {
    if (localStorage.getItem("datetime")) {
      const dateFormat = localStorage.getItem("datetime");
      console.log(dateFormat);
      const dataformat = JSON.parse(dateFormat as string);

      const formattedDate = dataformat.dateFormat
        .replace(/D/g, "d")
        .replace(/Y/g, "y");
      setFormatDate(formattedDate);
    }
  }, []);

 
  

  return (
    <Popover className="relative">
      <PopoverButton
        style={{ ...minWidthClass, ...heightClass }}
        disabled={disabled}
        className={`
        ${disabledClass} ${errorClass} 
        flex items-center justify-between
        px-4 py-2 border border-lilac-gray rounded-md shadow-sm 
       bg-white text-steel-gray hover:bg-gray-100 focus:outline-none`}
      >
        {selectedDate && formatDate ? format(selectedDate, formatDate) : placeholder}

        <CalendarIcon className="w-5 h-5 mr-2 text-steel-gray" />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <PopoverPanel className="absolute flex z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <DatePicker
            selected={selectedDate}
            onChange={onChange}
            inline={inline}
            className="w-full h-[2rem]"
            id={id}
          />
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default index;
