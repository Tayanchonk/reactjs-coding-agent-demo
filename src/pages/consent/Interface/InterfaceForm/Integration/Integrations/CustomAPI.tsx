import React from 'react'
import { Button } from '../../../../../../components/CustomComponent'
import { useTranslation } from 'react-i18next';


interface IConsentInterface {
    consentInterface: any;
    setConsentInterface: (data: any) => void;
    handleCopy: (id: string) => void;
}

type DataElement = {
    id: string;
    name: string;
    value?: string;
    selectionJson?: any;
    options?: any;
};

type Identifier = {
    identifierType: string;
    id: string;
    name: string;
    value?: string;
};

type PreferencePurpose = {
    Id: string;
    name: string;
    options?: any;
};

type Options = {
    text: string;
    value?: string;
    selected?: boolean;
};

type Purpose = {
    id: string;
    name: string;
    value: boolean;
    preference: PreferencePurpose[];
};

type ConsentInterface = {
    id: string;
    // version: string;
    organizationId: string;
    customerId: string;
    isTestMode: boolean;
};

function getPurposeData(consentPages: any[], consentData: any): {
    identifier: Identifier | null;
    dataElements: DataElement[];
    purpose: Purpose[];
    consentInterface: ConsentInterface;
} {
    const dataElements: DataElement[] = [];
    const purpose: Purpose[] = [];
    let identifier: Identifier | null = null;
    const consentInterface: ConsentInterface = {
        id: consentData.interfaceId,
        // version: consentData.versionNumber,
        organizationId: consentData.organizationId,
        customerId: consentData.customerId,
        isTestMode: false,
    };

    for (const page of consentPages) {
        if (!page.sections) continue;
        for (const section of page.sections) {
            if (!section.contents) continue;
            for (const content of section.contents) {
                const elem = content.element;
                if (!elem) continue;


                if (content.fieldTypeName === "data_element" && elem.selectedDataElement) {
                    const de = elem.selectedDataElement;
                    const defaultValue = de.selectionJson?.default ?? [];
                    const dataElementObj: DataElement = {
                        id: de.dataElementId,
                        name: de.dataElementName,
                        ...(Object.keys(de.selectionJson).length === 0
                            ? {
                                value: Array.isArray(defaultValue)
                                    ? defaultValue.length === 1
                                        ? defaultValue[0]
                                        : ""
                                    : ""
                            }
                            : {
                                options: de.selectionJson?.options.map((opt: Options) => ({
                                    name: opt.text,
                                    value: defaultValue.includes(opt.text)
                                }))
                            })
                    };

                    // ถ้ายังไม่มี identifier และ dataElement นี้มี isIdentifier = true
                    if (!identifier && de.isIdentifier === true) {
                        identifier = { identifierType: de.dataElementTypeName, ...dataElementObj };
                    } else {
                        dataElements.push(dataElementObj);
                    }
                }

                if (content.fieldTypeName === "standard_purpose" && elem.selectedStandardPurpose) {
                    const sp = elem.selectedStandardPurpose;
                    const preference: PreferencePurpose[] = [];
                    if (section.contents) {
                        for (const c of section.contents) {
                            if (c.fieldTypeName === "preference_purpose" && c.element.selectedPreferencePurpose?.stdPurposeId == sp.id) {
                                const pp = c.element.selectedPreferencePurpose;
                                preference.push({
                                    Id: pp.prefPurposeId || "",
                                    name: pp.prefPurposeName || "",
                                    options: pp.prefPurposeSelectionJson?.options.map((opt: Options) => ({
                                        name: opt.text,
                                        value: opt.selected || false
                                    })) || [],
                                });
                            }
                        }
                    }
                    purpose.push({
                        id: sp.id,
                        name: sp.name,
                        value: true,
                        preference,
                    });
                }
            }
        }
    }

    return {
        identifier, dataElements, purpose, consentInterface
    };
}

type Option = {
    text: string;
};

type OptionGroup = {
    id: string;
    name: string;
    options: Option[];
};

function getOptionsFromSelectionJson(consentPages: any[]): OptionGroup[] {
    const optionsResult: OptionGroup[] = [];

    for (const page of consentPages) {
        if (!page.sections) continue;
        for (const section of page.sections) {
            if (!section.contents) continue;
            for (const content of section.contents) {
                const elem = content.element;
                if (!elem) continue;

                // For data_element with selectionJson options
                if (
                    content.fieldTypeName === "data_element" &&
                    elem.selectedDataElement?.selectionJson?.options
                ) {
                    const de = elem.selectedDataElement;
                    optionsResult.push({
                        id: de.dataElementId,
                        name: de.dataElementName,
                        options: de.selectionJson.options.map((opt: any) => ({
                            text: opt.text,
                        })),
                    });
                }

                // For preference_purpose with prefPurposeSelectionJson options
                if (
                    content.fieldTypeName === "preference_purpose" &&
                    elem.selectedPreferencePurpose?.prefPurposeSelectionJson?.options
                ) {
                    const pp = elem.selectedPreferencePurpose;
                    optionsResult.push({
                        id: pp.prefPurposeId,
                        name: pp.prefPurposeName,
                        options: pp.prefPurposeSelectionJson.options.map((opt: any) => ({
                            text: opt.text,
                        })),
                    });
                }
            }
        }
    }

    return optionsResult;
}

function CustomAPI({ consentInterface, setConsentInterface, handleCopy }: IConsentInterface) {
    let { t, i18n } = useTranslation();
    const textData = `
    - OneTrust Web Form start
<style>
.ot-form-wrapper (
max-width: 750px;
height: 800px;
border: 1px solid #c0c2c7:
margin: auto:
.ot-form-wrapper iframe (
width: 100%;
height: 100%;
border: none:
</style>
div class-"ot-form-wrapper">
kiframe
src="https://privacyportal-apac.xxxxx.com/ui/#/preferences/multipage/login/6026c4e1-333b-4789-898e-298ac0d762be">
</iframe>`
    return (
        <div>

            <div className="w-100 mx-auto p-4 "
                style={{ border: "1px solid #E3E8EC", borderRadius: "4px 4px 0px 0px" }}
            >

                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            <a href="#" className="text-lg font-semibold">{t('integrations.examplePayload')}</a>
                        </h2>
                    </div>
                    <div>
                        <Button className="mt-2 text-blue-600 text-base float-right 
                    border border-blue-600 hover:bg-blue-600 hover:text-white
                    "
                            onClick={() => handleCopy('urlEndpoint')}
                        >{t('integrations.copy')}</Button>
                    </div>

                </div>
                <div className="mt-3 pt-12 bg-gray-100 p-4 rounded-md text-gray-600 text-sm relative overflow-x-auto max-w-full">
                    <span id="urlEndpoint" className="whitespace-nowrap mt-4">
                        {/* {consentInterface?.integation[0]?.customAPI?.urlEndpoint} */}
                        {import.meta.env.VITE_API_GATEWAY_URL}/api/v1/Consent/set-consent
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                </div>


                <div className="clear-both mt-4">

                    <p className="text-base">
                        {t('integrations.theConsentRecript')}
                    </p>
                </div>
            </div>

            <div className="w-100 mx-auto p-4 "
                style={{ border: "1px solid #E3E8EC", borderRadius: "0px 0px 4px 4px" }}
            >

                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            <a href="#" className="text-lg font-semibold">{t('integrations.examplePayload')}</a>
                        </h2>

                        <ul className="list-disc text-base pl-5 space-y-2">
                            <li>{t("integrations.requestInformation")}</li>
                            <li>{t("integrations.purposes")}</li>
                            <li>{t("integrations.dsDataElements")}</li>
                            <li>{t("integrations.test")}</li>
                            <li>{t("integrations.enableDataElementDateValidation")}</li>
                            <li>{t("integrations.transactionTypes")}</li>
                            <li>{t("integrations.parentPrimaryIdentifiers")}</li>
                            <li>{t("integrations.consentGivenBy")}</li>
                        </ul>


                    </div>
                    <div style={{ alignSelf: "end" }}>
                        <Button className="mt-2 text-blue-600 text-base float-right 
        border border-blue-600 hover:bg-blue-600 hover:text-white
        "
                            onClick={() => handleCopy('examplePayload')}
                        >{t('integrations.copy')}</Button>
                    </div>

                </div>

                <div className="mt-3 pt-12 bg-gray-100 p-4 rounded-md text-gray-600 text-sm relative overflow-x-auto max-w-full">
                    <span id="examplePayload" className=" mt-4">
                        <pre style={{
                            backgroundColor: '#f5f5f5',
                            padding: '1rem',
                            borderRadius: '6px',
                            overflowX: 'auto',
                            fontFamily: 'Consolas, monospace',
                            fontSize: '14px',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}>
                            {JSON.stringify(getPurposeData(consentInterface?.builder, consentInterface), null, 2)}
                        </pre>
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                </div>



            </div>


            {/* <div className="w-100 mx-auto p-4 "
                style={{
                    borderBottom: "0px solid #E3E8EC", borderRight: "1px solid #E3E8EC", borderLeft: "1px solid #E3E8EC",
                    borderRadius: "0px"
                }}
            >

                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            <a href="#" className="text-lg font-semibold">{t('integrations.options')}</a>
                        </h2>
                    </div>
                    <div>
                        <Button className="mt-2 text-blue-600 text-base float-right 
                    border border-blue-600 hover:bg-blue-600 hover:text-white
                    "
                            onClick={() => handleCopy('apiToken')}
                        >{t('integrations.copy')}</Button>
                    </div>

                </div>

                <div className="mt-3 pt-12 bg-gray-100 p-4 rounded-md text-gray-600 text-sm relative overflow-x-auto max-w-full">
                    <span id="apiToken" className="whitespace-nowrap mt-4">
                        <pre style={{
                            backgroundColor: '#f5f5f5',
                            padding: '1rem',
                            borderRadius: '6px',
                            overflowX: 'auto',
                            fontFamily: 'Consolas, monospace',
                            fontSize: '14px',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}>
                            {JSON.stringify(getOptionsFromSelectionJson(consentInterface?.builder), null, 2)}
                        </pre>
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                </div>


                <div className="clear-both mt-4">

                    <p className="text-base">
                        {t('integrations.useThislinktoTest')}
                    </p>
                </div>
            </div> */}
        </div>
    )
}

export default CustomAPI