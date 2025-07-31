import { useOutletContext, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    IConsentInterface
} from "../../../../../interface/interface.interface";
import Integrations from "./Integrations";
import { Progress } from "flowbite-react";

const InterfaceIntegration = () => {
    const { t } = useTranslation();
    const context = useOutletContext<{
        consentInterface: IConsentInterface;
        setConsentInterface: (data: IConsentInterface) => void;
        mode: string;
        errors: any;
        id?: string;
    }>();
    const { consentInterface, errors, setConsentInterface, mode, id } = context;
    const VITE_MCSA_INTEGRATION = import.meta.env.VITE_MCSA_INTEGRATION;
    const [urlEndPoint, setUrlEndPoint] = useState(VITE_MCSA_INTEGRATION ? VITE_MCSA_INTEGRATION : process.env.VITE_MCSA_INTEGRATION);
    useEffect(() => {
        const idc = id ? id : consentInterface.interfaceId;
        setConsentInterface({
            ...consentInterface,
            integation: [{
                directLink: {
                    enabled: true,
                    testWebFormLink: urlEndPoint + "/msclicksubscribe/consentCenter/" + idc + "/test",
                    productionWebFormLink: urlEndPoint + "/msclicksubscribe/consentCenter/" + idc,
                    loginURL: urlEndPoint + "/msclicksubscribe/consentCenter/" + idc,
                    magicLinkURL: urlEndPoint + "/msclicksubscribe/consentCenter/" + idc,
                    unsubscribeLink: urlEndPoint + "/msclicksubscribe/Unsubscribe/" + idc + "/<StadardpPurpose>",
                    unsubscribeLinkId: "fdgdfgdfgdfgdfgdf",
                },
                iframeScript: {
                    enabled: true,
                    iframeScript: `<style>
                                        .ot-form-wrapper {
                                            max-width:  100%;
                                            height:  100%;
                                           
                                            margin: auto;
                                        }
                                        .ot-form-wrapper iframe {
                                            width: 100%;
                                            height: 100%;
                                            border: none;
                                        }
                                           body, html {
                                            margin: 0;
                                            padding: 0;
                                            height: 100%;
                                        }
                                    </style>
                                    <div class="ot-form-wrapper">
                                        <iframe
                                            src="${urlEndPoint}/msclicksubscribe/consentCenter/${idc}"
                                            title="OneTrust Consent Center"
                                        ></iframe>
                                    </div>`,
                },
                customAPI: {
                    enabled: true,
                    urlEndpoint: urlEndPoint + "/msclicksubscribe/consentCenter/" + idc,
                    apiToken: "dfsdfsdfsdfsdfsddddddfsdfsdfsasdfasdfasdfasdfasdfasdfasdfasewfdasdfasd",
                    examplePayload: {
                        csrf_token: "abc123csrf",
                        name: "Alice",
                        email: "alice@example.com",
                        message: "Hello, this is a test message."
                    }

                },

            }]
        });
        // console.log("consentInterface", consentInterface);
        // console.log("errors", errors);
        // console.log("mode", mode);
        // console.log("id", id);+
        return () => {

        }
    }, []);

    return (
        <>
            {/* <h2>Interface Integration - Mode: {mode} {id ? `(ID: ${id})` : ""}</h2>
            {JSON.stringify(consentInterface)}
            {JSON.stringify(errors)} */}
            <Integrations setConsentInterface={setConsentInterface} consentInterface={consentInterface} />
        </>
    );
};

export default InterfaceIntegration;