import { useTranslation } from "react-i18next";
import { IoSwapVertical } from "react-icons/io5";

type SortingIconProps = {
  onClick?: () => void;
  title: string;
  center?: boolean;
};

const SortingIcon = ({ onClick, title, center = false }: SortingIconProps) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        width: "100%",
      }}
    >
      <span>{t(title)}</span>
      <IoSwapVertical
        className="size-4 cursor-pointer stroke-2 transform scale-x-[-1]"
        style={{ marginLeft: center ? "4px" : "auto" }}
        onClick={onClick}
      />
    </div>
  );
};

export default SortingIcon;