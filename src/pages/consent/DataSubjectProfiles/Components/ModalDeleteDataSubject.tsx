import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownOption,
  InputText,
} from "../../../../components/CustomComponent";
import { useTranslation } from "react-i18next";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import { useDispatch } from "react-redux";
import { deleteDataSubjectProfiles } from "../../../../services/dataSubjectProfileService";
interface ModalDeleteDataSubjectProps {
  openModalDeleteDataSubject: boolean;
  setOpenModalDeleteDataSubject: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  onDelete: (selectedOption: any) => void; // ฟังก์ชันสำหรับลบข้อมูล
}

const ModalDeleteDataSubject: React.FC<ModalDeleteDataSubjectProps> = ({
  openModalDeleteDataSubject,
  setOpenModalDeleteDataSubject,
  data,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<any>({});
  const [error, setError] = useState<boolean>(false);
  const optionAction = [
    {
      id: 1,
      name: t("dataSubjectProfile.modalDeleteDataSubject.option1"),
      delAll: false,
    },
    {
      id: 2,
      name: t("dataSubjectProfile.modalDeleteDataSubject.option2"),
      delAll: true,
    },
  ];

  const handleClose = () => {
    setOpenModalDeleteDataSubject(false); // ปิด Modal
  };

  const handleConfirmDelete = () => {
    if (!selectedOption.id) {
        setError(true)
    }else{
        onDelete(selectedOption); // เรียกฟังก์ชัน onDelete ที่ส่งมาจาก DataSubjectProfiles
        setOpenModalDeleteDataSubject(false); // ปิด Modal หลังจากลบ
        setSelectedOption({}); // รีเซ็ต selectedOption
    }

  };

  if (!openModalDeleteDataSubject) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: 24 }}
    >
      <div className="bg-white rounded-lg w-[630px] shadow-lg">
        <div className="border-b py-4 px-6 flex gap-2 items-center flex relative">
          <h2 className="text-base font-semibold">
            {t(
              "dataSubjectProfile.modalDeleteDataSubject.deleteDataSubjectProfile"
            )}
          </h2>
          <div className="justify-end m-[0 0 0 auto] absolute right-[18px] top-[12px]">
            <button
              className="w-[30px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
              onClick={handleClose}
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
          </div>
        </div>
        <div className="py-4 px-6 border-b">
         
          <div className="px-3">
            <p className="text-center font-normal text-base">
              {t("dataSubjectProfile.modalDeleteDataSubject.content1")}
            </p>
            <p className="text-center font-normal text-base">
              {t("dataSubjectProfile.modalDeleteDataSubject.content2")}
            </p>
            <p className="text-center font-normal text-base">
              {t("dataSubjectProfile.modalDeleteDataSubject.content3")}
            </p>
            <p className="text-center font-normal text-base">
              {t("dataSubjectProfile.modalDeleteDataSubject.content4")}
            </p>
            <p className="text-center font-normal text-base">
              {t("dataSubjectProfile.modalDeleteDataSubject.content5")}
            </p>

            <div className="px-3">
              <p className="pt-3">
                <span className="text-[red] font-semibold">* </span>
                {t("dataSubjectProfile.modalDeleteDataSubject.action")}
              </p>
              <Dropdown
                id="ddl-action"
                className={`w-full mt-1 ${(error&& !selectedOption.id )&& `border-red-500`}`}
                selectedName={selectedOption.name}
              >
                <div
                  className={`relative z-[24] bg-white border rounded pt-0 top-[-8px] `}
                >
                  {optionAction.map((option) => (
                    <DropdownOption
                      onClick={() => setSelectedOption(option)}
                      key={option.id}
                      className={`${
                        selectedOption.id === option.id && `bg-ice-blue`
                      } `}
                    >
                      {option.name}
                    </DropdownOption>
                  ))}
                </div>
              </Dropdown>
              {error && !selectedOption.id && (
                <p className="text-red-500 text-sm mt-1">
                  {t("thisfieldisrequired")}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end py-4 px-6">
          <Button
            onClick={handleClose}
            className="bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
          >
            {t("builderAndBranding.cancel")}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            className="ml-1 px-4 py-2 bg-[#E60E00] text-white rounded text-base font-semibold"
          >
            {t("builderAndBranding.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteDataSubject;
