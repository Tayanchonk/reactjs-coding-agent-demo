import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    IConsentInterface,
    IOrganizations
} from "../../../../../interface/interface.interface";
import { Dropdown, DropdownOption, InputText, Tag, TextArea } from "../../../../../components/CustomComponent";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import LogInfoTooltip from "../../../../../components/StandardPurpose/LogInfoTooltip";
import { addArrContentPersonalData, setIntContentPersonalData } from "../../../../../store/slices/contentPersonalDataBuilderAndBrandingSlice";
import { Field } from "../../../../../interface/purpose.interface";

interface MenuItemType {
    id: string;
    label: string;
    value: string;
}

const InterfaceInformation = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const context = useOutletContext<{
        consentInterface: IConsentInterface;
        setConsentInterface: (data: IConsentInterface) => void;
        mode: string;
        errors: any;
        id?: string;
        organizations: IOrganizations[];
    }>();
    const datimeformat = JSON.parse(localStorage.getItem("datetime") || "{}");
    const { consentInterface, setConsentInterface, mode, errors, organizations } = context;
    const [interfaceName, setInterfaceName] = useState(consentInterface.interfaceName);
    const [description, setDescription] = useState(consentInterface.description);
    const [identifier, setIdentifier] = useState("-");
    const [organization, setOrganization] = useState<any[]>([]);
    const [dataElements, setDataElements] = useState<any[]>([]);
    const [purposes, setPurposes] = useState<any[]>([]);
    const orgparent = useSelector((state: RootState) => state.orgparent);
    const [selectedOrganization, setSelectedOrganization] = useState<MenuItemType>();
    const contents = useSelector((state: RootState) => state.contentPersonalDataBuilderAndBranding.contents);

    useEffect(() => {
        async function fetchOrganizationCharts() {
            if (consentInterface.organizationId) {
                setSelectedOrganization({
                    id: consentInterface.organizationId,
                    label: consentInterface.organizationName,
                    value: consentInterface.organizationId,
                })
            }
        }
        fetchOrganizationCharts();
        // dispatch(setIntContentPersonalData());
        if (mode === 'create' && localStorage.getItem("isCreating") !== "true") {
            dispatch(setIntContentPersonalData());
        }
        if (mode === 'view' || mode === 'edit') {
            dispatch(setIntContentPersonalData());
            const contents = consentInterface.builder?.flatMap((page: any) =>

                page.sections?.flatMap((section: any) => section.contents) || []
            ) || [];
            dispatch(addArrContentPersonalData({ contents: contents }));
        }


    }, [])


    const handleUpdate = () => {
        // let updatedTranslationJson = consentInterface.translationJson;

        let updatedTranslationJson = consentInterface.translationJson.map((translation) => ({
            ...translation,
            fields: translation.fields.map((field: Field) =>
                field.name === "Consent Interface Name"
                    ? { ...field, value: interfaceName }
                    : field.name === "Description"
                        ? { ...field, value: description }
                        : field
            ),
        }));
        const updated = {
            ...consentInterface,
            interfaceName: interfaceName,
            description: description,
            organizationId: selectedOrganization?.value ?? "",
            organizationName: selectedOrganization?.label ?? "",
            translationJson: updatedTranslationJson,
        };
        setConsentInterface(updated);
    };

    useEffect(() => {
        handleUpdate()
    }, [interfaceName, description, selectedOrganization])

    const getIdentifier = () => {
        let identifier: string = "-";
        const pages = consentInterface.builder ?? [];
        for (const page of pages) {
            for (const section of page.sections ?? []) {
                for (const content of section.contents ?? []) {
                    if (content.isIdentifier) {
                        identifier = content.element.selectedDataElement.dataElementTypeName;
                        break;
                    }
                }
                if (identifier !== "-") break;
            }
            if (identifier !== "-") break;
        }
        setIdentifier(identifier);
    };

    const getDataElements = () => {
        let dataElements = [];
        let purposes = [];
        const pages = consentInterface.builder ?? [];
        for (const page of pages) {
            for (const section of page.sections ?? []) {
                for (const content of section.contents ?? []) {
                    if (content?.fieldTypeName === "data_element") {
                        dataElements.push(content.element.selectedDataElement.dataElementTypeName);
                    } else if (content?.fieldTypeName === "standard_purpose") {
                        purposes.push(content.element.selectedStandardPurpose?.name);
                    }
                }
            }
        }
        setDataElements(dataElements);
        setPurposes(purposes);
    };

    useEffect(() => {
        getIdentifier()
        getDataElements()
    }, [consentInterface]);

    const getStatusStyle = (status: any) => {
        switch (status) {
            case "Draft":
                return "text-gray-600 bg-gray-200";
            case "Retired":
                return "text-red-600 bg-red-100";
            case "Published":
                return "text-green-600 bg-green-100";
            case "Unpublished":
                return "text-orange-600 bg-orange-100";
            default:
                return "text-gray-600 bg-gray-200";
        }
    };

    useEffect(() => {
        const orgLists = organizations.map((org: any) => {
            return {
                label: org.organizationName,
                id: org.organizationId,
                value: org.organizationId,
            }
        });
        setOrganization(orgLists);
    }, [organizations]);

    return (
        <div className="px-6">
            <div className="w-full pb-5">
                <h2 className="text-xl font-semibold">{t("interface.info.title")}</h2>
                <p className=" text-base">
                    {t("interface.info.titledesc")}
                </p>
                <div className="flex items-center gap-3 mt-2">
                    <Tag size="sm" minHeight="1.625rem" className="border border-blue-600 text-blue-600 px-3 py-1 rounded-md text-base">
                        {t("interface.info.tag")}
                    </Tag>
                    <Tag size="sm" minHeight="1.625rem" className={`px-3 py-1 rounded-md text-base ${getStatusStyle(consentInterface ? consentInterface.interfaceStatusName : "Draft")}`}>
                        {consentInterface.versionNumber ? consentInterface.interfaceStatusName : "Draft"}
                    </Tag>
                    <Tag size="sm" minHeight="1.625rem" className="text-primary-blue px-3 py-1 rounded-md text-base font-semibold bg-blue-100">
                        {t("interface.info.version")} {consentInterface.versionNumber ? consentInterface.versionNumber : 1}
                    </Tag>
                    <Tag size="sm" minHeight="1.625rem" className="text-gray-600 text-base font-semibold">{t("interface.info.publishDate")} : {consentInterface ? consentInterface.publishedDate ? dayjs(consentInterface.publishedDate).format(`${datimeformat.dateFormat} ${datimeformat.timeFormat}`) : " - " : " - "}</Tag>
                </div>
            </div>
            <hr />
            <div className="grid grid-cols-12 gap-6 pt-6">
                {/* ฝั่งซ้าย */}
                <div className="grid-cols-12 col-span-5">
                    <div className="mb-4">
                        <h1 className="pb-2 text-base font-semibold">
                            {mode != "view" && <span className="text-red-500">*</span>} {t("interface.info.interfaceName")}
                        </h1>
                        <InputText
                            type="text"
                            placeholder=""
                            value={interfaceName}
                            isError={errors.info?.interfaceName}
                            disabled={mode === "view"}
                            className="font-base"
                            onChange={(e) => setInterfaceName(e.target.value)}
                        />
                        {errors.info?.interfaceName && <p className="text-red-500 pt-2">{t("thisfieldisrequired")}</p>}
                    </div>

                    <div className="mb-4">
                        <h1 className="text-base font-semibold pb-2">
                            {mode != "view" && <span className="text-red-500">*</span>} {t("interface.info.description")}
                        </h1>
                        <TextArea
                            placeholder=""
                            value={description}
                            isError={errors.info?.description}
                            className="text-base"
                            disabled={mode === "view"}
                            onChange={(e) => setDescription(e.target.value)}
                            minHeight="10rem"
                        />
                        {errors.info?.description && <p className="text-red-500 pt-2">{t("thisfieldisrequired")}</p>}
                    </div>

                    <div className="mb-10">
                        <label className="block text-base font-semibold pb-2">
                            {mode != "view" && <span className="text-red-500">*</span>}  {t("interface.info.organization")}
                        </label>
                        <Dropdown
                            id="selectedOrganization"
                            title=""
                            className="w-full mt-2 text-base"
                            isError={errors.info?.organizationId}
                            selectedName={selectedOrganization?.label || ""}
                            disabled={mode === "view"}
                        >
                            {organization.map((item) => (
                                <DropdownOption
                                    className="h-[2.625rem]"
                                    selected={selectedOrganization?.value === item.value}
                                    onClick={() => setSelectedOrganization(item)}
                                    key={item.id}
                                >
                                    <span className={`${selectedOrganization?.value === item.value ? 'text-white' : ''}`}>{item.label}</span>
                                </DropdownOption>
                            ))}
                        </Dropdown>
                        {errors.info?.organizationId && <p className="text-red-500 pt-2">{t("thisfieldisrequired")}</p>}
                    </div>
                    {mode !== "create" && <LogInfoTooltip {...consentInterface} />}
                </div>

                {/* ฝั่งขวา */}
                {/* <div className="flex flex-col justify-start items-start grid-cols-12 col-span-7 rounded-xl bg-gray-50 border px-6 py-4">
                    <p className="text-base">{t("interface.info.configuration")}</p>
                </div> */}
                <div className="flex flex-col justify-start items-start grid-cols-12 col-span-7 ">
                    <div className="rounded-t-xl bg-gray-30 border px-6 py-4 w-full">
                        <p className="text-base">{t("interface.info.configuration")}</p>
                    </div>
                    <div className="rounded-b-xl bg-gray-30 border px-6 py-4 w-full">
                        <div className="mb-4">
                            <h1 className="text-base font-semibold pb-2">
                                {t("interface.info.identifier")}
                            </h1>
                            <p className="pl-3">{identifier}</p>
                        </div>
                        <div className="mb-4">
                            <h1 className="text-base font-semibold pb-2">
                                {t("interface.info.dataElements")}
                            </h1>
                            <p className="pl-3">
                                {dataElements.length === 0 ? "-" : dataElements.join(", ")}
                            </p>
                        </div>
                        <div className="mb-4">
                            <h1 className="text-base font-semibold pb-2">
                                {t("interface.info.purposes")}
                            </h1>
                            <p className="pl-3">
                                {purposes.length === 0 && "-"}
                            </p>
                            <p className="pl-8">
                                <ul className="list-disc">
                                    {purposes.length > 0 && purposes.map((item) => (<li>{item}</li>))}
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterfaceInformation;