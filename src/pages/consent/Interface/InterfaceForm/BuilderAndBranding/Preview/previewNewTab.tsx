import React, { useState, useEffect } from "react";
import Logo from "../../../../../../assets/mcf-logo.svg";
import parse from "html-react-parser";
import {
  Dropdown,
  DropdownOption,
  InputText,
  MultipleSelect,
  CheckBox,
  DatePiceker,
  Toggle,
} from "../../../../../../components/CustomComponent";
import DatePicker from "../../../../../../components/CustomComponent/DatePicker";
import MultipleSelectOption from "../../../../../../components/CustomComponent/MultipleSelect/MutipleSelectOption";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const PreviewNewTab = () => {
  const passValueFromStorage = localStorage.getItem(
    "getAllInterfaceDataPreview"
  );
  const parsedValue = passValueFromStorage
    ? JSON.parse(passValueFromStorage)
    : null;
  const builder = parsedValue?.builder;
  const branding = parsedValue?.branding;

  const [subscriptionSetting, setSubscriptionSetting] = useState<any>(
    branding?.subScriptionSetting
  );

  const count = builder.map((_, index: number) => index);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const countSection = [
    ...(builder?.flatMap((page: any) =>
      page.sections?.map((data: any, sectionIndex: number) => data.id)
    ) || []),
    ...(subscriptionSetting.subScriptionSettingsShow ? [1] : []),
  ];
  const [headerAndFooter, setHeaderAndFooter] = useState<any>(
    branding?.headerAndFooter
  );
  const [titlePage, setTitlePage] = useState<any>(branding?.titlePage);
  const [themeSettings, setThemeSettings] = useState<any>(
    branding?.themeSetting
  );
  const [buttonSettings, setButtonSettings] = useState<any>(
    branding?.buttonSetting
  );
  const [toggleSubscribeAll, setToggleSubscribeAll] = useState<boolean>(false);
  const [toggleUnSubscribeAll, setToggleUnSubscribeAll] =
    useState<boolean>(false);

  const [radioValues, setRadioValues] = useState<{ [key: string]: string }>({});

  let allContents: any[] = [];

  builder.forEach((page: any) => {
    page.sections.forEach((section: any) => {
      section.contents.forEach((content: any) => {
        allContents.push(content);
      });
    });
  });

  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // for tab sidebar
  const [selectedPageId, setSelectedPageId] = useState<string | null>(
    builder[0].pageId
  ); // for tab sidebar
  const [selectPageType, setSelectPageType] = useState<string | null>(
    builder[0].pageType
  ); // for tab sidebar
  const [openIndexesContent, setOpenIndexesContent] =
    useState<number[]>(countSection); // for content

  const [dropdownValues, setDropdownValues] = useState<{
    [key: string]: string;
  }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [checkboxStates, setCheckboxStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [inputDatePickerValues, setInputDatePickerValues] = useState<{
    [key: string]: string;
  }>({});
  const [checkboxMultipleStates, setCheckboxMultipleStates] = useState<{
    [idMainOption: string]: {
      [idOption: string]: {
        checked: boolean;
        text: string;
      };
    };
  }>({});

  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //toggleSelect

  const [selectedMulti, setSelectedMulti] = useState<any[]>([]);

  const [selectedValueToShow, setSelectedValueToShow] = useState<any[]>([]);

  const filteredContents = allContents.filter(
    (content) => content.pageId === selectedPageId
  );
  const toggleAccordion = (index: number, pageId: string, pageType: string) => {
    setSelectedPageId(pageId); // อัปเดต selectedPageId เมื่อมีการคลิกที่ accordion
    setSelectPageType(pageType);
    if (openIndexes.includes(index)) {
      // ถ้า index นี้เปิดอยู่ ให้ปิด
      setOpenIndexes([]);
    } else {
      // ถ้า index นี้ยังไม่เปิด ให้ปิดอันอื่นแล้วเปิดอันนี้
      setOpenIndexes([index]);
    }
  };

  const toggleAccordionContent = (index: number) => {
    if (openIndexesContent.includes(index)) {
      // ถ้า index นี้เปิดอยู่ ให้ปิด
      setOpenIndexesContent(openIndexesContent.filter((i) => i !== index));
    } else {
      // ถ้า index นี้ยังไม่เปิด ให้เพิ่มเข้าไป
      setOpenIndexesContent([...openIndexesContent, index]);
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงค่า input
  const handleInputChange = (id: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: value, // อัปเดตค่าของ input ตาม id
    }));
  };
  // ฟังก์ชันสำหรับอัปเดตค่า dropdown
  const handleDropdownChange = (id: string, value: string) => {
    setDropdownValues((prev) => ({
      ...prev,
      [id]: value, // อัปเดตค่าของ dropdown ตาม id
    }));
  };

  const handleCheckboxChange = (id: string) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [id]: !prev[id], // สลับสถานะ checked ของ checkbox ที่มี id ตรงกัน
    }));
  };

  const handleDateChange = (
    contentId: string | undefined,
    date: Date | null
  ) => {
    if (!contentId) return; // ตรวจสอบว่า ContentId มีค่าหรือไม่
    setInputDatePickerValues((prevValues) => ({
      ...prevValues,
      [contentId]: date ? date.toISOString() : "", // เก็บค่าเป็น ISO string หรือค่าว่าง
    }));
  };

  const handleCheckboxMultipleChange = (
    idMainOption: number,
    idOption: string,
    optionText: string
  ) => {
    setCheckboxMultipleStates((prev) => {
      // ตรวจสอบว่า idMainOption มีอยู่ใน state หรือไม่
      const mainOptionState = prev[idMainOption] || {};

      // สลับสถานะ checked ของ idOption
      const isChecked = !mainOptionState[idOption]?.checked;

      // อัปเดตสถานะโดยแยก idMainOption และ idOption
      return {
        ...prev,
        [idMainOption]: {
          ...mainOptionState,
          [idOption]: {
            checked: isChecked,
            text: optionText,
          },
        },
      };
    });
  };

  // ฟังก์ชันจัดการเปิด/ปิด dropdown ตาม id
  const handleDropdownToggle = (id: string) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // สลับสถานะของ dropdown ตาม id
    }));
  };

  type OptionState = {
    checked: boolean;
    text: string;
  };

  type MainOptions = Record<string, OptionState>;

  type Data = Record<string, MainOptions>;

  const groupByKey = (data: Data): Record<string, string[]> => {
    const grouped: Record<string, string[]> = {};

    Object.entries(data).forEach(([_, mainOptions]) => {
      Object.entries(mainOptions).forEach(([key, optionState]) => {
        if (optionState.checked) {
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(optionState.text);
        }
      });
    });

    return grouped;
  };
  useEffect(() => {
    const groupedData = groupByKey(checkboxMultipleStates);
    setSelectedValueToShow(groupedData);
  }, [checkboxMultipleStates]);
  // จัดกลุ่มข้อมูล

  useEffect(() => { }, [openIndexes]);

  const handleRadioClick = (contentId: string, value: string) => {
    setRadioValues((prev) => ({
      ...prev,
      [contentId]: value,
    }));
  };

  const [isRadioInitialSet, setIsRadioInitialSet] = useState(false);
  const [isCheckboxInitialSet, setIsCheckboxInitialSet] = useState(false);
  const [isDropdownInitialSet, setIsDropdownInitialSet] = useState(false);

  useEffect(() => {
    // --- RADIO ---
    if (!isRadioInitialSet) {
      const initialRadioValues: { [key: string]: string } = {};

      builder?.forEach((page: any) => {
        page.sections?.forEach((section: any) => {
          section.contents?.forEach((content: any) => {
            if (
              content?.fieldTypeName === "preference_purpose" &&
              content?.element?.selectedPreferencePurpose
                ?.prefPurposeSelectionJson?.multipleSelections === false
            ) {
              const options =
                content?.element?.selectedPreferencePurpose
                  ?.prefPurposeSelectionJson?.options || [];
              const selectedOption = options.find(
                (option: any) => option.selected
              );
              if (selectedOption) {
                initialRadioValues[content.ContentId] = selectedOption.text;
              }
            }
          });
        });
      });

      setRadioValues(initialRadioValues);
      setIsRadioInitialSet(true);
    }

    // --- CHECKBOX MULTIPLE ---
    if (!isCheckboxInitialSet) {
      const initialCheckboxStates: {
        [idMainOption: string]: {
          [idOption: string]: {
            checked: boolean;
            text: string;
          };
        };
      } = {};

      builder?.forEach((page: any) => {
        page.sections?.forEach((section: any) => {
          section.contents?.forEach((content: any, indexMulti: number) => {
            // data_element แบบ multipleSelections
            if (
              content?.fieldTypeName === "data_element" &&
              content?.element?.selectedDataElement?.dataElementTypeName ===
              "Selection" &&
              content?.element?.selectedDataElement?.selectionJson
                ?.multipleSelections
            ) {
              content?.element?.selectedDataElement?.selectionJson?.options?.forEach(
                (option: any, optionIndex: number) => {
                  if (!initialCheckboxStates[optionIndex])
                    initialCheckboxStates[optionIndex] = {};
                  initialCheckboxStates[optionIndex][content.ContentId] = {
                    checked:
                      option?.text ===
                      content?.element?.selectedDataElement?.selectionJson
                        ?.default[0],
                    text: option.text,
                  };
                }
              );
            }
            // preference_purpose แบบ multipleSelections
            if (
              content?.fieldTypeName === "preference_purpose" &&
              content?.element?.selectedPreferencePurpose
                ?.prefPurposeSelectionJson?.multipleSelections
            ) {
              content?.element?.selectedPreferencePurpose?.prefPurposeSelectionJson?.options?.forEach(
                (option: any, optionIndex: number) => {
                  if (!initialCheckboxStates[optionIndex])
                    initialCheckboxStates[optionIndex] = {};
                  initialCheckboxStates[optionIndex][content.ContentId] = {
                    checked: !!option.selected,
                    text: option.text,
                  };
                }
              );
            }
          });
        });
      });

      setCheckboxMultipleStates(initialCheckboxStates);
      setIsCheckboxInitialSet(true);
    }

    // --- DROPDOWN (Selection แบบ single) ---
    if (!isDropdownInitialSet) {
      const initialDropdownValues: { [key: string]: string } = {};

      builder?.forEach((page: any) => {
        page.sections?.forEach((section: any) => {
          section.contents?.forEach((content: any) => {
            if (
              content?.fieldTypeName === "data_element" &&
              content?.element?.selectedDataElement?.dataElementTypeName ===
              "Selection" &&
              content?.element?.selectedDataElement?.selectionJson
                ?.multipleSelections === false
            ) {
              const options =
                content?.element?.selectedDataElement?.selectionJson?.options ||
                [];
              const selectedOption = options.find(
                (option: any) =>
                  option.text ===
                  content?.element?.selectedDataElement?.selectionJson
                    ?.default[0]
              );

              if (selectedOption) {
                initialDropdownValues[content.ContentId] = selectedOption.text;
              }
            }
          });
        });
      });

      setDropdownValues(initialDropdownValues);
      setIsDropdownInitialSet(true);
    }
  }, [builder, isRadioInitialSet, isCheckboxInitialSet, isDropdownInitialSet]);
  return (
    <>
      <style>{branding.customCss.customCss}</style>
      <div className="w-full">
        {headerAndFooter.header.show ? (
          <>
            {/* HEADER */}
            <div
              className={`w-full px-4 py-3`}
              style={{ backgroundColor: headerAndFooter.header.bgColor }}
            >
              <div className="flex items-center justify-between">
                <img
                  id="imageLogo"
                  src={
                    headerAndFooter.header.logo !== ""
                      ? headerAndFooter.header.logo
                      : Logo
                  }
                  className="h-[30px]"
                  alt={headerAndFooter.header.altLogo}
                />

                {/* Hamburger icon: แสดงเฉพาะหน้าจอเล็ก (mobile) */}
                <button
                  className="block text-gray-700 lg:hidden"
                  onClick={() => setIsOpenMenu(true)} // หรือ toggle อะไรที่คุณใช้
                >
                  {/* ใช้ไอคอน hamburger จาก heroicons หรือ svg */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#fff"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

          </>
        ) : (
          // show hamburger icon only 
          <>
            <div className="absolute right-0 block px-4 py-3 lg:hidden top-1">
              <button
                className="block text-gray-700"
                onClick={() => setIsOpenMenu(true)} // หรือ toggle อะไรที่คุณใช้
              >
                {/* ใช้ไอคอน hamburger จาก heroicons หรือ svg */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

            </div>

            {/* button logout
            <button
              className="bg-[#3758F9] text-white rounded px-4 py-2 hidden lg:block absolute top-2 right-4"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button> */}
          </>

        )}
        {titlePage.showTitle && (
          // TITLE PAGE
          <div
            id="header"
            className="h-[150px] flex items-center justify-center"
            style={{
              ...(titlePage.backgroundType === "Color"
                ? { backgroundColor: titlePage.backgroundColor }
                : {
                  backgroundImage: `url(${titlePage.backgroundImg})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }),
            }}
          >
            <p
              className="font-semibold "
              style={{
                fontSize: titlePage.fontSize,
                color: titlePage.fontColor,
              }}
            >
              {titlePage.pageTitle}
            </p>
          </div>
        )}
        {isOpenMenu && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay ดำจาง */}
            <div
              className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300 ease-in-out"
              onClick={() => setIsOpenMenu(false)}
            >

            </div>
        
            {/* Drawer ด้านซ้าย */}
            <div className="bg-white relative z-50 h-full bg-white shadow-lg animate-slide-in-left w-[80vw]">
                  <div className="absolute top-0 z-50 p-4 " style={{ right: -50 }}>
              <button className="font-bold text-white" onClick={() => setIsOpenMenu(false)}>✕</button>
            </div>
              {builder?.map((item: any, index: number) => {
                return (
                  <div key={item.pageId}>
                    <div
                      className="bg-[#E3E8EC] flex py-5 cursor-pointer header-accordion"
                      onClick={() =>
                        toggleAccordion(index, item.pageId, item.pageType)
                      }
                    >
                      <div className="w-10/12 pl-5 text-base font-semibold"
                        style={{
                          color: themeSettings?.fontColor,
                          fontSize: themeSettings?.fontSize,
                        }}
                      >
                        {item?.pageName}
                      </div>
                      <div className="w-2/12 justify-end flex pr-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-label="Expand"
                          className={`size-6 transform transition-transform ${openIndexes.includes(index) ? "rotate-180" : ""
                            }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {openIndexes.includes(index) && (
                      <>
                        {item.sections.map((item: any, index: number) => {
                          if (!item.show) return null; // ถ้า show เป็น false ให้ข้ามไป

                          return (
                            <div
                              className="bg-white flex py-5 border-b"
                              key={item.id}
                            >
                              <a
                                href={`#${item.id}`}
                                onClick={()=> setIsOpenMenu(false)}
                                className="w-10/12 pl-5 text-base font-semibold"
                                style={{
                                  color: themeSettings?.fontColor,
                                  fontSize: themeSettings?.fontSize,
                                }}
                              >
                                {item.text}
                              </a>
                              <div></div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                );
              })}
              {subscriptionSetting.subScriptionSettingsShow &&
                selectPageType === "consent_data" && (
                  <div className="bg-white flex py-5 border-b">
                    <a
                      href={`#subscription-setting`}

                      onClick={()=> setIsOpenMenu(false)}
                      className="w-10/12 pl-5 text-base font-semibold"
                      style={{
                        color: themeSettings?.fontColor,
                        fontSize: themeSettings?.fontSize,
                      }}
                    >
                      Subscription Settings
                    </a>
                    <div></div>
                  </div>
                )}
            </div>

          </div>
        )}
        <div className="flex flex-wrap pt-12  bg-[#F8F8F8] px-4 md:px-[50px] lg:px-[150px] pb-8">
          {/* TAB MENU */}
          <div className="hidden w-full bg-white lg:w-4/12 lg:block sm:mt-5 ">
            <div className="bg-white">
              {builder?.map((item: any, index: number) => {
                return (
                  <div key={item.pageId}>
                    <div
                      className="bg-[#E3E8EC] flex py-5 cursor-pointer header-accordion"
                      onClick={() =>
                        toggleAccordion(index, item.pageId, item.pageType)
                      }
                    >
                      <div className="w-10/12 pl-5 text-base font-semibold"
                        style={{
                          color: themeSettings?.fontColor,
                          fontSize: themeSettings?.fontSize,
                        }}
                      >
                        {item?.pageName}
                      </div>
                      <div className="w-2/12 justify-end flex pr-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-label="Expand"
                          className={`size-6 transform transition-transform ${openIndexes.includes(index) ? "rotate-180" : ""
                            }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {openIndexes.includes(index) && (
                      <>
                        {item.sections.map((item: any, index: number) => {
                          if (!item.show) return null; // ถ้า show เป็น false ให้ข้ามไป

                          return (
                            <div
                              className="bg-white flex py-5 border-b"
                              key={item.id}
                            >
                              <a
                                href={`#${item.id}`}
                                className="w-10/12 pl-5 text-base font-semibold"
                                style={{
                                  color: themeSettings?.fontColor,
                                  fontSize: themeSettings?.fontSize,
                                }}
                              >
                                {item.text}
                              </a>
                              <div></div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {subscriptionSetting.subScriptionSettingsShow &&
              selectPageType === "consent_data" && (
                <div className="bg-white flex py-5 border-b">
                  <a
                    href={`#subscription-setting`}
                    className="w-10/12 pl-5 text-base font-semibold"
                    style={{
                      color: themeSettings?.fontColor,
                      fontSize: themeSettings?.fontSize,
                    }}
                  >
                    Subscription Settings
                  </a>
                  <div></div>
                </div>
              )}

            <div className="bg-white"></div>
          </div>

          {/* CONTENT */}
          <div className="w-full lg:w-8/12 pl-0 lg:pl-[20px] sm:pt-5">
            {builder?.map((item: any, index: number) => {
              if (item.pageId !== selectedPageId) return null; // แสดงเฉพาะ pageId ที่เลือก
              return item?.sections.map((section: any, idContext: number) => {
                if (!section.show) return null; // ถ้า show เป็น false ให้ข้ามไป
                return (
                  <div key={section.id} id={`${section.id}`}>
                    {/* {index} {idContext} */}
                    <div
                      className={`header-accordion-content bg-white flex py-5 ${index === 0 && idContext === 0 ? `` : `border-t mt-1`
                        } border-b cursor-pointer`}
                      onClick={() => {
                        toggleAccordionContent(section.id);
                      }}
                    >
                      <div
                        className="w-10/12 pl-5 text-base font-semibold"
                        style={{
                          // background: themeSettings?.backgroundColor,
                          // border: `1px solid ${themeSettings?.borderColor}`,
                          color: themeSettings?.fontColor,
                          fontSize: themeSettings?.fontSize,
                        }}
                      >
                        {section?.text}
                      </div>
                      {/* <div>{section.id}</div> */}
                      <div className="w-2/12 justify-end flex pr-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-label="Expand"
                          className={`size-6 transform transition-transform ${openIndexesContent.includes(section.id)
                              ? "rotate-180"
                              : ""
                            }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {openIndexesContent.includes(section.id) && (
                      <div className="p-5 bg-white pl-[40px] pr-[40px]">
                        {filteredContents?.map(
                          (content: any, index: number) => {
                            if (content.sectionId === section.id) {
                              if (content?.fieldTypeName === "data_element") {
                                if (
                                  content?.element?.selectedDataElement
                                    ?.dataElementTypeName === "Email" ||
                                  content?.element?.selectedDataElement
                                    ?.dataElementTypeName === "Phone" ||
                                  content?.element?.selectedDataElement
                                    ?.dataElementTypeName === "Text Input" ||
                                  content?.element?.selectedDataElement
                                    ?.dataElementTypeName === "Number"
                                ) {
                                  return (
                                    <div
                                      key={
                                        content.ContentId || `content-${index}`
                                      }
                                    >
                                      <div
                                        className="flex text-base font-semibold whitespace-normal break-words break-all"
                                        style={{
                                          fontSize: themeSettings?.fontSize,
                                          color: themeSettings?.fontColor,
                                        }}
                                      >
                                        {content?.isRequired && (
                                          <span className="text-[red] pr-1">
                                            *
                                          </span>
                                        )}
                                        {
                                          content?.element?.selectedDataElement
                                            ?.dataElementName
                                        }
                                        {content?.isIdentifier && (
                                          <div className="pl-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24"
                                              fill="#3758F9"
                                              className="size-5"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <input
                                          type={`text`}
                                          className="my-2 w-full rounded h-[42px] px-3"
                                          placeholder=""
                                          style={{
                                            background:
                                              themeSettings?.backgroundColor,
                                            border: `1px solid ${themeSettings?.borderColor}`,
                                            color:
                                              themeSettings?.placeHolderColor,
                                            fontSize: themeSettings?.fontSize,
                                          }}
                                          value={
                                            inputValues[content?.ContentId] ||
                                            ""
                                          } // ใช้ค่าใน state หรือค่าเริ่มต้น
                                          onChange={(e) =>
                                            handleInputChange(
                                              content?.ContentId,
                                              e.target.value
                                            )
                                          } // อัปเดตค่าเมื่อเปลี่ยน
                                        />
                                      </div>
                                    </div>
                                  );
                                }
                                if (
                                  content?.element?.selectedDataElement
                                    ?.dataElementTypeName === "Selection" &&
                                  content?.element?.selectedDataElement
                                    ?.selectionJson?.multipleSelections === true
                                ) {
                                  return (
                                    <>
                                      <div
                                        className="flex text-base font-semibold whitespace-normal break-words break-all"
                                        style={{
                                          fontSize: themeSettings?.fontSize,
                                          color: themeSettings?.fontColor,
                                        }}
                                      >
                                        {content?.isRequired && (
                                          <span className="text-[red] pr-1">
                                            *
                                          </span>
                                        )}
                                        {
                                          content?.element?.selectedDataElement
                                            ?.dataElementName
                                        }
                                        {content?.isIdentifier && (
                                          <div className="pl-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24"
                                              fill="#3758F9"
                                              className="size-5"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <>
                                        <div
                                          className={`mt-3 relative ${!dropdownStates[
                                            content?.ContentId
                                            ] && `mb-3`
                                            }`}
                                        >
                                          <div className="relative">
                                            <input
                                              type="text"
                                              value={searchQuery}
                                              onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                              }
                                              onClick={() =>
                                                setIsDropdownOpen(true)
                                              }
                                              // placeholder={t("purpose.standardPurpose.preferenceModal.selectPlaceholder")}
                                              placeholder="Please Select"
                                              style={{
                                                border: `1px solid ${themeSettings?.borderColor}`,
                                                color:
                                                  themeSettings?.placeHolderColor,
                                                fontSize:
                                                  themeSettings?.fontSize,
                                              }}
                                              className="w-full border rounded-md px-4 py-2"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleDropdownToggle(
                                                  content?.ContentId
                                                )
                                              }
                                              className="absolute inset-y-0 right-0 flex items-center pr-3 z-10"
                                            >
                                              {dropdownStates[
                                                content?.ContentId
                                              ] ? (
                                                <FaChevronUp className="text-gray-500" />
                                              ) : (
                                                <FaChevronDown className="text-gray-500" />
                                              )}
                                            </button>
                                          </div>

                                          {dropdownStates[content?.ContentId] &&
                                            content?.element
                                              ?.selectedDataElement
                                              ?.selectionJson?.options.length >
                                            0 && (
                                              <div className="relative w-full mt-0 p-0 bg-white border rounded-md max-h-60 overflow-y-auto mb-3">
                                                <hr className="w-[96%] mx-auto border-gray-200" />
                                                {/* List Items */}
                                                {content?.element?.selectedDataElement?.selectionJson?.options.map(
                                                  (
                                                    option: any,
                                                    indexMulti: number
                                                  ) => (
                                                    <div key={option.id}>
                                                      <label
                                                        key={option.id}
                                                        // onClick={() => toggleSelect(option)}
                                                        className={`flex items-center space-x-4 px-4 py-2 cursor-pointer hover:bg-gray-100 ${index !==
                                                            content?.element
                                                              ?.selectedDataElement
                                                              ?.selectionJson
                                                              ?.options.length -
                                                            1
                                                            ? ""
                                                            : ""
                                                          }`}
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          className="rounded"
                                                          style={{
                                                            width:
                                                              themeSettings?.fontSize,
                                                            height:
                                                              themeSettings?.fontSize,
                                                            backgroundColor:
                                                              checkboxMultipleStates[
                                                                indexMulti
                                                              ]?.[
                                                                content
                                                                  ?.ContentId
                                                              ]?.checked
                                                                ? themeSettings?.activeColor // สีเมื่อ checked = true
                                                                : themeSettings?.inActiveColor, // สีเมื่อ checked = false
                                                            borderColor:
                                                              checkboxMultipleStates[
                                                                indexMulti
                                                              ]?.[
                                                                content
                                                                  ?.ContentId
                                                              ]?.checked
                                                                ? themeSettings?.activeColor
                                                                : themeSettings?.inActiveColor,
                                                          }}
                                                          checked={
                                                            checkboxMultipleStates[
                                                              indexMulti
                                                            ]?.[
                                                              content?.ContentId
                                                            ]?.checked || false
                                                          }
                                                          onChange={() =>
                                                            handleCheckboxMultipleChange(
                                                              indexMulti,
                                                              content?.ContentId,
                                                              option.text
                                                            )
                                                          }
                                                        />
                                                        <span className="text-gray-900 truncate">
                                                          {option.text}
                                                        </span>
                                                      </label>
                                                      {/* ใส่เส้นใต้ทุกอัน ยกเว้นตัวสุดท้าย */}
                                                      {index !==
                                                        content?.element
                                                          ?.selectedDataElement
                                                          ?.selectionJson
                                                          ?.options.length -
                                                        1 && (
                                                          <hr className="w-[96%] mx-auto border-gray-200" />
                                                        )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-6">
                                          {Object.entries(
                                            selectedValueToShow
                                          ).map(([key, values]) => {
                                            if (content?.ContentId === key) {
                                              return (
                                                <div
                                                  key={key}
                                                  className="flex mb-2"
                                                >
                                                  {values.map(
                                                    (
                                                      value: any,
                                                      index: number
                                                    ) => (
                                                      <div
                                                        key={index}
                                                        className="p-2 bg-[#4361FF1A] rounded-md m-1"
                                                      >
                                                        {value}
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              );
                                            }
                                            return null; // Ensure a return value for all cases
                                          })}
                                        </div>
                                      </>
                                    </>
                                  );
                                }
                                if (
                                  content?.element?.selectedDataElement
                                    ?.dataElementTypeName === "Selection" &&
                                  content?.element?.selectedDataElement
                                    ?.selectionJson?.multipleSelections ===
                                  false
                                ) {
                                  return (
                                    <>
                                      <div
                                        className="flex text-base font-semibold whitespace-normal break-words break-all"
                                        style={{
                                          fontSize: themeSettings?.fontSize,
                                          color: themeSettings?.fontColor,
                                        }}
                                      >
                                        {content?.isRequired && (
                                          <span className="text-[red] pr-1">
                                            *
                                          </span>
                                        )}
                                        {
                                          content?.element?.selectedDataElement
                                            ?.dataElementName
                                        }
                                        {content?.isIdentifier && (
                                          <div className="pl-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24"
                                              fill="#3758F9"
                                              className="size-5"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <div className="py-3">
                                        <Dropdown
                                          id={`${content?.element?.selectedDataElement?.dataElementId}`}
                                          className={`w-full text-[${themeSettings?.fontSize}] font-[${themeSettings.fontColor}]`}
                                          longText={true}
                                          selectedName={
                                            dropdownValues[
                                            content?.ContentId
                                            ] || "Select an option"
                                          }
                                        >
                                          {content?.element?.selectedDataElement?.selectionJson?.options.map(
                                            (option: any, i: any) => {
                                              return (
                                                <DropdownOption
                                                  key={i}
                                                  className="w-full"
                                                  onClick={() =>
                                                    handleDropdownChange(
                                                      content?.ContentId,
                                                      option.text
                                                    )
                                                  } // อัปเดตค่าเมื่อเลือก
                                                >
                                                  {option.text}
                                                </DropdownOption>
                                              );
                                            }
                                          )}
                                        </Dropdown>
                                        {/* <div className={`flex border border-[${themeSettings?.borderColor}] mt-3 py-3 rounded-md px-3`}
                                                                                style={{ border: `1px solid ${themeSettings?.borderColor}` }}
                                                                            >
                                                                                <div className="w-11/12"
                                                                                    style={{
                                                                                        fontSize: themeSettings?.fontSize,
                                                                                        color: themeSettings?.fontColor
                                                                                    }}
                                                                                >
                                                                                    Select
                                                                                </div>
                                                                                <div className="w-1/12 flex justify-end pr-3">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                            <div className={`border border-[${themeSettings?.borderColor}] mb-2`} style={{ border: `1px solid ${themeSettings?.borderColor}` }}>
                                                                                {
                                                                                    content?.element?.selectedDataElement?.selectionJson?.options.map((option: any, i: any) => {
                                                                                        return (
                                                                                            <div key={i} className="flex items-center border-b px-3 py-2">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    className="mr-2 rounded"
                                                                                                    style={{
                                                                                                        width: themeSettings?.fontSize,
                                                                                                        height: themeSettings?.fontSize,
                                                                                                        backgroundColor:themeSettings?.activeColor,
                                                                                                        borderColor:
                                                                                                            item?.element?.selectedDataElement?.selectionJson?.multipleSelections
                                                                                                                ? themeSettings?.activeColor
                                                                                                                : themeSettings?.inActiveColor,
                                                                                                    }}
                                                                                                    // checked={index % 2 === 0}
                                                                                                    value={option.text}
                                                                                                />
                                                                                                <label
                                                                                                    style={{
                                                                                                        fontSize: themeSettings?.fontSize,
                                                                                                        color: themeSettings?.fontColor
                                                                                                    }}
                                                                                                >{option.text}</label>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div> */}
                                      </div>
                                    </>
                                  );
                                }
                                if (
                                  content?.element?.selectedDataElement
                                    ?.dataElementTypeName === "Date"
                                ) {
                                  return (
                                    <>
                                      <div
                                        className="flex text-base font-semibold whitespace-normal break-words break-all"
                                        style={{
                                          fontSize: themeSettings?.fontSize,
                                          color: themeSettings?.fontColor,
                                        }}
                                      >
                                        {content?.isRequired && (
                                          <span className="text-[red] pr-1">
                                            *
                                          </span>
                                        )}
                                        {
                                          content?.element?.selectedDataElement
                                            ?.dataElementName
                                        }{" "}
                                        {content?.isIdentifier && (
                                          <div className="pl-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24"
                                              fill="#3758F9"
                                              className="size-5"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <div className="py-3">
                                        <DatePicker
                                          minWidth="100%"
                                          selectedDate={
                                            inputDatePickerValues[
                                              content?.ContentId
                                            ]
                                              ? new Date(
                                                inputDatePickerValues[
                                                content?.ContentId
                                                ]
                                              )
                                              : new Date()
                                          } // ใช้ค่าใน state หรือค่าเริ่มต้น
                                          onChange={(date) =>
                                            handleDateChange(
                                              content?.ContentId,
                                              date
                                            )
                                          } // อัปเดตค่าลงใน state
                                          placeholder="Select Date"
                                        />
                                      </div>
                                    </>
                                  );
                                }
                              }
                              if (
                                content?.fieldTypeName === "standard_purpose"
                              ) {
                                return (
                                  <div className="py-3">
                                    <div
                                      className="flex text-base font-semibold border p-3 whitespace-normal break-words break-all"
                                      style={{
                                        fontSize: themeSettings?.fontSize,
                                        color: themeSettings?.fontColor,
                                      }}
                                    >
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="mr-2 rounded"
                                          style={{
                                            width: themeSettings?.fontSize,
                                            height: themeSettings?.fontSize,
                                            backgroundColor: checkboxStates[
                                              content.ContentId
                                            ]
                                              ? themeSettings?.activeColor // สีเมื่อ checked = true
                                              : themeSettings?.inActiveColor, // สีเมื่อ checked = false
                                            borderColor: checkboxStates[
                                              content.ContentId
                                            ]
                                              ? themeSettings?.activeColor
                                              : themeSettings?.inActiveColor,
                                          }}
                                          checked={
                                            checkboxStates[content.ContentId] ||
                                            false
                                          }
                                          onChange={() =>
                                            handleCheckboxChange(
                                              content.ContentId
                                            )
                                          } // อัปเดตสถานะของ checkbox
                                        />
                                      </div>
                                      {content?.isRequired && (
                                        <span className="text-[red] pr-1">
                                          *
                                        </span>
                                      )}
                                      {
                                        content?.element
                                          ?.selectedStandardPurpose?.name
                                      }
                                      {content?.isIdentifier && (
                                        <div className="pl-2">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#3758F9"
                                            className="size-5"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }

                              if (
                                content?.fieldTypeName === "preference_purpose"
                              ) {
                                return (
                                  <div className="mb-3 border">
                                    <div
                                      className="flex text-base font-semibold  p-3 whitespace-normal break-words break-all"
                                      style={{
                                        fontSize: themeSettings?.fontSize,
                                        color: themeSettings?.fontColor,
                                      }}
                                    >
                                      {content?.isRequired && (
                                        <span className="text-[red] pr-1">
                                          *
                                        </span>
                                      )}
                                      {
                                        content?.element
                                          ?.selectedPreferencePurpose
                                          ?.prefPurposeName
                                      }
                                      {content?.isIdentifier && (
                                        <div className="pl-2">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#3758F9"
                                            className="size-5"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div className="px-5">
                                      {content?.element
                                        ?.selectedPreferencePurpose
                                        ?.prefPurposeSelectionJson
                                        ?.multipleSelections ? (
                                        <div className="">
                                          <>
                                            <div
                                              className={` ${!dropdownStates[
                                                content?.ContentId
                                                ] && `mb-4`
                                                }`}
                                            >
                                              {content?.element
                                                ?.selectedPreferencePurpose
                                                ?.prefPurposeSelectionJson
                                                ?.options.length > 0 && (
                                                  <div className="relative w-full mt-0 p-0 bg-white border rounded-md max-h-60 overflow-y-auto mb-3">
                                                    {/* Select All */}
                                                    {/* <div className="p-2">
                                                                                            <label className="flex items-center gap-4 pl-2 cursor-pointer" onClick={toggleSelectAll}>
                                                                                                <CheckBox
                                                                                                    shape="square"
                                                                                                    // checked={selectedPreferences.length === filteredOptions.length && filteredOptions.length > 0}
                                                                                                    // onChange={toggleSelectAll}
                                                                                                />
                                                                                                <span className="text-gray-900 font-medium">{t("purpose.standardPurpose.preferenceModal.selectAll")}</span>
                                                                                            </label>

                                                                                        </div> */}

                                                    {/* List Items */}
                                                    {content?.element?.selectedPreferencePurpose?.prefPurposeSelectionJson?.options.map(
                                                      (
                                                        option: any,
                                                        indexMulti: number
                                                      ) => (
                                                        <div key={option.id}>
                                                          <label
                                                            key={option.id}
                                                            // onClick={() => toggleSelect(option)}
                                                            className={`flex items-center space-x-4 px-4 py-2 cursor-pointer ${index !==
                                                                content?.element
                                                                  ?.selectedPreferencePurpose
                                                                  ?.prefPurposeSelectionJson
                                                                  ?.options.length -
                                                                1
                                                                ? ""
                                                                : ""
                                                              }`}
                                                          >
                                                            <input
                                                              type="checkbox"
                                                              className="rounded"
                                                              style={{
                                                                width:
                                                                  themeSettings?.fontSize,
                                                                height:
                                                                  themeSettings?.fontSize,
                                                                backgroundColor:
                                                                  checkboxMultipleStates[
                                                                    indexMulti
                                                                  ]?.[
                                                                    content
                                                                      ?.ContentId
                                                                  ]?.checked
                                                                    ? themeSettings?.activeColor // สีเมื่อ checked = true
                                                                    : themeSettings?.inActiveColor, // สีเมื่อ checked = false
                                                                borderColor:
                                                                  checkboxMultipleStates[
                                                                    indexMulti
                                                                  ]?.[
                                                                    content
                                                                      ?.ContentId
                                                                  ]?.checked
                                                                    ? themeSettings?.activeColor
                                                                    : themeSettings?.inActiveColor,
                                                              }}
                                                              checked={
                                                                checkboxMultipleStates[
                                                                  indexMulti
                                                                ]?.[
                                                                  content
                                                                    ?.ContentId
                                                                ]?.checked ??
                                                                false
                                                              }
                                                              onChange={() =>
                                                                handleCheckboxMultipleChange(
                                                                  indexMulti,
                                                                  content?.ContentId,
                                                                  option.text
                                                                )
                                                              }
                                                            />
                                                            <span
                                                              className="text-gray-900 truncate"
                                                              style={{
                                                                color:
                                                                  themeSettings.fontColor,
                                                                fontSize:
                                                                  themeSettings.fontSize,
                                                              }}
                                                            >
                                                              {option.text}
                                                            </span>
                                                          </label>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}
                                            </div>
                                          </>
                                        </div>
                                      ) : (
                                        <div className="mb-4 border rounded">
                                          {content?.element?.selectedPreferencePurpose?.prefPurposeSelectionJson?.options?.map(
                                            (option: any, i: any) => {
                                              return (
                                                <div
                                                  className="flex items-center px-3 py-2"
                                                  key={i}
                                                >
                                                  <input
                                                    type="radio"
                                                    name={content?.ContentId}
                                                    checked={
                                                      radioValues[
                                                      content?.ContentId
                                                      ] === option.text
                                                    }
                                                    onChange={() =>
                                                      handleRadioClick(
                                                        content?.ContentId,
                                                        option.text
                                                      )
                                                    }
                                                    style={{
                                                      fontSize:
                                                        themeSettings.fontSize,
                                                      backgroundColor:
                                                        radioValues[
                                                          content?.ContentId
                                                        ] === option.text
                                                          ? themeSettings.activeColor
                                                          : themeSettings.inActiveColor,
                                                    }}
                                                  />
                                                  <p
                                                    className={`text-[${themeSettings?.fontSize}] font-[${themeSettings.fontColor}] ml-2`}
                                                  >
                                                    {option.text}
                                                  </p>
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              }

                              if (content?.fieldTypeName === "content_text") {
                                return (
                                  <>
                                    <div
                                      className="flex text-base font-semibold whitespace-normal break-words break-all"
                                      style={{
                                        fontSize: themeSettings?.fontSize,
                                        color: themeSettings?.fontColor,
                                      }}
                                    >
                                      {content?.isRequired && (
                                        <span className="text-[red] pr-1">
                                          *
                                        </span>
                                      )}
                                      {
                                        content?.element?.selectedContentText
                                          ?.contentTitle
                                      }{" "}
                                      {content?.isIdentifier && (
                                        <div className="pl-2">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#3758F9"
                                            className="size-5"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <div
                                        className="w-full rounded h-auto mt-2 mb-3"
                                        style={{
                                          // border: `1px solid ${themeSettings?.borderColor}`,
                                          fontSize: themeSettings?.fontSize,
                                          color: themeSettings?.fontColor,
                                        }}
                                      >
                                        {content?.element?.selectedContentText
                                          ?.contentBody
                                          ? parse(
                                            content?.element
                                              ?.selectedContentText
                                              ?.contentBody
                                          )
                                          : ""}
                                      </div>
                                    </div>
                                  </>
                                );
                              }

                              <div
                                className="bg-white flex py-5 border-b"
                                key={index}
                              >
                                <div className="w-10/12 pl-5 text-base font-semibold">
                                  {content.fieldTypeName}
                                </div>
                              </div>;
                            }
                          }
                        )}
                      </div>
                    )}
                  </div>
                );
              });
            })}
            {subscriptionSetting.subScriptionSettingsShow &&
              selectPageType === "consent_data" && (
                <div className="mt-2" id="subscription-setting">
                  <div
                    className={`header-accordion-content bg-white flex py-5 border-t border-b cursor-pointer`}
                    onClick={() => {
                      toggleAccordionContent(1);
                    }}
                  >
                    <div
                      className="w-10/12 pl-5 text-base font-semibold"
                      style={{
                        // background: themeSettings?.backgroundColor,
                        // border: `1px solid ${themeSettings?.borderColor}`,
                        color: themeSettings?.fontColor,
                        fontSize: themeSettings?.fontSize,
                      }}
                    >
                      Subscription Settings
                    </div>
                    {/* <div>{section.id}</div> */}
                    <div className="w-2/12 justify-end flex pr-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-label="Expand"
                        className={`size-6 transform transition-transform ${openIndexesContent.includes(1) ? "rotate-180" : ""
                          }`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {openIndexesContent.includes(1) && (
                    <div className="p-5 bg-white pl-[40px] pr-[40px]">
                      <div className="pb-3">
                        <div className="bg-white px-5 pt-5 pb-3 flex">
                          <div className="m-auto  rounded-full bg-[#F3F7FF] p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="#3758F9"
                              className="size-7"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                              />
                            </svg>
                          </div>
                          <p
                            className={`text-base pl-3 font-[${themeSettings.fontColor}] text-[${themeSettings?.fontSize}]`}
                            style={{
                              fontSize: themeSettings?.fontSize,
                              color: themeSettings?.fontColor,
                            }}
                          >
                            This constitutes a request for comprehensive
                            consent. The consenting individual should thoroughly
                            review and understand each clause before providing
                            full consent.
                          </p>
                        </div>
                        {subscriptionSetting.subScribeAllShow && (
                          <div className="bg-white px-5 pt-5 flex">
                            <div className=" w-3/12 lg:w-1/12 m-auto">
                              <Toggle
                                checked={toggleSubscribeAll}
                                onChange={() =>
                                  setToggleSubscribeAll(!toggleSubscribeAll)
                                }
                              />
                            </div>
                            <div className="pl-3 w-9/12 lg:w-11/12">
                              <p
                                className="text-base font-semibold"
                                style={{
                                  fontSize: themeSettings?.fontSize,
                                  color: themeSettings?.fontColor,
                                }}
                              >
                                Subscribe All
                              </p>
                              <p
                                style={{
                                  fontSize: themeSettings?.fontSize,
                                  color: themeSettings?.fontColor,
                                }}
                              >
                                {subscriptionSetting.subscribeAllLabel}
                              </p>
                            </div>
                          </div>
                        )}
                        {subscriptionSetting.unSubscribeAllShow && (
                          <div className="bg-white px-5 pt-2 flex">
                            <div className=" w-3/12 lg:w-1/12 m-auto">
                              <Toggle
                                checked={toggleUnSubscribeAll}
                                onChange={() =>
                                  setToggleUnSubscribeAll(!toggleUnSubscribeAll)
                                }
                              />
                            </div>
                            <div className="pl-3 w-9/12 lg:w-11/12">
                              <p
                                className="text-base font-semibold"
                                style={{
                                  fontSize: themeSettings?.fontSize,
                                  color: themeSettings?.fontColor,
                                }}
                              >
                                Unsubscribe All
                              </p>
                              <p
                                style={{
                                  fontSize: themeSettings?.fontSize,
                                  color: themeSettings?.fontColor,
                                }}
                              >
                                {subscriptionSetting.unSubscribeAllLabel}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row w-full bg-white md:justify-center lg:justify-end pl-[40px] pr-[40px] py-3 pb-[20px]">
              {buttonSettings?.cancelLabelButtonShow && (
                <button
                  className="flex order-2 sm:order-2 md:order-1 sm:w-full  mt-5 justify-center items-center  border rounded-lg p-3 md:mr-2 lg:mr-2 md:w-[110px] lg:w-[110px] text-base font-semibold"
                  style={{
                    backgroundColor: buttonSettings?.cancelBackgroundColor,
                    color: buttonSettings?.cancelFontColor,
                    fontSize: themeSettings?.fontSize,
                  }}
                >
                  {buttonSettings?.cancelLabelButton}
                </button>
              )}
              <button
                className="flex items-center justify-center order-1 p-3 mt-5 text-base font-semibold border rounded-lg sm:order-1 md:order-2"
                style={{
                  backgroundColor: buttonSettings?.submitBackgroundColor,
                  color: buttonSettings?.submitFontColor,
                  fontSize: themeSettings?.fontSize,
                }}
              >
                {buttonSettings?.submitLabelButton}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        {headerAndFooter.footer.show && (
          <div
            className="py-2 text-center  bottom-0 w-full"
            style={{ backgroundColor: headerAndFooter.footer.backgroundColor }}
          >
            {parse(headerAndFooter.footer.footerContent)}
          </div>
        )}
      </div>
    </>
  );
};
export default PreviewNewTab;
