import { createContext, useContext, useState, ReactNode } from "react";
import ReactDOM from "react-dom";
import ConfirmModal from "../components/Modals/ConfirmModal";

export enum ModalType {
  Save = "Save",
  Cancel = "Cancel",
  Delete = "Delete",
  Active = "Active",
  Inactive = "Inactive",
  Retry = "Retry",
}

type ConfirmOptions = {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  detail?: string;
  notify?: boolean
  modalType: ModalType;
  onConfirm: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm ต้องใช้ภายใต้ ConfirmProvider เท่านั้น");
  }
  return context.confirm;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [modalProps, setModalProps] = useState<ConfirmOptions | null>(null);
  const confirm = (options: ConfirmOptions) => {
    options.isOpen = true;
    options.notify = options.notify ?? true;
    setModalProps(options);
  };

  const handleClose = () => setModalProps(null);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {modalProps &&
        ReactDOM.createPortal(
          <ConfirmModal {...modalProps} onClose={handleClose} />,
          document.body
        )}
    </ConfirmContext.Provider>
  );
};
