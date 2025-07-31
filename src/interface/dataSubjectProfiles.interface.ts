

export interface IDataSubjectProfilesInterface {
    dataSubjectId: string,
    customerId: string,
    profileIdentifier: string,
    identifierType: string,
    firstTransactionDate: string,
    lastTransactionDate: string,
    isTestMode: boolean,
    organizationId: string,
    isActiveStatus: boolean,
    createdDate: string,
    modifiedDate: string,
    createdBy:string,
    modifiedBy: string,
    dataSubjectReceipts: null,
    dataSubjectTransactions: null,
    dataSubjectDataElements: null
    receiptCount: number,
    transactionCount: number,
}


