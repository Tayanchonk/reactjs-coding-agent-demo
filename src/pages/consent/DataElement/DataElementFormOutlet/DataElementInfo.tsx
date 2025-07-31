import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoTriangle } from "react-icons/io5";
import { formatDate } from "../../../../utils/Utils";
import Select, { StylesConfig } from "react-select";
import { getDataElementTypes } from "../../../../services/dataElement.Service";
import ManageOptions from "./ManageOptions";
import { FaCheckCircle } from "react-icons/fa";
import InputText from "../../../../components/CustomComponent/InputText";
import Dropdown from "../../../../components/CustomComponent/Dropdown";
import DropdownOption from "../../../../components/CustomComponent/Dropdown/DropdownOption";
import Toggle from "../../../../components/CustomComponent/Toggle";
import { Field } from "../../../../interface/purpose.interface";

interface IOrganizations {
  customerId: string;
  organizationName: string;
  organizationId: string;
  isActiveStatus: boolean;
}

const customStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    background: "#fff",
    minHeight: "42px",
    height: "42px",
    borderColor: "#DFE4EA",
    borderRadius: "8px",
    "& input": {
      boxShadow: state.isFocused ? "none!important" : provided.boxShadow,
    },
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "42px",
    padding: "0 6px",
  }),

  input: (provided) => ({
    ...provided,
    outline: "none", // ป้องกันเส้นขอบ default
  }),

  indicatorSeparator: (state) => ({
    display: "none",
  }),

  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "42px",
  }),
};

const redCustomStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    background: "#fff",
    minHeight: "42px",
    height: "42px",
    borderColor: "red",
    borderRadius: "8px",
    border: "1px solid red",
    "& input": {
      boxShadow: state.isFocused ? "none!important" : provided.boxShadow,
    },
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "42px",
    padding: "0 6px",
  }),

  input: (provided) => ({
    ...provided,
    outline: "none", // ป้องกันเส้นขอบ default
  }),

  indicatorSeparator: (state) => ({
    display: "none",
  }),

  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "42px",
  }),
};

const DataElementInfo = () => {
  let { t, i18n } = useTranslation();
  const [Info, setInfo] = useState<boolean>(false);
  const [InfoIspersonaldata, setInfoIspersonaldata] = useState<boolean>(false);
  const [dataElementTypes, setDataElementTypes] = useState<any[]>([]);
  // ✅ Get context (state & update function) from `DataElementForm.tsx`
  const context = useOutletContext<{
    dataElement: any;
    setDataElement: (data: any) => void;
    mode: string;
    errors: any;
    id?: string;
    organizations: IOrganizations[];
  } | null>();

  if (!context) return <div></div>;

  const { dataElement, setDataElement, mode, errors, organizations } = context;
  const isViewMode = mode === "view";

  // ✅ Update function for inputs
  const handleChange = (field: string, value: any) => {
    setDataElement((prev: any) => {
      // If dataElementName changes, update translationJson
      let updatedTranslationJson = prev.translationJson;

      if (field === "dataElementName" && prev.translationJson.length > 0) {
        updatedTranslationJson = prev.translationJson.map((translation) => ({
          ...translation,
          fields: translation.fields.map((field: Field) =>
            field.name === "Data Element Name"
              ? { ...field, value } // Update value with the new dataElementName
              : field
          ),
        }));
      }

      return {
        ...prev,
        [field]: value,
        translationJson: updatedTranslationJson,
      };
    });
  };

  const openInfo = () => {
    setInfo(!Info);
  };

  const openInfoIspersonaldata = () => {
    setInfoIspersonaldata(!InfoIspersonaldata);
  };

  const handleChangeDataElementType = (event: any) => {
    const selectedId = event.value;
    const selected = dataElementTypes.find(
      (dataElementType) => dataElementType.dataElementTypeId === selectedId
    );

    if (selected) {
      if (selected.dataElementTypeName === "Selection") {
        setDataElement((prevState: any) => {
          const fields: Field[] = [];
          dataElement.selectionJson.options.forEach((option, index) => {
            fields.push({
              name: `Option ${option.order}`,
              value: option.text,
              transalte: "",
            });
          });
          return {
            ...prevState,
            dataElementTypeName: selected.dataElementTypeName,
            dataElementTypeId: selected.dataElementTypeId,
            isIdentifier: selected.isIdentifier,
            translationJson: prevState.translationJson.map((item: any) => {
              item.fields = [
                ...item.fields.filter(
                  (field: any) => field.name === "Data Element Name"
                ),
                ...fields,
              ];
              return item;
            }),
          };
        });
      } else
        setDataElement((prevState: any) => {
          return {
            ...prevState,
            dataElementTypeName: selected.dataElementTypeName,
            dataElementTypeId: selected.dataElementTypeId,
            isIdentifier: selected.isIdentifier,
            translationJson: prevState.translationJson.map((item: any) => {
              item.fields = item.fields.filter(
                (field: any) => field.name === "Data Element Name"
              );
              return item;
            }),
          };
        });
    }
  };

  const handleChangeOrganization = (event: any) => {
    const selectedId = event.value;
    const selectedOrg = organizations.find(
      (org) => org.organizationId === selectedId
    );

    if (selectedOrg) {
      setDataElement((prevState: any) => ({
        ...prevState,
        organizationId: selectedOrg.organizationId,
        organizationName: selectedOrg.organizationName,
        // manageoption: selectedOrg.organizationName.includes("PDPA") ? "Managed" : "Unmanaged",
        // manageoptiondesc: `Management status of ${selectedOrg.organizationName}`,
      }));
    }
  };

  const handleGetDataElementTypes = async () => {
    const resDataElementTypes = await getDataElementTypes();
    setDataElementTypes(resDataElementTypes);
  };

  useEffect(() => {
    handleGetDataElementTypes();
  }, []);

  return (
    <div className="py-2">
      {/* Title */}
      <p className="text-lg font-semibold">
        {t("dataelement.form.dataelementinfo")}
      </p>
      <p className="">{t("dataelement.form.dataelementinfodesc")}</p>

      {/* Grid Layout - Half Page for Inputs */}
      <div className="grid grid-cols-12 gap-4 border-b-2 ">
        <div className="col-span-6 border-r border-[#F6F6F6] p-3">
          {/* Left Column */}
          <div className="w-[80%]">
            {/* Data Element Name */}
            <div className="mt-7">
              <label
                htmlFor="firstName"
                className="block mb-2 font-medium text-base/6"
              >
                {isViewMode ? null : <span style={{ color: "red" }}>*</span>}{" "}
                {t("dataelement.form.dataelementname")}
              </label>

              <InputText
                disabled={mode === "view"}
                id="dataElementName"
                value={dataElement.dataElementName}
                placeholder={t("dataelement.form.dataelementname")}
                onChange={(e) =>
                  handleChange("dataElementName", e.target.value)
                }
                isError={errors.firstName}
              />
              {/* validate */}
              {errors.dataElementName && (
                <p className="text-red-500 text-xs pt-2">
                  {t("dataelement.form.requirefield")}
                </p>
              )}
              {errors.duplicateDataElementName && (
                <p className="text-red-500 text-xs pt-2">
                  {t("dataelement.form.duplicated")}
                </p>
              )}
            </div>
            {errors.invalid && (
              <p className="text-red-500 text-xs pt-2">
                {t("dataelement.form.invalid")}
              </p>
            )}

            {/* Data Element Type Dropdown */}
            <div className="mt-7">
              <label
                htmlFor="dataElementType"
                className="block mb-2 font-medium text-base/6"
              >
                {isViewMode ? null : <span style={{ color: "red" }}>*</span>}{" "}
                {t("dataelement.form.dataelementtype")}
              </label>

              <Dropdown
                id="dataelementtypes"
                className="w-full"
                isError={errors.dataElementType}
                selectedName={dataElement.dataElementTypeName}
                selectedLabel={dataElement.dataElementTypeName}
                disabled={mode === "view"}
              >
                {dataElementTypes.map((dataElementType: any) => (
                  <DropdownOption
                    className="h-[2.625rem]"
                    key={dataElementType.dataElementTypeId}
                    onClick={() =>
                      handleChangeDataElementType({
                        value: dataElementType.dataElementTypeId,
                        label: dataElementType.dataElementTypeName,
                      })
                    }
                  >
                    {dataElementType.dataElementTypeName}
                  </DropdownOption>
                ))}
              </Dropdown>
              {errors.dataElementType && (
                <p className="text-red-500 text-xs pt-2">
                  {t("dataelement.form.requirefield")}
                </p>
              )}
              {dataElement.isIdentifier ? (
                <div className="flex items-center mt-2">
                  <FaCheckCircle style={{ color: "#C6C6C6" }} />
                  <span className="text-sm text-gray-500 ml-2">
                    {t("dataelement.form.isindentifier")}
                  </span>
                </div>
              ) : null}
            </div>
            {/* Organization */}
            <div className="mt-7">
              <label
                htmlFor="firstName"
                className="block mb-2 font-medium text-base/6"
              >
                {t("dataelement.form.organization")}
              </label>

              <Dropdown
                id="organization"
                className="w-full"
                isError={errors.dataElementOrganization}
                selectedName={dataElement.organizationName}
                selectedLabel={dataElement.organizationName || ""}
                disabled={mode === "view"}
                isEmpty={true}
              >
                {organizations.map((organization: any) => (
                  <DropdownOption
                    key={organization.organizationId}
                    onClick={() =>
                      handleChangeOrganization({
                        value: organization.organizationId,
                        label: organization.organizationName,
                      })
                    }
                  >
                    {organization.organizationName}
                  </DropdownOption>
                ))}
              </Dropdown>
              {errors.dataElementOrganization && (
                <p className="text-red-500 text-xs pt-2">
                  {t("dataelement.form.requirefield")}
                </p>
              )}
            </div>
            <div className="mt-7">
              <div className="inline-flex mt-4">
                <label className="inline-flex items-center mb-5 cursor-pointer">
                  <Toggle
                    disabled={isViewMode}
                    checked={dataElement.isPersonalData || false}
                    onChange={() =>
                      handleChange(
                        "isPersonalData",
                        !dataElement.isPersonalData
                      )
                    }
                  />
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {t("dataelement.form.ispersonaldata")}
                  </span>
                </label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5  ml-2 mt-1"
                  onClick={openInfoIspersonaldata}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </div>
            </div>
            {InfoIspersonaldata && (
              <div className="relative">
                <div className="arrow-box bg-black w-[350px] absolute z-10 left-[250px] text-white py-3 px-6 mt-[-85px] rounded rounded-lg">
                  <IoTriangle
                    className="absolute top-[45px] left-[-10px] text-black"
                    style={{ transform: "rotate(29deg)" }}
                  />
                  <div className="flex">
                    {t("dataelement.form.ispersonaldatainfo")}
                  </div>
                </div>
              </div>
            )}

            {mode !== "create" ? (
              <div className="mt-7">
                <button
                  onClick={openInfo}
                  type="button"
                  className="relative flex mb-2 md:mb-0 text-black bg-[#ECEEF0] font-medium rounded-lg text-sm px-5 py-1.5 text-center  "
                >
                  <p className="pr-1">
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
              </div>
            ) : null}
            {Info && (
              <div className="relative">
                <div className="arrow-box bg-black w-[350px] absolute z-10 left-[155px] text-white py-3 px-6 mt-[-85px] rounded rounded-lg">
                  <IoTriangle
                    className="absolute top-[59px] left-[-10px] text-black"
                    style={{ transform: "rotate(29deg)" }}
                  />
                  <div className="flex">
                    <div className="w-6/12">
                      <p className="font-semibold text-sm text-[gainsboro]">
                        {t("settings.organizations.create.createDate")}
                      </p>
                      <p className="font-light text-sm pt-2">
                        {formatDate(
                          "datetime",
                          dataElement.createdDate || new Date()
                        )}
                      </p>
                      <p className="font-semibold text-sm pt-2 text-[gainsboro]">
                        {t("settings.organizations.create.updateDate")}
                      </p>
                      <p className="font-light text-sm pt-2">
                        {formatDate(
                          "datetime",
                          dataElement.modifiedDate || new Date()
                        )}
                      </p>
                    </div>
                    <div className="w-6/12">
                      <p className="font-semibold text-sm text-[gainsboro]">
                        {t("settings.organizations.create.createdBy")}
                      </p>
                      <p className="font-light text-sm pt-2">
                        {dataElement.createdBy}
                      </p>
                      <p className="font-semibold text-sm pt-2 text-[gainsboro]">
                        {t("settings.organizations.create.updatedBy")}
                      </p>
                      <p className="font-light text-sm pt-2">
                        {dataElement.modifiedBy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-6 border-r border-[#F6F6F6] p-3">
          {/* Right Column - Manage Translations */}
          {dataElement.selectionJson.hasOwnProperty("options") &&
          dataElement.dataElementTypeName === "Selection" ? (
            <ManageOptions
              mode={mode}
              dataElement={dataElement}
              setDataElement={setDataElement}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DataElementInfo;
