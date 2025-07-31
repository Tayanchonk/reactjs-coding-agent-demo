import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  Button,
  InputText,
  Toggle,
} from "../../../../../../components/CustomComponent";
import { useConfirm, ModalType } from "../../../../../../context/ConfirmContext";
import { useTranslation } from "react-i18next";

interface ModalAddSectionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: (sectionName: string, show: boolean) => void;
}

const ModalAddSection: React.FC<ModalAddSectionProps> = ({
  open,
  setOpen,
  onConfirm,
}) => {

  const confirm = useConfirm();
  const { t, i18n } = useTranslation();

  const [sectionName, setSectionName] = useState("");
  const [hideSection, setHideSection] = useState(false);
  const [errors, setErrors] = useState(false);

  const handleConfirm = () => {
    if(sectionName === "") {
      setErrors(true);
    }
    else{
      setErrors(false);
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          onConfirm(sectionName, hideSection);
          setSectionName(""); // Clear sectionName after confirming
          setOpen(false);
        },
        notify: true,
        onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
        successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      });
    }
  


  };

  const handleClose = () => {
    setSectionName(""); // Clear sectionName when closing the modal
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-800/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white">
              <div>
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900 p-4 border-b border-gray-200 px-6"
                >
                  {t('builderAndBranding.addSection')}
                </DialogTitle>
                <div className="mt-2 p-4 border-b border-gray-200 px-8 w-full">
                  <p className="text-base font-semibold">
                    <span className="font-semibold text-[red]">* </span>{" "}
                    {t('builderAndBranding.sectionName')}
                  </p>
                  <InputText
                    className="mt-2"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    isError={errors}
                  />
                  {errors && (
                    <p className="text-red-500 text-sm pt-2">
                      {t('thisfieldisrequired')}
                    </p>
                  )}
                  <div className="flex mt-5">
                    <Toggle
                      checked={hideSection}
                      onChange={() => {
                        setHideSection(!hideSection);
                        // dispatch(setHeaderShow({ show: !showHeader }));
                      }}
                    />
                    <div>
                      <p className="pl-2 text-base font-semibold">
                        {t('builderAndBranding.hideSection')}
                      </p>
                      <p className="pl-2 text-sm">
                        {t('builderAndBranding.hideSectionDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 sm:flex sm:flex-row-reverse ">
              <Button
                onClick={handleConfirm}
                className="ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md"
              >
                {t('builderAndBranding.add')}
              </Button>
              <Button
                className="bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
                onClick={handleClose}
              >
                {t('builderAndBranding.cancel')}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAddSection;
