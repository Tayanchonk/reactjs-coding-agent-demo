import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setMenuBreadcrumb } from "../../../../store/slices/menuBreadcrumbSlice";
import { setMenuHeader } from "../../../../store/slices/menuHeaderSlice";
import { setMenuDescription } from '../../../../store/slices/menuDescriptionSlice';
import { Button, Dropdown, DropdownOption } from "../../../../components/CustomComponent";
import { Menu, MenuButton, MenuItems, MenuItem, Description } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { RootState } from '../../../../store';
import Toggle from "./../../../../components/CustomComponent/Toggle";
import Input from "./../../../../components/CustomComponent/InputText"

import InputTextArea from "./../../../../components/CustomComponent/TextArea"

import LogInfoTooltip from '../../../../components/CustomComponent/LogInfo/index';
import { ac } from '@faker-js/faker/dist/airline-D6ksJFwG';
import dayjs from 'dayjs';
import { createClientCredential, deleteClientCredential, getClientCredentialById, getClientCredentialList, resetClientCredential, updateClientCredential } from '../../../../services/clientCredential';
import { get, set } from 'lodash';
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import ConfirmModal from '../../../../components/Modals/ConfirmModal';
import { formatDate } from 'react-datepicker/dist/date_utils';
import ConfirmResetSecretModal from '../../../../components/ClientCredential/confirmResetModal';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import notification from '../../../../utils/notification';
import { fa } from '@faker-js/faker/.';

type MenuItemType = {
  id: string;
  label: string;
  value: string;
};

const CredentialInfo = () => {
  const { id } = useParams();
  const { mode } = useParams();
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const [restrictIP, setRestrictIP] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [clientCredential, setClientCredential] = useState<any>(null);
  const [initialClientCredential, setInitialClientCredential] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [hasGeneratedCredential, setHasGeneratedCredential] = useState(false);
  // const [a, setHasGeneratedCredential] = useState(false);
  const confirm = useConfirm();
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Delete);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(
    async () => Promise.resolve()
  );

  const getUserSession: any = sessionStorage.getItem("user");
  const customerId = getUserSession
    ? JSON.parse(getUserSession).customer_id
    : "";
  const userAccountId = getUserSession
    ? JSON.parse(getUserSession).user_account_id
    : "";
  console.log("getUserSession", getUserSession);

  const [ipList, setIpList] = useState(["192.168.1.7/32"]);
  const durationOptions = [
    { label: "1 Hour", value: "1h" },
    { label: "1 Day", value: "1d" },
    { label: "1 Week", value: "1w" },
    { label: "1 Month", value: "1m" },
    { label: "1 Year", value: "1y" },
  ];
  const [selectedHour, setSelectedHour] = useState({ label: "", value: "" });
  const orgparent = useSelector((state: RootState) => state.orgparent);

  const [selectedOrganization, setSelectedOrganization] = useState<MenuItemType>({
    id: "",
    label: "",
    value: "",
  });
  const dateTimeStr = localStorage.getItem("datetime") || undefined;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddIP = () => {
    setIpList([...ipList, ""]);
  };

  useEffect(() => {
    if (mode === "create") {
      // setClientCredential({
      //   transactionId: "1",
      //   name: "",
      //   description: "",
      //   accessTokenLifetime: {
      //     label: "1 Hour",
      //     value: "1h"
      //   },
      //   clientId: "",
      //   createdDate: new Date().toISOString(),
      //   createdBy: "",
      //   modifiedDate: new Date().toISOString(),
      //   modifiedBy: "",
      // });
    }
  }, [mode]);


  useEffect(() => {
    if (!orgparent || !orgparent.orgParent) return;
    setLoading(true);
    const currentOrg = JSON.parse(localStorage.getItem("currentOrg") || "null");
    setSelectedOrganization({
      id: currentOrg.organizationId,
      value: currentOrg.organizationId,
      label: currentOrg.organizationName,
    });
    console.log("Selected Organization:", currentOrg);
    setLoading(false);
  }, [orgparent]);

  const handleChangeIP = (index: number, value: string) => {
    const newList = [...ipList];
    newList[index] = value;
    setIpList(newList);
  };

  const handleRemoveIP = (index: number) => {
    const newList = [...ipList];
    newList.splice(index, 1);
    setIpList(newList);
  };

  useEffect(() => {
    console.log("============ Check Param ================");

    console.log(`CredentialInfo: id=${id}, mode=${mode}`);
    console.log("permissionPage", permissionPage);
    handleGetClientCredential(id, true);

  }, [id, mode]);

  const handleSave = async () => {
    if (!clientCredential) return;

    const payload = {
      clientCredentialName: clientCredential.clientCredentialName,
      description: clientCredential.description,
      modifiedBy: userAccountId
    };

    try {
      const resp = await updateClientCredential(clientCredential.clientCredentialId, payload);
      console.log("✅ Updated successfully!", resp);
      //navigate("/setting/client-credentials");
      handleGetClientCredential(clientCredential.clientCredentialId, false);

    } catch (error) {
      console.error("Update failed:", error);

    }
  };

  const handleSaveCreate = async () => {

    const dto = {
      clientCredentialName: clientCredential.clientCredentialName,
      description: clientCredential.description,
      createdBy: userAccountId,
      modifiedBy: userAccountId,
      customerId: customerId,
      organizationId: selectedOrganization.id
    };

    try {
      const result = await createClientCredential(dto);
      console.log("Create result:", result);

      if (result && !result.isError) {
        console.log("✅ Created successfully");
        await handleGetClientCredential(result.data, true);
        setHasGeneratedCredential(true);

      } else {
        console.error("Failed to create:", result.message);
      }
    } catch (err) {
      console.error("Error creating client credential:", err);
    }
  };

  const handleGetClientCredential = async (id: any, downloaded: boolean): Promise<void> => {
    console.log("mode:", mode);
    console.log("hasGeneratedCredential:", hasGeneratedCredential);
    console.log("id:", id);
  

    if ((mode === "create" && downloaded) || (mode === "edit" && downloaded)) {
      setLoading(false);
      //return;
    } else {
      setLoading(true);
    }
    try {
      console.log("Fetching client credentials with request body:", id);

      const response = await getClientCredentialById(id);
      console.log("ClientCredential By Id", response);
      response.data.createdDate = formatDate(response.data.createdDate);
      response.data.modifiedDate = formatDate(response.data.modifiedDate);
      setClientCredential(response.data);
      setInitialClientCredential(response.data);

    } catch (error) {
      console.error("Error fetching client credentials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetClientCredential = async () => {
    try {
      const resp = await resetClientCredential(clientCredential.clientCredentialId, userAccountId);
      console.log("Client credential reset successfully :", resp);
      setHasGeneratedCredential(true);
      setIsModalOpen(false);
      handleGetClientCredential(clientCredential.clientCredentialId, true);
    } catch (error) {
      console.error("Error resetting client credential:", error);
    }
  }

  const isModified = () => {
    return (
      JSON.stringify(clientCredential) !== JSON.stringify(initialClientCredential)
    );
  };

  useEffect(() => {

    if (mode === "create") {
      dispatch(setMenuHeader(t("clientCredentials.textInfo.create")));
      dispatch(setMenuBreadcrumb([
        { title: "clientCredentials.settings", url: "/setting" },
        { title: "clientCredentials.title", url: "/setting/client-credentials" },
        { title: "clientCredentials.textInfo.create", url: "" },
      ]));
    } else if (mode === "edit") {
      dispatch(setMenuHeader("clientCredentials.textInfo.edit"));
      dispatch(setMenuBreadcrumb([
        { title: "clientCredentials.settings", url: "/setting" },
        { title: "clientCredentials.title", url: "/setting/client-credentials" },
        { title: "clientCredentials.textInfo.edit", url: "" },
      ]));
    } else if (mode === "view") {
      dispatch(setMenuHeader("clientCredentials.textInfo.view"));
      dispatch(setMenuBreadcrumb([
        { title: "clientCredentials.settings", url: "/setting" },
        { title: "clientCredentials.title", url: "/setting/client-credentials" },
        { title: "clientCredentials.textInfo.view", url: "" },
      ]));
    }
    //dispatch(setMenuDescription(t("clientCredentials.description")));
    // dispatch(setMenuBreadcrumb([
    //   { title: t("clientCredentials.title"), url: "/setting/clientCredential" },
    //   { title: t("clientCredentials.desc"), url: "/setting/clientCredential" },
    // ]));
    return () => {
      dispatch(setMenuHeader(""));
      dispatch(setMenuDescription(""));
      dispatch(setMenuBreadcrumb([]));
    };

  }, [t, mode]);


  const handleDownload = () => {
    const content =
      `Client ID: ${clientCredential?.clientId || ""}\n` +
      `Client Secret: ${((mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential))
        ? clientCredential?.clientSecret
        : ""
      }`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = clientCredential.clientCredentialName + " " + formatDate(clientCredential.createdDate) + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // const handleCopy = async (text: any) => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     console.log("Copied to clipboard:", text);
  //   } catch (err) {
  //     console.error("Failed to copy: ", err);
  //   }
  // };

  const handleCopy = (text: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        console.log("Copied to clipboard:", text);
        // Optional: alert("คัดลอกแล้ว");
      }).catch(err => {
        console.error("Clipboard API failed:", err);
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand("copy");
      console.log("Fallback copy:", successful ? "Success" : "Failed");
      // Optional: alert("คัดลอกแล้ว (fallback)");
    } catch (err) {
      console.error("Fallback failed:", err);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleDeleteClientCredential = async () => {
    try {
      if (!id) {
        console.error("ID");
        return;
      }
      const response = await deleteClientCredential(id, userAccountId);
      console.log("ClientCredential By Id", response);
      navigate("/setting/client-credentials");

    } catch (error) {
      console.error("Error fetching client credentials:", error);
    }
  };

  const isLeftFormValid = () => {
    return (
      clientCredential?.clientCredentialName?.trim() &&
      clientCredential?.description?.trim()
    );
  };

  const formatDate = (dateString: string) => {
    let dateTimeString = "";
    if (dateTimeStr) {
      const dateTimeObj = JSON.parse(dateTimeStr);
      dateTimeString = dateTimeObj.dateFormat + " " + dateTimeObj.timeFormat;
    }
    //console.log(dateString);
    if (dateString === "-" || dateString === null) {
      return "-";
    }
    return dayjs(dateString).format(dateTimeString);
  };

  return (
    <div>
      {loading && (
        <LoadingSpinner />
      )}
      {!loading && (
        <div className="min-h-[calc(100vh-250px)] mx-auto bg-white shadow rounded-lg overflow-hidden pb-8">
          <div className="absolute top-[120px] right-6 z-1 flex items-center space-x-2 bg-white">
            {mode === "edit" && permissionPage.isUpdate &&
              <Button className="border text-white px-4 py-2 rounded text-base font-medium"
                onClick={() => {
                  confirm({
                    modalType: ModalType.Delete,
                    notify: false,
                    onConfirm: async () => {
                      try {
                        await handleDeleteClientCredential();
                        notification.success(t("modal.successConfirmSave"));
                      } catch (error) {
                        notification.error(t("modal.errorConfirmSave"));
                      }
                    },

                  });
                }}
                color="#E60E00"
                variant="contained">
                {t("clientCredentials.info.actions.delete")}
              </Button>
            }
            {mode === "edit" &&

              <Button className="border border-[#2563eb] text-[#2563eb] px-4 py-2 rounded text-base font-medium"
                onClick={() => setIsModalOpen(true)}
                disabled={isModified()}
                color="primary-blue"
                variant="outlined">
                {t("clientCredentials.info.actions.resetSecret")}
              </Button>
            }
            {mode === "edit" &&
              <div className="h-6 w-px bg-gray-300 mx-2" />
            }
            {(mode === "create" || mode === "view" || mode === "edit") &&
              <Button
                className="border text-black px-4 py-2 rounded text-base font-medium"
                onClick={() => {
                  confirm({
                    modalType: ModalType.Cancel,
                    onConfirm: async () => {
                      navigate("/setting/client-credentials");
                    },
                    notify: false,
                  });
                }}
                color=""
                variant="outlined">
                {t("clientCredentials.info.actions.cancel")}

              </Button>
            }

            {(mode === "view" && permissionPage.isUpdate) &&
              <Button className="bg-[#111827] text-white px-4 py-2 rounded text-base font-medium"
                onClick={() =>
                  navigate(
                    "/setting/client-credentials/info/edit/" + id
                  )
                }
                color=""
                variant="outlined">
                {t("clientCredentials.info.actions.edit")}

              </Button>
            }
            {mode === "edit" &&
              <Button className="bg-primary-blue text-white px-4 py-2 rounded text-base font-medium"
                color="primary-blue"
                variant="contained"
                disabled={!isLeftFormValid() || !isModified()}
                onClick={() => {
                  confirm({
                    modalType: ModalType.Save,
                    notify: false,
                    onConfirm: async () => {
                      try {
                        await handleSave();
                        notification.success(t("modal.successConfirmSave"));
                      } catch (error) {
                        notification.error(t("modal.errorConfirmSave"));
                      }
                    },
                  });
                }}
              >
                {t("clientCredentials.info.actions.save")}
              </Button>
            }
            {mode === "create" &&
              !hasGeneratedCredential && (
                <Button className="bg-primary-blue text-white px-4 py-2 rounded text-base font-medium"
                  onClick={() => {
                    confirm({
                      modalType: ModalType.Save,
                      notify: false,
                      onConfirm: async () => {
                        try {
                          await handleSaveCreate();
                          notification.success(t("modal.successConfirmSave"));
                        } catch (error) {
                          notification.error(t("modal.errorConfirmSave"));
                        }
                      },
                    });
                  }}
                  disabled={!isLeftFormValid()}
                  color="primary-blue"
                  variant="contained">
                  {t("clientCredentials.info.actions.saveAndGenerate")}
                </Button>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
            <div className="p-6">
              <h2 className="text-base text-xl font-semibold mb-1">{t("clientCredentials.info.title")}</h2>
              <p className="text-base text-gray-600 mb-6">
                {t("clientCredentials.info.subTitle")}
              </p>

              <div className="mb-4">
                <label className="block font-semibold mb-1">
                  <span className="text-red-500">*</span> {t("clientCredentials.info.name")}
                </label>
                <Input
                  type="text"
                  disabled={mode !== "create" ? true : false}
                  value={clientCredential?.clientCredentialName || ""}
                  onChange={(e) =>
                    setClientCredential((prev: any) => ({
                      ...prev,
                      clientCredentialName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-base !text-black disabled:!text-black"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">
                  <span className="text-red-500">*</span>  {t("clientCredentials.info.description")}
                </label>
                <InputTextArea
                  disabled={mode === "view" ? true : false}
                  value={clientCredential?.description}
                  onChange={(e) =>
                    setClientCredential((prev: any) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  minHeight="6rem"
                  minWidth="100%"
                  className="text-base"
                />
              </div>

              {/* <div className="mb-6">
            <label className="block  font-semibold mb-1">
              <span className="text-red-500">*</span> Access Token Lifetime
            </label>
            <Dropdown
              id="accessTokenLifetime"
              title=""
              className="w-full mt-2 text-base"
              selectedName={clientCredential?.accessTokenLifetime?.label || ""}
              disabled={mode === "view"}
            >
              {durationOptions.map((item) => (
                <DropdownOption
                  key={item.value}
                  className="h-[2.625rem] text-base"
                  selected={clientCredential?.accessTokenLifetime?.value === item.value}
                  onClick={() => {
                    if (mode !== "create") {
                      setClientCredential((prev: any) => ({
                        ...prev,
                        accessTokenLifetime: item,
                      }));
                    }
                  }}
                >
                  <span
                    className={`${clientCredential?.accessTokenLifetime?.value === item.value
                      ? "text-white"
                      : ""
                      }`}
                  >
                    {item.label}
                  </span>
                </DropdownOption>
              ))}
            </Dropdown>

          </div>

          <div className="mb-6">
            <div className="flex items-start space-x-3 mb-1">
              <Toggle checked={restrictIP} onChange={() => setRestrictIP(!restrictIP)} />
              <div>
                <label className="text-base block font-semibold">Restrict IP Addresses</label>
                <p className="text-base text-sm text-gray-600">
                  Restrict incoming communication to the following IP addresses:
                </p>
              </div>
            </div>

            {restrictIP && (
              <div className="ml-[3.7rem] mt-4">
                <label className="text-base text-sm font-medium text-gray-700 mb block mb-2">
                  IP Addresses
                </label>

                <div className="">
                  {ipList.map((ip, index) => {
                    const hasValue = ip.trim() !== "";
                    const isLast = index === ipList.length - 1;

                    return (
                      <div
                        key={index}
                        className={`relative rounded-md p-2 ${hasValue ? "bg-gray-50  px-5" : "bg-transparent border border-transparent"
                          }`}
                      >
                        <Input
                          value={ip}
                          onChange={(e) => handleChangeIP(index, e.target.value)}
                          placeholder=""
                          className={`
                !bg-white !text-base text-sm
                ${hasValue
                              ? "text-basepr-10 border border-gray-300 pl-4 !text-sm"
                              : "text-base border border-primary-blue !text-sm"}
              `}
                        />

                        {hasValue && (
                          <Button
                            onClick={() => handleRemoveIP(index)}
                            variant="text"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-0"
                            minWidth="unset"
                            minHeight="unset"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={handleAddIP}
                  variant="text"
                  className="mt text-sm text-primary-blue p-0"
                  minWidth="unset"
                  minHeight="unset"
                >
                  + Add IP Address
                </Button>
              </div>
            )}



          </div> */}
              {mode !== "create" &&
                <LogInfoTooltip {...clientCredential} />
              }
            </div>

            <div className="hidden md:flex items-start justify-center pt-6">
              <div className="w-px h-full bg-gray-200"></div>
            </div>

            {(mode !== "create" || hasGeneratedCredential) && (
              <div className="p-6">
                <h2 className="text-base text-xl font-semibold">{t("clientCredentials.info.clientIdAndSecret.title")}</h2>
                <p className="text-base text-gray-600">
                  {t("clientCredentials.info.clientIdAndSecret.description")}
                </p>
                {((mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential)) && (
                  <div className="flex items-start text-sm text-gray-600 mt-4">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6 text-blue-600 mt-[-0.2rem] mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"
                      />
                    </svg>

                    <p className="m-0">
                      <span className="font-semibold text-gray-700">{t("clientCredentials.info.clientIdAndSecret.remark1")}</span>{t("clientCredentials.info.clientIdAndSecret.remark2")}.
                    </p>

                  </div>
                )}

                <div className="border border-gray-200 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-start mb-4 px-4 py-2">
                    <div>
                      <h2 className="font-semibold text-md text-base">{t("clientCredentials.info.clientIdAndSecret.downloadCredentialTitle")}</h2>
                      <p className="text-base text-gray-600">
                        {t("clientCredentials.info.clientIdAndSecret.downloadCredentialsSubTitle")}
                      </p>
                    </div>
                    <Button className="px-4 text-base py-2 bg-black text-white rounded mt-1" disabled={
                      !((mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential))
                    } onClick={handleDownload}> {t("clientCredentials.info.clientIdAndSecret.download")}</Button>
                  </div>

                  <div className="-mx-4 border-t border-gray-200 my-4" />

                  <div className="px-4 pb-3">

                    {/* <p className="text-base text-sm text-gray-600 mb-4">
                    {t("clientCredentials.info.clientIdAndSecret.downloadCredentialsDesc")}

                  </p> */}

                    {/* Client ID */}
                    <div className="mb-4">
                      <label className="block text-base font-medium mb-1"> {t("clientCredentials.info.clientIdAndSecret.clientId")}</label>
                      <div className="relative w-full">
                        <div
                          className="bg-gray-100 text-gray-500 text-sm px-4 py-2 rounded-md select-text"
                        >
                          {clientCredential?.clientId || ""}
                        </div>

                        {((mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential)) && (
                          <Button
                            onClick={() => handleCopy(clientCredential?.clientId)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-blue text-xs px-2 py-0 h-6 min-w-[2rem] flex items-center justify-center"
                            variant="outlined"
                            minWidth="2.5rem"
                            minHeight="1.5rem"
                          // disabled={isModified()}
                          >
                            {t("clientCredentials.info.clientIdAndSecret.copy")}
                          </Button>
                        )}
                        {/* <Input
                        value={clientCredential?.clientId || ""}
                        disabled={true}

                        className="!bg-gray-100  pr-[4rem]"
                      />
                      {((mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential)) && (
                        <Button
                          onClick={() => handleCopy(clientCredential?.clientId)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-blue text-xs px-2 py-0 h-6 min-w-[2rem] flex items-center justify-center "
                          variant="outlined"
                          minWidth="2.5rem"
                          minHeight="1.5rem"
                        // disabled={isModified()}
                        >
                          {t("clientCredentials.info.clientIdAndSecret.copy")}
                        </Button>
                      )} */}

                      </div>
                    </div>

                    {/* Client Secret */}
                    <div className="mb-4">
                      <label className="block text-base font-medium mb-1">{t("clientCredentials.info.clientIdAndSecret.clientSecret")}</label>
                      <div className="relative w-full">
                        <div
                          className="bg-gray-100 text-gray-500 text-sm px-4 py-2 rounded-md select-text"
                        >
                          {((mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential))
                            ? clientCredential?.clientSecret
                            : "****************************************"}
                        </div>

                        {((mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential)) && (
                          <Button
                            onClick={() => handleCopy(clientCredential?.clientSecret)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-blue text-xs px-2 py-0 h-6 min-w-[2rem] flex items-center justify-center"
                            variant="outlined"
                            minWidth="2.5rem"
                            minHeight="1.5rem"
                          // disabled={isModified()}
                          >
                            {t("clientCredentials.info.clientIdAndSecret.copy")}
                          </Button>
                        )}
                        {/* <Input
                        value={
                          (mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential)
                            ? clientCredential?.clientSecret
                            : "****************************************"
                        }
                        disabled={true}
                        className="!bg-gray-100 pr-[4rem]"
                      />
                      {((mode === "create" && hasGeneratedCredential) || (mode === "edit" && hasGeneratedCredential)) && (
                        <Button
                          onClick={() =>
                            handleCopy(clientCredential.clientSecret)
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-blue text-xs px-2 py-0 h-6 min-w-[2rem] flex items-center justify-center "
                          variant="outlined"
                          minWidth="2.5rem"
                          minHeight="1.5rem"
                        //disabled={isModified()}
                        >
                          {t("clientCredentials.info.clientIdAndSecret.copy")}
                        </Button>
                      )} */}
                      </div>
                    </div>



                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
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

      <ConfirmResetSecretModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReset={handleResetClientCredential}
      />
    </div>
  );



}



export default CredentialInfo;