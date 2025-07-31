import React, { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models, IReportEmbedConfiguration } from "powerbi-client";
import { getPowerBIToken } from "../../services/powerBIService";
import LoadingSpinner from "../LoadingSpinner";

interface PowerBIReportEmbedProps {
  reportName: string;
}

interface EmbedInfo {
  embedToken: string;
  embedUrl: string;
  reportId: string;
}

export default function PowerBIReportEmbed({ reportName }: PowerBIReportEmbedProps) {
  const [config, setConfig] = useState<EmbedInfo | null>(null);

  useEffect(() => {
    getPowerBI()
  }, []);

  async function getPowerBI() {
    try {
      const response = await getPowerBIToken(reportName);
      setConfig(response.data);
      console.log("Power BI config:", response.data);
    } catch (error) {
      console.error("Error fetching Power BI token:", error);
    }
  }

  if (!config) return <LoadingSpinner />;

  const embedConfig: IReportEmbedConfiguration = {
    type: "report",
    tokenType: models.TokenType.Embed,
    accessToken: config.embedToken,
    embedUrl: config.embedUrl,
    id: config.reportId,
    settings: {
      filterPaneEnabled: false
    }
  };

  return (
    <PowerBIEmbed
      embedConfig={embedConfig}
      cssClassName="w-full h-[calc(100vh-220px)] min-h-[400px]"
    />
  );
}