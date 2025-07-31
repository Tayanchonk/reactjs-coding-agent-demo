import { act, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { ModalType } from "../../enum/ModalType";
import notification from "../../utils/notification";
import { useTranslation } from "react-i18next";
import { LiaTimesSolid } from "react-icons/lia";
import { Button } from "../CustomComponent";
type ModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  detail?: string;
  notify?: boolean;
  modalType: ModalType;
  onConfirm: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
};

const ConfirmModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  detail,
  modalType,
  onConfirm,
  notify,
  successMessage,
  errorMessage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const defTitle = t(`modal.confirm${modalType}`);
  const defDetail = t(`modal.descriptionConfirm${modalType}`);
  const isNotify = notify ?? true;

  const backgroundIconColor =
    modalType === ModalType.Save || modalType === ModalType.Active
      ? "bg-light-green"
      : modalType === ModalType.Cancel
      ? "bg-light-yellow"
      : modalType === ModalType.Retry 
      ? "bg-[#edeffe]"
      : "bg-light-red";

  const textIconColor =
    modalType === ModalType.Save || modalType === ModalType.Active
      ? "text-dark-green"
      : modalType === ModalType.Cancel
      ? "text-dark-yellow"
      : modalType === ModalType.Retry
      ? "text-[#4b63f1]"
      : "text-dark-red";

  const actionText =
    modalType === ModalType.Save || modalType === ModalType.Cancel || modalType === ModalType.Retry
      ? t("modal.ok")
      : modalType === ModalType.Active
      ? t("modal.active")
      : modalType === ModalType.Inactive
      ? t("modal.inactive")
      : t("modal.delete");

  const actionColor =
    modalType === ModalType.Save || modalType === ModalType.Cancel

      ? "bg-primary-blue"
      : modalType === ModalType.Active
      ? "bg-dark-green"
      : "bg-dark-red";
      
  const handleConfirm = async () => {
    onClose();
    try {
      setIsLoading(true);
      await onConfirm();
      console.log(errorMessage);

      console.log("success");

      if (isNotify) {
        if (successMessage) {
          notification.success(successMessage);
        } else {
          notification.success(t("modal.success"));
        }
      }
    } catch (error) {
      console.log("eeeee");
      console.error(error);
      if (isNotify) {
        if (errorMessage) {
          notification.error(errorMessage);
        } else {
          notification.error(t("modal.error"));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      role="dialog"
      aria-label={title ? title : defTitle}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl relative">
          <button
            className=" text-right flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
            onClick={onClose}
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

          <div className="flex items-center">
            <div
              className={`${backgroundIconColor} ${textIconColor} p-2 rounded-full`}
            >
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <div className="mt-0 ml-2 flex flex-col items-start w-full">
              <p className="text-xl font-semibold">{title ? title : defTitle}</p>
              <p className="text-base">
                {detail ? detail : defDetail}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outlined"
              color="#DFE4EA"
              className="text-base font-semibold"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={isLoading}
              className={`rounded-md min-w-[100px] font-light ${actionColor} px-4 py-1 text-base font-semibold text-white`}
            >
              {actionText}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmModal;
/*
Documentation 
Component for Confirm Modal
----------------------------------------------------------------------------------
Example:
Declare state for modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );
----------------------------------------------------------------------------------
assign value Example:
   const openConfirmModal = () => {
      setConfirmTitle("Save Changes");
      setConfirmDetail("Are you sure you want to save changes?");
      setConfirmType(ModalType.Save);
      setConfirmAction(() => geRequestAccessTokenSetting);
      setIsConfirmModalOpen(true);
      setConfirmSuccessMessage("Changes saved successfully");
      setConfirmErrorMessage("Failed to save changes");
    };
    const geRequestAccessTokenSetting = async () => {
      const a = await getAccessTokenSetting(
        "123e4567-e89b-12d3-a456-4266141d74000"
      );
      console.log(a);
    };
  ----------------------------------------------------------------------------------
  Use component Example:
        <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={confirmTitle}
        modalType={confirmType}
        detail={confirmDetail}
        onConfirm={confirmAction}
        successMessage={confirmSuccessMessage}
        errorMessage={confirmErrorMessage}
      ></ConfirmModal>
    */
