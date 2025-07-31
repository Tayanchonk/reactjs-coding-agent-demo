// ตัวเลือกใน prefPurposeSelectionJson.options
interface Option {
    text: string;
    order: number;
    value: string;
    selected: boolean;
  }
  
  // โครงสร้างของ prefPurposeSelectionJson
  interface PrefPurposeSelectionJson {
    options: Option[];
    channels: string[];
    selected: boolean;
    preferences: {
      language: string;
      frequency: string;
    };
  }
  
  // โครงสร้างของ preferencePurposeTransaction
  interface PreferencePurposeTransaction {
    preferencePurposeTransactionId: string;
    transactionId: string;
    preferencePurposeId: string;
    preferencePurposeName: string;
    prefPurposeSelectionJson: PrefPurposeSelectionJson;
    organizationId: string;
    isActiveStatus: boolean;
    createdDate: string;    // ISO date string
    modifiedDate: string;   // ISO date string
    createdBy: string;
    modifiedBy: string;
  }
  
  // โครงสร้างหลักของ Transaction
  interface Transaction {
    transactionId: string;
    receiptId: string;
    receiptDate: string;            // เพิ่มฟิลด์ receiptDate
    standardPurposeId: string;
    standardPurposeName: string;
    standardPurposeVersion: number;
    preferencePurposeTransaction: PreferencePurposeTransaction[];
    transactionStatusId: string;
    transactionStatusName: string;  // เพิ่มฟิลด์ transactionStatusName
    profileId: string;              // เพิ่มฟิลด์ profileId
    profileName: string;            // เพิ่มฟิลด์ profileName
    interfaceId: string;            // เพิ่มฟิลด์ interfaceId
    interfaceName: string;          // เพิ่มฟิลด์ interfaceName
    interfaceVersion: number;       // เพิ่มฟิลด์ interfaceVersion
    transactionDate: string;        // ISO date string
    consentDate: string;            // ISO date string
    expiryDate: string;             // ISO date string
    withdrawalDate: string | null;
    withdrawalReason: string | null;
    interactionTypeId: string;
    interactionTypeName: string;    // เพิ่มฟิลด์ interactionTypeName
    interactionBy: string;
    isTestMode: string;             // เช่น "Production" หรือ "Test"
    organizationId: string;
    isActiveStatus: boolean;
    createdDate: string;            // ISO date string
    modifiedDate: string;           // ISO date string
    createdBy: string;
    modifiedBy: string;
  }
  