import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { FaSearch } from "react-icons/fa";
import {
  getEmailLanguageList,
  getEmailLanguageById,
  updateEmailLanguage,
} from "./../../../../services/emailLanguageService";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { EmailLanguages } from "../../../../interface/generalSetting.interface";
import { toast } from "react-toastify";
import notify from "../../../../utils/notification";

import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import { ModalType } from "../../../../enum/ModalType";

import { RootState } from "../../../../store";
import Buttons from "../../../../components/CustomComponent/Button";
import Radio from "../../../../components/CustomComponent/Radio";
import Input from "../../../../components/CustomComponent/InputText";

const EmailLanguage = () => {
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const [emailLanguages, setEmailLanguages] = useState<EmailLanguages[]>([]);
  const [previousEmailLanguages, setPreviousEmailLanguages] = useState<
    EmailLanguages[]
  >([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [filteredLanguages, setFilteredLanguages] = useState(emailLanguages);
  const [searchTerm, setSearchTerm] = useState("");
  const { t, i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.language.language);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );

  useEffect(() => {
    console.log("permissionPage", permissionPage);

    const getUserSession: any = sessionStorage.getItem("user");
    //const userAccountId = JSON.parse(getUserSession).user_account_id;
    const customerId = JSON.parse(getUserSession).customer_id;
    console.log(customerId);

    const fetchData = async () => {
      try {
        const response = await getEmailLanguageById(customerId);
        console.log(response);
        if (response) {
          const resp: any = response;
          console.log(resp.data);
          setEmailLanguages(resp.data);
          setPreviousEmailLanguages(resp.data);
          setFilteredLanguages(resp.data);
          const activeLang = resp.data.find(
            (lang: EmailLanguages) => lang.isActiveStatus
          );

          if (activeLang) {
            setSelectedLanguage(activeLang.emailLanguageId);
          }
        }

        //setEmailLanguages(response.data as EmailLanguage);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const handleSelectLanguage = (selectedId: string) => {
    if (permissionPage.isUpdate) {
      setSelectedLanguage(selectedId);
      setEmailLanguages((prevLanguages) =>
        prevLanguages.map((lang) => ({
          ...lang,
          isActiveStatus: lang.emailLanguageId === selectedId,
        }))
      );
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLanguages(emailLanguages);
    } else {
      setFilteredLanguages(
        emailLanguages.filter((lang) =>
          lang.languageName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, emailLanguages]);

  const handleSaveUpdate = async () => {
    const activeLanguages = emailLanguages.filter(
      (lang) => lang.isActiveStatus
    );

    try {
      //console.log("Updating Email Language ID:", activeLanguages[0].emailLanguageId);
      await updateEmailLanguage(activeLanguages[0].emailLanguageId);
      console.log("Update Success");
      //notify.success("Email Language data Updated.");
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Update Failed:", error);
      // notify.error("Email Language data Error.");
    }
  };

  const openConfirmModal = () => {
    setConfirmTitle(t("modal.confirmSave"));
    setConfirmDetail(t("modal.descriptionConfirmSave"));
    setConfirmType(ModalType.Save);
    setConfirmAction(() => handleSaveUpdate);
    setIsConfirmModalOpen(true);
    setConfirmSuccessMessage(
      t("generalSetting.emailLanguage.updatedSuccessfully")
    );
    setConfirmErrorMessage(t("generalSetting.emailLanguage.error"));
  };

  return (
    <div className="h-[50vh]">
      <div className="flex pb-2 border-b border-solid border-1">
        <div className="w-9/12">
          <h2 className="text-lg font-semibold">
            {t("generalSetting.emailLanguage.emailLanguage")}
          </h2>
          <p className="text-base">
            {t("generalSetting.emailLanguage.description")}
          </p>
        </div>
        <div className="w-3/12 text-right">
          {permissionPage.isUpdate && (
            <Buttons
              onClick={openConfirmModal}
              className="text-white text-sm"
              variant="contained"
            >
              {t("generalSetting.emailLanguage.saveAndUpdate")}
            </Buttons>
            /*
          <button
            className="rounded bg-[#3758F9] py-2 px-4 text-sm text-white hover:bg-sky-500 active:bg-sky-700 font-bold"
            onClick={openConfirmModal}
          >
            {t("generalSetting.emailLanguage.saveAndUpdate")}
          </button>
          */
          )}
        </div>
      </div>

      <div className="mt-5 border border-1 border-solid rounded-md">
        <div className="relative w-full max-w-xs px-8 pt-8 pb-3">
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Search"
            minWidth="20rem"
          ></Input>
        </div>

        <div className="w-full px-4 py-4 flex flex-col gap-2">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((item) => (
              <label
                key={item.emailLanguageId}
                className="flex items-center space-x-3 px-4 py-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
              >
                <Radio
                  //className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  checked={selectedLanguage === item.emailLanguageId}
                  onChange={() => handleSelectLanguage(item.emailLanguageId)}
                ></Radio>
                <span
                  className="text-base"
                  onClick={() => {
                    handleSelectLanguage(item.emailLanguageId);
                  }}
                >
                  {item.languageName}
                </span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-center py-3"></p>
          )}
        </div>
      </div>
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
    </div>
  );
};
export default EmailLanguage;
