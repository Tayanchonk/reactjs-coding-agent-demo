import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { setCloseModalCFOrg } from "../../../store/slices/openModalCFOrg";
import { deleteData, postData, putData } from "../../../services/apiService";
import "./style.css";
import { setOpenAlert } from "../../../store/slices/openAlertSlice";
import { setCloseDrawerOrgCreate } from "../../../store/slices/openDrawerCreateOrg";
import { createOrganization, deleteOrganization, updateOrganization } from "../../../services/organizationService";
import { useTranslation } from "react-i18next";
import { FaExclamationTriangle } from "react-icons/fa";
import notification from "../../../utils/notification";
import { setReloadOrgTrue } from "../../../store/slices/reloadOrgSlice";
import { Button } from "../../CustomComponent";
interface ModalCFOrganizationProps {
  type: string | null;
  id?: string | null;
  data?: object | null;
}

const ModalCFOrganization: React.FC<ModalCFOrganizationProps> = ({
  type,
  id,
  data,
}) => {
    const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const openModalCFOrg = useSelector(
    (state: RootState) => state.openmodalcforg.openModal
  );
  const language = useSelector((state: RootState) => state.language.language);
  const [animationClass, setAnimationClass] = useState("modal-enter");
  const [disabledBtn, setDisabledBtn] = useState(false);
  useEffect(() => {
    if (!openModalCFOrg) {
      setAnimationClass("modal-exit");
    }
  }, [openModalCFOrg]);

  const handleCloseModal = () => {
    setAnimationClass("modal-exit");
    setTimeout(() => {
      dispatch(setCloseModalCFOrg());
    }, 300); // Match the duration of the animation
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };
    useEffect(() => {
      changeLanguage(language);
    }, [language]);
  if (!openModalCFOrg && animationClass === "modal-exit") return null;

  const handleSubmit = async () => {
    if (type === "delete") {
      const deleteOrg = async () => {
        try {
          await deleteOrganization(id).then((res) => {
            if (res.data.isError === false) {
              dispatch(setCloseModalCFOrg());
              notification.success(t('settings.organizations.create.deleteOrgSuccess'));
              dispatch(setReloadOrgTrue())
              // dispatch(
              //   setOpenAlert({
              //     description: "Delete Success",
              //     typeAlert: "success",
              //   })
              // );
            }
          });

          // close modal
          // openAlert
        } catch (error) {
          console.error("Delete Error:", error);
        }
      };
      deleteOrg();
    }
    if (type === "cancel") {
      dispatch(setCloseModalCFOrg());
      dispatch(setCloseDrawerOrgCreate());
    }
    if (type === "confirmCreate") {
      try {
        setDisabledBtn(true);
        await createOrganization(data).then((res) => {
          if(res.data.isError === false) {
            setDisabledBtn(false);
            dispatch(setCloseModalCFOrg());
            dispatch(setCloseDrawerOrgCreate());
            notification.success(t('settings.organizations.create.createOrgSuccess'));
            dispatch(setReloadOrgTrue())
            // dispatch(
            //   setOpenAlert({
            //     description: "Organization Creted Success !",
            //     typeAlert: "success",
            //   })
            // );
          }
        })
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
    if (type === "confirmUpdate") {
      try {
        setDisabledBtn(true);
        updateOrganization(data).then((res) => {
          if(res.data.isError === false) {
            setDisabledBtn(false);
            dispatch(setCloseModalCFOrg());
            dispatch(setCloseDrawerOrgCreate());
            notification.success(t('settings.organizations.create.editOrgSuccess'));
            dispatch(setReloadOrgTrue())
            // dispatch(
            //   setOpenAlert({
            //     description: "Organization Update Success !",
            //     typeAlert: "success",
            //   })
            // );
          }
        })
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50 ${animationClass}`}
    >
      <div className="relative p-4 max-w-[600px] max-h-full w-[600px]">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 max-w-md">
          <div className="flex items-center justify-between pl-6 pt-6 md:pl-6  rounded-t dark:border-gray-600 border-gray-200">
            <div
              className={`w-[40px] h-[40px]  rounded-full`}
              style={{
                background:
                  type === "delete"
                    ? `#FFDEDE`
                    : type === "cancel"
                    ? `#FFF6DE`
                    : type === "confirmCreate"
                    ? `#c4ead0`
                    : `#c4ead0`,
              }}
            >
              {type === "delete" ? (
                <FaExclamationTriangle className="w-6 h-6 m-auto mt-1 text-[#E60000] mt-2" />
              ) : type === "cancel" ? (
                <FaExclamationTriangle className="w-6 h-6 m-auto mt-1 text-[#e68a00] mt-2" />
              ) : type === "confirmCreate" || type === "confirmUpdate" ? (
                <FaExclamationTriangle className="w-6 h-6 m-auto mt-1 text-dark-green mt-2" />
              ) : (
                <></>
              )}
            </div>
            <div>
              <p className=" pl-3 text-xl font-semibold">
                {" "}
                {type === "delete"
                  ? t('settings.organizations.modal.confirmDelete')
                  : type === "cancel"
                  ? t('settings.organizations.modal.confirmCancel')
                  : type === "confirmCreate" 
                  ? t('settings.organizations.modal.confirmSave')
                  : t('settings.organizations.modal.confirmUpdate')}
              </p>
              <p className="pl-3 text-base ">
                {" "}
                {type === "delete"
                  ? t('settings.organizations.modal.descriptionConfirmDelete')
                  : type === "cancel"
                  ? t('settings.organizations.modal.descriptionConfirmCancel')
                  : type === "confirmCreate" 
                  ? t('settings.organizations.modal.descriptionConfirmSave')
                  : t('settings.organizations.modal.descriptionConfirmUpdate')
                }
              </p>
            </div>

            <Button
              // type="button"
              className="relative top-[-20px] text-white bg-transparent rounded-lg text-sm w-8 h-8 ms-auto  justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="static-modal"
              onClick={handleCloseModal}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </Button>
          </div>

          <div className="flex justify-end p-4 md:p-5 rounded-b dark:border-gray-600">
            <Button
              data-modal-hide="static-modal"
              // type="button"
              className="mr-2 py-2.5 px-5 ms-3 text-base text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={handleCloseModal}
            >
              {t('settings.organizations.modal.cancel')}
            </Button>
            <button
              data-modal-hide="static-modal"
              type="button"
              disabled={disabledBtn}
              className="text-white bg-[#3758f9]  rounded-lg text-base px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              style={{
                background: type === "confirmCreate" || type === "confirmUpdate" || type === "cancel" ? `#3758f9` :  `#E60000`,
              }}
              onClick={() => {
                handleSubmit();
              }}
            >
              {type === "delete"
                ? t('settings.organizations.modal.delete')
                : type === "cancel"
                ? t('settings.organizations.modal.ok')
                : type === "confirmCreate" || type === "confirmUpdate"
                ? t('settings.organizations.modal.ok')
                : "xxx"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCFOrganization;
