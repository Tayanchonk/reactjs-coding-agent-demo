import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/CustomComponent";
import { useNavigate } from "react-router-dom";
import { getConsentReportById } from "../../../../services/consentReportService";

const ModalCopy = ({
  openModalCopy,
  setOpenModalCopy,
  consentReportId,
  copyReportName,
  copyDescription,
}: {
  openModalCopy: boolean;
  setOpenModalCopy: React.Dispatch<React.SetStateAction<boolean>>;
  consentReportId: string;
  copyReportName: string;
  copyDescription: string;
}) => {
  console.log("🚀 ~ consentReportId:", consentReportId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [reportName, setReportName] = React.useState(copyReportName);
  const [description, setDescription] = React.useState(copyDescription);
  const [dataConsentReportById, setDataConsentReportById] =
    React.useState<any>(null);
  const handleCopyReport = () => {
    // Add logic for copying the report
    console.log("Copy report logic executed");
    navigate("/dashboard/report-data-subject-profile-consent/create-reports", {
      state: {
        reportName,
        description,
        status: "copy",
        consentReportId: consentReportId,
        data: dataConsentReportById,
      },
    });
    setOpenModalCopy(false); // Close the modal after copying

    // Redirect to the report page after copying
  };

  useEffect(() => {
    if (consentReportId === "") {
      getConsentReportById(consentReportId).then((res) => {
        console.log("🚀 ~ res:", res?.data?.data);
        setDataConsentReportById(res?.data?.data);
      });
    }
  }, [consentReportId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenModalCopy(false);
      }
    };

    if (openModalCopy) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModalCopy, setOpenModalCopy]);

  return (
    <>
      {openModalCopy && (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="relative p-4 w-full max-w-2xl max-h-full"
          >
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between py-6 px-10 border-b rounded-t dark:border-gray-600 border-gray-200">
                <div>
                  <h3 className="text-xl font-semibold ">
                    {t("reportDataSubjectProfileConsent.copyToNewReport")}
                  </h3>
                  <div className="text-gray-500 dark:text-gray-400 pt-2">
                    {t("reportDataSubjectProfileConsent.descCopyReport")}
                  </div>
                </div>
              </div>

              <div className="py-3 px-10 space-y-4">
                <p className="font-semibold text-base">
                  <span className="text-red-500">* </span>
                  {t("reportDataSubjectProfileConsent.reportName")}
                </p>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md dark:border-gray-600 text-base"
                  placeholder={t("reportDataSubjectProfileConsent.reportName")}
                  defaultValue={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
                <p className="font-semibold text-base">
                  <span className="text-red-500">* </span>{" "}
                  {t("roleAndPermission.descriptionInput")}
                </p>
                <textarea
                  id="description"
                  rows={4}
                  style={{ marginBottom: "25px" }}
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block pt-1 p-2.5 w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={t("roleAndPermission.description") + "..."}
                ></textarea>
              </div>
              <div className="flex justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <Button
                  className="rounded mx-1 bg-white py-2 px-4 text-base  border border-1 border-gray-200 text-blue font-medium"
                  onClick={() => setOpenModalCopy(!openModalCopy)}
                >
                  {t("roleAndPermission.cancel")}
                </Button>

                <Button
                  className=" rounded ml-1 bg-[#3758F9] py-2 px-4 text-base text-white font-semibold"
                  onClick={() => handleCopyReport()}
                >
                  {t("roleAndPermission.copy")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCopy;
