import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


const ExportFormattedTable = () => {
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // กำหนดคอลัมน์พร้อมฟอร์แมตเป็น Text
    worksheet.columns = [
      {
        header: "ID",
        key: "id",
        width: 15,
        style: { numFmt: "@" } // @ คือ ฟอร์แมต Text
      },
      {
        header: "Name",
        key: "name",
        width: 20,
        style: { numFmt: "@" }
      },
      {
        header: "Email",
        key: "email",
        width: 30,
        style: { numFmt: "@" }
      },
      {
        header: "BirthDay",
        key: "birthdate",
        width: 30,
        style: { numFmt: "@" }
      },
      {
        header: "Mobile",
        key: "mobile",
        width: 30,
        style: { numFmt: "@" }
      }
    ];

    const data = [
      { id: "", name: "", email: "", birthdate: "", mobile: "" },
    ];

    // ใส่ข้อมูลลง worksheet
    worksheet.addRows(data);

    // สร้าง Table จริง + ฟอร์แมต
    worksheet.addTable({
      name: "UserTable",
      ref: "A1",
      headerRow: true,
      style: {
        theme: "TableStyleMedium9",
        showRowStripes: true,
      },
      columns: [
        { name: "ID", filterButton: true },
        { name: "Name", filterButton: true },
        { name: "Email", filterButton: true },
        { name: "BirthDay", filterButton: true },
        { name: "Mobile", filterButton: true },
      ],
      rows: data.map((d) => [d.id, d.name, d.email, d.birthdate, d.mobile]),
    });

    // ✅ บันทึก
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "user_table_text_format.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>ส่งออก Excel พร้อม Table Format</h2>
      <button onClick={exportExcel} style={{ padding: "10px 20px", fontSize: "16px" }}>
        ดาวน์โหลด Excel
      </button>
    </div>
  );
};

export default ExportFormattedTable;
