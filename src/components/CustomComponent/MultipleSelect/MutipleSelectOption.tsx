import React from "react";
import { MenuItem } from "@headlessui/react";
import { CheckBox } from "../";

type MutipleSelectOptionProps = {
  children?: React.ReactNode;
  selected?: boolean;
  onChange?: () => void;
  disabled?: boolean;
};
const MutipleSelectOption = ({
  children,
  selected,
  onChange,
  disabled,
}: MutipleSelectOptionProps) => {
  const disabledClass = disabled
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer";
  return (
    <MenuItem disabled={disabled}>
      <div className={`px-4 py-2 flex items-center ${disabledClass}`}>
        <CheckBox
          className="mr-1"
          onChange={onChange}
          shape="square"
          checked={selected}
        />
        {children}
      </div>
    </MenuItem>
  );
};

export default MutipleSelectOption;
