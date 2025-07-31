import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import {
  Button,
  InputText,
  TextArea,
} from "../../../../../../components/CustomComponent";
import { useTranslation } from "react-i18next";
import { setCustomCss } from "../../../../../../store/slices/previewCustomCssSlice";
import { useDispatch } from "react-redux";
import {
  useConfirm,
  ModalType,
} from "../../../../../../context/ConfirmContext";

interface CustomCSSProps {
  setOpenScreenCustomCss: (open: boolean) => void;
  mode: string;
}

const CustomCSS: React.FC<CustomCSSProps> = ({ setOpenScreenCustomCss,mode }) => {
  // ------------- STATE -----------------
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const confirm = useConfirm();
  const customCss = useSelector(
    (state: RootState) => state.previewCustomCss
  );

  const [customCssURL, setCustomCssURL] = useState<string>("--https://yourdomain.com/custom.css");
  const language = useSelector((state: RootState) => state.language.language);
  const [customCssURLInput, setCustomCssURLInput] = useState<string>(customCss.customCssURL);
  const [customCssInput, setCustomCssInput] = useState<string>(customCss.customCss);


  // ------------- FUNCTION -----------------
  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };
  const handleConfirm = () => {


    confirm({
      title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        dispatch(
          setCustomCss({
            customCssURL: customCssURLInput,
            customCss: customCssInput,
          })
        );
        setOpenScreenCustomCss(false);
      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });


  };

  // ------------- USEEFFECT -----------------
  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  return (
    <div className="w-full bg-white pr-4">
      <div className="flex p-4 border-b">
        <button
          type="button"
          className="w-1/12 pt-[2px]"
          onClick={() => setOpenScreenCustomCss(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <div className="w-8/12 pl-3 my-auto">
          <p className="font-semibold text-base text-[#3758F9]">{t('builderAndBranding.customCss')}</p>
        </div>
        <div className="w-3/12 pt-[8px] text-right"></div>
      </div>
      <div className="p-4">
        <p className="text-base text-[#111928]">
          {t('builderAndBranding.css.customCssDescription')}
        </p>
        <p className="text-base text-[#111928] pt-2">
          {t('builderAndBranding.css.format')} : https://yourdomain.com/custom.css
        </p>
      </div>
      <div className="pb-2 pt-4 pr-3 ">
        <p className=" py-2 text-base font-semibold">    {t('builderAndBranding.css.customCssUrl')}</p>
        <InputText placeholder="--https://yourdomain.com/custom.css" value={customCssURLInput} onChange={(e) => setCustomCssURLInput(e.target.value)} disabled={mode === 'view'} />
      </div>
      <div className="pb-2 pt-4 pr-3 ">
        <p className=" py-2 text-base font-semibold">  {t('builderAndBranding.css.customCss')}</p>
        <TextArea placeholder="body 
        {
        background-color: lightblue;
        }"
          value={customCssInput} onChange={(e) => setCustomCssInput(e.target.value)}
          disabled={mode === 'view'}
        />
      </div>
      <div>
        <div className={`flex pt-5 border-t border-gray-200 ${mode === 'view' && `justify-end`}`}>
          <Button
            className="w-1/2 bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
            onClick={() => setOpenScreenCustomCss(false)}
          >
            {t('builderAndBranding.cancel')}
          </Button>
          {mode === 'view' ? null :
            <Button
              onClick={handleConfirm}
              className="w-1/2 ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md"
            >
              {t('builderAndBranding.apply')}
            </Button>
          }
        </div>
      </div>
    </div>
  );
};

export default CustomCSS;
