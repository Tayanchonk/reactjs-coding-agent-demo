import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCloseAlert } from "../../store/slices/openAlertSlice";


interface AlertProps {
  description: string | null;
  typeAlert: string | null;
}

const Alert: React.FC<AlertProps> = ({ typeAlert, description }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setCloseAlert());
    }, 3000); // 3 วินาที

    return () => clearTimeout(timer); // ล้าง timer เมื่อ component ถูก unmount
  }, [dispatch]);
  
  return (
    <div
      style={{
        background: `${
          typeAlert === "error"
            ? `#FDF0F0`
            : typeAlert === "success"
            ? `#F1F9F6`
            : `#E8F3FF`
        }`,
      }}
      className={`p-4 mb-4 text-sm text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400  fixed bottom-0 right-[20px] z-50 flex`}
    >
      <div className="m-auto p-1">
        {typeAlert === "error" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#E60E00"
            className="size-9"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {typeAlert === "info" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#1369b0"
            className="size-9"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {typeAlert === "success" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#48BB78"
            className="size-9"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <div className="p-1">
        <p
          className="font-semibold"
          style={{
            color: `${
              typeAlert === "error"
                ? `#E60E00`
                : typeAlert === "success"
                ? "#22AD5C"
                : `#3758F9`
            }`,
          }}
        >
          {typeAlert === "error"
            ? "Error !"
            : typeAlert === "success"
            ? "Success"
            : "Info"}
        </p>
        <p>{description}</p>
      </div>
    </div>
  );
};
export default Alert;
