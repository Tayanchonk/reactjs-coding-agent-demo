import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

interface customToastParam {
  type: string;
  message: string;
  fontcolor: string;
}

const CustomToast = ({ type, message, fontcolor }: customToastParam) => {
  const { t } = useTranslation();
  return (
    <div>
      <div style={{ fontWeight: 'bold', color: fontcolor }}>{t(`notification.${type}`)}</div>
      <div style={{ fontSize: '14px' }}>{message}</div>
    </div>
  );
};

const success = (message: string) => {
  toast.success(<CustomToast type="sccess" message={message} fontcolor="#22AD5C" />, {
    className: "black-background",
  });
}
const error = (message: string) => {
  toast.error(<CustomToast type="error" message={message} fontcolor="#E60E00" />, {
    className: "error-background",
  });
}
const info = (message: string) => {
  toast.info(<CustomToast type="info" message={message} fontcolor="#3758F9" />, {
    className: "info-background",
  });
}
const warning = (message: string) => {
  toast.warning(<CustomToast type="warning" message={message} fontcolor="#F4AC3D" />, {
    className: "warning-background",
  });
}

const customs = (message: string, type: string) => {
  toast.warning(<CustomToast type={type} message={message} fontcolor="#F4AC3D" />, {
    className: "warning-background",
  });
}

export default { success, error, info, warning, customs }