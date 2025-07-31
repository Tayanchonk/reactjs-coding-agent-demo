import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { IConsentInterface } from "../../interface/interface.interface";
import { CheckBox } from "../CustomComponent";
import { formatDate } from "../../utils/Utils";

interface Interface {
  selected: boolean;
  interfaceId: string;
  interfaceName: string;
  identifier: string;
  status: string;
  version: number;
  modifiedDate: string;
  modifiedByName: string;
  data?: IConsentInterface
}

interface UpdateInterfaceModalProps {
  isOpen: boolean;
  interfaces: any[];
  onClose: () => void;
  onUpdate: (selectInterfaces: Interface[]) => void;
}

const UpdateInterface: React.FC<UpdateInterfaceModalProps> = ({ isOpen, interfaces, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [selectInterfaces, setSelectInterfaces] = useState<Interface[]>([]);

  useEffect(() => {
    if (interfaces && interfaces.length > 0) {
      const updatedInterfaces = interfaces.map((interfaceItem) => {
        let identifier: string = "-";
        const pages = interfaceItem.builder ?? [];
        for (const page of pages) {
          for (const section of page.sections ?? []) {
            for (const content of section.contents ?? []) {
              if (content.isIdentifier) {
                identifier = content.element.selectedDataElement.dataElementTypeName;
                break;
              }
            }
            if (identifier !== "-") break;
          }
          if (identifier !== "-") break;
        }
        return ({
          selected: false,
          interfaceId: interfaceItem.interfaceId,
          interfaceName: interfaceItem.interfaceName,
          identifier: identifier,
          status: interfaceItem.interfaceStatusName,
          version: interfaceItem.versionNumber,
          modifiedDate: interfaceItem.modifiedDate || "",
          modifiedByName: interfaceItem.modifiedByName || "",
          data: interfaceItem,
        })
      });
      setSelectInterfaces(updatedInterfaces);
    }
  }, [interfaces]);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectInterfaces((prevInterfaces) =>
      prevInterfaces.map((item) =>
        item.interfaceId === id ? { ...item, selected: checked } : item
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectInterfaces((prevInterfaces) =>
      prevInterfaces.map((item) => ({ ...item, selected: checked }))
    );
  };

  function getStatusStyle(status: string) {
    switch (status) {
      case "Draft":
        return "text-gray-600 bg-gray-200";
      case "Retired":
        return "text-red-600 bg-red-100";
      case "Published":
        return "text-green-600 bg-green-100";
      case "Unpublished":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-200";
    }
  }

  const allSelected = selectInterfaces.length > 0 && selectInterfaces.every(item => item.selected);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full">
        <div className="items-start gap-2 pt-6 pr-6 pl-6">
          <h2 className="text-xl font-semibold">{t("purpose.standardPurpose.updateInterface.title")}</h2>
          <p className="text-gray-600 text-base mt-1">
            {t("purpose.standardPurpose.updateInterface.description")}
          </p>
        </div>
        <div className="p-4 rounded-md pr-6 pl-6">
          <table className="w-full text-left text-base">
            <thead className="bg-[#f9fafb]">
              <tr className="py-2 whitespace-nowrap px-4 border-b border-[#e5e7eb] text-left">
                <th className="py-2 px-4">
                  <CheckBox
                    shape="square"
                    className="cursor-pointer "
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e)}
                  />
                </th>
                <th>
                  <div className="w-full flex items-center justify-start">
                    <span className="text-base font-semibold"> {t("purpose.standardPurpose.updateInterface.table.interfaceName")} </span>
                  </div>
                </th>
                <th>
                  <div className="w-full flex items-center justify-start">
                    <span className="text-base font-semibold"> {t("purpose.standardPurpose.updateInterface.table.identifier")} </span>
                  </div></th>
                <th>
                  <div className="w-full flex items-center justify-start">
                    <span className="text-base font-semibold">  {t("purpose.standardPurpose.updateInterface.table.status")}  </span>
                  </div>
                </th>
                <th>
                  <div className="w-full flex items-center justify-start">
                    <span className="text-base font-semibold">  {t("purpose.standardPurpose.updateInterface.table.version")}  </span>
                  </div>
                </th>
                <th>
                  <div className="w-full flex items-center justify-start">
                    <span className="text-base font-semibold">  {t("purpose.standardPurpose.updateInterface.table.modifiedBy")}  </span>
                  </div>
                </th>
                <th>
                  <div className="w-full flex items-center justify-start">
                    <span className="text-base font-semibold">  {t("purpose.standardPurpose.updateInterface.table.modifiedDate")}  </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {selectInterfaces.map((interfaceItem) => (
              <tr key={interfaceItem.interfaceId} className="py-2 whitespace-nowrap px-4 border-b border-[#e5e7eb] text-left">
                <td className="py-2 px-4">
                  <CheckBox
                    shape="square"
                    className="cursor-pointer "
                    checked={interfaceItem.selected}
                    onChange={(e) => { handleCheckboxChange(interfaceItem.interfaceId, e) }}
                  />
                </td>
                <td>
                  <div className="flex items-center" onClick={() => {
                    window.open(`/consent/consent-interface/view/${interfaceItem.interfaceId}/info`, '_blank', 'noopener,noreferrer');
                  }}>
                    <div className="relative group ml-2 justify-start">
                      <p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{interfaceItem.interfaceName}</p>
                      <div
                        className="absolute bottom-full left-0 translate-y-[-6px] z-50 
				   hidden group-hover:inline-block bg-gray-800 text-white text-xs rounded py-1 px-2 
				   shadow-lg break-words min-w-max max-w-[300px]"
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word"
                        }}
                      >
                        {interfaceItem.interfaceName}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{interfaceItem.identifier}</td>
                <td>
                  <span className={`px-2 py-1 text-base rounded-md ${getStatusStyle(interfaceItem.status)}`}>
                    {interfaceItem.status}
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 text-base rounded-md">
                    {t("purpose.standardPurpose.version")} {interfaceItem.version}
                  </span>
                </td>
                <td>{interfaceItem.modifiedByName}</td>
                <td>{formatDate("datetime", interfaceItem.modifiedDate)}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr className="border-t border-gray-200 w-full" />
        <div className="mt-3 flex justify-end gap-2 pr-6 pl-6 pb-4">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
            {t("purpose.standardPurpose.updateInterface.btn.cancel")}
          </button>
          <button onClick={() => onUpdate(selectInterfaces)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {t("purpose.standardPurpose.updateInterface.btn.update")}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateInterface;
