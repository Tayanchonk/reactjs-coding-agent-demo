export interface PrivacyNoticeListResponse {
  items: PrivacyNoticeItem[];
  page: number;
  take: number;
  total: number;
}

export interface PrivacyNoticeItem {
  privacyNotice: PrivacyNotice;
  privacyNoticeStatusName: string;
  modifiedByName: string;
  createdBytName: string;
  publishedByName: string;
}

export interface PrivacyNotice {
  privacyNoticeId: string;
  privacyNoticeName: string;
  description: string;
  customerId: string;
  isActiveStatus: boolean;
  versionNumber: number;
  privacyNoticeStatusId: string;
  parentVersionId?: number | null;
  defaultLanguage: string;
  translationJson?: string | null;
  latestVersion: boolean;
  createdDate: Date;
  modifiedDate: Date;
  publishedDate?: Date | null;
  createdBy: string;
  modifiedBy: string;
  publishedBy?: string | null;
  configJson: string;
}

export interface PrivacyNoticeListRequest {
  customerId: string;
  page: number;
  pageSize: number;
  sort: string;
  column: string;
  searchTerm: string;
  statusId?: string | null;
}

export interface PrivacyNoticeStatus {
  privacyNoticeStatusId: string;
  privacyNoticeStatusName: string;
  isActiveStatus: boolean;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface PrivacyNoticeRequest {
  privacyNoticeId: string;
  privacyNoticeName: string;
  description: string;
  defaultLanguage: string;
  translationJson?: string | null;
  modifiedBy: string;
}

export interface ConfigJson {
  src: string;
  id: string;
  setting: string;
}
