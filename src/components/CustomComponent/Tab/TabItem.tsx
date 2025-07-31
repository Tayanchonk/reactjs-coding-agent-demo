import React from "react";
type TabItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};
const TabItem = ({ children, onClick, active }: TabItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 flex justify-center  ${
        active ? "border-b border-primary-blue" : ""
      }`}
    >
      <button
        className={`py-2 px-7 font-semibold rounded-lg
        ${active ? "text-blue-600 " : "text-gray-500 "}
        `}
      >
        {children}
      </button>
    </div>
  );
};

export default TabItem;
