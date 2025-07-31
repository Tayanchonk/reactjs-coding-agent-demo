import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { IConsentInterface } from "../../../../../interface/interface.interface";
import MockImg from "../../../../../assets/images/mockimg.png";
import {
  Button,
  InputText,
  Toggle,
} from "../../../../../components/CustomComponent";
import ScreenPersonalData from "./Components/ScreenPersonalData";
import HeaderAndFooter from "./HeaderAndFooter";
import TitlePage from "./TitlePage";
import ThemeSetting from "./ThemeSetting";
import ButtonSetting from "./ButtonSetting";
import AuthenticationScreen from "./AuthenticationScreen";
import SubscriptionSetting from "./SubscriptionSetting";
import CustomCSS from "./CustomCSS";
import ModalEditPage from "./Components/ModalEditPage";
import Preview from "./Preview";
import ScreenConsentData from "./Components/ScreenConsentData";
import { mapSectionsWithContentsForBuilderBranding } from "../../../../../utils/Utils";
import { setPage } from "../../../../../store/slices/pageBuilderAndBrandingSlice";
import { GetPageTypes } from "../../../../../services/consentInterfaceService";
import { setIntSection } from "../../../../../store/slices/sectionPersonalDataBuilderAndBrandingSlice";
import { setIntSectionConsentData } from "../../../../../store/slices/sectionConsentDataBuilderAndBrandingSlice";
import { setDataSelectionPreview } from "../../../../../store/slices/dataBuilderAndBrandingSlice";
import { Field } from "../../../../../interface/purpose.interface";

const InterfaceBuilderAndBranding = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const context = useOutletContext<{
    consentInterface: IConsentInterface;
    setConsentInterface: (data: IConsentInterface) => void;
    mode: string;
    errors: any;
    id?: string;
  }>();
  const { consentInterface, setConsentInterface, mode, id } = context;


  // ------------- STATE -----------------

  // --- GLOBAL STATE ----
  const language = useSelector((state: RootState) => state.language.language);
  const contents = useSelector(
    (state: RootState) => state.contentPersonalDataBuilderAndBranding.contents
  );
  const titlePage = useSelector(
    (state: RootState) => state.previewTitlePage.titlePage
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

  // --- LOCAL STATE ---
  const [openInterfaceAccordion, setOpenInterfaceAccordion] = useState(true);
  const [openScreenPersonalData, setOpenScreenPersonalData] = useState(false);
  const [pageId, setPageId] = useState("");
  const [openScreenConsentData, setOpenScreenConsentData] = useState(false);
  const [openSreenHeaderAndFooter, setOpenScreenHeaderAndFooter] =
    useState(false);
  const [openScreenTitlePage, setOpenScreenTitlePage] = useState(false);
  const [openScreenThemeSettings, setOpenScreenThemeSettings] = useState(false);
  const [openScreenButtonSettings, setOpenScreenButtonSettings] =
    useState(false);
  const [openScreenAuthenticationScreen, setOpenScreenAuthenticationScreen] =
    useState(false);
  const [openScreenSubscriptionSetting, setOpenScreenSubscriptionSetting] =
    useState(false);
  const [openScreenCustomCss, setOpenScreenCustomCss] = useState(false);

  const [openModalEditPage, setOpenModalEditPage] = useState({
    open: false,
    pageName: "",
    pageId: "", // เพิ่ม pageId ที่นี่
  });


  const dataIcon = [
    {
      icon: (
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
        >
          <path
            d="M0.976562 2.04163V0.335938H20.3077V2.04163H0.976562ZM18.2521 4.53449C18.8265 4.53449 19.3127 4.73349 19.7107 5.13148C20.1087 5.52948 20.3077 6.01569 20.3077 6.59013V17.6114C20.3077 18.1859 20.1087 18.6721 19.7107 19.0701C19.3127 19.4681 18.8265 19.6671 18.2521 19.6671H3.0322C2.45776 19.6671 1.97155 19.4681 1.57355 19.0701C1.17556 18.6721 0.976562 18.1859 0.976562 17.6114V6.59013C0.976562 6.01569 1.17556 5.52948 1.57355 5.13148C1.97155 4.73349 2.45776 4.53449 3.0322 4.53449H18.2521ZM18.2521 6.24018H3.0322C2.93005 6.24018 2.84619 6.27297 2.78061 6.33854C2.71504 6.40412 2.68225 6.48798 2.68225 6.59013V17.6114C2.68225 17.7136 2.71504 17.7975 2.78061 17.863C2.84619 17.9286 2.93005 17.9614 3.0322 17.9614H18.2521C18.3542 17.9614 18.4381 17.9286 18.5037 17.863C18.5692 17.7975 18.602 17.7136 18.602 17.6114V6.59013C18.602 6.48798 18.5692 6.40412 18.5037 6.33854C18.4381 6.27297 18.3542 6.24018 18.2521 6.24018Z"
            fill="#656668"
          />
        </svg>
      ),
      text: t("builderAndBranding.headerAndFooter"),
      screen: "HeaderAndFooter",
    },
    {
      icon: (
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
        >
          <path
            d="M4.09622 7.7955H13.6587V4.98328H4.09622V7.7955ZM2.97122 20.0625C2.40291 20.0625 1.92188 19.8656 1.52813 19.4719C1.13438 19.0781 0.9375 18.5971 0.9375 18.0288V2.97122C0.9375 2.40291 1.13438 1.92188 1.52813 1.52813C1.92188 1.13438 2.40291 0.9375 2.97122 0.9375H18.0288C18.5971 0.9375 19.0781 1.13438 19.4719 1.52813C19.8656 1.92188 20.0625 2.40291 20.0625 2.97122V18.0288C20.0625 18.5971 19.8656 19.0781 19.4719 19.4719C19.0781 19.8656 18.5971 20.0625 18.0288 20.0625H2.97122ZM2.97122 18.375H18.0288C18.1154 18.375 18.1947 18.3389 18.2667 18.2667C18.3389 18.1947 18.375 18.1154 18.375 18.0288V2.97122C18.375 2.88459 18.3389 2.80528 18.2667 2.73328C18.1947 2.66109 18.1154 2.625 18.0288 2.625H2.97122C2.88459 2.625 2.80528 2.66109 2.73328 2.73328C2.66109 2.80528 2.625 2.88459 2.625 2.97122V18.0288C2.625 18.1154 2.66109 18.1947 2.73328 18.2667C2.80528 18.3389 2.88459 18.375 2.97122 18.375Z"
            fill="#656668"
          />
        </svg>
      ),
      text: t("builderAndBranding.titlePage"),
      screen: "TitlePage",
    },
    {
      icon: (
        <svg
          width="22"
          height="21"
          viewBox="0 0 22 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
        >
          <path
            d="M7.39429 19.6926L1.23175 13.5301C1.05824 13.3556 0.928055 13.1638 0.841208 12.9545C0.754361 12.7451 0.710938 12.5275 0.710938 12.3018C0.710938 12.0761 0.754361 11.8592 0.841208 11.651C0.928055 11.4427 1.05824 11.2516 1.23175 11.0779L7.35692 4.96956L4.36096 2.01558L5.62331 0.703125L15.9995 11.0893C16.1725 11.2623 16.2996 11.4531 16.3808 11.6619C16.4621 11.8706 16.5027 12.0881 16.5027 12.3143C16.5027 12.5403 16.4621 12.7577 16.3808 12.9665C16.2996 13.1752 16.1721 13.3666 15.9984 13.5406L9.84642 19.6926C9.67272 19.8661 9.48169 19.9963 9.27333 20.0831C9.06515 20.17 8.84822 20.2134 8.62252 20.2134C8.39683 20.2134 8.17926 20.17 7.96981 20.0831C7.76055 19.9963 7.56871 19.8661 7.39429 19.6926ZM8.61521 6.22785L2.75681 12.0863C2.7151 12.128 2.6873 12.1697 2.6734 12.2114C2.65949 12.2531 2.65254 12.2947 2.65254 12.3362H14.5776C14.5776 12.2947 14.5707 12.2531 14.5567 12.2114C14.5428 12.1697 14.515 12.128 14.4733 12.0863L8.61521 6.22785ZM19.1921 20.2134C18.6116 20.2134 18.1234 20.0094 17.7277 19.6013C17.3317 19.1931 17.1337 18.693 17.1337 18.1009C17.1337 17.662 17.2366 17.2432 17.4422 16.8445C17.6477 16.446 17.8935 16.0634 18.1797 15.6967L19.1921 14.4216L20.2589 15.6967C20.5339 16.0634 20.7769 16.446 20.988 16.8445C21.199 17.2432 21.3046 17.662 21.3046 18.1009C21.3046 18.693 21.0976 19.1931 20.6838 19.6013C20.27 20.0094 19.7727 20.2134 19.1921 20.2134Z"
            fill="#656668"
          />
        </svg>
      ),
      text: t("builderAndBranding.themeSettings"),
      screen: "ThemeSettings",
    },
    {
      icon: (
        <svg
          width="22"
          height="13"
          viewBox="0 0 22 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
        >
          <path
            d="M2.66933 12.5964C2.12207 12.5964 1.65885 12.4068 1.27969 12.0276C0.900521 11.6484 0.710938 11.1852 0.710938 10.638V2.63808C0.710938 2.09082 0.900521 1.6276 1.27969 1.24844C1.65885 0.869271 2.12207 0.679688 2.66933 0.679688H19.3359C19.8831 0.679688 20.3464 0.869271 20.7255 1.24844C21.1047 1.6276 21.2943 2.09082 21.2943 2.63808V10.638C21.2943 11.1852 21.1047 11.6484 20.7255 12.0276C20.3464 12.4068 19.8831 12.5964 19.3359 12.5964H2.66933ZM2.66933 10.9714H19.3359C19.4332 10.9714 19.5131 10.9401 19.5756 10.8776C19.638 10.8152 19.6693 10.7353 19.6693 10.638V2.63808C19.6693 2.54076 19.638 2.46087 19.5756 2.3984C19.5131 2.33592 19.4332 2.30469 19.3359 2.30469H2.66933C2.57201 2.30469 2.49212 2.33592 2.42965 2.3984C2.36717 2.46087 2.33594 2.54076 2.33594 2.63808V10.638C2.33594 10.7353 2.36717 10.8152 2.42965 10.8776C2.49212 10.9401 2.57201 10.9714 2.66933 10.9714ZM6.02333 9.61719H7.31521V7.28396H9.64844V5.99208H7.31521V3.65885H6.02333V5.99208H3.6901V7.28396H6.02333V9.61719Z"
            fill="#656668"
          />
        </svg>
      ),
      text: t("builderAndBranding.buttonSettings"),
      screen: "ButtonSettings",
    },
    {
      icon: (
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
        >
          <path
            d="M6.34625 11.6538H13.6538V11.2963C13.6538 10.6296 13.324 10.1058 12.6645 9.725C12.0048 9.34417 11.1167 9.15375 10 9.15375C8.88333 9.15375 7.99517 9.34417 7.3355 9.725C6.676 10.1058 6.34625 10.6296 6.34625 11.2963V11.6538ZM10 7.84625C10.4858 7.84625 10.899 7.676 11.2395 7.3355C11.5798 6.99517 11.75 6.58208 11.75 6.09625C11.75 5.61025 11.5798 5.19708 11.2395 4.85675C10.899 4.51642 10.4858 4.34625 10 4.34625C9.51417 4.34625 9.101 4.51642 8.7605 4.85675C8.42017 5.19708 8.25 5.61025 8.25 6.09625C8.25 6.58208 8.42017 6.99517 8.7605 7.3355C9.101 7.676 9.51417 7.84625 10 7.84625ZM6.5 17.5V15.5H2.30775C1.80258 15.5 1.375 15.325 1.025 14.975C0.675 14.625 0.5 14.1974 0.5 13.6923V2.30775C0.5 1.80258 0.675 1.375 1.025 1.025C1.375 0.675 1.80258 0.5 2.30775 0.5H17.6923C18.1974 0.5 18.625 0.675 18.975 1.025C19.325 1.375 19.5 1.80258 19.5 2.30775V13.6923C19.5 14.1974 19.325 14.625 18.975 14.975C18.625 15.325 18.1974 15.5 17.6923 15.5H13.5V17.5H6.5ZM2.30775 14H17.6923C17.7693 14 17.8398 13.9679 17.9038 13.9038C17.9679 13.8398 18 13.7692 18 13.6923V2.30775C18 2.23075 17.9679 2.16025 17.9038 2.09625C17.8398 2.03208 17.7693 2 17.6923 2H2.30775C2.23075 2 2.16025 2.03208 2.09625 2.09625C2.03208 2.16025 2 2.23075 2 2.30775V13.6923C2 13.7692 2.03208 13.8398 2.09625 13.9038C2.16025 13.9679 2.23075 14 2.30775 14Z"
            fill="#656668"
          />
        </svg>
      ),
      text: t("builderAndBranding.AuthenticationScreen"),
      screen: "AuthenticationScreen",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
        >
          <path
            d="M8.48073 14.1723L15.764 6.88904L14.6224 5.74748L8.48073 11.8892L5.39323 8.80167L4.25167 9.94323L8.48073 14.1723ZM2.74746 19.2057C2.20019 19.2057 1.73698 19.0161 1.35781 18.637C0.978646 18.2578 0.789062 17.7946 0.789062 17.2473V2.74746C0.789062 2.20019 0.978646 1.73698 1.35781 1.35781C1.73698 0.978646 2.20019 0.789062 2.74746 0.789062H17.2473C17.7946 0.789062 18.2578 0.978646 18.637 1.35781C19.0161 1.73698 19.2057 2.20019 19.2057 2.74746V17.2473C19.2057 17.7946 19.0161 18.2578 18.637 18.637C18.2578 19.0161 17.7946 19.2057 17.2473 19.2057H2.74746ZM2.74746 17.5807H17.2473C17.3307 17.5807 17.4071 17.546 17.4765 17.4765C17.546 17.4071 17.5807 17.3307 17.5807 17.2473V2.74746C17.5807 2.66404 17.546 2.58767 17.4765 2.51833C17.4071 2.44882 17.3307 2.41406 17.2473 2.41406H2.74746C2.66404 2.41406 2.58767 2.44882 2.51833 2.51833C2.44882 2.58767 2.41406 2.66404 2.41406 2.74746V17.2473C2.41406 17.3307 2.44882 17.4071 2.51833 17.4765C2.58767 17.546 2.66404 17.5807 2.74746 17.5807Z"
            fill="#656668"
          />
        </svg>
      ),
      text: t("builderAndBranding.subscriptionSettings"),
      screen: "SubscriptionSettings",
    },
    // {
    //   icon: (
    //     <svg
    //       width="24"
    //       height="18"
    //       viewBox="0 0 24 18"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //       className="size-6"
    //     >
    //       <path
    //         d="M7.09179 8.91017V7.16017H5.34179V8.91017H7.09179ZM11.3749 8.91017C11.5439 8.57514 11.7376 8.26374 11.9559 7.97596C12.1743 7.68799 12.4135 7.41606 12.6737 7.16017H9.42513V8.91017H11.3749ZM10.4617 13.3301C10.4378 13.2105 10.4228 13.092 10.4168 12.9745C10.4108 12.8571 10.4078 12.7326 10.4078 12.6009C10.4078 12.417 10.4108 12.2438 10.4168 12.0815C10.4228 11.9193 10.4415 11.7522 10.4728 11.5801H5.34179V13.3301H10.4617ZM12.4092 17.75H3.03092C2.44914 17.75 1.95214 17.544 1.53992 17.132C1.12789 16.7197 0.921875 16.2227 0.921875 15.641V2.35904C0.921875 1.77726 1.12789 1.28026 1.53992 0.868042C1.95214 0.456014 2.44914 0.25 3.03092 0.25H20.9795C21.5613 0.25 22.0583 0.456014 22.4705 0.868042C22.8825 1.28026 23.0885 1.77726 23.0885 2.35904V6.84167C22.8327 6.58889 22.5608 6.36265 22.273 6.16296C21.9851 5.96326 21.6736 5.78642 21.3385 5.63242V2.35904C21.3385 2.25424 21.3049 2.1682 21.2376 2.10092C21.1703 2.03364 21.0843 2 20.9795 2H3.03092C2.92611 2 2.84007 2.03364 2.77279 2.10092C2.70551 2.1682 2.67188 2.25424 2.67188 2.35904V15.641C2.67188 15.7458 2.70551 15.8318 2.77279 15.8991C2.84007 15.9664 2.92611 16 3.03092 16H11.1953C11.3568 16.335 11.5363 16.6465 11.7337 16.9345C11.9312 17.2223 12.1564 17.4941 12.4092 17.75ZM18.9268 17.75H17.2666L17.0061 16.2018C16.7281 16.1196 16.4663 16.012 16.221 15.879C15.9756 15.7458 15.7422 15.5789 15.521 15.3785L14.0425 15.8924L13.2124 14.481L14.4193 13.494C14.3355 13.2037 14.2936 12.906 14.2936 12.6009C14.2936 12.2958 14.3355 11.9982 14.4193 11.7081L13.2235 10.6984L14.0536 9.28729L15.521 9.81229C15.7348 9.61182 15.9663 9.44693 16.2154 9.31763C16.4645 9.18813 16.7281 9.08225 17.0061 9L17.2666 7.45212H18.9268L19.1758 9C19.4539 9.08225 19.7205 9.19406 19.9756 9.33542C20.2305 9.47678 20.459 9.64769 20.661 9.84817L22.1284 9.28729L22.9585 10.7342L21.7626 11.744C21.8464 12.0341 21.8883 12.3258 21.8883 12.619C21.8883 12.912 21.8464 13.2037 21.7626 13.494L22.9695 14.481L22.1395 15.8924L20.661 15.3785C20.4395 15.5789 20.2062 15.7458 19.961 15.879C19.7156 16.012 19.4539 16.1196 19.1758 16.2018L18.9268 17.75ZM18.0853 14.8223C18.697 14.8223 19.2202 14.605 19.6548 14.1704C20.0893 13.7358 20.3066 13.2126 20.3066 12.6009C20.3066 11.9892 20.0893 11.466 19.6548 11.0315C19.2202 10.5971 18.697 10.3799 18.0853 10.3799C17.4736 10.3799 16.9504 10.5971 16.5158 11.0315C16.0814 11.466 15.8643 11.9892 15.8643 12.6009C15.8643 13.2126 16.0814 13.7358 16.5158 14.1704C16.9504 14.605 17.4736 14.8223 18.0853 14.8223Z"
    //         fill="#656668"
    //       />
    //     </svg>
    //   ),
    //   text: t("builderAndBranding.customCss"),
    //   screen: "CustomCss",
    // },
  ];
  // ------------- FUNCTION -----------------
  const toggleInterfaceAccordion = () => {
    setOpenInterfaceAccordion(!openInterfaceAccordion);
  };



  const handleScreenInterFaceAndBranding = (screen: string) => {
    switch (screen) {
      case "HeaderAndFooter":
        setOpenScreenHeaderAndFooter(true);
        break;
      case "TitlePage":
        setOpenScreenTitlePage(true);
        break;
      case "ThemeSettings":
        setOpenScreenThemeSettings(true);
        break;
      case "ButtonSettings":
        setOpenScreenButtonSettings(true);
        break;
      case "AuthenticationScreen":
        setOpenScreenAuthenticationScreen(true);
        break;
      case "SubscriptionSettings":
        setOpenScreenSubscriptionSetting(true);
        break;
      // case "CustomCss":
      //   setOpenScreenCustomCss(true);
      //   break;
      default:
        break;
    }
  };

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  const getDataGlobalState = () => {
    const mapGlobalState = [];
    const mappedPage = mapSectionsWithContentsForBuilderBranding(page, section, sectionConsent, contents);




  };
  // -------------- USEEFFECT ----------------

  useEffect(() => {
    const getPageTypes = async () => {
      const response = await GetPageTypes();
      // console.log("🚀 ~ getPageType ~ response:", response)
      if (response.status === 200) {
        const data = response.data.map((item: any) => {
          return {
            pageId: item.pageTypeId,
            pageType: item.pageTypeName,
            pageName: item.description,
          }
        })
        // console.log("🚀 ~ getPageTypes ~ data:", data)
        dispatch(setPage(data));
      }
      // setItems(response);
    }
    if (mode === "create" && localStorage.getItem("isCreating") !== "true") {
      getPageTypes();
      dispatch(setIntSection())
      dispatch(setIntSectionConsentData())
    }

  }, [])

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    const builder = mapSectionsWithContentsForBuilderBranding(page, section, sectionConsent, contents);
    const fields: Field[] = [];

    builder.forEach((page) => {
      fields.push({
        name: `Page: ${page.pageName}`,
        value: page.pageName,
        transalte: "",
      });

      page.sections.forEach((section: any, index: number) => {
        fields.push({
          name: `Section: ${section.text}`,
          value: section.text,
          transalte: "",
        });
      });
    });

    const translationJson = consentInterface.translationJson.map((item: any) => {
      // สร้าง Map เพื่อค้นหา translate ได้ไว
      const oldFieldMap = new Map(
        item.fields.map((f: any) => [f.name, f.transalte])
      );

      const translatedFields = fields.map((f) => ({
        ...f,
        transalte: oldFieldMap.get(f.name) || "",
      }));

      item.fields = [
        // keep Consent Interface Name + Description
        ...item.fields.filter(
          (field: any) =>
            field.name === "Consent Interface Name" || field.name === "Description"
        ),
        ...translatedFields,
      ];

      return item;
    });
    const updated = {
      ...consentInterface,
      builder: builder,
      translationJson: translationJson,
    };
    setConsentInterface(updated);
    // set localstorage to check reset intial data 
    if (mode === 'create') {
      localStorage.setItem("isCreating", JSON.stringify(true));
    }
  }, [page, section, sectionConsent, contents]);



  return (
    <div className="bg-white flex h-[65vh] overflow-auto">
      <div className="w-4/12">
        <div>
          {!openScreenPersonalData && !openScreenConsentData && (
            <>
              <p className="text-[#3758F9] font-semibold px-4">
                {t("builderAndBranding.page")}
              </p>
              <div className="pt-3 pb-5 border-b">
                <div className="px-4">
                  {page?.map((item: any, index: number) => {
                    return (
                      <Button key={index} className="flex rounded py-2 px-4 w-full border boder-[#3758F9]  hover:border-[#3758F9] mt-3">
                        <p
                          onClick={() => {
                            if (item.pageType === "personal_data") {
                              setOpenScreenPersonalData(true);
                              dispatch(setDataSelectionPreview({
                                pageId: item.pageId,
                                sectionId: ""
                              }));
                            }
                            else {
                              setOpenScreenConsentData(true);
                              dispatch(setDataSelectionPreview({
                                pageId: item.pageId,
                                sectionId: ""
                              }));
                            }

                            setPageId(item.pageId);
                            sessionStorage.setItem(
                              "pageId",
                              item.pageId
                            );
                          }}
                          className="w-11/12 m-auto text-left  pl-3 text-base font-semibold text-black hover:text-[#3758F9]"
                        >
                          {item.pageName}
                        </p>
                        {mode === 'view' ? null :
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#656668"
                            className="size-6 w-1/12 m-auto cursor-pointer hover:stroke-[#3758F9]"
                            onClick={() =>
                              setOpenModalEditPage({
                                open: true,
                                pageName: item.pageName,
                                pageId: item.pageId
                              })
                            }
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        }

                      </Button>
                    )
                  }
                  )}
                </div>
              </div>
            </>
          )}

          <div></div>
        </div>
        {openScreenPersonalData ? (
          <ScreenPersonalData
            setOpenScreenPersonalData={setOpenScreenPersonalData}
            setOpenScreenHeaderAndFooter={setOpenScreenHeaderAndFooter}
            setOpenScreenConsentData={setOpenScreenConsentData}
            pageId={pageId}
            mode={mode}
          />
        ) : openScreenConsentData ? (
          <ScreenConsentData
            setOpenScreenConsentData={setOpenScreenConsentData}
            setOpenScreenHeaderAndFooter={setOpenScreenHeaderAndFooter}
            pageId={pageId}
            mode={mode}
          />
        ) : openSreenHeaderAndFooter ? (
          <HeaderAndFooter
            setOpenScreenHeaderAndFooter={setOpenScreenHeaderAndFooter}
            mode={mode}
          />
        ) : openScreenTitlePage ? (
          <TitlePage setOpenScreenTitlePage={setOpenScreenTitlePage} mode={mode} />
        ) : openScreenThemeSettings ? (
          <ThemeSetting
            setOpenScreenThemeSettings={setOpenScreenThemeSettings}
            mode={mode}
          />
        ) : openScreenButtonSettings ? (
          <ButtonSetting
            setOpenScreenButtonSettings={setOpenScreenButtonSettings}
            mode={mode}
          />
        ) : openScreenAuthenticationScreen ? (
          <AuthenticationScreen
            setOpenScreenAuthenticationScreen={
              setOpenScreenAuthenticationScreen
            }
            mode={mode}
          />
        ) : openScreenSubscriptionSetting ? (
          <SubscriptionSetting
            setOpenScreenSubscriptionSetting={setOpenScreenSubscriptionSetting}
            mode={mode}
          />
        )
          // : openScreenCustomCss ? (
          //   <CustomCSS setOpenScreenCustomCss={setOpenScreenCustomCss} mode={mode} />
          // ) 
          : (
            <div id="accordion-collapse" data-accordion="collapse">
              <h2 id="accordion-collapse-heading-1">
                <button
                  type="button"
                  className=" flex items-center justify-between w-full px-5 py-3 font-base rtl:text-right font-semibold"
                  onClick={toggleInterfaceAccordion}
                  aria-expanded={openInterfaceAccordion}
                  aria-controls="accordion-collapse-body-1"
                >
                  <span>{t("builderAndBranding.interfaceBranding")}</span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 shrink-0 transition-transform ${openInterfaceAccordion ? "rotate-180" : ""
                      }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </h2>
              <div
                id="accordion-collapse-body-1"
                className={`${openInterfaceAccordion ? "" : "hidden"}`}
                aria-labelledby="accordion-collapse-heading-1"
              >
                <div className="p-5 dark:border-gray-700 dark:bg-gray-900 flex flex-wrap">
                  {dataIcon.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="w-1/2 p-1.5 hover:text-[#3758F9]"
                      >
                        <div
                          className="border border-solid border-[#656668] p-3 rounded-md cursor-pointer hover:border-[#3758F9]"
                          onClick={() =>
                            handleScreenInterFaceAndBranding(item.screen)
                          }
                        >
                          <div className="flex justify-center items-center mb-2">
                            {item.icon}
                          </div>

                          <p className="text-center text-[#656668] text-base font-semibold  hover:text-[#3758F9]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
      </div>
      <div className="w-8/12">
        <Preview />
      </div>
      <ModalEditPage
        openModalEditPage={openModalEditPage} // ส่ง state ไปยัง ModalEditPage
        setOpenModalEditPage={setOpenModalEditPage} // ส่งฟังก์ชัน setState ไปยัง ModalEditPage
      />
    </div>
  );
};

export default InterfaceBuilderAndBranding;
