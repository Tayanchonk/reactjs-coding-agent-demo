import React from "react";
import { Button } from "../CustomComponent";
import { exportPDF } from "../../services/powerBIService";

interface ExportButtonProps {
  workspaceId: string;
  reportId: string;
  pdfName: string;
}

export default function ExportPdfButton({ workspaceId, reportId, pdfName }: ExportButtonProps) {
  const handleExport = async () => {
    try {
      const blob = await exportPDF(workspaceId, reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      console.log('ดาวน์โหลด PDF ไม่สำเร็จ');
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="bg-primary-blue text-white"
      variant="outlined">
      <p className="text-base">Download PDF</p>
    </Button>
  );
}
