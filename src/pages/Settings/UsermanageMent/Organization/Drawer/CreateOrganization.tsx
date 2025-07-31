import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { IoTriangle } from "react-icons/io5";
import {
  InputText,
  Button,
  ComboBox,
  ComboBoxOption,
} from "../../../../../components/CustomComponent";
import InputTextArea from "../../../../../components/CustomComponent/TextArea";
import "./style.css";
import { getData, postData } from "../../../../../services/apiService";
import { OrganizationParent, ApiResponse, DrawerProps } from "../interfaces";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { setCloseDrawerOrgCreate } from "../../../../../store/slices/openDrawerCreateOrg";
import { setOpenModalCFOrg } from "../../../../../store/slices/openModalCFOrg";
import { setOpenAlert } from "../../../../../store/slices/openAlertSlice";
import {
  setOpenLoadingTrue,
  setOpenLoadingFalse,
} from "../../../../../store/slices/loadingSlice";
import {
  getOrganizationById,
  getOrganizationChart,
  getOrganizationParent,
} from "../../../../../services/organizationService";
import { useTranslation } from "react-i18next";
import {
  extractOrgs,
  extractOrgsAndOrgLevel,
  formatDate,
} from "../../../../../utils/Utils";


const CreateOrganization: React.FC<DrawerProps> = ({
  openCreateOrganization,
  // openDrawerCreateOrganization,
}) => {
  // ------------------------------ GLOBAL STATE ----------------------------------- //
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { openDrawer, id, type, isParent } = useSelector(
    (state: RootState) => state.opendrawercreateorg
  );
  const { openModal, idOrg, typeModal, data } = useSelector(
    (state: RootState) => state.openmodalcforg
  );
  const { loading } = useSelector((state: RootState) => state.loading);
  const language = useSelector((state: RootState) => state.language.language);

  const getUserSession: any = sessionStorage.getItem("user");
  const user = JSON.parse(getUserSession);
  // ------------------------------ STATE ----------------------------------- //
  const [Info, setInfo] = useState<boolean>(false);
  // value input
  const [isActiveStatus, setIsActiveStatus] = useState<boolean>(true);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizationOldName, setOrganizationOldName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [organizationParent, setOrganizationParent] = useState<string>("");
  const [organizationParentName, setOrganizationParentName] =
    useState<string>("");
  const [organizationLevel, setOrganizationLevel] = useState<number>(0);
  const [defaultLanguage, setDefaultLanguage] = useState<string>("");
  const [optionOrgParent, setOptionOrgParent] = useState<
    { value: string; label: string }[]
  >([]);

  const [activeStatusParent, setActiveStatusParent] = useState<boolean>(true);
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const [defaultValueParent, setDefaultValueParent] = useState<any>({});
  // errors
  const [errors, setErrors] = useState<any>({});
  const [query, setQuery] = useState<string>("");
  // for update data
  const [dataInfo, setDataInfo] = useState<any>({
    createdBy: "",
    createdDate: "",
    updatedBy: "",
    updatedDate: "",
  });

  const infoRef = useRef<HTMLDivElement>(null);

  // ----------------------------- USE EFFECT -------------------------------- //
  useEffect(() => {
    setDefaultValueParent({});
    const fetchData = async () => {
      try {
        dispatch(setOpenLoadingTrue());
        // call api

        getOrganizationChart(user.customer_id, orgparent).then((res) => {
          if (res.data.isError === false) {
            const allOrgs = extractOrgsAndOrgLevel(res.data.data);
            const data = allOrgs.map((item: any) => ({
              value: item.value,
              label: item.label,
              isDisabled:
                item.value === id || item.organizationLevel >= 3 ? true : false,
              organizationLevel: item.organizationLevel,
            }));
            setOptionOrgParent(data);
            dispatch(setOpenLoadingFalse());
          }
        });
        // await getOrganizationParent(
        //   user.customer_id,
        //   type === "updateOrgById" ? true : false
        // ).then((res) => {

        //   if (res.data) {
        //     const data = res.data.data
        //       .filter((item: OrganizationParent) => item.organizationId !== "ab780f1f-bf67-4cee-8695-ed3efdd8a268")
        //       .map((item: OrganizationParent) => ({
        //         value: item.organizationId,
        //         label: item.organizationName,
        //         isDisabled: item.organizationId === id ? true : false,
        //       }))
        //       .sort((a, b) => a.label.localeCompare(b.label)); // Sort A-Z
        //     setOptionOrgParent(data);
        //     dispatch(setOpenLoadingFalse());
        //   }
        // });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [openDrawer]); // first render

  useEffect(() => {
    if (type === "updateOrgById") {
      const fetchDataEdit = async () => {
        try {
          dispatch(setOpenLoadingTrue());
          // call api byId
          getOrganizationById(id).then(async (res) => {
            if (res.data) {
              dispatch(setOpenLoadingFalse());
              const result = res.data;
              setOrganizationName(result.organizationName);
              setOrganizationOldName(result.organizationName)
              setDescription(result.description);
              setIsActiveStatus(result.isActiveStatus);
              setOrganizationParent(result.organizationParentId);

              setDefaultLanguage(result.defaultLanguage);
              setDataInfo({
                createdBy: result.createdByName,

                createdDate: formatDate("datetime", result.createdDate),
                updatedBy: result.modifiedByName,

                updatedDate: formatDate("datetime", result.modifiedDate),
              });
              if (result.organizationParentId) {
                await getOrganizationById(result.organizationParentId).then(
                  (res) => {
                    if (res.data) {
                      setActiveStatusParent(res.data.isActiveStatus);
                      setOrganizationLevel(res.data.organizationLevel + 1);
                      setDefaultValueParent({
                        value: res.data.organizationId,
                        label: res.data.organizationName,
                      });
                    }
                  }
                );
              }
            }
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchDataEdit();
    }
  }, [type === "updateOrgById"]);

  useEffect(() => {
    const getLevel: any = optionOrgParent.find((option) => option.value === id);
    setOrganizationLevel(getLevel?.organizationLevel + 1);
  }, [type === "createOrgById"]);

  useEffect(() => {
    if (!openDrawer) {
      setOrganizationParent("");
      setOrganizationParentName("");
      setDefaultLanguage("");
      setOrganizationName("");
      setDescription("");
      setIsActiveStatus(true);
      setErrors({});
    }
  }, [openDrawer]);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoRef]);
  // ----------------------------- FUNCTION ----------------------------- //

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  // const openInfo = () => {
  //   setInfo(true);
  // };

  const validate = () => {
    const newErrors: any = {};
    
    let duplicateOrgName:any 
    if(type === "updateOrgById"){
      duplicateOrgName =  optionOrgParent.find((option)=> 
        option.label === organizationName && option.label !== organizationOldName
      )
    }
    else{
      duplicateOrgName =  optionOrgParent.find((option)=> option.label === organizationName)
    }
   
    if (!organizationName) newErrors.organizationName = t("required");
    if (!organizationParent) newErrors.organizationParent = t("required");
    if (!description) newErrors.description = t("required");
    if (duplicateOrgName) newErrors.organizationDuplicate = t('settings.organizations.create.orgDuplicate')
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // function interval input
  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (field === "organizationName") {
        setOrganizationName(value);
       
      
        if (errors.organizationName) {
          setErrors((prevErrors: any) => {
            const { organizationName, ...rest } = prevErrors;
            return rest;
          });
        }
      } else if (field === "description") {
        setDescription(value);
        if (errors.description) {
          setErrors((prevErrors: any) => {
            const { description, ...rest } = prevErrors;
            return rest;
          });
        }
      }
    };

  const handleSubmit = async () => {
    if (validate()) {
      const dataToInsert = {
        organizationId:
          id && type === "updateOrgById"
            ? id
            : "00000000-0000-0000-0000-000000000000",
        customerId: user.customer_id,
        organizationName: organizationName,
        organizationParentId:
          id && type === "createOrgById"
            ? id
            : id && type === "updateOrgById"
            ? organizationParent
            : organizationParent,
        defaultLanguage: defaultLanguage,
        description: description,
        isActiveStatus: isActiveStatus,
        createdDate: new Date(), // replace with userID login
        modifiedDate: new Date(),
        createdBy: user.user_account_id, // replace with userID login
        modifiedBy: user.user_account_id,
        isDelete: false,
        organizationLevel: organizationParent === null ? 0 : organizationLevel,
      };
      if (type === "createOrgById" || type === "createNew") {
        dispatch(
          setOpenModalCFOrg({
            idOrg: "0",
            typeModal: "confirmCreate",
            data: dataToInsert,
          })
        );
      }
      if (type === "updateOrgById") {
        dispatch(
          setOpenModalCFOrg({
            idOrg: "0",
            typeModal: "confirmUpdate",
            data: dataToInsert,
          })
        );
      }
    } else {
      console.log("validate");
    }
  };

  const defaultValue: any =
    id && type === "createOrgById"
      ? optionOrgParent.find((option) => option.value === id)
      : id && type === "updateOrgById"
      ? isParent
        ? defaultValueParent
        : optionOrgParent.find((option) => option.value === organizationParent)
      : [];

  const filteredOptions = optionOrgParent.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className={`fixed z-[13] overflow-auto top-0 right-0 px-3 h-full w-[490px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        openCreateOrganization ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4">
        <button
          className=" text-right flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
          onClick={() =>
            dispatch(setOpenModalCFOrg({ idOrg: "0", typeModal: "cancel" }))
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="size-6 h-[30px] w-[30px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="mt-4">
          <h1 className="text-xl font-semibold">
            {type === "updateOrgById"
              ? t("settings.organizations.create.editOrganization")
              : t("settings.organizations.create.createOrganization")}
          </h1>
          <p className=" text-base">
            {t("settings.organizations.create.createOrgDescription")}
          </p>
          <label htmlFor="togglex" className="flex items-center cursor-pointer">
            {/* <div className="relative">
              <input
                id="togglex"
                type="checkbox"
                className="sr-only"
                disabled={type === "updateOrgById" && activeStatusParent === false}
                checked={isActiveStatus}
                onChange={() => setIsActiveStatus(!isActiveStatus)}
              />
              <div
                className={`block w-12 h-6 rounded-full ${
                  isActiveStatus ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition  ${
                  isActiveStatus
                    ? "left-[12px] transform translate-x-full bg-white-500"
                    : ""
                }`}
              ></div>
            </div> */}
            {/* <p className="pl-3 text-sm">
              {t("settings.organizations.create.active")}
            </p> */}
          </label>
          <div className="pt-5">
            <p className="font-semibold text-base">
              <span className="text-[red] font-semibold text-base">* </span>
              {t("settings.organizations.create.organizationName")}
            </p>
            {/* <input
              className={`w-full mt-2 h-[42px] border border-solid border-1 border-[#d1d5db] rounded-md text-sm px-4 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none`}
              style={errors.organizationName && { border: "1px solid red" }}
              placeholder={t("settings.organizations.create.organizationName")}
              // defaultValue={organizationName}
              value={organizationName}
              onChange={handleInputChange("organizationName")}
            /> */}
            <InputText
              // onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder={t("settings.organizations.create.organizationName")}
              minWidth="20rem"
              height="2.625rem"
              className=" mt-2 font-base"
              isError={(errors.organizationName || errors.organizationDuplicate) && { border: "1px solid red" }}
              value={organizationName}
              onChange={handleInputChange("organizationName")}
            ></InputText>
            {errors.organizationName && (
              <p className="text-red-500 text-xs pt-1">
                {errors.organizationName}
              </p>
            )}
            {errors.organizationDuplicate && (
              <p className="text-red-500 text-xs pt-1">
                {errors.organizationDuplicate}
              </p>
            )}
          </div>
          <div className="pt-5">
            <p className="font-semibold text-base">
              <span className="text-[red] font-semibold text-base">* </span>
              {t("settings.organizations.create.organizationParent")}
            </p>
            <div className="flex w-full mt-2">
              <ComboBox
                id="ddlOrgParents"
                disabled={
                  type === "createOrgById" ||
                  (type !== "createNew" && organizationParent === "") ||
                  organizationParent === null ||
                  isParent ||
                  type === "updateOrgById"
                    ? true
                    : false
                }
                className=" text-base"
                placeholder={t("settings.organizations.create.selectOrgParent")}
                isError={errors.organizationParent && !organizationParent}
                minWidth="100%"
                displayName={
                  type === "createOrgById" || type === "updateOrgById"
                    ? defaultValue?.label
                    : organizationParentName
                }
                onChange={(e) => {
                  setQuery(e);
                  setOrganizationParent(e.value);
                  setOrganizationParentName(e.label);
                  setOrganizationLevel(e.organizationLevel + 1);
                }}
                onClose={() => setQuery("")}
                defaultValue={
                  defaultValue ? defaultValue?.label : ""
                  // type === "createOrgById" ||  type === "updateOrgById" && defaultValue
                  //   ? defaultValue.label
                  //   : organizationParent
                  //   ? organizationParentName || ""
                  //   : ""
                }
              >
                <div className="z-[11111111] relative bg-white">
                  {filteredOptions?.map((option: any, index: number) => (
                    <ComboBoxOption
                      key={index}
                      className={`hover:bg-gray-100 text-base
                        ${option.value === organizationParent && "text-white"}
                        hover:text-black`}
                      disabled={option.isDisabled}
                      selected={option.value === organizationParent}
                      value={option}
                      onClick={() => {
                        setOrganizationParent(option.value);
                        setOrganizationParentName(option.label);
                        setOrganizationLevel(option.organizationLevel + 1);
                      }}
                    >
                      <span>{option.label}</span>
                    </ComboBoxOption>
                  ))}
                </div>
              </ComboBox>
            </div>
             {(errors.organizationParent  && !organizationParent) && (
              <p className="text-red-500 text-xs pt-1">
                {errors.organizationParent }
              </p>
            )}
          </div>
          <div className="pt-5">
            <p className="font-semibold text-base">
              <span className="text-[red] font-semibold text-base">* </span>
              {t("settings.organizations.create.description")}
            </p>

            <InputTextArea
              value={description}
              className="text-base mt-2"
              // disabled={!isEdit}
              placeholder={`${t(
                "settings.organizations.create.descriptionInput"
              )}`}
              isError={errors.description ? true : false}
              onChange={handleInputChange("description")}
              minHeight="10rem"
            />
            {errors.description && (
              <p className="text-red-500 text-xs pt-1">{errors.description}</p>
            )}
          </div>
          <div className="pt-5 pb-6">
            {type === "updateOrgById" && (
              <button
                onClick={() => setInfo(true)}
                type="button"
                className="relative flex mb-2 md:mb-0 text-black bg-[#ECEEF0] font-medium rounded-lg text-base px-5 py-1.5 text-center  "
              >
                <p className="pr-1 text-base">
                  {t("settings.organizations.create.loginfo")}
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </button>
            )}

            {Info && (
              <div
                ref={infoRef}
                className="arrow-box bg-black w-[325px] fixed left-[155px] text-white py-3 px-6 mt-[-85px] rounded rounded-lg"
              >
                <IoTriangle
                  className="absolute top-[59px] left-[-10px] text-black"
                  style={{ transform: "rotate(29deg)" }}
                />
                <div className="flex">
                  <div className="w-6/12">
                    <p className="font-semibold text-base text-[gainsboro]">
                      {t("settings.organizations.create.createDate")}
                    </p>
                    <p className=" text-base pt-2">
                      {dataInfo.createdDate}
                      {/* {dataInfo.createdDate} */}
                    </p>
                    <p className="font-semibold text-base pt-2 text-[gainsboro]">
                      {t("settings.organizations.create.updateDate")}
                    </p>
                    <p className=" text-base pt-2">
                      {dataInfo.updatedDate}
                    </p>
                  </div>
                  <div className="w-6/12">
                    <p className="font-semibold text-base text-[gainsboro]">
                      {t("settings.organizations.create.createdBy")}
                    </p>
                    <p className=" text-base pt-2">{dataInfo.createdBy}</p>
                    <p className="font-semibold text-base pt-2 text-[gainsboro]">
                      {t("settings.organizations.create.updatedBy")}
                    </p>
                    <p className=" text-base pt-2">{dataInfo.updatedBy}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end border-t border-gray-300">
            <Button
              className="bg-white text-black border border-1 border-[gainsboro] text-base font-semibold px-4 py-2 rounded-md mt-5"
              onClick={() => {
                dispatch(
                  setOpenModalCFOrg({ idOrg: "0", typeModal: "cancel" })
                );
              }}
            >
              {t("settings.organizations.create.cancel")}
            </Button>

            <Button
              className="ml-1 bg-[#3758F9] text-white text-base font-semibold px-4 py-2 rounded-md mt-5"
              onClick={handleSubmit}
            >
              {type === "updateOrgById"
                ? t("settings.organizations.create.update")
                : t("settings.organizations.create.save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
