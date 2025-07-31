import React from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CloseButton, Button } from "../../../components/CustomComponent";
import { useTranslation } from "react-i18next";
interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  htmlContent: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  title = "Preview",
  htmlContent,
}) => {
  const { t } = useTranslation();
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-[80vw] transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between pb-3 border-b">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <CloseButton onClick={() => onClose()} />
                </div>

                <div className="mt-4 overflow-y-auto max-h-[70vh]">
                  <div
                    className="max-w-none prose"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="contained"
                    className="text-base font-semibold"
                    onClick={onClose}
                  >
                    <p className="text-white">{t("close")}</p>
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PreviewModal;
