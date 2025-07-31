import { useState, useEffect } from "react";
// import { Button } from "@headlessui/react";
import {
  Button,
  Toggle,
  InputText,
} from "../../../../components/CustomComponent";
import { ModalType } from "../../../../enum/ModalType";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import {
  getConsentAccessToken,
  updateConsentAccessToken,
} from "../../../../services/accessTokenLinkService";
import useSessionStorage from "../../../../hook/useSessionStorage";
import notification from "../../../../utils/notification";
import LoadingSpinner from "./../../../../components/LoadingSpinner";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
const AccessTokenLink = () => {
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );

  const [user, setUser] = useSessionStorage<{
    customer_id: "";
    user_account_id: "";
  }>("user", {
    customer_id: "",
    user_account_id: "",
  });
  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isSingleUse, setIsSingleUse] = useState(false);
  const [recycleRate, setRecycleRate] = useState(1);
  const [isDisableCurrent, setIsDisableCurrent] = useState(false);
  const [isNonExpiring, setIsNonExpiring] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [recycleRateError, setRecycleRateError] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getConsentAccessToken(user.customer_id);
        setIsActive(res.isActiveStatus);
        setIsSingleUse(res.isSingleUse);
        setRecycleRate(res.expiryMonthDuration);
        setIsDisableCurrent(res.isDisableUse);
        setIsNonExpiring(res.isNonExpiry);
        setTokenId(res.consentAccessTokenId);
      } catch (error) {
        notification.error(
          t("settings.consentSetting.accessTokenLink.failedToFetchData")
        );
      } finally {
        setIsLoading(false);
      }
    };
    if (user.customer_id) fetchData();

    return () => {};
  }, [user.customer_id]);

  const toggleIsActive = () => {
    if (!isActive) {
      if (recycleRate > 12) {
        setRecycleRate(12);
      } else if (recycleRate < 1) {
        setRecycleRate(1);
      }
    }
    setIsActive(!isActive);
  };

  const toggleIsNonExpiring = () => {
    if (!isNonExpiring) {
      setIsSingleUse(false);
      if (recycleRate > 12) {
        setRecycleRate(12);
      } else if (recycleRate < 1) {
        setRecycleRate(1);
      }
    }

    setIsNonExpiring(!isNonExpiring);
  };

  const toggleIsSingleUse = () => {
    if (!isSingleUse && recycleRate > 12) {
      setRecycleRate(12);
    }
    setIsSingleUse(!isSingleUse);
  };
  const openConfirmModal = () => {
    if (recycleRate > 12) {
      notification.error(
        t("settings.consentSetting.accessTokenLink.recycleRateMoreThan12")
      );
      setRecycleRateError(true);
    } else if (recycleRate < 1) {
      notification.error(
        t("settings.consentSetting.accessTokenLink.recycleRateLessThan1")
      );
      setRecycleRateError(true);
    } else {
      setConfirmTitle(t("settings.consentSetting.accessTokenLink.saveChange"));
      setConfirmDetail(
        t("settings.consentSetting.accessTokenLink.confirmDetail")
      );
      setConfirmType(ModalType.Save);
      setIsConfirmModalOpen(true);
      setConfirmAction(() => updateAccessTokenSetting);
      setConfirmSuccessMessage(
        t("settings.consentSetting.accessTokenLink.confirmSuccess")
      );
      setConfirmErrorMessage(
        t("settings.consentSetting.accessTokenLink.failToSave")
      );
      setRecycleRateError(false);
    }
  };

  const updateAccessTokenSetting = async () => {
    const data = {
      consentAccessTokenId: tokenId,
      customerId: user.customer_id,
      enableAccessTokenLink: isActive,
      isNonExpiry: isNonExpiring,
      isSingleUse: isSingleUse,
      expiryMonthDuration: recycleRate,
      isDisableUse: isDisableCurrent,
      isActiveStatus: isActive,
      userId: user.user_account_id,
    };
    await updateConsentAccessToken(data);
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <div className="flex pb-2 border-b border-solid border-1 ">
        <div className="w-9/12">
          <p className="text-xl font-semibold">
            {t("settings.consentSetting.accessTokenLink.title")}
          </p>
          <p className="">
            {t("settings.consentSetting.accessTokenLink.amountOfTime")}
          </p>
        </div>
        <div className="w-3/12 text-right">
          <Button
            onClick={() => openConfirmModal()}
            variant="contained"
            className={`
            ${!permissionPage.isUpdate && "hidden"}
            `}
          >
            <p className="text-white font-semibold">
              {t("settings.consentSetting.accessTokenLink.saveAndUpdate")}
            </p>
          </Button>
        </div>
      </div>
      <div className=" mt-5 ">
        <div className="overflow-x-auto w-full flex">
          <div className="w-6/12">
            <div className="flex border-1 border-solid border-x border-y rounded-tl-md rounded-tr-md ">
              <div className="w-2/12 my-auto justify-center flex">
                <Toggle
                  checked={isActive}
                  onChange={() => toggleIsActive()}
                  disabled={!permissionPage.isUpdate}
                />
              </div>
              <div className="w-10/12 p-4">
                <div>
                  <p className="font-semibold">
                    {t(
                      "settings.consentSetting.accessTokenLink.enableAccessTokenLink"
                    )}
                  </p>
                  <p className="">
                    {t("settings.consentSetting.accessTokenLink.accessToken")}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`flex pl-[2rem]  border-1 border-solid border-x border-t ${
                !isActive ? "hidden" : ""
              }`}
            >
              <div className="w-2/12 my-auto justify-center flex">
                <Toggle
                  checked={isNonExpiring}
                  onChange={() => toggleIsNonExpiring()}
                  disabled={!permissionPage.isUpdate}
                />
              </div>
              <div className="w-10/12 p-4">
                <div>
                  <p className="font-semibold">
                    {t(
                      "settings.consentSetting.accessTokenLink.accessTokenNonExpiring"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`flex pl-[2rem]  border-1 border-solid border-x border-t ${
                isNonExpiring || !isActive ? "hidden" : ""
              }`}
            >
              <div className="w-2/12 my-auto justify-center flex">
                <Toggle
                  checked={isSingleUse}
                  onChange={() => toggleIsSingleUse()}
                  disabled={!permissionPage.isUpdate}
                />
              </div>
              <div className="w-10/12 p-4">
                <div>
                  <p className="font-semibold">
                    {t(
                      "settings.consentSetting.accessTokenLink.accessTokenSingleUse"
                    )}
                  </p>
                  <p className="">
                    {t(
                      "settings.consentSetting.accessTokenLink.magicLinkExpiration"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`flex pl-[2rem]  border-1 border-solid border-x border-t ${
                isNonExpiring || isSingleUse || !isActive ? "hidden" : ""
              }`}
            >
              <div className="w-2/12 my-auto justify-center flex">
                <InputText
                  type="text"
                  value={recycleRate.toString()}
                  onChange={(e) => setRecycleRate(+e.target.value)}
                  disabled={permissionPage.isUpdate ? false : true}
                  isError={recycleRateError}
                  className={`text-center h-[2rem]`}
                />
              </div>
              <div className="w-10/12 p-4">
                <div>
                  <p className="font-semibold">
                    {t(
                      "settings.consentSetting.accessTokenLink.accessTokenRecycleRate"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`flex border-1 border-solid border-x border rounded-br-md rounded-bl-md
              }`}
            >
              <div className="w-2/12 my-auto justify-center flex">
                <Toggle
                  checked={isDisableCurrent}
                  onChange={() => setIsDisableCurrent(!isDisableCurrent)}
                  disabled={permissionPage.isUpdate ? false : true}
                />
              </div>
              <div className="w-10/12 p-4">
                <div>
                  <p className="font-semibold">
                    {t(
                      "settings.consentSetting.accessTokenLink.disableAccessTokenLink"
                    )}
                  </p>
                  <p className="">
                    {t("settings.consentSetting.accessTokenLink.suspendAccess")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-6/12 pl-3">
            <div
              className={`flex bg-[#FAFAFA] py-3 px-5 rounded-md                     
                ${!permissionPage.isCreate && "hidden"}`}
            >
              <div className="w-9/12">
                <p className="font-semibold">
                  {t(
                    "settings.consentSetting.accessTokenLink.recreateAccessTokenLink"
                  )}
                </p>
                <p className="">
                  {t(
                    "settings.consentSetting.accessTokenLink.createNewMagicLinks"
                  )}
                </p>
              </div>
              <div className="m-auto w-3/12 text-right">
                <Button className=" bg-gradient-to-r from-[#3758F9] to-[#8644F2] ">
                  <span className="text-white font-semibold">
                    {t("settings.consentSetting.accessTokenLink.createLink")}
                  </span>
                </Button>
              </div>
            </div>
            <div
              className={`flex bg-[#FAFAFA] py-3 px-5 mt-2 rounded-md                     
                ${!permissionPage.isDelete && "hidden"}`}
            >
              <div className="w-9/12">
                <p className="font-semibold">
                  {t(
                    "settings.consentSetting.accessTokenLink.deleteAccessTokenLink"
                  )}
                </p>
                <p className="">
                  {t(
                    "settings.consentSetting.accessTokenLink.createNewMagicLinks"
                  )}
                </p>
              </div>
              <div className="m-auto w-3/12 text-right">
                <Button color="#656668" variant="contained">
                  <span className="text-white text-sm font-semibold">
                    {t("settings.consentSetting.accessTokenLink.deleteLink")}
                  </span>
                </Button>
              </div>
            </div>
          </div>
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
export default AccessTokenLink;
