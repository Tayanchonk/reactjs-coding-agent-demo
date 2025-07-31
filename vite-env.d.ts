interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly Workspace_BI: string;
    readonly Report_Daliy_ID: string;
    readonly Datasets_Daliy_ID: string;
    readonly Report_SpecificDate_ID: string;
    readonly Datasets_SpecificDate_ID: string;
    readonly Report_Monthly_ID: string;
    readonly Datasets_Monthly_ID: string;
    readonly Report_Yearly_ID: string;
    readonly Datasets_Yearly_ID: string;
    readonly VITE_MCSA_INTEGRATION: string;
    // Add other environment variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}