export interface ConsentGeneral {
  customerId: string;
  enableTransactionDeclineConsent: boolean;
  enableAcknowledgementEmail: boolean;
  enableDataSubjectsDeletion: boolean;
  enableRequireOrganizationPurposes: boolean;
  // enableReasonNote: boolean;
  // enableReasonTemplate: boolean;
}

export interface ConsentAccessToken {
  consentAccessTokenId: string;
  customerId: string;
  enableAccessTokenLink: boolean;
  isNonExpiry: boolean;
  isSingleUse: boolean;
  expiryMonthDuration: number;
  isDisableUse: boolean;
  isActiveStatus: boolean;
  userId: string;
}
