import { useOutletContext } from "react-router-dom";
import { Button, Toggle } from "../../../../../components/CustomComponent";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    IConsentInterface, IConfigJson
} from "../../../../../interface/interface.interface";
import { getConsentGeneral } from "../../../../../services/consentSettingService";

const InterfaceSetting = () => {
    const { t } = useTranslation();
    const context = useOutletContext<{
        consentInterface: IConsentInterface;
        setConsentInterface: (data: any) => void;
        mode: string;
        errors: any;
        id?: string;
        permissionPage: any;
    }>();
    const { consentInterface, setConsentInterface, mode, id, permissionPage } = context;

    const toggleSwitch = (component: string, key: string) => {
        setConsentInterface((prev: any) => ({
            ...prev,
            configJson: {
                ...prev.configJson,
                [component]: {
                    ...prev.configJson[component],
                    [key]: !prev.configJson[component][key]
                }
            }
        }));
    };
    const [isConsentAcknowledgementEmail, setIsConsentAcknowledgementEmail] = useState<boolean>(false);
    const [isConsentTransactionDeclineConsent, setIsConsentTransactionDeclineConsent] = useState<boolean>(false);

    useEffect(() => {
        const getUserSession: any = sessionStorage.getItem("user");
        const user = JSON.parse(getUserSession);
        getConsentGeneral(user.customer_id).then((res: any) => {
            setIsConsentAcknowledgementEmail(res.data.enableAcknowledgementEmail);
            setIsConsentTransactionDeclineConsent(res.data.enableTransactionDeclineConsent);
            if (!res.data.enableAcknowledgementEmail || !res.data.enableTransactionDeclineConsent) {
                setConsentInterface((prev: any) => ({
                    ...prev,
                    configJson: {
                        ...prev.configJson,
                        confirmation: {
                            ...prev.configJson.confirmation,
                            consentAcknowledgementEmail: res.data.enableAcknowledgementEmail ? prev.configJson.confirmation.consentAcknowledgementEmail : false,
                            consentTransactionDeclineConsent: res.data.enableTransactionDeclineConsent ? prev.configJson.confirmation.consentTransactionDeclineConsent : false
                        }
                    }
                }));
            }
        })

    }, []);

    return (
        <div className="p-4">
            <div className="flex pb-2 border-b border-solid border-1 ">
                <div className="w-9/12">
                    <h2 className="text-xl font-semibold">{t('interface.setting.title')}</h2>
                    <p className="">
                        {t('interface.setting.desc')}
                    </p>
                </div>
                {/* <div className="w-3/12 text-right">
                    {permissionPage.isUpdate &&
                        <Button className="rounded bg-[#3758F9] py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 font-semibold"
                            onClick={() => openConfirmModal()}>
                            {t('saveandupdate')}
                        </Button>
                    }
                </div> */}
            </div>

            {isConsentAcknowledgementEmail && <div>
                <h1 className="text-xl font-semibold py-3 pt-5 text-[#656668]">
                    {t("interface.setting.confirmation")}
                </h1>
                <div className="">
                    {[
                        {
                            key: "consentAcknowledgementEmail",
                            title: "consentAcknowledgementEmailTitle",
                            description: "consentAcknowledgementEmailDesc"
                        }
                    ]
                        .map(({ key, title, description }) => (
                            <div key={key} className="flex border border-solid border-x border-t border-b">
                                <div className="w-1/12 my-auto p-4 justify-center flex">
                                    <Toggle
                                        checked={consentInterface.configJson.confirmation[key as keyof typeof consentInterface.configJson.confirmation]}
                                        onChange={() => { if (permissionPage.isUpdate) toggleSwitch("confirmation", key) }}
                                        disabled={mode === "view"}
                                    />
                                </div>
                                <div className="w-10/12 p-4">
                                    <div>
                                        <p className="font-semibold">{t(`interface.setting.${title}`)}</p>
                                        <p className="">{t(`interface.setting.${description}`)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>}

            {/* <h1 className="text-xl font-bold py-3 pt-5 text-[#656668]">
                {t("interface.setting.events")}
            </h1>
            <div className="">
                {[
                    {
                        key: "interfaceEvents",
                        title: "interfaceEventsTitle",
                        description: "interfaceEventsDesc"
                    },
                    {
                        key: "singleDataSubjectUpdateEventType",
                        title: "singleDataSubjectUpdateEventTypeTitle",
                        description: "singleDataSubjectUpdateEventTypeDesc"
                    },
                    {
                        key: "dataSubjectElementChanges",
                        title: "dataSubjectElementChangesTitle",
                        description: "dataSubjectElementChangesDesc"
                    },
                    {
                        key: "enableDataSubjectPurposeChanges",
                        title: "enableDataSubjectPurposeChangesTitle",
                        description: "enableDataSubjectPurposeChangesDesc"
                    },
                    {
                        key: "dataSubjectPreferencePurposeChanges",
                        title: "dataSubjectPreferencePurposeChangesTitle",
                        description: "dataSubjectPreferencePurposeChangesDesc"
                    }
                ]
                    .map(({ key, title, description }) => (
                        <div key={key} className="flex border border-solid border-x border-t border-b">
                            <div className="w-1/12 my-auto p-4 justify-center flex">
                                <Toggle
                                    checked={consentInterface.configJson.events[key as keyof typeof consentInterface.configJson.events]}
                                    onChange={() => { if (permissionPage.isUpdate) toggleSwitch("events", key) }}
                                    disabled={mode === "view"}
                                />
                            </div>
                            <div className="w-10/12 p-4">
                                <div>
                                    <p className="font-semibold">{t(`interface.setting.${title}`)}</p>
                                    <p className="">{t(`interface.setting.${description}`)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div> */}
            {isConsentTransactionDeclineConsent && <div>
                <h1 className="text-xl font-semibold py-3 pt-5 text-[#656668]">
                    {t("interface.setting.records")}
                </h1>
                <div className="">
                    {[
                        {
                            key: "collectTransactionsOfConsentWithheldOnThisInterface",
                            title: "collectTransactionsOfConsentWithheldOnThisInterfaceTitle",
                            description: "collectTransactionsOfConsentWithheldOnThisInterfaceDesc"
                        }
                    ]
                        .map(({ key, title, description }) => (
                            <div key={key} className="flex border border-solid border-x border-t border-b">
                                <div className="w-1/12 my-auto p-4 justify-center flex">
                                    <Toggle
                                        checked={consentInterface.configJson.records[key as keyof typeof consentInterface.configJson.records]}
                                        onChange={() => { if (permissionPage.isUpdate) toggleSwitch("records", key) }}
                                        disabled={mode === "view"}
                                    />
                                </div>
                                <div className="w-10/12 p-4">
                                    <div>
                                        <p className="font-semibold">{t(`interface.setting.${title}`)}</p>
                                        <p className="">{t(`interface.setting.${description}`)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>}

            {/* <h1 className="text-xl font-bold py-3 pt-5 text-[#656668]">
                {t("interface.setting.pageConfiguration")}
            </h1>
            <div className="">
                {[
                    {
                        key: "showCurrentPurposeSubscriptionStatus",
                        title: "showCurrentPurposeSubscriptionStatusTitle",
                        description: "showCurrentPurposeSubscriptionStatusDesc"
                    },
                    {
                        key: "sendEmailsWhenTheInterfaceChanges",
                        title: "sendEmailsWhenTheInterfaceChangesTitle",
                        description: "sendEmailsWhenTheInterfaceChangesDesc"
                    },
                    {
                        key: "sendEmailsWhenTheDataSubjectChanges",
                        title: "sendEmailsWhenTheDataSubjectChangesTitle",
                        description: "sendEmailsWhenTheDataSubjectChangesDesc"
                    },
                    {
                        key: "sendEmailsWhenUnsubscribingFromInterfaceData",
                        title: "sendEmailsWhenUnsubscribingFromInterfaceDataTitle",
                        description: "sendEmailsWhenUnsubscribingFromInterfaceDataDesc"
                    }
                ]
                    .map(({ key, title, description }) => (
                        <div key={key} className="flex border border-solid border-x border-t border-b">
                            <div className="w-1/12 my-auto p-4 justify-center flex">
                                <Toggle
                                    checked={consentInterface.configJson.pageConfig[key as keyof typeof consentInterface.configJson.pageConfig]}
                                    onChange={() => { if (permissionPage.isUpdate) toggleSwitch("pageConfig", key) }}
                                    disabled={mode === "view"}
                                />
                            </div>
                            <div className="w-10/12 p-4">
                                <div>
                                    <p className="font-semibold">{t(`interface.setting.${title}`)}</p>
                                    <p className="">{t(`interface.setting.${description}`)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div> */}

        </div>
    );
};

export default InterfaceSetting;