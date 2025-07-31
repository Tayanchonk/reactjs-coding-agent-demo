import React from 'react'
import { Button } from '../../../../../../components/CustomComponent'
import { useTranslation } from 'react-i18next';

interface IConsentInterface {
    consentInterface: any;
    setConsentInterface: (data: any) => void;
    handleCopy: (id: string) => void;
  }

function IframeScrip({ consentInterface, setConsentInterface, handleCopy }: IConsentInterface) {
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
        <div className="w-100 mx-auto p-4 "
            style={{ border: "1px solid #E3E8EC", borderRadius: "4px" }}
        >

            <div className="flex justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        <a href="#" className="text-base font-semibold">{t('integrations.iframeScript')}</a>
                    </h2>
                </div>
                <div>
                    <Button className="mt-2 text-blue-600 text-base float-right 
        border border-blue-600 hover:bg-blue-600 hover:text-white
        "
        onClick={() => handleCopy('iframeScript')}
        >{t('integrations.copy')}</Button>
                </div>

            </div>

            <div className="mt-3 pt-12 bg-gray-100 p-4 rounded-md text-gray-600 text-sm relative overflow-x-auto max-w-full">
                <span id="iframeScript" className=" mt-4">

                    {consentInterface?.integation[0]?.iframeScript?.iframeScript}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-300"></div>
            </div>


            <div className="clear-both mt-4">

                <p className="text-base">
                    {t('integrations.copyTheScript')}
                </p>
            </div>
        </div>
    )
}

export default IframeScrip