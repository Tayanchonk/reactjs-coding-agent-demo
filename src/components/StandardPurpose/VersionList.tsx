import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt, FaChevronLeft } from "react-icons/fa";
import { DeleteStandardPurpose } from "../../services/standardPurposeService";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useConfirm, ModalType } from "../../context/ConfirmContext";

export interface Version {
  id: string;
  title: string;
  modifiedDate: string;
  version: string;
  status: string;
}

interface VersionListProps {
  data: Version[];
  onClose: () => void;
  desc?: string;
  onSelect?: (version: Version) => void;
  onDelete?: (version: Version) => void;
}

const VersionList: React.FC<VersionListProps> = ({ data, onClose, onSelect, onDelete, desc }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleDeleteVersion = async (id: string) => {
    confirm({
      modalType: ModalType.Delete,
      onConfirm: async () => {
        var detedata = await DeleteStandardPurpose(id, JSON.parse(sessionStorage.getItem("user") as string).user_account_id);
        navigate("/consent/purpose/standard-purpose")
      }
    });
  };

  const handleExpandVersion = (version: any) => {
    handleClose()
    if (version.status === "Draft") {
      navigate("/consent/purpose/standard-purpose/edit-spurpose/" + version.id)
    } else {
      navigate("/consent/purpose/standard-purpose/view-spurpose/" + version.id)
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <div
        className={`w-[500px] h-full flex flex-col shadow-lg bg-white transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="bg-white p-4 border-b ml-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("purpose.standardPurpose.versions.title")}</h2>
            <button
              className=" text-base flex justify-end absolute mt-[10px] w-[30px] right-[22px] top-[15px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
              onClick={() =>
                handleClose()
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6 h-[30px] w-[30px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-base text-gray-500">{desc ? desc : t("purpose.standardPurpose.versions.description")}</p>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto m-4 rounded-lg">
          {data.sort((a, b) => parseFloat(b.version) - parseFloat(a.version)).map((version) => (
            <div
              key={version.id}
              className="relative bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center border"
            >
              {/* Left Arrow Button */}
              <button
                className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-transparent hover:bg-gray-200 rounded-l-lg"
                onClick={() => onSelect ? onSelect(version) : handleExpandVersion(version)}
              >
                <FaChevronLeft className="text-gray-400" />
              </button>

              <div className="flex-1 pl-12">
                <h3 className="text-base font-semibold">{version.title}</h3>
                <p className="text-base text-gray-500"><span className="text-gray-700 font-semibold pr-1">{t("purpose.standardPurpose.versions.modifiedDate")}</span>  {version.modifiedDate}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 text-base rounded-md">
                    {t("purpose.standardPurpose.version")} {version.version}
                  </span>
                  <span
                    className={`px-2 py-1 text-base rounded-md ${getStatusStyle(version.status)}`}
                  >
                    {version.status}
                  </span>
                </div>
              </div>

              {version.status == "Draft" && (
                <button
                  onClick={() => onDelete ? onDelete(version) : handleDeleteVersion(version.id)}
                  className="absolute bottom-3 right-2 text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt className="w-6 h-6" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersionList;

