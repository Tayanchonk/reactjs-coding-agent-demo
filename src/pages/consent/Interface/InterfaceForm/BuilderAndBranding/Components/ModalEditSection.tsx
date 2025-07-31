import React, { useState, useEffect } from "react";
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
import { removeSectionsPersonalData } from "../../../../../../store/slices/sectionPersonalDataBuilderAndBrandingSlice";
import { useDispatch } from "react-redux";

interface ModalEditSectionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: (id: string, sectionName: string, hideSection: boolean) => void;
  id: string | null; // Ensure id can be null
  initialText: string;
  show: boolean;
}

const ModalEditSection: React.FC<ModalEditSectionProps> = ({
  open,
  setOpen,
  onConfirm,
  id,
  initialText,
  show,
}) => {

  const confirm = useConfirm();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const [sectionName, setSectionName] = useState(initialText || "");
  const [hideSection, setHideSection] = useState(show);
  const [errors, setErrors] = useState(false);

  useEffect(() => {
    if (open) {
      setSectionName(initialText || ""); // Reset section name when modal opens
      setHideSection(show ? false : true); // Reset hideSection when modal opens
    }
  }, [open, initialText, show]);

  const handleConfirm = () => {
    if (sectionName === "") {
      setErrors(true);
    }
    else {
      setErrors(false);
      if (id) {

        confirm({
          title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
          detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
          modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
          onConfirm: async () => {
            onConfirm(id, sectionName, hideSection); // Pass updated values to parent
            setOpen(false);
          },
          notify: true,
          onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
          successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
          errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
        });

      }
    }

    // Close modal
  };

  const handleDelete = (id:any) => {
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        
        dispatch(removeSectionsPersonalData(id));
      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
    setOpen(false)
    // setActiveItemId(null);
    // 
  };

  const handleClose = () => {
    setOpen(false); // Close modal without saving
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-800/75" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white">
              <DialogTitle className="text-base font-semibold text-gray-900 p-4 border-b border-gray-200 px-6">
                {t('builderAndBranding.editSection')}
              </DialogTitle>
              <div className="mt-2 p-4 border-b border-gray-200 px-8 w-full">
                <p className="text-base font-semibold">
                  <span className="font-semibold text-[red]">* </span>  {t('builderAndBranding.sectionName')}
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
                    onChange={() => setHideSection(!hideSection)}
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
            <div className="bg-gray-50 p-6 sm:flex sm:flex-row-reverse">
              
              <Button
                onClick={handleConfirm}
                className="ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md"
              >
                {t('builderAndBranding.save')}
              </Button>
              <Button
                className="bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md"
                onClick={handleClose}
              >
                {t('builderAndBranding.cancel')}
              </Button>
              <Button
                onClick={()=>handleDelete(id)}
                className="ml-1 bg-[#fff] text-[red] border border-[red] text-base font-semibold px-4 py-2 rounded-md mr-1"
              >
                {t('builderAndBranding.delete')}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalEditSection;