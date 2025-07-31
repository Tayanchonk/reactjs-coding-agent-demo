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
import notification from "../../../../utils/notification";

import {
  IConsentInterface,
  IOrganizations,
} from "../../../../interface/interface.interface";
import {
  getConsentInterfaceByID,
  createConsentInterface,
  updateConsentInterface,
  deleteConsentInterface,
  GetVersions,
  CreateInterfaceNewVersion,
  GetPageTypes,
} from "../../../../services/consentInterfaceService";
import { Menu } from "@headlessui/react";
import { BsClock, BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { TbFileSearch } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import VersionList, { Version } from "../../../../components/StandardPurpose/VersionList";
import { formatDate, mapSectionsWithContentsForBuilderBranding } from "../../../../utils/Utils";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Copyto, PopupPublish, PopupUnpublish } from "../../../../components/interfaceComponent";
import { setDataBuilderAndBranding } from "../../../../store/slices/dataBuilderAndBrandingSlice";
import { setIntPage, setPage } from "../../../../store/slices/pageBuilderAndBrandingSlice";
import { setIntSection, setSectionsPersonalData } from "../../../../store/slices/sectionPersonalDataBuilderAndBrandingSlice";
import { addArrContentPersonalData, setContentsPersonalData, setIntContentPersonalData } from "../../../../store/slices/contentPersonalDataBuilderAndBrandingSlice";
import { setIntSectionConsentData, setSectionsConsentData } from "../../../../store/slices/sectionConsentDataBuilderAndBrandingSlice";
import { useDispatch } from "react-redux";
import { setFooterBackgroundColor, setFooterContent, setFooterShow, setHeaderAltLogo, setHeaderBgColor, setHeaderFavicon, setHeaderLogo, setHeaderShow, setIntHeaderAndFooter } from "../../../../store/slices/previewHeaderAndFooterSlice";
import { setIntTitlePage, setTitlePage } from "../../../../store/slices/previewTitlePageSlice";
import { setIntThemeSettings, setThemeSettings } from "../../../../store/slices/previewThemeSettingsSlice";
import { setButtonSettings, setIntButtonSettings } from "../../../../store/slices/previewButtonSettingsSlice";
import { setAuthenticationScreen, setIntAuthenticationScreen } from "../../../../store/slices/previewAuthenticationScreenSlice";
import { setIntSubscriptionSettings, setSubscriptionSettings } from "../../../../store/slices/previewSubscriptionSettingsSlice";
import { setCustomCss, setIntCustomCss } from "../../../../store/slices/previewCustomCssSlice";


const InterfaceForm = () => {
  const confirm = useConfirm();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );
  const { mode, id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isCopyToModalOpen, setIsCopyToModalOpen] = useState(false);
  const [isVersionListOpen, setIsVersionListOpen] = useState(false);
  const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);
  const [isConfirmUnpublishOpen, setIsConfirmUnpublishOpen] = useState(false);

  const section = useSelector(
    (state: RootState) => state.sectionPersonalDataBuilderAndBranding.sections
  );
  const sectionConsent = useSelector(
    (state: RootState) => state.sectionConsentDataBuilderAndBranding.sections
  );
  const page = useSelector(
    (state: RootState) => state.pageBuilderAndBranding.pages
  );
  const contents = useSelector(
    (state: RootState) => state.contentPersonalDataBuilderAndBranding.contents
  );

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const headerAndFooterState = useSelector(
    (state: RootState) => state.previewHeaderAndFooter
  );
  const titlePageState = useSelector(
    (state: RootState) => state.previewTitlePage.titlePage
  );
  const themeSettingState = useSelector(
    (state: RootState) => state.previewThemeSetting.themeSettings
  );
  const buttonSettingState = useSelector(
    (state: RootState) => state.previewButtonSettings
  );
  const authenScreenState = useSelector(
    (state: RootState) => state.previewAuthenticationScreen
  );
  const subScriptionSettingState = useSelector(
    (state: RootState) => state.previewSubscriptionSettings
  );
  const customCssState = useSelector(
    (state: RootState) => state.previewCustomCss
  );
  const [consentInterface, setConsentInterface] = useState<IConsentInterface>({
    interfaceId: "00000000-0000-0000-0000-000000000000",
    interfaceName: "",
    description: "",
    customerId: "00000000-0000-0000-0000-000000000000",
    versionNumber: 1,
    interfaceStatusId: "00000000-0000-0000-0000-000000000000",
    interfaceStatusName: "Draft",
    integation: [],
    builder: [],
    branding: {},
    configJson: {
      // events: {
      //   interfaceEvents: false,
      //   dataSubjectElementChanges: false,
      //   enableDataSubjectPurposeChanges: false,
      //   singleDataSubjectUpdateEventType: false,
      //   dataSubjectPreferencePurposeChanges: false
      // },
      records: {
        collectTransactionsOfConsentWithheldOnThisInterface: false
      },
      // pageConfig: {
      // sendEmailsWhenTheInterfaceChanges: false,
      // showCurrentPurposeSubscriptionStatus: false,
      // sendEmailsWhenTheDataSubjectChanges: false,
      // sendEmailsWhenUnsubscribingFromInterfaceData: false
      // },
      confirmation: {
        consentAcknowledgementEmail: false
      },
      defaultLanguage: "EN-US"
    },
    translationJson: [],
    organizationId: "4a36c412-276d-4b70-a75d-d1203922a9bb",
    organizationName: "Org Main",
    isActiveStatus: true,
    createdDate: "",
    modifiedDate: "",
    createdBy: "",
    modifiedBy: "",
    publishedDate: "",
    publishedBy: "",
    LatestVersion: true,
  });
  const [organizations, setOrganizations] = useState<IOrganizations[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const tabNames = [
    t("interface.information"),
    t("interface.builderAndBranding"),
    t("interface.integrations"),
    t("interface.receipts"),
    t("interface.transactions"),
    t("interface.settings"),
    t("interface.translations"),
  ];
  const tabLinks = [
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/info`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/builder-branding`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/integration`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/receipt`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/transactions`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/setting`,
    `/consent/consent-interface/${mode}${id ? "/" + id : ""}/translation`,
  ];

  // Button text and styles based on mode
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  const isViewMode = mode === "view";

  const validateInfo = () => ({
    interfaceName: consentInterface.interfaceName === "",
    description: consentInterface.description === "",
    organizationId: consentInterface.organizationId === "",
  });

  const validateBuilderAndBranding = () => ({
    identifier: findIdentifier(consentInterface),
    emptyContents: checkSectionsOnly(consentInterface),
  });

  const validateIntegration = () => {
    return {};
  };

  const validateSetting = () => {
    return {};
  };

  const validateTranslation = () => {
    return {};
  };

  const openConfirmModal = () => {
    confirm({
      modalType: ModalType.Save,
      onConfirm: async () => {
        handleConfirm();
      },
    });
  };

  function findIdentifier(data: any) {
    if (!data.builder || !Array.isArray(data.builder)) return true;

    for (const page of data.builder) {
      if (!page.sections || !Array.isArray(page.sections)) continue;

      for (const section of page.sections) {
        if (!section.contents || !Array.isArray(section.contents)) continue;

        for (const content of section.contents) {
          const el = content.element?.selectedDataElement;
          if (el && el.isIdentifier === true) {
            return false;
          }
        }
      }
    }

    return true;
  }

  function checkSectionsOnly(data: any): boolean {
    if (!data.builder || !Array.isArray(data.builder)) {
      return true;
    }

    const sections = data.builder.flatMap((page: any) =>
      Array.isArray(page.sections) ? page.sections : []
    );

    for (const section of sections) {
      if (!section.contents || section.contents.length === 0) {
        notification.error(`Section (Name: ${section.text}) has no contents`);
        return true;
      }
    }

    return false;
  }

  const handleConfirm = async () => {
    setIsLoading(true);
    if (mode === "create")
      await createConsentInterface(consentInterface); // insert interface API
    else if (mode === "edit") await updateConsentInterface(consentInterface); // update interface API
    navigate("/consent/consent-interface");
  };

  const handleCancel = () => {
    confirm({
      title: t("roleAndPermission.confirmCancel"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmCancel"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      notify: false, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
      modalType: ModalType.Cancel, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        navigate(`/consent/consent-interface`);
      }, //จำเป็น
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  };

  const groupValidate = () => {
    const validateInfoResult = validateInfo();
    const validateBuilderAndBrandingResult = validateBuilderAndBranding();
    const validateIntegrationResult = validateIntegration();
    return {
      info: validateInfoResult,
      builderAndBranding: validateBuilderAndBrandingResult,
      translation: validateIntegrationResult,
    };
  };

  const handlePublish = async () => {
    const validated = groupValidate();
    setErrors(validated);
    if (Object.values(validated.info).includes(true)) {
      navigate(`/consent/consent-interface/${mode}${id ? "/" + id : ""}/info`);
    }
    else if (Object.values(validated.builderAndBranding).includes(true)) {
      if (validated.builderAndBranding.identifier) {
        notification.error(t("builderAndBranding.errorIdentifier"));
      }
      navigate(
        `/consent/consent-interface/${mode}${id ? "/" + id : ""
        }/builder-branding`
      );
    } else if (Object.values(validated.translation).includes(true))
      navigate(
        `/consent/consent-interface/${mode}${id ? "/" + id : ""}/integration`
      );
    else setIsConfirmPublishOpen(true);
  };

  const handleSave = async () => {
    const validated = groupValidate();
    setErrors(validated);
    if (Object.values(validated.info).includes(true)) {
      navigate(`/consent/consent-interface/${mode}${id ? "/" + id : ""}/info`);
    }
    else if (Object.values(validated.builderAndBranding).includes(true)) {
      if (validated.builderAndBranding.identifier) {
        notification.error(t("builderAndBranding.errorIdentifier"));
      }
      navigate(
        `/consent/consent-interface/${mode}${id ? "/" + id : ""
        }/builder-branding`
      );
    } else if (Object.values(validated.translation).includes(true))
      navigate(
        `/consent/consent-interface/${mode}${id ? "/" + id : ""}/integration`
      );
    else openConfirmModal();
  };

  const handlePublished = async () => {
    setIsLoading(true)
    setIsConfirmPublishOpen(false)
    try {
      if (consentInterface.interfaceId === "00000000-0000-0000-0000-000000000000") {
        await createConsentInterface({ ...consentInterface, interfaceStatusName: "Published" });
      } else {
        await updateConsentInterface({ ...consentInterface, interfaceStatusName: "Published" });
      }
      notification.success(t("modal.successConfirmSave"));
    } catch (error) {
      notification.error(t("modal.errorConfirmSave"));
    }
    navigate(`/consent/consent-interface`);
  };

  const handleUnpublish = async () => {
    setIsConfirmUnpublishOpen(false)
    try {
      await updateConsentInterface({ ...consentInterface, interfaceStatusName: "Unpublished" });
      notification.success(t("modal.successConfirmSave"));
    } catch (error) {
      notification.error(t("modal.errorConfirmSave"));
    }
    navigate(`/consent/consent-interface`);
  }

  useEffect(() => {
    handleGetOrganization(false);
    GetPageTypes().then((res) => {
    })
  }, [orgparent]);

  const handleGetOrganization = async (isSetDefault: boolean) => {
    const resOrganization = await getOrganization();

    const defaultOrganize = resOrganization.find(
      (organize: any) => organize.organizationName === ""
    );
    if (isSetDefault)
      setConsentInterface((prevState: any) => ({
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

  const handleGetInterface = async (id?: any) => {
    const resConsentInterface: any = await getConsentInterfaceByID(id);
    dispatch(setIntContentPersonalData());
    if (mode === 'create' && localStorage.getItem("isCreating") !== "true") {
      dispatch(setIntContentPersonalData());
    }
    if (mode === 'view' && resConsentInterface.builder.length || mode === 'edit' && resConsentInterface.builder.length) {
      const sortedBuilder = resConsentInterface.builder.sort((a: any, b: any) => a.order - b.order);

      dispatch(setPage(sortedBuilder));
      const getSectionPersonalData = resConsentInterface.builder.find((item: any) => item.pageType === "personal_data");
      const getSectionConsentData = resConsentInterface.builder.find((item: any) => item.pageType === "consent_data");
      const mapDataToDispatchForPersonal = getSectionPersonalData?.sections.map((item: any) => {
        return {
          ...item,
          pageId: getSectionPersonalData.pageId
        }
      }
      )
        .sort((a: any, b: any) => a.order - b.order);
      const mapDataToDispatchForConsent = getSectionConsentData?.sections.map((item: any) => {
        return {
          ...item,
          pageId: getSectionConsentData.pageId
        }
      }
      );
      const allContents = resConsentInterface.builder.flatMap((page: any) =>
        page.sections.flatMap((section: any) =>
          section.contents
        )
      );
      dispatch(setSectionsPersonalData(mapDataToDispatchForPersonal));
      dispatch(setSectionsConsentData(mapDataToDispatchForConsent));
      dispatch(addArrContentPersonalData({ contents: allContents }))
      // dispatch set interface branding (7 box)
      // --- header 
      const branding = resConsentInterface.branding
      dispatch(setHeaderShow({ show: branding.headerAndFooter.header.show ? true : false }));
      dispatch(setHeaderBgColor(branding.headerAndFooter.header.bgColor));
      dispatch(setFooterShow({ show: branding.headerAndFooter.footer.show ? true : false }));
      dispatch(setFooterContent(branding.headerAndFooter.footer.footerContent));
      dispatch(setFooterBackgroundColor(branding.headerAndFooter.footer.backgroundColor));
      dispatch(setHeaderLogo(branding.headerAndFooter.header.logo));
      dispatch(setHeaderFavicon(branding.headerAndFooter.header.favicon));
      dispatch(setHeaderAltLogo(branding.headerAndFooter.header.altLogo));
      // --- title page  
      dispatch(setTitlePage({
        showTitle: branding.titlePage.showTitle,
        pageTitle: branding.titlePage.pageTitle,
        fontSize: branding.titlePage.fontSize,
        fontColor: branding.titlePage.fontColor,
        backgroundColor: branding.titlePage.backgroundColor,
        backgroundType: branding.titlePage.backgroundType,
        backgroundImg: branding.titlePage.backgroundImg
      }));
      // -- theme setting
      dispatch(setThemeSettings({
        fontSize: branding.themeSetting.fontSize,
        fontColor: branding.themeSetting.fontColor,
        placeHolderColor: branding.themeSetting.placeHolderColor,
        borderColor: branding.themeSetting.borderColor,
        backgroundColor: branding.themeSetting.backgroundColor,
        inActiveColor: branding.themeSetting.inActiveColor,
        activeColor: branding.themeSetting.activeColor,
      }))
      // button setting
      dispatch(setButtonSettings({
        submitLabelButton: branding.buttonSetting.submitLabelButton,
        submitFontColor: branding.buttonSetting.submitFontColor,
        submitBackgroundColor: branding.buttonSetting.submitBackgroundColor,
        submitConfirmAlert: branding.buttonSetting.submitConfirmAlert,
        cancelLabelButtonShow: branding.buttonSetting.cancelLabelButtonShow,
        cancelLabelButton: branding.buttonSetting.cancelLabelButton,
        cancelFontColor: branding.buttonSetting.cancelFontColor,
        cancelBackgroundColor: branding.buttonSetting.cancelBackgroundColor,
      }))
      // --- authentication screen
      dispatch(setAuthenticationScreen({
        authenScreenShow: branding.authenScreen.authenScreenShow,
        verifyTitle: branding.authenScreen.verifyTitle,
        verifyDescription: branding.authenScreen.verifyDescription,
        verifyLabelButton: branding.authenScreen.verifyLabelButton,
        verifyFontSize: branding.authenScreen.verifyFontSize,
        verifyFontColor: branding.authenScreen.fontColor,
        verifyBackgroundColor: branding.authenScreen.bgColor,
        logoutScreenShow: branding.authenScreen.logoutScreenShow,
        logoutTitle: branding.authenScreen.logoutTitle,
        logoutDescription: branding.authenScreen.logoutDescription,
      }))
      // --- subscription setting
      dispatch(
        setSubscriptionSettings(
          {
            subScriptionSettingsShow: branding.subScriptionSetting.subScriptionSettingsShow,
            subscriptionTitle: branding.subScriptionSetting.subscriptionTitle,
            subScribeAllShow: branding.subScriptionSetting.subScribeAllShow,
            subscribeAllLabel: branding.subScriptionSetting.subscribeAllLabel,
            unSubscribeAllShow: branding.subScriptionSetting.unSubscribeAllShow,
            unSubscribeAllLabel: branding.subScriptionSetting.unSubscribeAllLabel,
            unSubscribeReasonShow: branding.subScriptionSetting.unSubscribeReasonShow,
            trigerUnSubscribeReason: branding.subScriptionSetting.trigerUnSubscribeReason,
            unSubscribeReasonTitle: branding.subScriptionSetting.unSubscribeReasonTitle,
            unSubscribeReasonTitleDescription:
              branding.subScriptionSetting.unSubscribeReasonTitleDescription,
            unSubscribeReasonLabelButton: branding.subScriptionSetting.unSubscribeReasonLabelButton,
            unSubscribeReasonFontSize: branding.subScriptionSetting.unSubscribeReasonFontSize,
            unSubscribeReasonFontColor: branding.subScriptionSetting.unSubscribeReasonFontColor,
            unSubscribeReasonBackgroundColor: branding.subScriptionSetting.unSubscribeReasonBackgroundColor,
            unSubscribeReason: branding.subScriptionSetting.unSubscribeReason,
            unSubscribeReasonRequired: branding.subScriptionSetting.unSubscribeReasonRequired,
          }
        )
      )
      // --- custom css
      dispatch(setCustomCss({
        customCssURL: branding.customCss.customCssURL,
        customCss: branding.customCss.customCss
      }))


    }
    setConsentInterface(resConsentInterface);
    setIsLoading(false)
  };

  const handleGetVersions = async (id?: any) => {
    const resVersions: any = await GetVersions(id);
    await setVersions(resVersions.data.map((cv: any) => ({
      id: cv.interfaceId,
      title: cv.interfaceName,
      version: cv.versionNumber,
      status: cv.interfaceStatusName,
      modifiedDate: formatDate("datetime", cv.modifiedDate),
    })));
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
      await handleGetInterface(id);
      await handleGetVersions(id);
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  };

  const handleSelectVersion = async (version: Version) => {
    const path =
      version.status === "Draft" && mode === "edit"
        ? `/consent/consent-interface/edit/${version.id}/info`
        : `/consent/consent-interface/view/${version.id}/info`;
    navigate(path);
    setIsVersionListOpen(false);
  }

  const handleDeleteVersion = (version: Version) => {
    confirm({
      modalType: ModalType.Delete,
      onConfirm: async () => {
        await deleteConsentInterface(version.id);
        navigate(`/consent/consent-interface`);
      },
    });
  }

  const handleCopyTo = async (formData: any, isError: boolean) => {
    const newInterface = { ...consentInterface };
    newInterface.interfaceName = formData.interfaceName;
    newInterface.description = formData.description;
    newInterface.organizationId = formData.organizationId;
    newInterface.parentVersionId = "00000000-0000-0000-0000-000000000000";
    newInterface.interfaceStatusName = "Draft";
    newInterface.versionNumber = 1;
    if (!isError) {
      confirm({
        modalType: ModalType.Save,
        onConfirm: async () => {
          await createConsentInterface(newInterface);
          navigate(`/consent/consent-interface`);
        },
      });
    }
  }


  useEffect(() => {

    handleInitial();
    if (mode === "create" && localStorage.getItem("isCreating") !== "true") {
      // if(mode === 'create'){
      dispatch(setIntPage());
      dispatch(setIntSection())
      dispatch(setIntSectionConsentData());
      dispatch(setIntContentPersonalData());
      dispatch(setIntTitlePage())
      dispatch(setIntHeaderAndFooter())
      dispatch(setIntThemeSettings())
      dispatch(setIntButtonSettings())
      dispatch(setIntAuthenticationScreen())
      dispatch(setIntSubscriptionSettings())
      dispatch(setIntCustomCss())


      const mappedPage = mapSectionsWithContentsForBuilderBranding(page, section, sectionConsent, []);
      setConsentInterface((prevState: any) => ({
        ...prevState,
        builder: mappedPage,
      }));

      if (!permissionPage?.isCreate) navigate("/consent/consent-interface");
    } else if (mode === "edit") {
      if (!permissionPage?.isUpdate) navigate("/consent/consent-interface");
    }
  }, []);

  const handleCreateNewVersion = async () => {
    try {
      await CreateInterfaceNewVersion(consentInterface);
      notification.success(t("interface.createNewVersionSuccess"));
    }
    catch (error) {
      notification.error(t("interface.createNewVersionError"));
    }
    navigate(`/consent/consent-interface`);
  }

  useEffect(() => {
    const allState = {
      headerAndFooter: headerAndFooterState,
      titlePage: titlePageState,
      themeSetting: themeSettingState,
      buttonSetting: buttonSettingState,
      authenScreen: authenScreenState,
      subScriptionSetting: subScriptionSettingState,
      customCss: customCssState,
    }
    setConsentInterface((prevState: any) => ({
      ...prevState,
      branding: allState,
    }));
  }, [headerAndFooterState, titlePageState, themeSettingState, buttonSettingState, authenScreenState, subScriptionSettingState, customCssState])

  useEffect(() => {
    localStorage.setItem("getAllInterfaceDataPreview", JSON.stringify({ branding: consentInterface.branding, builder: consentInterface.builder }));
  }, [consentInterface])

  useEffect(() => {
    handleInitial();
  }, [id, orgparent]);
  return (
    <div className="w-full bg-white flex flex-col">
      <div className="flex justify-between items-center px-6 border-b">
        <TabNavigation names={consentInterface.interfaceStatusName !== "Published" ? tabNames.filter((_, index) => index !== 2) : tabNames} links={consentInterface.interfaceStatusName !== "Published" ? tabLinks.filter((_, index) => index !== 2) : tabLinks} />
        <div className="absolute top-[120px] right-6 z-1 flex space-x-2 bg-white">
          {(isCreateMode ||
            (isEditMode &&
              consentInterface.interfaceStatusName === "Draft")) && (
              <Button
                onClick={handlePublish}
                variant="outlined"
              >
                <p className="text-primary-blue text-base">{t("Published")}</p>
              </Button>
            )}
          {isViewMode &&
            consentInterface.interfaceStatusName === "Published" && (
              <Button
                onClick={() => { setIsConfirmUnpublishOpen(true) }}
                variant="outlined"
              >
                <p className="text-primary-blue text-base">{t("Unpublish")}</p>
              </Button>
            )}
          {isViewMode &&
            consentInterface.interfaceStatusName === "Unpublished" && (
              <Button
                onClick={() => { setIsConfirmPublishOpen(true) }}
                variant="outlined"
              >
                <p className="text-primary-blue text-base">
                  {t("Republished")}
                </p>
              </Button>
            )}
          <Button
            onClick={handleCancel}
            color="#DFE4EA"
            className="mr-2"
            variant="outlined"
          >
            <p className="text-base">{t("cancel")}</p>
          </Button>
          {consentInterface.interfaceStatusName === "Draft" &&
            isViewMode &&
            permissionPage?.isUpdate && (
              <Button
                onClick={() => {
                  navigate(`/consent/consent-interface/edit/${id}/info`);
                }}
                color="#111928"
                variant="contained"
              >
                <p className="text-white text-base">{t("edit")}</p>
              </Button>
            )}

          {(isCreateMode ||
            (isEditMode &&
              consentInterface.interfaceStatusName === "Draft")) && (
              <Button onClick={handleSave} variant="contained">
                <p className="text-white text-base">{t("save")}</p>
              </Button>
            )}

          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="cursor-pointer focus:outline-none">
              <BsThreeDotsVertical className="size-5 text-gray-600 mt-3" />
            </Menu.Button>

            <Menu.Items className="absolute right-1 mt-4 w-[13rem] bg-white border border-gray-200 rounded-lg shadow-md z-50">
              {consentInterface.interfaceStatusName !== "Retired" &&
                consentInterface.interfaceStatusName !== "Draft" &&
                !isCreateMode && (
                  <Menu.Item as="div" onClick={() => handleCreateNewVersion()}>
                    <button
                      className="flex items-center px-4 py-2 w-full text-left text-base rounded-md"
                    >
                      <IoMdAdd className="size-4 mr-2" />
                      <span className="pt-1">
                        {t("interface.threeDotsMenu.createNewVersion")}
                      </span>
                    </button>
                  </Menu.Item>
                )}

              {!isCreateMode && (
                <Menu.Item as="div" onClick={() => setIsCopyToModalOpen(true)}>
                  <button
                    className="flex items-center px-4 py-2 w-full text-left text-base rounded-md"
                  >
                    <FaRegCopy className="size-4 mr-2" />
                    <span className="pt-1">
                      {t("interface.threeDotsMenu.copyto")}
                    </span>
                  </button>
                </Menu.Item>
              )}

              <Menu.Item as="div" onClick={() => {
                const url = "/preview-consent";
                window.open(url, "_blank", "noopener,noreferrer");
              }}>
                <button
                  className="flex items-center px-4 py-2 w-full text-left text-base rounded-md"

                >
                  <TbFileSearch className="size-5 mr-1" />
                  <span className="pt-1">
                    {t("interface.threeDotsMenu.preview")}
                  </span>
                </button>
              </Menu.Item>

              {!isCreateMode && (
                <Menu.Item as="div" onClick={() => setIsVersionListOpen(true)}>
                  <button
                    className="flex items-center px-4 py-2 w-full text-left text-base rounded-md"
                  >
                    <BsClock className="size-4 mr-2" />
                    <span className="pt-1">
                      {t("interface.threeDotsMenu.viewAllVersions")}
                    </span>
                  </button>
                </Menu.Item>
              )}

              <Menu.Item as="div" onClick={() => {
                navigate(`/setting/bulk-data-import`);
              }}>
                <button
                  className="flex items-center px-4 py-2 w-full text-left text-base rounded-md"
                >
                  <FiDownload className="size-4 mr-2" />
                  <span className="pt-1">
                    {t("interface.threeDotsMenu.bulkDataImport")}
                  </span>
                </button>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className="p-6">
        {isLoading ?
          <LoadingSpinner /> :
          <Outlet
            context={{
              consentInterface,
              setConsentInterface,
              mode,
              id,
              errors,
              organizations,
              permissionPage,
              isLoading,
            }}
          />}
      </div>
      <Copyto
        isOpen={isCopyToModalOpen}
        organizations={organizations}
        onClose={() => setIsCopyToModalOpen(false)}
        onSubmit={handleCopyTo}
      />
      {isVersionListOpen && (
        <VersionList
          data={versions}
          desc={t("interface.info.allVersions")}
          onClose={() => setIsVersionListOpen(false)}
          onSelect={handleSelectVersion}
          onDelete={handleDeleteVersion}
        />
      )}
      <PopupPublish
        isOpen={isConfirmPublishOpen}
        onClose={() => setIsConfirmPublishOpen(false)}
        onPublish={handlePublished}
      />
      <PopupUnpublish
        isOpen={isConfirmUnpublishOpen}
        onClose={() => setIsConfirmUnpublishOpen(false)}
        onUnpublish={handleUnpublish}
      />
    </div>
  );
};

export default InterfaceForm;