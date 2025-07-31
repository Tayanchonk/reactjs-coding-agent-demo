import React, { useEffect, useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { Button, CheckBox, InputText } from "../CustomComponent"; // สมมติว่า CustomComponent อยู่ใน path นี้

interface PreferencePurpose {
  preferencePurposeId: string;
  preferencePurposeName: string;
  description: string;
  selectionJson: string;
  organizationId: string;
  isRequired: boolean;
  translationJson: string;
  customerId: string;
  isActiveStatus: boolean;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
}

interface InitialDataItem {
  csPreferencePurpose: PreferencePurpose;
  createdByFirstName: string;
  createdByLastName: string;
  modifiedByFirstName: string;
  modifiedByLastName: string;
  organizationName?: string;
  standardPreferenceCount?: number;
}

const PreferenceModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selected: InitialDataItem[]) => void;
  initialData: InitialDataItem[];
}) => {
  const [selectedPreferences, setSelectedPreferences] = useState<InitialDataItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) {
      setSelectedPreferences([]);
      setSearchQuery("");
    }
  }, [isOpen]);

  const preferencesOptions = useMemo(() => {
    return initialData.map((item) => ({
      id: item.csPreferencePurpose.preferencePurposeId,
      label: item.csPreferencePurpose.preferencePurposeName,
      ...item,
    }));
  }, [initialData]);

  const filteredOptions = useMemo(() => {
    return preferencesOptions.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, preferencesOptions]);

  const toggleSelect = (selectedItem: InitialDataItem) => {
    setSelectedPreferences((prev) => {
      const isSelected = prev.some((item) => item.csPreferencePurpose.preferencePurposeId === selectedItem.csPreferencePurpose.preferencePurposeId);
      return isSelected
        ? prev.filter((item) => item.csPreferencePurpose.preferencePurposeId !== selectedItem.csPreferencePurpose.preferencePurposeId)
        : [...prev, selectedItem];
    });
  };

  const removeTag = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.filter((item) => item.csPreferencePurpose.preferencePurposeId !== id)
    );
  };

  const isSelected = (id: string) =>
    selectedPreferences.some((item) => item.csPreferencePurpose.preferencePurposeId === id);

  const toggleSelectAll = () => {
    setSelectedPreferences((prev) =>
      prev.length === filteredOptions.length ? [] : filteredOptions
    );
  };

  const handleSave = () => {
    onSave(selectedPreferences);
    setSelectedPreferences([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-[600px] flex flex-col transition-all duration-300">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("purpose.standardPurpose.preferenceModal.title")}</h2>
            <button onClick={onClose}>
              <IoMdClose size={20} />
            </button>
          </div>
          <p className="text-base text-gray-500 mt-1">
            {t("purpose.standardPurpose.preferenceModal.description")}
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          <label className="text-base font-semibold text-black">
            <span className="text-red-500">*</span>   {t("purpose.standardPurpose.preferenceModal.preferenceName")}
          </label>
          <div className="mt-2 relative">
            <div className="relative z-10">
              <InputText
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => setIsDropdownOpen(true)}
                placeholder={t("purpose.standardPurpose.preferenceModal.selectPlaceholder")}
                className="w-full border rounded-md px-4 py-2"
              />
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 z-10"
              >
                {isDropdownOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </button>
            </div>

            {isDropdownOpen && filteredOptions.length > 0 && (
              <div className="relative w-full mt-0 p-0 bg-white border rounded-md max-h-60 overflow-y-auto ">
                {/* Select All */}
                <div className="p-2">
                  {/* แก้ไข: ใส่ onClick ที่ label, เอา onChange ออกจาก CheckBox */}
                  <label
                    className="flex items-center gap-4 pl-2 cursor-pointer"
                    onClick={toggleSelectAll} // <--- ใส่ onClick ที่นี่
                  >
                    <CheckBox
                      shape="square"
                      checked={selectedPreferences.length === filteredOptions.length && filteredOptions.length > 0}
                      // onChange={toggleSelectAll} // <--- เอา onChange ออก
                    />
                    <span className="text-gray-900 font-medium">{t("purpose.standardPurpose.preferenceModal.selectAll")}</span>
                  </label>
                </div>
                <hr className="w-[96%] mx-auto border-gray-200" />
                {/* List Items */}
                {filteredOptions.map((option, index) => (
                  <div key={option.id}>
                    {/* แก้ไข: ใส่ onClick ที่ label, เอา onChange ออกจาก CheckBox */}
                    <label
                      onClick={() => toggleSelect(option)} // <--- ใส่ onClick ที่นี่
                      className={`flex items-center space-x-4 px-4 py-2 cursor-pointer hover:bg-gray-100 
                      ${index !== filteredOptions.length - 1 ? "" : ""}`}
                    >
                      <CheckBox
                        shape="square"
                        checked={isSelected(option.id)}
                        // onChange={() => toggleSelect(option)} // <--- เอา onChange ออก
                      />
                      <span className="text-gray-900 truncate">{option.label}</span>
                    </label>
                    {index !== filteredOptions.length - 1 && (
                      <hr className="w-[96%] mx-auto border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPreferences.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 w-full">
              {selectedPreferences.map((item) => (
                <span key={item.csPreferencePurpose.preferencePurposeId} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-base flex items-center gap-2">
                  {item.csPreferencePurpose.preferencePurposeName}
                  <button onClick={() => removeTag(item.csPreferencePurpose.preferencePurposeId)} className="text-gray-600 hover:text-gray-600">
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-6 flex justify-end gap-2">
          <Button className="px-4 py-2 border rounded-md" onClick={onClose}>
            {t("purpose.standardPurpose.preferenceModal.actions.cancel")}
          </Button>
          <Button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={handleSave}>
            {t("purpose.standardPurpose.preferenceModal.actions.save")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default PreferenceModal;