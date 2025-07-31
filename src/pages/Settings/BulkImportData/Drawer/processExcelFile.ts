import * as XLSX from "xlsx";
import { IBulkImportDataSubjectWithConsentData } from "../../../../interface/bulkImportData.interface";

class processExcelFile {
  constructor() {
    // Constructor logic if needed
  }

  private parseFieldName(fieldName: string, placeholder: string = "", value: any = "") {
    // Create a base result object
    let result: IBulkImportDataSubjectWithConsentData = {
      originalField: fieldName,
      data: value || "",
      isRequired: false,
      isIdentifier: false,
      fieldType: "none",
    };

    let processedFieldName = fieldName;    // Check if field is required (has leading *)
    if (fieldName.startsWith("*")) {
      result.isRequired = true;
      // Remove * from field name for further processing
      processedFieldName = fieldName.substring(1);
      
      // Check if required field has a value
      if (value === undefined || value === null || value === "") {
        console.warn(`Required field "${fieldName}" is empty`);
        throw new Error(`Required field "${fieldName}" cannot be empty`);
      }
    }
    
    // Also check if the field is marked as required in the result and has an empty value
    if (result.isRequired && (value === undefined || value === null || value === "")) {
      console.warn(`Required field "${fieldName}" is empty`);
      throw new Error(`Required field "${fieldName}" cannot be empty`);
    }

    // Handle special case: ConsentDate
    if (processedFieldName === "ConsentDate") {
      result.fieldName = "ConsentDate";
      return result;
    }

    // Check if field contains underscore
    if (processedFieldName.includes("_")) {
      const [prefix, ...nameParts] = processedFieldName.split("_");

      // Validate the field format
      if (nameParts.length === 0) {
        throw new Error("Some value or data had invalid.");
      }

      if (prefix === "PP") {
        // Store the preference purpose name (last part of the name parts)
        const preferencePurpose = nameParts[nameParts.length - 1] || "";
        result.fieldName = preferencePurpose;

        // Extract and store standard purpose name if there are multiple parts
        if (nameParts.length > 1) {
          // Join all parts except the last one as the standard purpose name
          const standardPurposeName = nameParts
            .slice(0, nameParts.length - 1)
            .join(" ");
          result.standardPurposeName = standardPurposeName;
        }
      } else {
        const actualName = nameParts.join(" ");
        result.fieldName = actualName;
      }

      // Check prefixes for field type
      if (prefix === "DE") {
        result.fieldType = "data_element";
        
        // For data elements, validate date format if placeholder contains DD/MM/YYYY
        if (placeholder && placeholder.includes("DD/MM/YYYY") && value) {
          // Check if the value matches DD/MM/YYYY format
          const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
          if (!datePattern.test(value)) {
            throw new Error(`Field "${fieldName}" must be in DD/MM/YYYY format`);
          }
          
          // Further validate that the date is actually valid
          const [_, day, month, year] = value.match(datePattern) || [];
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          
          if (isNaN(date.getTime())) {
            throw new Error(`Field "${fieldName}" contains an invalid date`);
          }

          result.dataElementTypeName = "Date";
        }
      } else if (prefix === "SP") {
        result.fieldType = "standard_purpose";
      } else if (prefix === "PP") {
        result.fieldType = "preference_purpose";
      } else if (prefix === "DataSubjectIdentifier") {
        result.fieldType = "data_element";
        result.isIdentifier = true;
      } else {
        // If prefix doesn't match any expected value, throw error
        throw new Error("Some value or data had invalid.");
      }
    } else if (processedFieldName !== "ConsentDate") {
      // If there's no underscore and it's not ConsentDate, throw error
      throw new Error("Some value or data had invalid.");
    }

    return result;
  }

  /**
   * Validates if a filename follows the pattern ${someName}_${uuid}_${versionNumber}
   * @param fileName - The filename to validate
   * @returns boolean - True if the file follows the pattern, false otherwise
   */
  private validateFileNameFormat(fileName: string): boolean {
    // Remove file extension
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

    // Split by underscore
    const parts = nameWithoutExtension.split("_");

    // We need at least 3 parts: someName, uuid, versionNumber
    if (parts.length < 3) {
      return false;
    }

    // Extract the parts
    const someName = parts.slice(0, parts.length - 2).join("_"); // In case the name itself contains underscores
    const uuid = parts[parts.length - 2];
    const versionNumber = parts[parts.length - 1];

    // UUID validation: should be a valid uuid format
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUuid = uuidPattern.test(uuid);

    // Version validation: should be a number
    const isValidVersion = /^\d+$/.test(versionNumber);

    // Name validation: should not be empty
    const isValidName = someName.trim().length > 0;

    return isValidName && isValidUuid && isValidVersion;
  }

  /**
   * Validates an Excel file based on its name format
   * @param file - The file to validate
   * @returns {Object} - Contains isValid boolean and errorMessage string if invalid
   */
  public validateExcelFile(file: File): {
    isValid: boolean;
    errorType?: "type" | "name" | "noFile";
  } {
    if (!file) {
      return { isValid: false, errorType: "noFile" };
    }

    // Check if it's an Excel file
    if (
      !(
        file.type.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      )
    ) {
      return { isValid: false, errorType: "type" };
    }
    // Validate format for .xlsx files only
    if (file.name.endsWith(".xlsx")) {
      const isValidFormat = this.validateFileNameFormat(file.name);
      if (!isValidFormat) {
        return {
          isValid: false,
          errorType: "name",
        };
      }
    }

    return { isValid: true };
  }

  public otherType(
    file: File
  ): Promise<{ data: any[]; sheetInfo: { name: string; rowCount: number }[] }> {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            // Initialize sheet information array
            let sheetInfo: { name: string; rowCount: number }[] = [];

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            // Get all rows, including empty ones
            const allRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            // Filter out rows where all values are empty
            const jsonData = allRows.filter((row: any) =>
              Object.values(row).some(
                (value) => value !== "" && value !== null && value !== undefined
              )
            );

            sheetInfo.push({
              name: firstSheetName,
              rowCount: jsonData.length,
            });

            resolve({
              data: jsonData,
              sheetInfo,
            });
          } catch (error) {
            console.error("Error processing Excel file:", error);
            reject(
              new Error(
                error instanceof Error
                  ? error.message
                  : "Unknown error processing Excel file"
              )
            );
          }
        };

        reader.onerror = () => {
          reject(new Error("Error reading file"));
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Processes Excel files and extracts data from specified sheets
   * @param file The Excel file to process
   * @param targetSheetNames List of sheet names to focus on (will fall back to all sheets if not found)
   * @returns Object containing the combined data array and sheet information
   */
  public dataSubjectWithConsent(
    file: File,
    targetSheetNames: string[] = ["page1"] // Only process the first sheet
  ) {
    try {
      return new Promise<{
        data: IBulkImportDataSubjectWithConsentData[][];
        sheetInfo: { name: string; rowCount: number }[];
      }>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          try {
            const binaryData = new Uint8Array(e.target.result);
            const workbook = XLSX.read(binaryData, { type: "array" });
            
            // Initialize combined data array
            let combinedData: IBulkImportDataSubjectWithConsentData[][] = [];
            let sheetInfo: { name: string; rowCount: number }[] = [];
            
            // Create a map to store field placeholders from Sheet 2
            const fieldPlaceholders = new Map<string, string>();
            
            // Process Sheet 2 (Header Info) if it exists
            if (workbook.SheetNames.length > 1) {
              const headerInfoSheetName = workbook.SheetNames[1];
              const headerInfoWorksheet = workbook.Sheets[headerInfoSheetName];
              
              // Parse the header info sheet
              const headerInfoData = XLSX.utils.sheet_to_json(headerInfoWorksheet, {
                defval: "",
                raw: false,
              });
              
              // Extract field names and descriptions (placeholders)
              headerInfoData.forEach((row: any) => {
                Array.from(Object.entries(row)).forEach(([fieldName, placeholder]) => {
                  if (fieldName && placeholder) {
                    // Store the field name and its placeholder in the map
                    fieldPlaceholders.set(fieldName, String(placeholder));
                  }
                });
              });
            }

            // Function to process a worksheet properly
            const processSheet = (
              worksheet: XLSX.WorkSheet,
              sheetName: string
            ) => {
              // Get header row to check if there are columns
              const range = XLSX.utils.decode_range(
                worksheet["!ref"] || "A1:A1"
              );
              const headers: string[] = [];

              // Extract header row (first row)
              for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell =
                  worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
                headers.push(cell ? String(cell.v) : "");
              }

              // Get data with headers from first row
              const sheetData = XLSX.utils.sheet_to_json(worksheet, {
                defval: "",
                raw: false, // To ensure proper string handling
              });

              // Filter out rows where all values are empty
              const filteredData = sheetData.filter((row: any) =>
                Object.values(row).some(
                  (value) =>
                    value !== "" && value !== null && value !== undefined
                )
              );

              // Create a result array - we'll process all rows
              let resultData: any[] = [];

              // Process all rows in filtered data
              if (filteredData.length > 0) {
                resultData = filteredData; // Process all rows
              } else if (headers.filter((h) => h).length > 0) {
                // If we have headers but no data, create an empty data object with headers as keys
                const emptyDataObject: any = {};
                headers.forEach((header) => {
                  if (header) {
                    emptyDataObject[header] = "";
                  }
                });
                resultData = [emptyDataObject];
              }
              
              // Transform the data using the parseFieldName function
              const transformedData = resultData.map((row) => {
                // Create an array to directly hold field objects
                const fields: IBulkImportDataSubjectWithConsentData[] = [];

                // Process each field in the row
                Object.entries(row).forEach(([fieldName, value]) => {
                  if (fieldName !== "__sheetName") {
                    try {
                      // Get the placeholder for this field, if available
                      const placeholder = fieldPlaceholders.get(fieldName) || "";
                      
                      // Parse the field name according to our rules, passing the placeholder
                      const parsedField = this.parseFieldName(fieldName, placeholder, value);

                      

                      // Add the parsed field directly to the fields array
                      fields.push(parsedField);
                    } catch (err) {
                      // Throw the error with the sheet name for better context
                      const errorMessage = `Invalid field format in sheet "${sheetName}": ${
                        err instanceof Error
                          ? err.message
                          : "Invalid field format detected"
                      }`;
                      throw new Error(errorMessage);
                    }
                  }
                });

                // Ensure we have fields in this row
                if (fields.length === 0) {
                  console.warn(
                    `Row in sheet "${sheetName}" has no valid fields`
                  );
                }

                return fields; // Return fields array directly without wrapping in an object
              });

              // Store sheet info - we count the actual filtered data rows for reporting
              sheetInfo.push({
                name: sheetName,
                rowCount: filteredData.length,
              });

              return transformedData;
            };
            
            // Only process the first sheet in the workbook, but process ALL rows in that sheet
            if (workbook.SheetNames.length > 0) {
              const firstSheetName = workbook.SheetNames[0];

              const worksheet = workbook.Sheets[firstSheetName];
              const sheetData = processSheet(worksheet, firstSheetName);
              // Add validation to ensure there are no duplicate identifiers in the data
              const identifierMap = new Map();

              // First check identifiers within the current sheet
              for (let i = 0; i < sheetData.length; i++) {
                const row = sheetData[i];
                
                // Find identifier fields in this row
                const identifierFields = row.filter(field => field.isIdentifier);
                
                // Check each identifier field
                for (const field of identifierFields) {
                  const identifierValue = field.data;
                  
                  // Skip empty values
                  if (!identifierValue) continue;
                  
                  // Check if this identifier value already exists
                  if (identifierMap.has(identifierValue)) {
                    reject(new Error(`Duplicate identifier found: "${identifierValue}" appears more than once in the data`));
                    return;
                  }
                  
                  // Store this identifier value
                  identifierMap.set(identifierValue, true);
                }
              }

              // Then check against previously processed data in combinedData
              for (const existingRow of combinedData.flat()) {
                // Check only identifier fields
                if (existingRow.isIdentifier) {
                  const identifierValue = existingRow.data;
                  
                  // Skip empty values
                  if (!identifierValue) continue;
                  
                  // Check if this value exists in current sheet
                  if (identifierMap.has(identifierValue)) {
                    reject(new Error(`Duplicate identifier found: "${identifierValue}" appears more than once across sheets`));
                    return;
                  }
                }
              }
              

              if (sheetData && sheetData.length > 0) {
                // Add the processed data to our array
                combinedData = [...combinedData, ...sheetData];
              } else {
                console.warn("No valid data found in the first sheet");
                reject(new Error("No valid data found in the sheet"));
                return;
              }
            } else {
              console.warn("No sheets found in the workbook");
              reject(new Error("No sheets found in the workbook"));
              return;
            }

            // We no longer reject based on empty data, as we're now handling empty sheets
            // by creating objects with empty string values for each column
            if (combinedData.length === 0) {
              console.warn(
                "No sheets with valid headers found in the Excel file"
              );
              reject(new Error("No valid sheets found"));
              return;
            }

            resolve({
              data: combinedData,
              sheetInfo,
            });
          } catch (error) {
            console.error("Error processing Excel file:", error);
            reject(
              new Error(
                error instanceof Error
                  ? error.message
                  : "Unknown error processing Excel file"
              )
            );
          }
        };

        reader.onerror = () => {
          reject(new Error("Error reading file"));
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error("Error in processExcelFile:", error);
      throw error;
    }
  }
}

export default new processExcelFile();
