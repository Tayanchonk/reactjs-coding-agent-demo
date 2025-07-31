import { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import TabNavigation from "../../../components/CustomComponent/TabNavigation/PageTab";
import {
  getDataElementByID,
  createDataElement,
  updateDataElement,
  getDataElementNames
} from "../../../services/dataElement.Service";
import { getOrganizationChart } from "../../../services/organizationService";
import { getOrganization } from "../../../services/userService";
import { useConfirm, ModalType } from "../../../context/ConfirmContext";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Button } from "../../../components/CustomComponent";
import { organization } from "../../Settings/UsermanageMent/RoleAndPermission/interface";
import LoadingSpinner from "./../../../components/LoadingSpinner";

interface IOrganizations {
  customerId: string;
  organizationName: string;
  isActiveStatus: boolean;
}

interface IDataElementNames {
  dataElementId: string;
  dataElementName: string;
};

const DataElementForm = () => {
  const confirm = useConfirm();
  const { t, i18n } = useTranslation();
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const { mode, id } = useParams();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const [loading, setLoading] = useState(false);
  const [dataElementNames, setDataElementNames] = useState<IDataElementNames[]>([]);
  const [dataElement, setDataElement] = useState({
    dataElementId: "00000000-0000-0000-0000-000000000000",
    dataElementName: "",
    dataElementTypeName: "",
    isIdentifier: false,
    isPersonalData: false,
    selectionJson: {
      default: [""],
      options: [{ order: 1, text: "" }],
      multipleSelections: false,
    },
    translationJson: [],
    organizationId: "00000000-0000-0000-0000-000000000000",
    organizationName: "",
    customerId: "00000000-0000-0000-0000-000000000000",
    isActiveStatus: true,
    createdDate: "",
    modifiedDate: "",
    createdBy: "",
    modifiedBy: "",
    interfaceDataElementCount: 0,
    interfaceDataElements: [
      {
        interfaceDataElementId: "00000000-0000-0000-0000-000000000000",
        interfaceName: "",
        isActiveStatus: true,
        interfaceStatusName: ""
      },
    ],
  });
  const [organizations, setOrganizations] = useState<IOrganizations[]>([]);
  const [errors, setErrors] = useState({
    dataElementName: false,
    duplicateDataElementName: false,
    dataElementType: false,
    invalid: false,
    // dataElementOrganization: false
  });
  const navigate = useNavigate();

  const handleGetUser = async () => {
    setLoading(true);
    const resDataElement: any = await getDataElementByID(id);
    if (
      Object.keys(resDataElement.selectionJson).length === 0 &&
      resDataElement.selectionJson.constructor === Object
    ) {
      // If it's empty, update selectionJson to the default structure
      resDataElement.selectionJson = {
        default: [""],
        options: [{ order: 1, text: "" }],
        multipleSelections: false,
      };
    }
    setDataElement(resDataElement);
    setLoading(false);
  };

  const handleSave = async () => {
    if (
      dataElement.dataElementName === "" &&
      dataElement.dataElementTypeName === ""
    ) {
      setErrors({
        dataElementName: true,
        duplicateDataElementName: dataElementNames.some(el => el.dataElementName.toLowerCase() === dataElement.dataElementName.toLowerCase()),
        dataElementType: true,
        invalid: false,
      });
    } else if (dataElement.dataElementName === "") {
      setErrors({
        dataElementName: true,
        duplicateDataElementName: dataElementNames.some(el => el.dataElementName.toLowerCase() === dataElement.dataElementName.toLowerCase()),
        dataElementType: false,
        invalid: false,
      });
    } else if (dataElementNames.some(el => el.dataElementName.toLowerCase() === dataElement.dataElementName.toLowerCase())) {
      setErrors({
        dataElementName: false,
        duplicateDataElementName: dataElementNames.some(el => el.dataElementName.toLowerCase() === dataElement.dataElementName.toLowerCase()),
        dataElementType: false,
        invalid: false,
      });
    } else if (dataElement.dataElementTypeName === "") {
      setErrors({
        dataElementName: false,
        duplicateDataElementName: dataElementNames.some(el => el.dataElementName.toLowerCase() === dataElement.dataElementName.toLowerCase()),
        dataElementType: true,
        invalid: false,
      });
    } else if (
      !/^[a-zA-Z\u0E00-\u0E7F\s]+$/.test(dataElement.dataElementName)
    ) {
      // Allow English and Thai letters
      setErrors({
        dataElementName: false,
        duplicateDataElementName: false,
        dataElementType: false,
        invalid: true,
      });
    } else if (dataElement.dataElementTypeName === "Selection") {
      setErrors({
        dataElementName: false,
        duplicateDataElementName: false,
        dataElementType: false,
        invalid: false,
      });
      if (
        !dataElement.selectionJson.options.some(
          (option) =>
            option.text === "" ||
            dataElement.selectionJson.options.some(
              (option, i, arr) =>
                arr.filter((o) => o.text === option.text).length > 1
            )
        )
      )
        openConfirmModal();
    } else {
      setErrors({
        dataElementName: false,
        duplicateDataElementName: false,
        dataElementType: false,
        invalid: false,
      });
      openConfirmModal();
    }
  };

  useEffect(() => {
    handleGetOrganization(false);
  }, [orgparent]);

  const handleGetOrganization = async (isSetDefault: boolean) => {
    const resOrganization = await getOrganization();
    const defaultOrganize = resOrganization.find(
      (organize: any) => organize.organizationName === ""
    );
    if (isSetDefault)
      setDataElement((prevState: any) => ({
        ...prevState,
        organizationId: defaultOrganize.organizationId,
        organizationName: defaultOrganize.organizationName,
      }));
    const customerId = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") as string).customer_id
      : "";
    var res = await getOrganizationChart(customerId, orgparent);
    var org = res.data.data;
    const orgList: string[] = [];
    orgList.push(org[0].id);
    if (org[0].organizationChildRelationship.length > 0) {
      org[0].organizationChildRelationship.forEach((element: any) => {
        orgList.push(element.id);
        if (element.organizationChildRelationship.length > 0) {
          element.organizationChildRelationship.forEach((child: any) => {
            orgList.push(child.id);
            if (child.organizationChildRelationship.length > 0) {
              child.organizationChildRelationship.forEach((child2: any) => {
                orgList.push(child2.id);
              });
            }
          });
        }
      });
    }
    const filteredOrganizations = resOrganization.filter(
      (org: organization) =>
        orgList.includes(org.organizationId) ||
        org.organizationId === "00000000-0000-0000-0000-000000000000"
    );
    setOrganizations(
      filteredOrganizations
        .sort((a: any, b: any) =>
          a.organizationName.localeCompare(b.organizationName)
        )
        ?.filter((organization: any) => organization.isActiveStatus === true)
    );
  };

  const openConfirmModal = () => {
    // setConfirmTitle(t('modal.confirmSave'));
    // setConfirmDetail(t('modal.descriptionConfirmSave'));
    // setConfirmType(ModalType.Save);
    setIsConfirmModalOpen(true);
    // setConfirmAction(() => handleConfirm);
    // setConfirmSuccessMessage(t('modal.successConfirmSave'));
    // setConfirmErrorMessage(t('modal.errorConfirmSave'));
    confirm({
      modalType: ModalType.Save,
      onConfirm: async () => {
        handleConfirm();
      },
    });
  };

  const handleConfirm = async () => {
    setIsConfirmModalOpen(false);
    if (mode === "create") await createDataElement(dataElement);
    else if (mode === "edit") await updateDataElement(dataElement, id);
    setTimeout(() => {
      navigate("/consent/data-element");
    }, 3000);
  };

  const handleCancel = () => {
    confirm({
      title: t("roleAndPermission.confirmCancel"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmCancel"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      notify: false, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
      modalType: ModalType.Cancel, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        navigate(`/consent/data-element`);
      }, //จำเป็น
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };

  const handleGetDataElementNames = async () => {
    const resDataElementNames = await getDataElementNames();
    setDataElementNames(resDataElementNames);
  };

  const handleInitial = async () => {
    await handleGetOrganization(true);
    handleGetDataElementNames();
    if (id) {
      setErrors({
        dataElementName: false,
        duplicateDataElementName: false,
        dataElementType: false,
        invalid: false,
        // dataElementOrganization: false
      });
      // Fetch data element by ID
      handleGetUser();
    }
  };

  useEffect(() => {
    handleInitial();
    if (mode === "create") {
      if (!permissionPage?.isCreate) navigate("/consent/data-element");
    } else if (mode === "edit") {
      if (!permissionPage?.isUpdate) navigate("/consent/data-element");
    }
  }, []);

  // Dynamic tab names and links
  const tabNames = [
    t("dataelement.form.tabinfo"),
    t("dataelement.form.tabinterface"),
    t("dataelement.form.tabtranslation"),
  ];
  const tabLinks = [
    `/consent/data-element/${mode}${id ? "/" + id : ""}/info`,
    `/consent/data-element/${mode}${id ? "/" + id : ""}/interface`,
    `/consent/data-element/${mode}${id ? "/" + id : ""}/translation`,
  ];

  // Button text and styles based on mode
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  const isViewMode = mode === "view";

  const buttonText = !isCreateMode
    ? "Edit"
    : isCreateMode
      ? t("dataelement.form.edit")
      : t("dataelement.form.edit");
  const buttonColor = !isCreateMode
    ? "flex rounded ml-1 bg-[#111928] py-2 px-4 text-sm text-white hover:shadow-lg font-semibold"
    : "flex rounded ml-1 bg-[#3758F9] py-2 px-4 text-sm text-white hover:shadow-lg font-semibold";

  return (
    <div>
      {!loading ? (
        <div className="p-4 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            {/* Tab Navigation */}
            <TabNavigation names={tabNames} links={tabLinks} />
            {/* Action Buttons (Aligned to Right) */}
            <div className="flex space-x-2">
              <Button
                onClick={handleCancel}
                color="#DFE4EA"
                className="mr-2"
                variant="outlined"
              >
                <p className="text-sm">{t("cancel")}</p>
              </Button>
              {isViewMode && permissionPage?.isUpdate && (dataElement.interfaceDataElements.filter(x => x.interfaceStatusName == "Published").length === 0) && (
                <Button
                  onClick={() => {
                    navigate(`/consent/data-element/edit/${id}/info`);
                  }}
                  color="#111928"
                  variant="contained"
                >
                  <p className="text-white text-sm"> {t("edit")}</p>
                </Button>
              )}
              {!isViewMode && (
                <Button onClick={handleSave} variant="contained">
                  <p className="text-white text-sm"> {t("save")}</p>
                </Button>
              )}
            </div>
          </div>

          {/* Render Selected Tab Content */}
          <div className="p-6">
            <Outlet
              context={{
                dataElement,
                setDataElement,
                mode,
                id,
                errors,
                organizations,
              }}
            />
          </div>
          {/* <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title={confirmTitle}
                modalType={confirmType}
                detail={confirmDetail}
                onConfirm={confirmAction}
                successMessage={confirmSuccessMessage}
                errorMessage={confirmErrorMessage}
            ></ConfirmModal> */}

        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>

  );
};

export default DataElementForm;
