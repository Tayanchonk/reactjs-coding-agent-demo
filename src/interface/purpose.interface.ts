export interface PreferencePurposeList {
  items: PreferencePurposeItem[];
  page: number;
  take: number;
  total: number;
}

export interface PreferencePurposeItem {
  csPreferencePurpose: CSPreferencePurpose;
  modifiedByFirstName: string;
  modifiedByLastName: string;
  createdByFirstName: string;
  createdByLastName: string;
  organizationName: string;
  standardPreferenceCount: number;
}

export interface CSPreferencePurpose {
  preferencePurposeId: string;
  preferencePurposeName: string;
  description: string;
  selectionJson: string;
  organizationId: string;
  isRequired: boolean;
  translationJson: string;
  customerId: string;
  isActiveStatus: boolean;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: string;
  modifiedBy: string;
}

export interface PreferencePurposeListRequest {
  organizationIds: string[];
  customerId: string;
  page: number;
  pageSize: number;
  sort: string;
  column: string;
  searchTerm: string;
}

export interface PreferencePurposeRequest {
  preferencePurposeName: string;
  description: string;
  selectionJson: string;
  organizationId: string | null;
  isRequired: boolean;
  customerId: string;
  isActiveStatus: boolean;
  createdBy: string;
  translationJson: string;
  modifiedBy?: string;
  preferencePurposeId?: string;
}

export interface selectionJson {
  options: Option[];
  multipleSelections: boolean;
}

export interface Option {
  text: string;
  order: number;
  value: string;
  selected: boolean;
  id: string;
}

export interface TranslationField {
  language: string;
  languageId: string;
  fields: Field[];
}

export interface Field {
  name: string;
  value: string;
  type?: string;
  transalte?: string;
}
