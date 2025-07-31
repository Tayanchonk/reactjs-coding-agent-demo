import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const FormatPath = (path: string): string => {
  return encodeURIComponent(
    path
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/&/g, "")
      .replace(/--+/g, "-")
  );
};
export const CapitalizeFirstLetter = (string: string) => {
  return string
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const handleURLforActiveSubmenu = (url: string) => {
  // ตรวจสอบว่ามี submenuname หรือไม่
  const parts = url.split("/").filter(Boolean); // แยก URL และตัดส่วนว่างออก

  // ถ้า URL มีส่วนประกอบมากกว่า 2 (module และ menuname)
  if (parts.length > 2) {
    return `/${parts[0]}/${parts[1]}`; // คืนค่าที่ตัด submenuname ออก
  }

  // ถ้าเป็นแบบ 1 (ไม่มี submenuname) คืนค่าเดิม
  return url;
};

export function formatDate(type: string, value: string | Date, options?: {
  dateFormat?: string;
  timeFormat?: string;
  timeZoneName?: string;
}): string {
  const parseDateTime = JSON.parse(localStorage.getItem("datetime") || "{}");
  const settings = {
    dateFormat: options?.dateFormat || parseDateTime.dateFormat || "DD/MM/YYYY",
    timeFormat: options?.timeFormat || parseDateTime.timeFormat || "HH:mm",
    timeZoneName: options?.timeZoneName || parseDateTime.timeZoneName || "Asia/Bangkok",
  };
  if (type === "date") {
    // console.log("settings.dateFormat", settings.dateFormat);
 
    return formatDateTime(value, settings.dateFormat, settings);
  }
    // console.log("🚀 ~ formatDate ~ settings.timeFormat:", settings.timeZoneName)
  return formatDateTime(
    value,
    `${settings.dateFormat} ${settings.timeFormat}`,
    settings
  );
}

export const GenerateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const formatDateTime = (
  value: string | Date,
  format: string,
  settings: any
): string => {
  return dayjs(value).tz(settings.timeZoneName).format(format);
};

export const extractOrgs = (orgs: any, result: any = []) => {
  orgs.forEach((org: any) => {
    result.push({ value: org.id, label: org.orgName });
    if (org.organizationChildRelationship) {
      extractOrgs(org.organizationChildRelationship, result);
    }
  });
  return result;
};

export const extractOrgsAndOrgLevel = (orgs: any, result: any = []) => {
  orgs.forEach((org: any) => {
    result.push({
      value: org.id,
      label: org.orgName,
      organizationLevel: org.organizationLevel,
    });
    if (org.organizationChildRelationship) {
      extractOrgsAndOrgLevel(org.organizationChildRelationship, result);
    }
  });
  return result;
};


export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0; // สุ่มเลขฐาน 16
    const value = char === "x" ? random : (random & 0x3) | 0x8; // กำหนดค่าเฉพาะสำหรับตำแหน่ง 'y'
    return value.toString(16); // แปลงเป็นเลขฐาน 16
  });
};

export const mapSectionsWithContentsForBuilderBranding = (
  pages: any[],
  sections: any[],
  sectionConsent: any[],
  contents: any[]
) => {
  // รวม sections และ sectionConsent
  const combinedSections = [
    // ...sections,
    ...(Array.isArray(sections) ? sections : []),
    ...(Array.isArray(sectionConsent) ? sectionConsent : []),
  ];

  // จัดกลุ่มตาม pageId
  const mappedPages = Object.values(
    combinedSections.reduce((acc: any, curr: any) => {
      if (!acc[curr.pageId]) {
        acc[curr.pageId] = {
          pageId: curr.pageId,
          sections: [], // เก็บ sections ในแต่ละ page
        };
      }

      // ดึง contents ที่ตรงกับ sectionId และ pageId
      const sectionContents = contents.filter(
        (content) =>
          content.pageId === curr.pageId && content.sectionId === curr.id
      );

      // เพิ่ม order ให้กับ contents
      let contentOrder = 1;
      const orderedContents = sectionContents.map((content) => ({
        ...content,
        order: contentOrder++, // เพิ่มฟิลด์ order
      }));

      // เพิ่ม section พร้อม contents เข้าไปใน page
      acc[curr.pageId].sections.push({
        id: curr.id,
        text: curr.text,
        show: curr.show,
        order: acc[curr.pageId].sections.length + 1, // เพิ่มฟิลด์ order ให้ section
        contents: orderedContents, // เพิ่ม contents ที่มี order
      });

      return acc;
    }, {})
  );

  // Merge pageName จาก pages เข้าไปใน mappedPages
  let pageOrder = 1;
  const mergedPages = mappedPages.map((page: any) => {
    const matchingPage = pages.find((p) => p.pageId === page.pageId);
    return {
      ...page,
      pageName: matchingPage ? matchingPage.pageName : null, // เพิ่ม pageName หรือ null ถ้าไม่เจอ
      pageType: matchingPage ? matchingPage.pageType : null, // เพิ่ม pageType หรือ null ถ้าไม่เจอ
      order: pageOrder++, // เพิ่มฟิลด์ order ให้ page
    };
  });

  return mergedPages;
};

export const isDate = (value: string): boolean => {
  const parsedDate = Date.parse(value);
  return !isNaN(parsedDate); // คืนค่า true ถ้า value เป็นวันที่
};