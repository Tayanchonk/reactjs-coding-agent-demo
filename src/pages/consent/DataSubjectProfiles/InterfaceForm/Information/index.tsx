import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IoTriangle } from "react-icons/io5";
import { formatDate, isDate } from "../../../../../utils/Utils";
import { useParams } from "react-router-dom";
import { getDataSubjectProfilesById } from "../../../../../services/dataSubjectProfileService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/index";

const Information: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [Info, setInfo] = useState<boolean>(false);
  const infoRef = useRef<HTMLDivElement>(null);
  const open = useSelector((state: RootState) => state.opensidebar.open);
  const [dataInfo, setDataInfo] = useState<any>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoRef]);

  useEffect(() => {
    getDataSubjectProfilesById(id ?? "")
      .then((response) => {
      console.log("🚀 ~ .then ~ response:", response)

        const receiptMap = new Map();
        // เช็คว่า dataReceipt มีค่าและเป็น array ก่อนเรียก forEach
        if (response.dataReceipt && Array.isArray(response.dataReceipt)) {
          response.dataReceipt.forEach((receipt: any) => {
            receiptMap.set(receipt.receiptId, {
              isAnonymizeDataElement: receipt.isAnonymizeDataElement,
              isDeleted: receipt.isDeleted,
            });
          });
        }

        // เพิ่ม properties ใหม่เข้าไปใน dataSubjectDataElements
        // เช็คว่า dataSubjectDataElements มีค่าและเป็น array ก่อนเรียก forEach
        if (response.dataSubjectDataElements && Array.isArray(response.dataSubjectDataElements)) {
          response.dataSubjectDataElements.forEach((element: any) => {
            const receiptData = receiptMap.get(element.receiptId);
            if (receiptData) {
              element.isAnonymizeDataElement = receiptData.isAnonymizeDataElement;
              element.isDeleted = receiptData.isDeleted;
            }
          });
        }


        // Handle the response data as needed
        const reduceDataSubjectDataElements = (data: any) => {
          const map = new Map();

          // วนลูปและใส่ Map โดย key เป็น dataElementTypeName
          // เช็คว่า dataSubjectDataElements มีค่าและเป็น array ก่อนเรียก forEach
          if (data.dataSubjectDataElements && Array.isArray(data.dataSubjectDataElements)) {
            data.dataSubjectDataElements.forEach((element: any) => {
              const typeName =
                element.dataElementInDataSubject?.[0]?.dataElementTypeName;
              if (typeName) {
                map.set(typeName, element); // ตัวท้ายสุดจะเขียนทับ
              }
            });
          }

          // คืนค่า object ใหม่ โดยเปลี่ยนเฉพาะ dataSubjectDataElements

          return {
            ...data,
            dataSubjectDataElements: Array.from(map.values()),
          };
        };        // ✨ เรียกใช้
        const newData = reduceDataSubjectDataElements(response);

        setDataInfo(response);
      })
      .catch((error) => {
        console.error("Error fetching data subject data:", error);
      });
  }, [id]);

  return (
    <div className="md:flex-row xl:flex">
      <div className=" md:w-full xl:w-5/12 bg-white rounded-md mx-1">
        <div className=" border-b p-5">
          <p className="font-semibold text-base">
            {t("dataSubjectProfile.information.profileInfo")}
          </p>
          <p className="pt-1">
            {t("dataSubjectProfile.information.profileInfoDesc")}
          </p>
          {dataInfo && (
            <button
              onClick={() => setInfo(true)}
              type="button"
              className="relative flex mb-2 md:mb-0 text-black bg-[#ECEEF0] font-medium rounded-lg text-base px-5 py-1.5 text-center  mt-3"
            >
              <p className="pr-1 text-base">
                {t("settings.organizations.create.loginfo")}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </button>
          )}

          {Info && (
            <div
              ref={infoRef}
              className={`arrow-box bg-black w-[325px] absolute left-[250px] text-white py-3 px-6 mt-[-85px] rounded rounded-lg`}
              style={{
                left: open ? "525px" : "250px",
              }}
            >
              <IoTriangle
                className="absolute top-[59px] left-[-10px] text-black"
                style={{ transform: "rotate(29deg)" }}
              />
              <div className="flex">
                <div className="w-6/12">
                  <p className="font-semibold text-base text-[gainsboro]">
                    {t("settings.organizations.create.createDate")}
                  </p>
                  <p className=" text-base pt-2">
                    {formatDate("datetime", dataInfo.createdDate)}
                    {/* {dataInfo.createdDate} */}
                  </p>
                  <p className="font-semibold text-base pt-2 text-[gainsboro]">
                    {t("settings.organizations.create.updateDate")}
                  </p>
                  <p className=" text-base pt-2">
                    {formatDate("datetime", dataInfo.modifiedDate)}
                  </p>
                </div>
                <div className="w-6/12">
                  <p className="font-semibold text-base text-[gainsboro]">
                    {t("settings.organizations.create.createdBy")}
                  </p>
                  <p className=" text-base pt-2">{dataInfo.createdByName}</p>
                  <p className="font-semibold text-base pt-2 text-[gainsboro]">
                    {t("settings.organizations.create.updatedBy")}
                  </p>
                  <p className=" text-base pt-2">{dataInfo.modifiedByName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex m-5 py-7">
          <div className="w-4/12 bg-[#3758F9] m-auto text-center py-5 rounded-md ">
            <p className="font-semibold text-base text-white">
              {t("dataSubjectProfile.transactions")}
            </p>
            <h1 className="text-white">{dataInfo?.transactionCount}</h1>
          </div>
          <div className="w-4/12 m-auto text-center rounded-md">
            <p className="font-semibold text-base ">
              {t("dataSubjectProfile.firstTransaction")}
            </p>
            <p className="">
              {dataInfo
                ? formatDate("datetime", dataInfo?.firstTransactionDate)
                : "-"}
            </p>
          </div>
          <div className="w-4/12 m-auto text-center  rounded-md ">
            <p className="font-semibold text-base ">
              {t("dataSubjectProfile.lastTransaction")}
            </p>
            <p className="">
              {dataInfo
                ? formatDate("datetime", dataInfo?.lastTransactionDate)
                : "-"}
            </p>
          </div>
        </div>
      </div>
      <div className="md:w-full xl:w-7/12">
        <div className="bg-white mx-1 mb-3 rounded-md">
          <div className="border-b px-5 py-3">
            <p className="text-base font-semibold">
              {t("dataSubjectProfile.information.profileOverAllInfo")} (
              {dataInfo ? 1 : 0})
            </p>
          </div>
          <div className="p-3 pb-7">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB]  text-left text-base font-semibold">
                  <th className="text-base font-semibold text-center px-5 py-3">
                    {t("dataSubjectProfile.information.mainProfile")}
                  </th>
                  <th className="text-base font-semibold px-5 py-3">
                    {t("dataSubjectProfile.information.profileIdentifier")}
                  </th>
                  <th className="text-base font-semibold px-5 py-3">
                    {t("dataSubjectProfile.information.dataElementType")}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-5 text-center py-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#3758F9"
                      className="size-6 mx-auto"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                  <td className="px-5 text-[#3758F9]">
                    {dataInfo?.profileIdentifier}
                  </td>
                  <td className="px-5 ">{dataInfo?.identifierType}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white mx-1 mb-1 rounded-md">
          <div className="bg-white mx-1 mb-3 rounded-md">
            <div className="border-b px-5 py-3">
              <p className="text-base font-semibold">
                {t("dataSubjectProfile.information.dataElements")} (
                {dataInfo?.dataSubjectDataElements.length
                  ? dataInfo?.dataSubjectDataElements.length
                  : 0}
                )
              </p>
            </div>
            <div className="p-3 px-16 pb-7 flex flex-wrap">
              {dataInfo?.dataSubjectDataElements.map(
                (item: any, index: number) => {
                  let optionSelected;
                  if (item.selectionJson !== null) {
                    optionSelected = JSON.parse(item.selectionJson);
                  }
                  if (
                    isDate(item.DataElementValue) &&
                    item?.dataElementInDataSubject?.[0]?.dataElementTypeName ===
                      "date"
                  ) {
                    item.DataElementValue = formatDate(
                      "date",
                      item.DataElementValue
                    );
                  }
                  return (
                    <div key={index} className="w-6/12 py-3">
                      <p className="font-semibold">
                        {item.dataElementInDataSubject[0].dataElementName}
                      </p>
                      <p className="text-[#3758F9]">
                        {item.isDeleted && item.isAnonymizeDataElement ? (
                          <p>******</p>
                        ) : item.isDeleted ? (
                          <p>Deleted</p>
                        ) : item.DataElementValue !== "--" ? (
                          item.DataElementValue
                        ) : (
                          optionSelected?.options?.map(
                            (option: any, index: number) => {
                              if (option?.selected === true) {
                                return (
                                  <p key={index} className="text-[#3758F9]">
                                    {option?.text}
                                  </p>
                                );
                              }
                            }
                          )
                        )}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Information;
