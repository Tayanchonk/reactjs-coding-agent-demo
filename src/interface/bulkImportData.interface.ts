export interface ImportRecord {
  importId: string;
  importName: string;
  templatesType: string;
  status: string;
  createdDate: string;
  createdBy: string;
}

export interface ImportRecordResponse {
  data: ImportRecord[];
  pagination: {
    page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
  };
}
export type fieldTypeName =
  | "content_text"
  | "data_element"
  | "standard_purpose"
  | "preference_purpose";

export type IElementTypeName =
  | "Email"
  | "Text Input"
  | "Date"
  | "Selection"
  | "Phone";
export interface IInterfaceDetails {
  interfaceId: string;
  versionNumber: number;
  interfaceStatusId: string;
  interfaceStatusName: string;
  builder: {
    sections: {
      contents: {
        fieldTypeId: string;
        fieldTypeName: fieldTypeName;
        element: {
          selectedDataElement?: {
            dataElementId: string;
            dataElementName: string;
            dataElementTypeName: IElementTypeName;
            isIdentifier: boolean;
            translationJson: {
              languageId: string;
            }[];
            selectionJson?: {
              options?: { text: string }[];
              multipleSelections: boolean;
            };
          };
          selectedContentText?: {
            contentTitle: string;
          };
          selectedStandardPurpose?: {
            id: string;
            name: string;
          };
          selectedPreferencePurpose?: {
            standardPreferenceId: string;
            prefPurposeId: string;
            prefPurposeName: string;
            stdPurposeId: string;
            prefPurposeSelectionJson?: {
              options?: {
                id: string;
                text: string;
              }[];
              multipleSelections: boolean;
            };
          };
        };
        isRequired: boolean;
        isIdentifier: boolean;
      }[];
    }[];
  }[];
}

export interface IBulkImportDataSubjectWithConsentData {
  id?: string;
  originalField?: string;
  data?: string;
  options?: { name: string }[];
  fieldName?: string;
  standardPurposeId?: string;
  standardPurposeName?: string; // Added for preference purpose fields to store the standard purpose name
  availableOptions?: string[]; // Added to store all available options for selection/multiple-choice fields
  isMultiSelect?: boolean; // Flag to indicate if this is a multi-selection field
  hasSelectionOptions?: boolean; // Flag to indicate this field has selection options
  dataElementTypeName?: IElementTypeName;
  isRequired: boolean;
  isIdentifier: boolean;
  fieldType: fieldTypeName | "none";
}

export interface IBulkCreateConsentData {
  identifier: {
    identifierType: string;
    id: string;
    name: string;
    value: string;
  };
  dataElements: {
    id: string;
    name: string;
    value?: string;
    options?: { name: string; value: boolean }[];
  }[];
  purpose: {
    id: string;
    name: string;
    value: boolean;
    consentDate?: string; // Added consent date field
    preference: {
      id: string;
      name: string;
      options?: { name: string; value: boolean }[];
    }[];
  }[];
  consentInterface: {
    id: string;
    organizationId: string;
    customerId: string;
    isTestMode?: boolean;
  };
}
