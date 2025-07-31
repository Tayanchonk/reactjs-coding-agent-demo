import React from "react";
import { Dialog } from "@headlessui/react";
import { IoMdAlert } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface ConfirmPublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPublish: () => void;
}

const ConfirmPublishModal: React.FC<ConfirmPublishModalProps> = ({ isOpen, onClose, onPublish }) => {
    const { t } = useTranslation();
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
                <div className="flex items-start gap-2 pt-6 pr-6 pl-6">
                    <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                        <FiAlertTriangle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{t("purpose.standardPurpose.publishPopup.title")}</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {t("purpose.standardPurpose.publishPopup.description")}
                        </p>
                    </div>
                </div>

                <div className="p-4 rounded-md pr-6 pl-14">
                    <div className="flex items-center gap-2">
                        <div className=" p-2 rounded-full flex items-center justify-center">
                            <FiAlertTriangle className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-sm">{t("purpose.standardPurpose.publishPopup.line1")}</h3>
                    </div>
                    <div className="ml-12">
                        <ul className="mt-2 text-sm text-gray-700 list-disc list-outside pl-5">
                            <li>{t("purpose.standardPurpose.publishPopup.line2")}</li>
                            <li>{t("purpose.standardPurpose.publishPopup.line3")}</li>
                            <li>{t("purpose.standardPurpose.publishPopup.line4")}</li>
                        </ul>
                    </div>
                    <p className="ml-2 mt-4 text-sm font-medium">{t("purpose.standardPurpose.publishPopup.line5")}</p>

                </div>
                <hr className="border-t border-gray-200 w-full"></hr>
                <div className="mt-3 flex justify-end gap-2 pr-6 pl-6 pb-4">
                    <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">{t("purpose.standardPurpose.actions.cancel")}</button>
                    <button onClick={onPublish} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t("purpose.standardPurpose.actions.publish")}</button>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmPublishModal;