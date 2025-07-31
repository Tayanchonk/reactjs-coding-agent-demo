import React from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface ConfirmResetSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

const ConfirmResetSecretModal: React.FC<ConfirmResetSecretModalProps> = ({ isOpen, onClose, onReset }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{t("clientCredentials.confirmReset.title")}</h2>
            <p className="text-sm text-gray-700 mt-1">
             {t("clientCredentials.confirmReset.description")}
            </p>
            <p className="mt-4 text-sm font-medium text-gray-900">
              {t("clientCredentials.confirmReset.remark")}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
           {t("clientCredentials.confirmReset.cancel")}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
          {t("clientCredentials.confirmReset.reset")}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmResetSecretModal;