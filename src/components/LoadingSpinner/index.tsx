import { GooSpinner } from "react-spinners-kit";
import { useTranslation } from "react-i18next";
import "./style.css"

function LoadingSpinner() {
  const { t } = useTranslation();
  return (
    <div
      className="twoColor"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "20rem"
      }}
    >
      <GooSpinner size={80} color="#3586FF" loading={true} />
      <span className="font-normal text-gray-600 text-lg slow-blink" >
        {t("loading")}
      </span>
    </div>
  );
}

export default LoadingSpinner;
