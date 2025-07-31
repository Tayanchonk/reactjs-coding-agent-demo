import { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import TabNavigation from "../../../../components/CustomComponent/TabNavigation/PageTab";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Button } from "../../../../components/CustomComponent";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import { getOrganizationChart } from "../../../../services/organizationService";
import { getOrganization } from "../../../../services/userService";
import {
  IOrganizations,
} from "../../../../interface/interface.interface";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setIntDataSubjectPurpose } from "../../../../store/slices/dataSubjectSlice";
import { useLocation } from "react-router-dom";

const DataSubjectProfileInterfaceForm = () => {
  const location = useLocation();
console.log('xxx',location.state?.purposeName);
  const confirm = useConfirm();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const { mode, id } = useParams();
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const [isLoading, setIsLoading] = useState(true);

    const language = useSelector(
        (state: RootState) => state.language.language
    );
  const section = useSelector(
    (state: RootState) => state.sectionPersonalDataBuilderAndBranding.sections
  );
  const sectionConsent = useSelector(
    (state: RootState) => state.sectionConsentDataBuilderAndBranding.sections
  );
  const page = useSelector(
    (state: RootState) => state.pageBuilderAndBranding.pages
  );

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );


  const [organizations, setOrganizations] = useState<IOrganizations[]>([]);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const tabNames = [
    t("dataSubjectProfile.tab.information"),
    t("dataSubjectProfile.tab.purposes"),
    t("dataSubjectProfile.tab.reciepts"),
    t("dataSubjectProfile.tab.transactions"),
  ];
  const tabLinks = [
    `/consent/data-subject/${mode}${id ? "/" + id : ""}/information`,
    `/consent/data-subject/${mode}${id ? "/" + id : ""}/purposes`,

    `/consent/data-subject/${mode}${id ? "/" + id : ""}/receipts`,
    `/consent/data-subject/${mode}${id ? "/" + id : ""}/transactions`,

    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/integration`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/receipt`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/transactions`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/setting`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/translation`,
  ];




  const handleCancel = () => {
    confirm({
      title: t("roleAndPermission.confirmCancel"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmCancel"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      notify: false, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
      modalType: ModalType.Cancel, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        navigate(`/consent/data-subject`);
      }, //จำเป็น
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };











  useEffect(() => {
    handleGetOrganization(false);

  }, [orgparent]);

  const handleGetOrganization = async (isSetDefault: boolean) => {
    const resOrganization = await getOrganization();
    const defaultOrganize = resOrganization.find(
      (organize: any) => organize.organizationName === ""
    );
 
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
      (org: IOrganizations) =>
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

  const handleInitial = async () => {
    await handleGetOrganization(true);
    if (id) {
      setErrors({
        info: { interfaceName: false },
        builderAndBranding: {},
        translation: {},
      });
      // Fetch consent interface
    //   await handleGetInterface(id);
    //   await handleGetVersions(id);
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };
  


  useEffect(() => {
    handleInitial();
  }, [id, orgparent]);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    dispatch(setIntDataSubjectPurpose())
  
    
  },[]);

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="flex justify-between items-center px-6 border-b">
        <TabNavigation names={tabNames} links={tabLinks} />
        {/* <div className="absolute top-[120px] right-6 z-1 flex space-x-2 bg-white">
        
        
          <Button
            onClick={handleCancel}
            color="#DFE4EA"
            className="mr-2"
            variant="outlined"
          >
            <p className="text-base">{t("cancel")}</p>
          </Button>
          {
            isView &&
            permissionPage?.isUpdate && (
              <Button
                onClick={() => {
                  navigate(`/consent/data-subject/edit/${id}/information`);
                }}
                color="#111928"
                variant="contained"
              >
                <p className="text-white text-base">{t("edit")}</p>
              </Button>
            )}

   
           { isEdit &&
         
              <Button onClick={()=>{}} variant="contained">
                <p className="text-white text-base">{t("save")}</p>
              </Button>}
          

        </div> */}
      </div>
      <div className="p-6 bg-[#f8f8fb]">
        {isLoading ?
          <LoadingSpinner /> :
          <Outlet
            context={{
              mode,
              id,
              errors,
              organizations,
              permissionPage,
              isLoading,
            }}
          />}
      </div>
     
    
    </div>
  );
};

export default DataSubjectProfileInterfaceForm;