import { models } from 'powerbi-client';
import { configureStore, current } from "@reduxjs/toolkit";
import openSidebarSlice from "./slices/openSidebarSlice";
import showSearchSlice from "./slices/showSearchSlice";
import themeReducer from "./slices/themeSlice";
import languageSlice from "./slices/languageSlice";
import childMenuSlice from "./slices/childMenuSlice";
import loadingSlice from "./slices/loadingSlice";
import openDrawerCreateOrgSlice from "./slices/openDrawerCreateOrg";
import openModalCFOrgSlice from "./slices/openModalCFOrg";
import openAlertSlice from "./slices/openAlertSlice";
import permissionMenuSlice from "./slices/permissionMenuSlice";
import dateTimeFormatSlice from "./slices/dateTimeFormatSlice";
import currentUserSlice from "./slices/currentUserSlice";
import reloadSlice from "./slices/reloadSlice";
import sessionSlice from "./slices/sessionSlice";
import orgParentSlice from "./slices/orgParentSlice";
import preferencePurposeSlice from "./slices/preferencePurposeSlice";
import reloadOrgSlice from "./slices/reloadOrgSlice";
import menuDescriptionSlice from "./slices/menuDescriptionSlice";
import previewHeaderAndFooterSlice from "./slices/previewHeaderAndFooterSlice";
import sectionPersonalDataBuilderAndBrandingSlice from "./slices/sectionPersonalDataBuilderAndBrandingSlice";
import contentPersonalDataBuilderAndBrandingSlice from "./slices/contentPersonalDataBuilderAndBrandingSlice";
import sectionConsentDataBuilderAndBrandingSlice from "./slices/sectionConsentDataBuilderAndBrandingSlice";
import contentConsentDataBuilderAndBrandingSlice from "./slices/contentConsentDataBuilderAndBrandingSlice";
import pageBuilderAndBrandingSlice from "./slices/pageBuilderAndBrandingSlice";
import previewTitlePageSlice from "./slices/previewTitlePageSlice";
import previewThemeSettingSlice from "./slices/previewThemeSettingsSlice";
import previewButtonSettingsSlice from "./slices/previewButtonSettingsSlice";
import previewAuthenticationScreenSlice from "./slices/previewAuthenticationScreenSlice";
import previewSubscriptionSettingsSlice from "./slices/previewSubscriptionSettingsSlice";
import previewCustomCssSlice from "./slices/previewCustomCssSlice";
import dataBuilderAndBrandingSlice from "./slices/dataBuilderAndBrandingSlice";
import menuBreadcrumbSlice from "./slices/menuBreadcrumbSlice";
import menuHeaderSlice from "./slices/menuHeaderSlice";
import dataSubjectSlice from "./slices/dataSubjectSlice";
import filterReportDataSubjectSlice  from "./slices/filterReportDataSubjectSlice";
import module from "./slices/module";
export const store = configureStore({
  reducer: {
    opensidebar: openSidebarSlice,
    showSearch: showSearchSlice,
    theme: themeReducer,
    language: languageSlice,
    childmenu: childMenuSlice,
    loading: loadingSlice,
    opendrawercreateorg: openDrawerCreateOrgSlice,
    openmodalcforg: openModalCFOrgSlice,
    openalert: openAlertSlice,
    permissionPage: permissionMenuSlice,
    dateTimeFormat: dateTimeFormatSlice,
    currentUser: currentUserSlice,
    reload: reloadSlice,
    session: sessionSlice,
    orgparent: orgParentSlice,
    menuDescription: menuDescriptionSlice,
    preferencePurpose: preferencePurposeSlice,
    reloadorg: reloadOrgSlice,
    previewHeaderAndFooter: previewHeaderAndFooterSlice,
    sectionPersonalDataBuilderAndBranding:
      sectionPersonalDataBuilderAndBrandingSlice,
    contentPersonalDataBuilderAndBranding:
      contentPersonalDataBuilderAndBrandingSlice,
    sectionConsentDataBuilderAndBranding:
      sectionConsentDataBuilderAndBrandingSlice,
    contentConsentDataBuilderAndBranding:
      contentConsentDataBuilderAndBrandingSlice,
    pageBuilderAndBranding: pageBuilderAndBrandingSlice,
    previewTitlePage: previewTitlePageSlice,
    previewThemeSetting: previewThemeSettingSlice,
    previewButtonSettings: previewButtonSettingsSlice,
    previewAuthenticationScreen: previewAuthenticationScreenSlice,
    previewSubscriptionSettings: previewSubscriptionSettingsSlice,
    previewCustomCss: previewCustomCssSlice,
    dataBuilderAndBranding: dataBuilderAndBrandingSlice,
    menuBreadcrumbSlice: menuBreadcrumbSlice,
    menuHeaderSlice: menuHeaderSlice,
    dataSubject: dataSubjectSlice,
    filterReportDataSubjectSlice: filterReportDataSubjectSlice,
    module: module,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
