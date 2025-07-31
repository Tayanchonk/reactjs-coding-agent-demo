import UnauthorizedError from "../assets/images/UnauthorizedError.png";
import { useTranslation } from 'react-i18next';

function AccessDeniedPage() {
  const { t } = useTranslation();
  return (
    <div className="relative flex items-center justify-center h-auto" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      <img
        src={UnauthorizedError}
        alt="PageNotFound"
        className="h-96 object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 pl-4">
        <span className="font-semibold text-9xl text-primary-blue">
          401
        </span>
        <span className="font-semibold text-4xl text-primary-blue">
          {t("errorPage.401.title")} <span className='text-yellow-200'>!</span>
        </span>
        <span className="font-light text-base text-gray-600 pt-2">
          {t("errorPage.401.description")}
        </span>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
