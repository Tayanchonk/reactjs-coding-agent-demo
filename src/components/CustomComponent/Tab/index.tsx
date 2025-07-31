import React from "react";
type TabProps = {
  children: React.ReactNode;
  buttonGroup?: any;
  tabs: any;
  selectedIndex?: number;
};
const Tab = ({ children, buttonGroup, tabs, selectedIndex }: TabProps) => {
  return (
    <div className="bg-white w-full">
      <div>
        <nav className="flex border-b justify-between">
          <div className="flex ">{tabs}</div>
          {buttonGroup && <div className="p-3 gap-1">{buttonGroup}</div>}{" "}
        </nav>
      </div>
      <div className="m-3 pt-5 pb-10  ">{children}</div>
    </div>
  );
};

export default Tab;
