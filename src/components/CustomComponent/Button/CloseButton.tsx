import React from "react";
type CloseButtonProps = {
  onClick: () => void;
};
const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <button
      className=" text-right flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
        className="size-6 h-[30px] w-[30px]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default CloseButton;
