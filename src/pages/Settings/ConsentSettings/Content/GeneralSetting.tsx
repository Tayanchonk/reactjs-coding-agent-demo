import React, { useState, useEffect } from "react";
import { Button, Toggle } from "../../../../components/CustomComponent"; // Assuming you have this custom component
import { useTranslation } from 'react-i18next';
import { getConsentGeneral, updateConsentGeneral } from "../../../../services/consentSettingService";
import { getUserInfo } from "../../../../services/authenticationService";
import { ConsentGeneral } from "../../../../interface/consentSetting.interface";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa"; // Import icons
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import { ModalType } from "../../../../enum/ModalType";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

const GeneralSetting = () => {
  const permissionPage = useSelector((state: RootState) => state.permissionPage.permission);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [consentSettings, setConsentSettings] = useState<ConsentGeneral>({
    customerId: "",
    enableTransactionDeclineConsent: false,
    enableAcknowledgementEmail: false,
    // enableReasonNote: false,
    // enableReasonTemplate: false,
    enableDataSubjectsDeletion: false,
    enableRequireOrganizationPurposes: false
  });
  const [userInfo, setUserInfo] = useState<any>(null);
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
    const fetchUserInfo = async () => {
      const response = await getUserInfo();
      setUserInfo(response.data);
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchConsentGeneral = async () => {
      try {
        const response = await getConsentGeneral(userInfo.customer_id);
        setConsentSettings(response.data as ConsentGeneral);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    if (userInfo) {
      fetchConsentGeneral();
    }
  }, [userInfo]);

  const openConfirmModal = () => {
    setConfirmTitle(t('modal.confirmSave'));
    setConfirmDetail(t('modal.descriptionConfirmSave'));
    setConfirmType(ModalType.Save);
    setIsConfirmModalOpen(true);
    setConfirmAction(() => handleConfirm);
    setConfirmSuccessMessage(t('modal.successConfirmSave'));
    setConfirmErrorMessage(t('modal.errorConfirmSave'));
  };

  const handleConfirm = async () => {
    setIsConfirmModalOpen(false);
    await updateConsentGeneral(consentSettings, userInfo.user_account_id);
  };

  const toggleSwitch = (key: string) => {
    setConsentSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  return (
    <div>
      <div className="flex pb-2 border-b border-solid border-1 ">
        <div className="w-9/12">
          <h2 className="text-xl font-semibold">{t('settings.consentSetting.generalSetting.title')}</h2>
          <p className="">
            {t('settings.consentSetting.generalSetting.desctibe')}
          </p>
        </div>
        <div className="w-3/12 text-right">
          {permissionPage.isUpdate &&
            <Button className="rounded bg-[#3758F9] py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 font-semibold"
              onClick={() => openConfirmModal()}>
              {t('saveandupdate')}
            </Button>
          }
        </div>
      </div>

      {/* Switches Section */}
      <div className="mt-5">
        {[
          { key: "enableTransactionDeclineConsent", title: "enableTransactionDeclineConsentTitle", description: "enableTransactionDeclineConsentDescribe" },
          { key: "enableAcknowledgementEmail", title: "enableAcknowledgementEmailTitle", description: "enableAcknowledgementEmailDescribe" },
          // { key: "enableReasonNote", title: "enableReasonNoteTitle", description: "enableReasonNoteDescribe" },
          // { key: "enableReasonTemplate", title: "enableReasonTemplateTitle", description: "enableReasonTemplateDescribe" },
          { key: "enableDataSubjectsDeletion", title: "enableDataSubjectsDeletionTitle", description: "enableDataSubjectsDeletionDescribe" },
          { key: "enableRequireOrganizationPurposes", title: "enableRequireOrganizationPurposesTitle", description: "enableRequireOrganizationPurposesDescribe" },
        ].map(({ key, title, description }) => (
          <div key={key} className="flex border border-solid border-x border-t border-b">
            <div className="w-2/12 my-auto p-4 justify-center flex">
              <Toggle
                checked={consentSettings[key]}
                onChange={() => { if (permissionPage.isUpdate) toggleSwitch(key) }}
                disabled={!permissionPage.isUpdate}
              />
            </div>
            <div className="w-10/12 p-4">
              <div>
                <p className="font-semibold">{t(`settings.consentSetting.generalSetting.${title}`)}</p>
                <p className="">{t(`settings.consentSetting.generalSetting.${description}`)}</p>
              </div>
            </div>
          </div>
        ))}
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
      />
    </div>
  );
};

export default GeneralSetting;
