import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import InterfaceAndBranding from "./pages/Settings/InterfaceAndBranding";
import UsermanageMent from "./pages/Settings/UsermanageMent";
import GeneralSettings from "./pages/Settings/GeneralSettings";
import ConsentSettings from "./pages/Settings/ConsentSettings";
import BulkImportData from "./pages/Settings/BulkImportData";
import NoPage from "./pages/NoPage";
import ByPeriod from "./pages/Analytics/ByPeriod";
import Users from "./pages/Settings/UsermanageMent/User/User";
import LoginPage from "./pages/Login/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./Layout";
import RolePermission from "./pages/Settings/UsermanageMent/RoleAndPermission/RolePermission";
import RoleAndPermission from "./pages/Settings/UsermanageMent/RoleAndPermission";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import DataElementPage from "./pages/consent/DataElement/DataElementPage";
import DataElementForm from "./pages/consent/DataElement/DataElementForm";
import DataElementInfo from "./pages/consent/DataElement/DataElementFormOutlet/DataElementInfo";
import DataElementInterface from "./pages/consent/DataElement/DataElementFormOutlet/DataElementInterface";
import DataElementTranslation from "./pages/consent/DataElement/DataElementFormOutlet/DataElementTranslationM";
import Interface from "./pages/consent/Interface";
import InterfaceForm from "./pages/consent/Interface/InterfaceForm";
import InterfaceBuilderAndBranding from "./pages/consent/Interface/InterfaceForm/BuilderAndBranding";
import InterfaceInformation from "./pages/consent/Interface/InterfaceForm/Information";
import InterfaceIntegration from "./pages/consent/Interface/InterfaceForm/Integration";
import InterfaceReceipt from "./pages/consent/Interface/InterfaceForm/Receipt";
import InterfaceSetting from "./pages/consent/Interface/InterfaceForm/Setting";
import InterfaceTransaction from "./pages/consent/Interface/InterfaceForm/Transaction";
import InterfaceTranslation from "./pages/consent/Interface/InterfaceForm/Translation";
import UserInRole from "./pages/Settings/UsermanageMent/RoleAndPermission/userInRole";
import Purpose from "./pages/consent/Purpose";
import StandardPurpose from "./pages/consent/Purpose/StandardPurpose";
import PreferencePurpose from "./pages/consent/Purpose/PreferencePurpose";
import PreferencePurposeForm from "./pages/consent/Purpose/PreferencePurpose/PreferencePurposeForm";
import ScheduledItems from "./pages/Settings/ConsentSettings/Content/ScheduledItems";

import PrivacyNoticesManangeMent from "./pages/Privacy/PrivacyNoticesManagement/PrivacyNoticesManagement";
import PrivacyNotices from "./pages/Privacy/PrivacyNotices";
import ReceiptPage from "./pages/consent/DataSubject/receipt";
import ReceiptDetailsPage from "./pages/consent/DataSubject/receipt/detail";
import TransactionDetailPage from "./pages/consent/DataSubject/transaction/detail/index";
import TransactionPage from "./pages/consent/DataSubject/transaction";

import PreviewNewTab from "./pages/consent/Interface/InterfaceForm/BuilderAndBranding/Preview/previewNewTab";
import DataSubjectProfiles from "./pages/consent/DataSubjectProfiles";
import DataSubjectProfileInterfaceForm from "./pages/consent/DataSubjectProfiles/InterfaceForm";
import Information from "./pages/consent/DataSubjectProfiles/InterfaceForm/Information";
import Purposes from "./pages/consent/DataSubjectProfiles/InterfaceForm/Purposes";
import Receipt from "./pages/consent/DataSubjectProfiles/InterfaceForm/Receipt";
import Transaction from "./pages/consent/DataSubjectProfiles/InterfaceForm/Transaction";
import DashboardPage from "./pages/Dashboard";
import DailyConsent from "./pages/Dashboard/DailyConsent";
import MonthlyConsent from "./pages/Dashboard/MonthlyConsent";
import YearlyConsent from "./pages/Dashboard/YearlyConsent";
import SpecificDateConsent from "./pages/Dashboard/SpecificDateConsent";
import ClientCredentialListPage from "./pages/Settings/ClientCredential";
import ClientCredentialInfo from "./pages/Settings/ClientCredential/info";
import ReportDataSubjectProfileConsent from "./pages/Dashboard/ReportDataSubjectProfileConsent";
import CreateReportDataSubjectProfileConsent from "./pages/Dashboard/ReportDataSubjectProfileConsent/create";


const App: React.FC = () => {

  useEffect(() => {
    const path = location.pathname;
    if (
      !(
        path.startsWith("/consent/consent-interface/view/") ||
        path.startsWith("/consent/consent-interface/edit/")
      )
    ) {
      localStorage.removeItem("nameConsent");
    }
    if (
      !(
        path.startsWith("/consent/consent-interface/create/")
      )
    ) {
      localStorage.removeItem("isCreating");
    }
  }, [location.pathname]);

  return useRoutes([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/forgot-password",
      element: <LoginPage />,
    },
    {
      path: "/reset-password",
      element: <LoginPage />,
    },
    {
      path: "/set-password",
      element: <LoginPage />,
    },
    {
      path: "/2fa",
      element: <LoginPage />,
    },
    {
      path: "/access-denied",
      element: (
        <PrivateRoute>
          <Layout>
            <AccessDeniedPage />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Layout>
            <Home />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/consent",
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        // {
        //   path: "consent-interface",
        //   element: <ConsentInterface />,

        // },
        {
          path: "purpose",
          element: <Purpose />,
          children: [
            {
              path: "standard-purpose",
              element: <StandardPurpose />,
              children: [
                {
                  path: "new-spurpose",
                },
                {
                  path: "view-spurpose/:id",
                },
                {
                  path: "edit-spurpose/:id",
                },
              ],
            },
            {
              path: "preference-purpose",
              element: <PreferencePurpose />,
              children: [
                {
                  path: "create-preference-purpose",
                  element: <PreferencePurposeForm />,
                },
                {
                  path: "edit-preference-purpose",
                  element: <PreferencePurposeForm />,
                },
                {
                  path: "view-preference-purpose",
                  element: <PreferencePurposeForm />,
                },
              ],
            },
          ],
        },
        {
          path: "data-element",
          element: <DataElementPage />,
        },
        {
          path: "data-element/:mode/:id?",
          element: <DataElementForm />,
          children: [
            {
              path: "info",
              element: <DataElementInfo />,
            },
            {
              path: "interface",
              element: <DataElementInterface />,
            },
            {
              path: "translation",
              element: <DataElementTranslation />,
            },
          ],
        },
        {
          path: "receipts",
          element: <ReceiptPage />,
        },
        {
          path: "receipts/details/:id",
          element: <ReceiptDetailsPage />,
        },
        {
          path: "transaction",
          element: <TransactionPage />,
        },
        {
          path: "transaction/details/:id",
          element: <TransactionDetailPage />,
        },
        {
          path: "consent-interface",
          element: <Interface />,
        },
        {
          path: "consent-interface/:mode/:id?",
          element: <InterfaceForm />,
          children: [
            {
              path: "info",
              element: <InterfaceInformation />,
            },
            {
              path: "builder-branding",
              element: <InterfaceBuilderAndBranding />,
            },
            {
              path: "integration",
              element: <InterfaceIntegration />,
            },
            {
              path: "receipt",
              element: <InterfaceReceipt />,
            },
            {
              path: "transactions",
              element: <InterfaceTransaction />,
            },
            {
              path: "setting",
              element: <InterfaceSetting />,
            },
            {
              path: "translation",
              element: <InterfaceTranslation />,
            },
          ],
        },
        {
          path: "data-subject",
          element: <DataSubjectProfiles />,
        },
        {
          path: "data-subject/:mode/:id?",
          element: <DataSubjectProfileInterfaceForm />,
          children: [
            {
              path: "information",
              element: <Information />,
            },
            {
              path: "purposes",
              element: <Purposes />,
            },
            {
              path: "receipts",
              element: <Receipt />,
            },
            {
              path: "transactions",
              element: <Transaction />,
            },
          ],
        },
      ],
    },
    {
      path: "/setting",
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "bulk-data-import",
          element: <BulkImportData />
        },
        {
          path: "interface-branding",
          element: <InterfaceAndBranding />,
        },
        {
          path: "general-setting",
          element: <GeneralSettings />,
          children: [
            {
              path: "date-time",
              element: <GeneralSettings />,
            },
            {
              path: "email-language",
              element: <GeneralSettings />,
            },
            {
              path: "session-setting",
              element: <GeneralSettings />,
            },
          ],
        },
        {
          path: "user-management",
          element: <UsermanageMent />,
          children: [
            {
              path: "user",
              element: <UsermanageMent />,
              // children: [{
              //   path: "create-new-user",
              // },
              // {
              //   path: "edit-user",
              // },]
            },
            {
              path: "organization",
              element: <UsermanageMent />,
            },
            {
              path: "role-permission",
              element: <RoleAndPermission />,
            },
          ],
        },
        { path: "user-management/user/users", element: <Users /> },
        {
          path: "user-management/role-permission/role-permissions",
          element: <RolePermission />,
        },
        {
          path: "user-management/role-permission/user-in-role",
          element: <UserInRole />,
        },
        {
          path: "consent-setting",
          element: <ConsentSettings />,
          children: [
            {
              path: "general-consent",
              element: <ConsentSettings />,
            },
            {
              path: "accessed-token-link",
              element: <ConsentSettings />,
            },
            {
              path: "data-retention",
              element: <ConsentSettings />,
            },
          ],
        },
        {
          path: "consent-setting/data-retention/retention-activities-logs",
          element: <ScheduledItems />,
        },
        {
          path: "client-credentials",
          element: <ClientCredentialListPage />,
        },
        {
          path: "client-credentials/info/:mode/:id",
          element: <ClientCredentialInfo />,
        }

      ],
    },
    {
      path: "/analytics/by-period",
      element: (
        <PrivateRoute>
          <Layout>
            <ByPeriod />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/privacy",
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "privacy-notices",
          element: <PrivacyNotices />,
        },
        {
          path: "privacy-notices/privacy-notices-management/:mode/:id",
          element: <PrivacyNoticesManangeMent />,
        },
      ],
    },
    {
      path: "*",
      element: (
        <PrivateRoute>
          <Layout>
            <NoPage />
          </Layout>
        </PrivateRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "consent-dashboard",
          element: <DashboardPage />,
        },
        {
          path: "consent-dashboard/daily",
          element: <DailyConsent />,
        },
        {
          path: "consent-dashboard/monthly",
          element: <MonthlyConsent />,
        },
        {
          path: "consent-dashboard/specific-date",
          element: <SpecificDateConsent />,
        },
        {
          path: "consent-dashboard/yearly",
          element: <YearlyConsent />,
        },
        {
          path: "report-data-subject-profile-consent",
          element: <ReportDataSubjectProfileConsent />,

        },
        {
          path: "report-data-subject-profile-consent/create-reports",
          element: <CreateReportDataSubjectProfileConsent />,
        },
        {
          path: "report-data-subject-profile-consent/:mode/:id",
          element: <CreateReportDataSubjectProfileConsent />,
        }
      ],

    },
    // {
    //   path: "/setting/client-credentials",
    //   element: (
    //     <PrivateRoute>
    //       <Layout>
    //         <ClientCredentialListPage />
    //       </Layout>
    //     </PrivateRoute>
    //   ),
    // },
    //    {
    //   path: "/setting/client-credentials/info/:mode/:id",
    //   element: (
    //     <PrivateRoute>
    //       <Layout>
    //         <ClientCredentialInfo />
    //       </Layout>
    //     </PrivateRoute>
    //   ),
    // },
    {
      path: "preview-consent",
      element: <PreviewNewTab />,
    }
  ]);
};

export default App;
