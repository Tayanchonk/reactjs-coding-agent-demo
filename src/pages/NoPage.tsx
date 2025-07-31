import PageNotFound from "../assets/images/PageNotFound.png";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function NoPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  }
  return (
    <div className="relative flex items-center justify-center h-auto" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      <img
        src={PageNotFound}
        alt="PageNotFound"
        className="h-96 object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-24 pl-4">
        <span className="font-semibold text-9xl text-primary-blue">
          404
        </span>
        <span className="font-semibold text-4xl text-primary-blue">
          {t("errorPage.404.title")} <span className='text-yellow-200'>:(</span>
        </span>
        <span className=" text-base text-gray-600 pt-2">
          {t("errorPage.404.description")}
        </span>
        <span className='pt-10'>
          <button
            onClick={() => handleNavigate()}
            className="rounded bg-[#3758F9] py-2 px-4 text-sm text-white font-semibold hover:bg-sky-500 active:bg-sky-700 "
          >
            {t("errorPage.404.btn")}
          </button>
        </span>
      </div>
    </div>
  );
}

export default NoPage;
