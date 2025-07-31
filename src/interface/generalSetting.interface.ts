export interface EmailLanguages {
    createdBy: string;
    createdDate: string;
    customerId: string;
    emailLanguageId: string;
    isActiveStatus: boolean;
    isDelete: boolean;
    languageName: string;
    modifiedBy: string;
    modifiedDate: string; 
  }

export interface AppSession {
    sessionTimeoutDuration: number;
    enableSessionProtection: boolean;
    enableRememberLastOrganization: boolean;
    sessionTimeoutTimeType: string;
    appSessionId: string;
    customerId: string;
    isActiveStatus: true;
    createdDate: string;
    modifiedDate: string;
    createdBy: string;
    modifiedBy: string;
}

export interface DateTimeSettings {
  timeZoneName: string;
  dateFormat: string;
  timeFormat: string;
  customerId: string;
  dateFormatId: string;
  modifiedBy: string;

}

