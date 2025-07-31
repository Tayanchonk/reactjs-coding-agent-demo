import React, { useCallback, useEffect, useState } from "react";
import InputText from "../CustomComponent/InputText";
import InputTextArea from "../CustomComponent/TextArea";
import CustomToggleSwitch from "../CustomComponent/Toggle";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import LogInfoTooltip from "../../components/StandardPurpose/LogInfoTooltip";
import Dropdown from "../CustomComponent/Dropdown";
import { useTranslation } from "react-i18next";
import { DropdownOption } from "../CustomComponent";

interface MenuItemType {
  id: string;
  label: string;
  value: string;
}

interface LogInfoType {
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  publishedDate: string;
  publishedBy: string;
  stdPurposeStatusName: string;
}

interface StandardPurposeInfoProps {
  enableRequireOrganizationPurposes: boolean;
  isCheckData: boolean;
  setIsCheckData: (value: boolean) => void;
  isEdit: boolean;
  selectedOrganization: MenuItemType;
  setSelectedOrganization: (value: MenuItemType) => void;
  purposeName: string;
  setPurposeName: (value: string) => void;
  purposeDesc: string;
  setPurposeDesc: (value: string) => void;
  organization: MenuItemType[];
  selectedExpireDateType: string;
  setSelectedExpireDateType: (value: string) => void;
  expireNumber: string;
  setExpireNumber: (value: string) => void;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  logInfo: LogInfoType;
}

const mockExpireDateItems = [
  { id: "1", label: "Day", value: "Day", min: 1, max: 3285 },
  { id: "2", label: "Month", value: "Month", min: 1, max: 109 },
  { id: "3", label: "Year", value: "Year", min: 1, max: 9 },
];

const StandardPurposeInfo: React.FC<StandardPurposeInfoProps> = ({
  enableRequireOrganizationPurposes,
  isCheckData,
  setIsCheckData,
  isEdit,
  selectedOrganization,
  setSelectedOrganization,
  purposeName,
  setPurposeName,
  purposeDesc,
  setPurposeDesc,
  organization,
  selectedExpireDateType,
  setSelectedExpireDateType,
  expireNumber,
  setExpireNumber,
  isChecked,
  setIsChecked,
  logInfo,
}) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-12 gap-6 px-6">
      {/* ฝั่งซ้าย */}
      <div className="grid-cols-12 col-span-5">
        <div className="mb-4">
          <h1 className="pb-2 text-base font-semibold">
            {isEdit && <span className="text-red-500">*</span>}{" "}
            {t(
              "purpose.standardPurpose.tabs.standardPurposeInfo.txtPurposeName"
            )}
          </h1>
          <InputText
            type="text"
            placeholder=""
            value={purposeName}
            disabled={!isEdit}
            isError={purposeName === "" && isCheckData ? true : false}
            className="font-light"
            onChange={(e) => setPurposeName(e.target.value)}
          />
          {purposeName === "" && isCheckData && (
            <p className="text-red-500 pt-2">
              {t(
                "purpose.standardPurpose.tabs.standardPurposeInfo.thisfieldisrequired"
              )}
            </p>
          )}
        </div>

        <div className="mb-4">
          <h1 className="text-base font-semibold pb-2">
            {isEdit && <span className="text-red-500">*</span>}{" "}
            {t(
              "purpose.standardPurpose.tabs.standardPurposeInfo.txtdescription"
            )}
          </h1>
          <InputTextArea
            placeholder=""
            value={purposeDesc}
            className="text-base"
            disabled={!isEdit}
            isError={purposeDesc === "" && isCheckData ? true : false}
            onChange={(e) => setPurposeDesc(e.target.value)}
            minHeight="10rem"
          />
          {purposeDesc === "" && isCheckData && (
            <p className="text-red-500 pt-2">
              {t(
                "purpose.standardPurpose.tabs.standardPurposeInfo.thisfieldisrequired"
              )}
            </p>
          )}
        </div>

        <div className="mb-10">
          <label className="block text-base font-semibold pb-2">
            {isEdit && enableRequireOrganizationPurposes && (
              <span className="text-red-500">*</span>
            )}{" "}
            {t("purpose.standardPurpose.tabs.standardPurposeInfo.organization")}
          </label>
          <Dropdown
            id="selectedOrganization"
            title=""
            className="w-full mt-2 text-base"
            selectedName={selectedOrganization.label}
            disabled={!isEdit}
            isError={
              selectedOrganization.label === "" &&
                isCheckData &&
                enableRequireOrganizationPurposes
                ? true
                : false
            }
          >
            {organization.map((item) => (
              <DropdownOption
                className="h-[2.625rem] text-base"
                selected={selectedOrganization.value === item.value}
                onClick={() => setSelectedOrganization(item)}
                key={item.value}
              >
                <span
                  className={`${selectedOrganization.value === item.value
                    ? "text-white"
                    : ""
                    }`}
                >
                  {item.label}
                </span>
              </DropdownOption>
            ))}
          </Dropdown>
          {selectedOrganization.label === "" &&
            isCheckData &&
            enableRequireOrganizationPurposes && (
              <p className="text-red-500 pt-2">
                {t(
                  "purpose.standardPurpose.tabs.standardPurposeInfo.thisfieldisrequired"
                )}
              </p>
            )}
        </div>

        {logInfo && <LogInfoTooltip {...logInfo} />}
      </div>

      {/* ฝั่งขวา */}
      <div className="flex flex-col justify-start items-start grid-cols-12 col-span-7">
        {((isEdit) || (!isEdit && isChecked)) && <div className="ml-5">
          <label className="flex items-center space-x-2 ">
            <CustomToggleSwitch
              checked={isChecked}
              disabled={!isEdit}
              onChange={() => setIsChecked(!isChecked)}
            />
            <span className="text-base">
              {t(
                "purpose.standardPurpose.tabs.standardPurposeInfo.setConsenttoexpire"
              )}
            </span>
          </label>
          {isChecked && (
            <div className="flex items-center mt-2 ml-[60px]">
              <div className="inline-flex items-center w-[100px] mr-2">
                <InputText
                  type="number"
                  className="w-[90px] text-base"
                  value={expireNumber}
                  disabled={!isChecked || !isEdit}
                  onChange={(e) => {
                    let newValue = e.target.value;

                    if (newValue === "") {
                      setExpireNumber("1");
                      return;
                    }

                    let numValue = parseInt(newValue, 10);
                    let min = 1,
                      max = 3285;

                    if (selectedExpireDateType === "Month") {
                      max = 109;
                    } else if (selectedExpireDateType === "Year") {
                      max = 9;
                    }

                    if (numValue > max) {
                      setExpireNumber(max.toString());
                    } else if (numValue < min) {
                      setExpireNumber(min.toString());
                    } else {
                      setExpireNumber(numValue.toString());
                    }
                  }}
                />
              </div>
              <Dropdown
                selectedName={selectedExpireDateType}
                minWidth="115px"
                className="border-gray-300 text-gray-900 text-base"
                isError={false}
                selectedLabel={t(
                  "purpose.standardPurpose.tabs.standardPurposeInfo." +
                  selectedExpireDateType
                )}
                disabled={!isChecked || !isEdit}
              >
                {mockExpireDateItems.map((item) => (
                  <MenuItem key={item.id}>
                    {({ active }) => (
                      <button
                        className={`block w-[115px] px-4 py-2 text-left text-base ${active ? "bg-gray-100" : "text-gray-700"
                          }`}
                        onClick={() => {
                          setSelectedExpireDateType(item.value);
                          setExpireNumber(item.min.toString());
                        }}
                      >
                        {t(
                          "purpose.standardPurpose.tabs.standardPurposeInfo." +
                          item.label
                        )}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </Dropdown>
            </div>)}
        </div>}
      </div>
    </div>
  );
};

export default StandardPurposeInfo;
