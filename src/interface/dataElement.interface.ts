export interface DataElement {
    dataElementId: string;
    dataElementName: string;
    dataElementTypeId: string;
    isPersonalData: boolean;
    selectionJson: Record<string, any>; // JSON data
    translationJson: Record<string, any>; // JSON data
    organizationId: string;
    customerId: string;
    isActiveStatus: boolean;
    createdDate: string;
    modifiedDate: string;
    createdBy: string | null;
    modifiedBy: string;
}

export interface Pagination {
    page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
}

export interface DataElementData {
    data: DataElement[];
    pagination: Pagination;
}
