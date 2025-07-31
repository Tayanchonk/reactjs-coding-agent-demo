import { TranslationField } from "./purpose.interface"

export interface IConsentInterface {
    interfaceId: string;
    interfaceName: string;
    description: string;
    customerId: string;
    versionNumber: number;
    interfaceStatusId: string;
    interfaceStatusName: string;
    integation: any[];
    branding: any;
    builder: any[];
    configJson: IConfigJson;
    parentVersionId?: string;
    translationJson: TranslationField[];
    organizationId: string;
    organizationName: string
    isActiveStatus: boolean;
    createdDate: string;
    modifiedDate?: string;
    createdBy?: string;
    modifiedBy: string;
    publishedDate?: string;
    publishedBy?: string;
    LatestVersion?: boolean;
}

export interface IOrganizations {
    customerId: string;
    organizationId: string;
    organizationName: string;
    isActiveStatus: boolean;
}

export interface ITranslateFields {
    name: string;
    value: string;
}

export interface IConfigJson {
    // events: {
    //     interfaceEvents: boolean;
    //     dataSubjectElementChanges: boolean;
    //     enableDataSubjectPurposeChanges: boolean;
    //     singleDataSubjectUpdateEventType: boolean;
    //     dataSubjectPreferencePurposeChanges: boolean;
    // };
    records: {
        collectTransactionsOfConsentWithheldOnThisInterface: boolean;
    };
    // pageConfig: {
    //     sendEmailsWhenTheInterfaceChanges: boolean;
    //     showCurrentPurposeSubscriptionStatus: boolean;
    //     sendEmailsWhenTheDataSubjectChanges: boolean;
    //     sendEmailsWhenUnsubscribingFromInterfaceData: boolean;
    // };
    confirmation: {
        consentAcknowledgementEmail: boolean;
    };
    defaultLanguage: string;
}