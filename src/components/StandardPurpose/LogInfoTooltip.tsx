import dayjs from "dayjs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface LogInfoProps {
  createdDate?: string;
  createdBy?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  publishedDate?: string;
  publishedBy?: string;
  modifiedByName?: string;
  createdByName?: string;
  publishedByName?: string;
}

const LogInfoTooltip: React.FC<LogInfoProps> = ({
  createdDate,
  createdBy,
  createdByName,
  modifiedDate,
  modifiedBy,
  modifiedByName,
  publishedDate,
  publishedBy,
  publishedByName,
}) => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const datimeformat = JSON.parse(localStorage.getItem("datetime") || "{}");
  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  return (
    <div className="relative flex items-center">
      <button
        className="flex items-center px-3 py-2 text-gray-600 bg-gray-100 rounded-md  hover:bg-gray-200"
        onClick={toggleTooltip}
      >
        <span className="mr-1 font-semibold">{t("purpose.standardPurpose.tabs.standardPurposeInfo.logInfo")}</span>
        <AiOutlineInfoCircle className="text-gray-500" />
      </button>

      {showTooltip && (
        <div className="absolute left-28 top-0 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50">
          {/* ลูกศรชี้ไปที่ปุ่ม */}
          <div className="absolute left-[-6px] top-4 w-3 h-3 rotate-45 bg-gray-900"></div>

          <div className="grid grid-cols-2 auto-rows-min gap-2 text-sm">
            <div>
              <div className="text-gray-300">{t("purpose.standardPurpose.tableHeaders.createdDate")}</div>
              <div className="font-semibold">
                {createdDate
                  ? dayjs(createdDate).format(`${datimeformat.dateFormat} ${datimeformat.timeFormat}`)
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-300">{t("purpose.standardPurpose.tableHeaders.createdBy")}</div>
              <div className="font-semibold">{createdByName ? createdByName : createdBy ? createdBy : "-"}</div>
            </div>
            <div>
              <div className="text-gray-300">{t("purpose.standardPurpose.tableHeaders.modifiedDate")}</div>
              <div className="font-semibold">
                {modifiedDate
                  ? dayjs(modifiedDate).format(`${datimeformat.dateFormat} ${datimeformat.timeFormat}`)
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-300">{t("purpose.standardPurpose.tableHeaders.modifiedBy")}</div>
              <div className="font-semibold">{modifiedByName ? modifiedByName : modifiedBy ? modifiedBy : "-"}</div>
            </div>
            <div>
              <div className="text-gray-300">{t("purpose.standardPurpose.tableHeaders.publishedDate")}</div>
              <div className="font-semibold">
                {publishedDate
                  ? dayjs(publishedDate).format(`${datimeformat.dateFormat} ${datimeformat.timeFormat}`)
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-300">{t("purpose.standardPurpose.tableHeaders.publishedBy")}</div>
              <div className="font-semibold">{publishedByName ? publishedByName : publishedBy ? publishedBy : "-"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogInfoTooltip;
