import React from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface ConfirmPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnpublish: () => void;
}

const PopupUnpublish: React.FC<ConfirmPublishModalProps> = ({ isOpen, onClose, onUnpublish }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-start gap-2 pt-6 pr-6 pl-6">
          <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
            <FiAlertTriangle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{t("interface.unpublishedModal.title")}</h2>
            <p className="text-gray-600 text-base mt-1">
              {t("interface.unpublishedModal.titledesc")}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-md pr-6 pl-14">
          <p className="ml-2 mt-4 text-base font-semibold">{t("interface.unpublishedModal.areYouSure")}</p>
        </div>
        <hr className="border-t border-gray-200 w-full"></hr>
        <div className="mt-3 flex justify-end gap-2 pr-6 pl-6 pb-4">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">{t("interface.unpublishedModal.cancel")}</button>
          <button onClick={onUnpublish} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t("interface.unpublishedModal.unpublish")}</button>
        </div>
      </div>
    </Dialog>
  );
};

export default PopupUnpublish;