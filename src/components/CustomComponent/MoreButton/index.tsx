import { useState, useEffect, useRef } from "react";
import { IoMdMore } from "react-icons/io";
type MoreButtonProps = {
  children?: React.ReactNode;
};
const MoreButton: React.FC<MoreButtonProps> = ({ children }) => {
  const [showInfo, setShowInfo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setShowInfo(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative z-1 cursor-pointer"
      onClick={() => setShowInfo(!showInfo)}
    >
      <IoMdMore className="text-lg" />
      {showInfo && (
        <div className="absolute z-50 right-0 mt-2 w-fit bg-white border border-gray-200 rounded-md shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default MoreButton;
