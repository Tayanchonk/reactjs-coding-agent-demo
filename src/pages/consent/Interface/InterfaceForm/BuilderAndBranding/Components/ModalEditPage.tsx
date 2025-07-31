import React,{useState} from "react";
import {
  Button,
  InputText,
} from "../../../../../../components/CustomComponent";
import { useTranslation } from "react-i18next";
import { useConfirm, ModalType } from "../../../../../../context/ConfirmContext";
import { useDispatch } from "react-redux";
import { editPage } from "../../../../../../store/slices/pageBuilderAndBrandingSlice";

interface ModalEditPageProps {
  openModalEditPage: {
    open: boolean;
    pageName: string;
    pageId: string; // เพิ่ม pageId ที่นี่
  };
  setOpenModalEditPage: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      pageName: string;
      pageId: string; // เพิ่ม pageId ที่นี่
    }>
  >;
}

const ModalEditPage: React.FC<ModalEditPageProps> = ({
  openModalEditPage,
  setOpenModalEditPage,
}) => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const [error,setErrors] = useState(false)
  const handleClose = () => {
    setOpenModalEditPage({ open: false, pageName: "", pageId: "" }); // ปิด Modal และรีเซ็ต pageName
  };

  const handleSave = () => {
    console.log("Saved Page Name:", openModalEditPage.pageName);
    if (openModalEditPage.pageName === "") {
      setErrors(true)
     }
    else {
      setErrors(false)
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {

          const updates = { pageName: openModalEditPage.pageName }; // สร้าง object ที่มี pageName ใหม่
          // เรียกใช้ action editPage
          dispatch(editPage({ pageId: openModalEditPage.pageId, updates }));


          setOpenModalEditPage({ open: false, pageName: "", pageId: "" }); // ปิด Modal หลังจากบันทึก

        },
        notify: true,
        onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    }


  };

  if (!openModalEditPage.open) return null; // ไม่แสดง Modal ถ้า open เป็น false

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ zIndex: 1 }}>
      <div className="bg-white rounded-lg w-[500px] shadow-lg">
        <div className="border-b py-4 px-6">
          <h2 className="text-base font-semibold">{t('builderAndBranding.editPage')}</h2>
        </div>
        <div className="py-4 px-6 border-b">
          <p className="font-semibold text-base pb-4 pt-1"><span className="text-[red]">* </span>{t('builderAndBranding.pageName')}</p>
          <InputText
            type="text"
            value={openModalEditPage.pageName}
            onChange={(e) =>
              setOpenModalEditPage({
                ...openModalEditPage,
                pageName: e.target.value,
              })
            }
            isError={error}
            className="w-full  rounded p-2 text-base"
            placeholder="Enter new page name"
          />
          {error && <p className="text-red-500 text-sm pt-2">{t('thisfieldisrequired')}</p>}
        </div>

        <div className="flex justify-end py-4 px-6">
          <Button
            onClick={handleClose}
            className="bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
          >
            {t('builderAndBranding.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            className="ml-1 px-4 py-2 bg-[#3758F9] text-white rounded text-base font-semibold"
          >
            {t('builderAndBranding.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditPage;
