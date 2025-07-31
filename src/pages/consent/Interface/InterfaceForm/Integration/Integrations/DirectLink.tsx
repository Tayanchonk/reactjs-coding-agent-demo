import React, { useState } from 'react'
import { Button, ComboBox, ComboBoxOption, Dropdown, DropdownOption } from '../../../../../../components/CustomComponent'
import { useTranslation } from 'react-i18next';

interface IConsentInterface {
    consentInterface: any;
    setConsentInterface: (data: any) => void;
    handleCopy: (id: string) => void;
}

function DirectLink({ consentInterface, setConsentInterface, handleCopy }: IConsentInterface) {

    console.log("DirectLink", consentInterface);
    const standardPurposeContents = collectStandardPurposeContents(consentInterface);
    const [selectedStandardPurpose, setSelectedStandardPurpose] = useState<any>(null);
    let { t, i18n } = useTranslation();
    const [query, setQuery] = useState("");

    function collectStandardPurposeContents(data: any): any[] {
        const results: any[] = [];
        for (const page of data.builder) {
            for (const section of page.sections) {
                for (const content of section.contents) {
                    if (content.fieldTypeName.toLowerCase() === 'standard_purpose') {
                        results.push(content);
                    }
                }
            }
        }
        console.log(results)
        //[0].element.selectedStandardPurpose.name
        return results;
    }

    return (
        <div>

            <div className="p-4 mx-auto w-100 "
                style={{
                    borderBottom: "1px solid #E3E8EC", borderRight: "1px solid #E3E8EC", borderLeft: "1px solid #E3E8EC",
                    borderRadius: "0px 0px 4px 4px"
                }}
            >

                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            <a href="#" className="text-base font-semibold">{t('integrations.testWebFormLink')}</a>
                        </h2>
                    </div>
                    <div>
                        <Button className="float-right mt-2 text-base text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white "
                            onClick={() => handleCopy("testWebFormLink")}
                        >{t('integrations.copy')}</Button>
                    </div>

                </div>

                <div className="relative max-w-full p-4 pt-12 mt-3 overflow-x-auto text-sm text-gray-600 bg-gray-100 rounded-md">
                    <span id="testWebFormLink" className="mt-4 whitespace-nowrap">
                        {consentInterface?.integation[0]?.directLink?.testWebFormLink}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                </div>


                <div className="clear-both mt-4">

                    <p className="text-base">
                        {t('integrations.useThislink')}
                    </p>
                </div>
            </div>
            <div className="p-4 mx-auto w-100 "
                style={{
                    borderBottom: "1px solid #E3E8EC", borderRight: "1px solid #E3E8EC", borderLeft: "1px solid #E3E8EC",
                    borderRadius: "0px"
                }}
            >

                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            <a href="#" className="text-base font-semibold">{t('integrations.productionWebFormLink')}</a>
                        </h2>
                    </div>
                    <div>
                        <Button className="float-right mt-2 text-base text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white "
                            onClick={() => handleCopy("productionWebFormLink")}
                        >{t('integrations.copy')}</Button>
                    </div>

                </div>

                <div className="relative max-w-full p-4 pt-12 mt-3 overflow-x-auto text-sm text-gray-600 bg-gray-100 rounded-md">
                    <span id="productionWebFormLink" className="mt-4 whitespace-nowrap">
                        {consentInterface?.integation[0]?.directLink?.productionWebFormLink}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                </div>


                <div className="clear-both mt-4">

                    <p className="text-base">
                        {t('integrations.copyTheDirect')}
                    </p>
                </div>
            </div>


            {/* <div className="p-4 mx-auto w-100 "
                style={{ border: "1px solid #E3E8EC", borderRadius: "4px 4px 0px 0px" }}
            >

                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            <a href="#" className="text-base font-semibold">{t('integrations.loginURL')}</a>
                        </h2>
                    </div>
                    <div>
                        <Button className="float-right mt-2 text-base text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white "
                            onClick={() => handleCopy("loginURL")}
                        >{t('integrations.copy')}</Button>
                    </div>

                </div>

                <div className="relative max-w-full p-4 pt-12 mt-3 overflow-x-auto text-sm text-gray-600 bg-gray-100 rounded-md">
                    <span id="loginURL" className="mt-4 whitespace-nowrap">
                        {consentInterface?.integation[0]?.directLink?.loginURL}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                </div>


                <div className="clear-both mt-4">
                    <p className="text-base font-semibold ">{t('integrations.userthisURL')}</p>
                    <p className="text-base">
                        {t('integrations.youMustPublish')}
                    </p>
                </div>
            </div> */}

            <div className="p-4 mx-auto w-100 "
                style={{
                    borderBottom: "1px solid #E3E8EC", borderRight: "1px solid #E3E8EC", borderLeft: "1px solid #E3E8EC",
                    borderRadius: "0px"
                }}
            >

                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            <a href="#" className="text-base font-semibold">{t('integrations.magicLinkURL')}</a>
                        </h2>
                    </div>
                    <div>
                        <Button className="float-right mt-2 text-base text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white "
                            onClick={() => handleCopy("magicLinkURL")}
                        >{t('integrations.copy')}</Button>
                    </div>

                </div>

                <div className="relative max-w-full p-4 pt-12 mt-3 overflow-x-auto text-sm text-gray-600 bg-gray-100 rounded-md">
                    <span id="magicLinkURL" className="mt-4 whitespace-nowrap">
                        {consentInterface?.integation[0]?.directLink?.magicLinkURL}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                </div>


                <div className="clear-both mt-4">

                    <p className="text-base">
                        {t('integrations.replaceToken')}

                    </p>
                </div>
            </div>
            <div className="p-4 mx-auto w-100 "
                style={{
                    borderBottom: "1px solid #E3E8EC", borderRight: "1px solid #E3E8EC", borderLeft: "1px solid #E3E8EC",
                    borderRadius: "0px"
                }}
            >
                <div className="flex justify-between">
                    <div className="flex flex-col w-full">
                        <h2 className="text-lg font-semibold">
                            <a href="#" className="text-lg font-semibold">{t('integrations.unsubscribeLink')}</a>
                        </h2>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="manager"
                                className="block text-base font-semibold"
                            >
                                {t('integrations.standardPurposes')}
                            </label>
                        </div>
                    </div>
                    <div>
                        <Button className="float-right mt-2 text-base text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white "
                            onClick={() => handleCopy("unsubscribeLink")}
                        >{t('integrations.copy')}</Button>
                    </div>
                </div>
                <Dropdown
                    id="selectedOrganization"
                    title=""
                    className="w-3/6 mt-2 text-base"
                    selectedName={selectedStandardPurpose?.element?.selectedStandardPurpose?.name || ""}
                >
                    {standardPurposeContents.map((item: any, index) => (
                        <DropdownOption
                            selected={item.element?.selectedStandardPurpose?.name === selectedStandardPurpose?.element?.selectedStandardPurpose?.name}
                            onClick={() => {
                                setSelectedStandardPurpose(item);
                                let url = consentInterface?.integation[0]?.directLink?.unsubscribeLink;
                                let urlSpit = url.split("/");
                                urlSpit[urlSpit.length - 1] = item?.element?.selectedStandardPurpose?.id;
                                let urlEndPoint = urlSpit.join("/");
                                setConsentInterface((prevState: any) => ({
                                    ...prevState,
                                    integation: [
                                        {
                                            ...prevState.integation[0],
                                            directLink: {
                                                ...prevState.integation[0].directLink,
                                                unsubscribeLink: urlEndPoint
                                            }
                                        }
                                    ]
                                }));
                            }}
                            key={index}
                        >
                            <span className={`${item?.element?.selectedStandardPurpose?.name === selectedStandardPurpose?.element?.selectedStandardPurpose?.name ? 'text-white' : ''}`}>{item.element?.selectedStandardPurpose?.name}</span>
                        </DropdownOption>
                    ))}
                </Dropdown>
                <div className="relative max-w-full p-4 pt-12 mt-3 overflow-x-auto text-sm text-gray-600 bg-gray-100 rounded-md">
                    <span id="unsubscribeLink" className="mt-4 whitespace-nowrap">
                        {consentInterface?.integation[0]?.directLink?.unsubscribeLink}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
                </div>
                <div className="clear-both mt-4">
                    <p className="text-base">
                        {t('integrations.replaceTokenWith')}
                    </p>
                </div>
            </div>

        </div>

    )
}

export default DirectLink