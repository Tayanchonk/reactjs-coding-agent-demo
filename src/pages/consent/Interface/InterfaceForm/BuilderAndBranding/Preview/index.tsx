import React, { useState, useEffect, useMemo } from "react";
import Logo from "../../../../../../assets/mcf-logo.svg";
import { InputText, Toggle } from "../../../../../../components/CustomComponent";
import { RootState } from "../../../../../../store/index";
import { useSelector, useDispatch } from "react-redux";
import parse from "html-react-parser";
import { getContentPersonalDataBySectionId } from "../../../../../../store/slices/contentPersonalDataBuilderAndBrandingSlice";
import { getContentConsentDataBySectionId } from "../../../../../../store/slices/contentConsentDataBuilderAndBrandingSlice";
import { mapSectionsWithContentsForBuilderBranding } from "../../../../../../utils/Utils";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "../../../../../../components/CustomComponent/DatePicker";
import { setDataSelectionPreview } from "../../../../../../store/slices/dataBuilderAndBrandingSlice";


const Preview = () => {
  const dispatch = useDispatch();
  const headerAndFooter = useSelector(
    (state: RootState) => state.previewHeaderAndFooter
  );
  const contentAll = useSelector(
    (state: RootState) => state.contentPersonalDataBuilderAndBranding.contents
  );

  const section = useSelector(
    (state: RootState) => state.sectionPersonalDataBuilderAndBranding.sections
  );
  // console.log("🚀 ~ Preview ~ section:", section)
  const sectionConsent = useSelector(
    (state: RootState) => state.sectionConsentDataBuilderAndBranding.sections
  );
  const page = useSelector(
    (state: RootState) => state.pageBuilderAndBranding.pages
  );
  const titlePage = useSelector(
    (state: RootState) => state.previewTitlePage.titlePage
  );

  const dataSelectionPreview = useSelector(
    (state: RootState) => state.dataBuilderAndBranding.dataSelectionPreview
  );

  const filterPage = page.filter((item) => item.pageId === dataSelectionPreview.pageId);


  // ------ global state interface branding ------

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
  const [dataPreviewRender, setDataPreviewRender] = useState<any>([])
  const [dataPreview, setDataPreview] = useState<any>([])



  // หา contents ทั้งหมดที่ตรงตาม pageId และ sectionId
  function filterSectionsByPageAndSection(data: any, targetPageId: string, targetSectionId: string) {
    const isPageIdValid = !!targetPageId;
    const isSectionIdValid = !!targetSectionId;

    // ถ้าไม่ส่งทั้ง pageId และ sectionId → คืนค่าเดิม
    if (!isPageIdValid && !isSectionIdValid) {
      return data;
    }

    return data
      .map((section: any) => {
        // ถ้ามี sectionId → ตรวจสอบให้ตรง
        if (isSectionIdValid && section.id !== targetSectionId) return null;

        const filteredContents = section.contents.filter((content: any) => {
          if (isPageIdValid && isSectionIdValid) {
            return content.pageId === targetPageId && content.sectionId === targetSectionId;
          } else if (isPageIdValid) {
            return content.pageId === targetPageId;
          }
          return true; // fallback เผื่อไว้
        });

        if (filteredContents.length === 0) return null;

        return {
          ...section,
          contents: filteredContents
        };
      })
      .filter((section: any) => section !== null);
  }




  const allState = {
    headerAndFooter: headerAndFooterState,
    titlePage: titlePageState,
    themeSetting: themeSettingState,
    buttonSetting: buttonSettingState,
    authenScreen: authenScreenState,
    subScriptionSetting: subScriptionSettingState,
    customCss: customCssState,
  }

  // console.log("allState", allState);


  // ------------------------------------------------


  const contents = useSelector((state: RootState) =>
    getContentPersonalDataBySectionId(
      state.contentPersonalDataBuilderAndBranding,
      sessionStorage.getItem("sectionIdForBuilderAndBranding") || "",
      sessionStorage.getItem("pageId") || ""
    )
  );
  // console.log("🚀 ~ Preview ~ contents:--------", contents)
  const contentConsent = useSelector((state: RootState) =>
    getContentConsentDataBySectionId(
      state.contentConsentDataBuilderAndBranding,
      sessionStorage.getItem("sectionIdForConsent") || ""
    )
  );

  useEffect(() => {
    dispatch(setDataSelectionPreview({
      pageId: "",
      sectionId: ""
    }));
  }, [])

  useEffect(() => {
    const getAllInterface = mapSectionsWithContentsForBuilderBranding(
      page,
      section,
      sectionConsent,
      contentAll
    );
    const dataPreviewNewTab = {
      builder: getAllInterface,
      branding: {
        headerAndFooter: headerAndFooterState,
        titlePage: titlePageState,
        themeSetting: themeSettingState,
        buttonSetting: buttonSettingState,
        authenScreen: authenScreenState,
        subScriptionSetting: subScriptionSettingState,
        customCss: customCssState
      }
    }
    localStorage.setItem("getAllInterfaceDataPreview", JSON.stringify(dataPreviewNewTab));
    // สร้างอาร์เรย์ใหม่โดยดึงเฉพาะ `sections` จาก `getAllInterface`
    const sectionsArray = getAllInterface.map((item: any) => item.sections);

    // รวม sectionsArray ให้เป็น array เดียว
    const flattenedSectionsArray = sectionsArray.flat();
    setDataPreview(flattenedSectionsArray);
  }, [page, section, sectionConsent, contentAll, titlePage]); // ลบ `contents` ออกหากไม่จำเป็น

  // หาก `contentAll` หรือ `sectionConsent` เป็นออบเจ็กต์ ให้ใช้ useMemo
  const memoizedContentAll = useMemo(() => contentAll, [contentAll]);
  const memoizedSectionConsent = useMemo(() => sectionConsent, [sectionConsent]);

  useEffect(() => {
    const getAllInterface = mapSectionsWithContentsForBuilderBranding(
      page,
      section,
      memoizedSectionConsent,
      memoizedContentAll
    );

    const sectionsArray = getAllInterface.map((item: any) => item.sections);
    const flattenedSectionsArray = sectionsArray.flat();
    setDataPreview(flattenedSectionsArray);
  }, [page, section, memoizedSectionConsent, memoizedContentAll]);

  // ---- useEffect ----
  useEffect(() => {

    const filterContentToPreview = filterSectionsByPageAndSection(dataPreview, dataSelectionPreview.pageId, dataSelectionPreview.sectionId);

    setDataPreviewRender(filterContentToPreview);
  }, [dataPreview, dataSelectionPreview]);

  const filteredData = dataPreviewRender?.filter((data: any) => data.show === true);


  return (
    <div className="w-full bg-[#F8F8F8] p-1">
      {headerAndFooter.header.show && (
        <>
          {/* HEADER */}
          <div
            className={`w-full px-4 py-3 min-h-[54px]`}
            style={{ backgroundColor: headerAndFooter.header.bgColor }}
          >
            {headerAndFooter.header.logo !== "" &&
              <img src={headerAndFooter.header.logo} className="h-[30px]" alt={headerAndFooter.header.altLogo} />
            }

          </div>
          {/* TITLE PAGE */}
       
        </>
      )}
      {titlePage.showTitle && (
           <div className="h-[100px] flex items-center justify-center"
            style={{
              ...(titlePage.backgroundType === "Color"
                ? { backgroundColor: titlePage.backgroundColor }
                : { backgroundImage: `url(${titlePage.backgroundImg})` }),
            }}          >
            <p className="font-semibold " style={{ fontSize: titlePage.fontSize, color: titlePage.fontColor }}>{titlePage?.pageTitle}</p>
          </div>
      )}

      <div className="flex pt-1 bg-[#F8F8F8]">
        {/* TAB MENU */}
        <div className="w-4/12 bg-white">
          <div className="bg-white">

            {page?.map((item, index) => {
              return (
                <div key={item.pageId}>
                  <div className="bg-[#E3E8EC] flex py-5">
                    <div className="w-10/12 pl-5 text-base font-semibold"
                      style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                      {item?.pageName}
                    </div>
                    <div className="w-2/12 justify-end flex pr-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-label="Expand"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {item?.pageType === "personal_data" && (
                    <div>
                      {section.map((item, index) => {
                        if (!item.show) return null; // ถ้า show เป็น false ให้ข้ามไป

                        return (
                          <div className="bg-white flex py-5 border-b" key={item.id}>
                            <div className="w-10/12 pl-5 text-base font-semibold"
                              style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                              {item.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {item?.pageType === "consent_data" && (
                    <div>
                      {sectionConsent.map((item, index) => {
                        if (!item.show) return null; // ถ้า show เป็น false ให้ข้ามไป

                        return (
                          <div className="bg-white flex py-5 border-b" key={item.id}>
                            <div className="w-10/12 pl-5 text-base font-semibold"
                              style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                              {item.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {
                    (subScriptionSettingState.subScriptionSettingsShow === true && item?.pageType === "consent_data") &&
                    <div className="bg-white flex py-5 border-b" >
                      <div className="w-10/12 pl-5 text-base font-semibold"
                        style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                        Subscription Settings
                      </div>
                    </div>

                  }

                </div>
              )

            })}
          </div>

          <div className="bg-white">
          </div>

        </div>
        {/* CONTENT */}
        <div className="pb-3 w-full ml-2 rounded border relative ">

          {
            filteredData.filter((data: any) => data.show === true).map((item: any, index: number) => {
              return (
                <div key={item.id} className={`bg-white ${(filteredData.length - 1 === index && subScriptionSettingState.subScriptionSettingsShow === false) ? `mb-[65px]` : `mb-[10px]`}`}>
                  <div className={`flex border-b py-4`}>
                    <div className={`w-11/12 pl-3 font-semibold`}
                      style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>{item.text}</div>
                    <div className="w-1/12"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                    </div>
                  </div>
                  <div className={`px-5 py-3`}
                  // style={{ marginBottom: dataPreviewRender.length - 1 === index ? 65 : 0 }}                // style={{}}
                  >
                    {/* {JSON.stringify(dataPreviewRender)} */}
                    {
                      item?.contents.map((data: any, index: number) => {
                        if (data.hide) return null; // ถ้า show เป็น false ให้ข้ามไป
                        if (data?.fieldTypeName === 'data_element') {
                          if (data?.element?.selectedDataElement?.dataElementTypeName === "Email" ||
                            data?.element?.selectedDataElement?.dataElementTypeName === "Phone" ||
                            data?.element?.selectedDataElement?.dataElementTypeName === "Text Input" ||
                            data?.element?.selectedDataElement?.dataElementTypeName === "Number"
                          ) {
                            return (
                              <div key={data.ContentId}>
                                <div className="flex text-base font-semibold whitespace-normal break-words break-all" style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>{data?.isRequired && <span className="text-[red] pr-1">*</span>}{data?.element?.selectedDataElement?.dataElementName}
                                  {data?.isIdentifier && (<div className="pl-2">
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
                                  </div>)}
                                </div>
                                <div>
                                  <input type={`text`} className="my-2  w-full rounded h-[42px] px-3"
                                    placeholder=""
                                    style={{
                                      background: themeSettingState?.backgroundColor,
                                      border: `1px solid ${themeSettingState?.borderColor}`,
                                      color: themeSettingState?.fontColor,
                                      fontSize: themeSettingState?.fontSize,
                                    }}
                                  />
                                </div>
                              </div>

                            )
                          }
                          if (data?.element?.selectedDataElement?.dataElementTypeName === "Selection") {
                            return (
                              <div key={data.ContentId}>
                                <div className="flex text-base font-semibold whitespace-normal break-words break-all" style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>{data?.isRequired && <span className="text-[red] pr-1">*</span>}{data?.element?.selectedDataElement?.dataElementName}
                                  {data?.isIdentifier && (
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
                                  <div className={`flex border border-[${themeSettingState?.borderColor}] mt-3 py-3 rounded-md px-3`}
                                    style={{ border: `1px solid ${themeSettingState?.borderColor}` }}
                                  >
                                    <div className="w-11/12"
                                      style={{
                                        fontSize: themeSettingState?.fontSize,
                                        color: themeSettingState?.fontColor,
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
                                  <div className={`border border-[${themeSettingState?.borderColor}] mb-2`} style={{ border: `1px solid ${themeSettingState?.borderColor}` }}>
                                    {
                                      data?.element?.selectedDataElement?.selectionJson?.options.map((option: any, index: any) => {
                                        return (
                                          <div key={index} className="flex items-center border-b px-3 py-2">
                                            <input
                                              type="checkbox"
                                              className="mr-2 rounded"
                                              style={{
                                                width: themeSettingState?.fontSize,
                                                height: themeSettingState?.fontSize,
                                                backgroundColor:
                                                  item?.element?.selectedDataElement?.selectionJson?.multipleSelections
                                                    ? themeSettingState?.activeColor // สีเมื่อเลือก
                                                    : index % 2 === 0
                                                      ? themeSettingState?.activeColor // สีตามเงื่อนไข
                                                      : themeSettingState?.inActiveColor,
                                                borderColor:
                                                  item?.element?.selectedDataElement?.selectionJson?.multipleSelections
                                                    ? themeSettingState?.activeColor
                                                    : themeSettingState?.inActiveColor,
                                              }}
                                              readOnly
                                              checked={index % 2 === 0}
                                              value={option.text}
                                            />
                                            <label
                                            className="whitespace-normal break-words break-all"
                                              style={{
                                                fontSize: themeSettingState?.fontSize,
                                                color: themeSettingState?.fontColor,
                                              }}
                                            >{option.text}</label>
                                          </div>
                                        )
                                      })
                                    }
                                  </div>


                                </div>
                              </div>

                            )
                          }
                          if (data?.element?.selectedDataElement?.dataElementTypeName === "Date") {
                            return (
                              <div key={data.ContentId}>
                                <div className="flex text-base font-semibold whitespace-normal break-words break-all" style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>{data?.isRequired && <span className="text-[red] pr-1">*</span>}{data?.element?.selectedDataElement?.dataElementName} {data?.isIdentifier && (<div className="pl-2">
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
                                </div>)}</div>
                                <div className="py-3">
                                  <DatePicker
                                    minWidth="100%"
                                    selectedDate={new Date()} // ใช้ค่าใน state หรือค่าเริ่มต้น
                                    onChange={() => { }} // อัปเดตค่าลงใน state
                                    placeholder="Select Date"
                                  />
                                </div>
                              </div>

                            )
                          }

                        }
                        if (data?.fieldTypeName === 'preference_purpose') {
                          return (
                            <div key={data.ContentId}>
                              <div className="my-3 p-3 border">

                                <div className="text-base font-semibold"
                                  style={{
                                    fontSize: themeSettingState?.fontSize,
                                    color: themeSettingState?.fontColor,
                                  }}
                                >
                                  {data?.isRequired && <span className="text-[red] mr-1">* </span>}
                                  {data?.element?.selectedPreferencePurpose?.prefPurposeName}
                                </div>
                                <div>
                                  
                                  <div className={`border mt-2 rounded border-[${themeSettingState?.borderColor}] mb-2`} style={{ border: `1px solid ${themeSettingState?.borderColor}` }}>
                                    {
                                      data?.element?.selectedPreferencePurpose?.prefPurposeSelectionJson?.options?.map((option: any, index: any) => {
                                        return (

                                          <div key={index} className="flex items-center px-3 py-2">
                                            {data?.element?.selectedPreferencePurpose?.prefPurposeSelectionJson?.multipleSelections && (
                                              <input
                                                type="checkbox"
                                                className="mr-2 rounded"
                                                style={{
                                                  width: themeSettingState?.fontSize,
                                                  height: themeSettingState?.fontSize,
                                                  backgroundColor:
                                                    item?.element?.selectedDataElement?.selectionJson?.multipleSelections
                                                      ? themeSettingState?.activeColor // สีเมื่อเลือก
                                                      : index % 2 === 0
                                                        ? themeSettingState?.activeColor // สีตามเงื่อนไข
                                                        : themeSettingState?.inActiveColor,
                                                  borderColor:
                                                    item?.element?.selectedDataElement?.selectionJson?.multipleSelections
                                                      ? themeSettingState?.activeColor
                                                      : themeSettingState?.inActiveColor,
                                                }}
                                                readOnly
                                                checked={index % 2 === 0}
                                                value={option.text}
                                              />
                                            )}
                                             {!data?.element?.selectedPreferencePurpose?.prefPurposeSelectionJson?.multipleSelections && (
                                              <input
                                                type="radio"
                                                className="mr-2 rounded-xl"
                                                style={{
                                                  width: themeSettingState?.fontSize,
                                                  height: themeSettingState?.fontSize,
                                                  backgroundColor:
                                                    item?.element?.selectedDataElement?.selectionJson?.multipleSelections
                                                      ? themeSettingState?.activeColor // สีเมื่อเลือก
                                                      : index % 2 === 0
                                                        ? themeSettingState?.activeColor // สีตามเงื่อนไข
                                                        : themeSettingState?.inActiveColor,
                                                  borderColor:
                                                    item?.element?.selectedDataElement?.selectionJson?.multipleSelections
                                                      ? themeSettingState?.activeColor
                                                      : themeSettingState?.inActiveColor,
                                                }}
                                                readOnly
                                                checked={index % 2 === 0}
                                                value={option.text}
                                              />
                                            )}

                                            <label
                                              style={{
                                                fontSize: themeSettingState?.fontSize,
                                                color: themeSettingState?.fontColor,
                                              }}
                                            >{option.text}</label>
                                          </div>
                                        )
                                      })
                                    }
                                  </div>


                                </div>
                              </div>
                            </div>
                          );
                        }
                        if (data?.fieldTypeName === 'standard_purpose') {
                          return (
                            <div key={data.ContentId}>
                              <div className="flex text-base font-semibold border p-3 mb-3 whitespace-normal break-words break-all"
                                style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                                <div>
                                  <input
                                    type="checkbox"
                                    className="rounded mr-2"
                                    style={{
                                      width: themeSettingState?.fontSize,
                                      height: themeSettingState?.fontSize,
                                      backgroundColor: themeSettingState?.activeColor, // สีตามเงื่อนไข
                                      borderColor: themeSettingState?.activeColor
                                    }}
                                    readOnly
                                    checked={true}
                                  />
                                </div>

                                {data?.isRequired && <span className="text-[red] pr-1">*</span>}
                                {data?.element?.selectedStandardPurpose?.name}
                                {data?.isIdentifier && (
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
                                  </div>)}</div>
                            </div>

                          )
                        }
                        if (data?.fieldTypeName === 'content_text') {
                          return (
                            <div key={data.ContentId}>
                              <div className="flex text-base font-semibold whitespace-normal break-words break-all" style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>{data?.isRequired && <span className="text-[red] pr-1">*</span>}{data?.element?.selectedContentText?.contentTitle} {data?.isIdentifier && (<div className="pl-2">
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
                              </div>)}</div>

                              <div>
                                <div className="w-full rounded h-auto my-2 whitespace-normal break-words break-all"
                                  style={{
                                    // border: `1px solid ${themeSettingState?.borderColor}`,
                                    fontSize: themeSettingState?.fontSize,
                                    color: themeSettingState?.fontColor,
                                  }}
                                >
                                  {data?.element?.selectedContentText?.contentBody ? parse(data?.element?.selectedContentText?.contentBody) : ''}
                                </div>
                              </div>
                            </div>

                          )
                        }
                      })

                    }
                  </div>

                </div>
              )
            })}


          {
            (subScriptionSettingState.subScriptionSettingsShow === true && filterPage === undefined || filterPage.length === 0 || filterPage[0]?.pageType === "consent_data"  ) ? (
              <div className="mb-[90px] bg-white">
                <div className={`flex border-b py-4`}>
                  <div className={`w-11/12 pl-3 font-semibold`}
                    style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>Subscription Settings</div>
                  <div className="w-1/12"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                  </div>
                </div>
                <div className="pb-3">
                <div className="bg-white px-5 pt-5 pb-3 flex">
                  <div className="m-auto  rounded-full bg-[#F3F7FF] p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3758F9" className="size-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <p className="text-base pl-3" style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                    This constitutes a request for comprehensive consent. The consenting individual should thoroughly review and understand each clause before providing full consent.
                  </p>
                </div>
                {
                  subScriptionSettingState.subScribeAllShow &&
                  <div className="bg-white px-5 pt-5 pb-3 flex mx-6">
                    <div className="m-auto w-1/12">
                      <Toggle />
                    </div>
                    <div className="pl-3 w-11/12">
                      <p className="text-base font-semibold" style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                        Subscribe All
                      </p>
                      <p style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                        {subScriptionSettingState.subscribeAllLabel}
                      </p>
                    </div>

                  </div>
                }
                 {
                  subScriptionSettingState.unSubscribeAllShow &&
                  <div className="bg-white px-5 pt-2 pb-3 flex mx-6">
                    <div className="m-auto w-1/12">
                      <Toggle />
                    </div>
                    <div className="pl-3 w-11/12">
                      <p className="text-base font-semibold" style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                        Unsubscribe All
                      </p>
                      <p style={{ fontSize: themeSettingState?.fontSize, color: themeSettingState?.fontColor }}>
                        {subScriptionSettingState.unSubscribeAllLabel}
                      </p>
                    </div>

                  </div>
                }
                </div>
            
              </div>
            ) : null
          }


          <div className="absolute w-full bg-[#f8f8f8] justify-end bottom-0 flex pr-3 py-3">

            {buttonSettingState?.cancelLabelButtonShow && (
              <button
                className="border rounded-lg p-3 mr-2 w-[110px] text-base font-semibold"
                style={{ backgroundColor: buttonSettingState?.cancelBackgroundColor, color: buttonSettingState?.cancelFontColor,fontSize: themeSettingState?.fontSize }}
              >{buttonSettingState?.cancelLabelButton}</button>
            )}
            <button
              className="border rounded-lg p-3 w-auto text-base font-semibold"
              style={{ backgroundColor: buttonSettingState?.submitBackgroundColor, color: buttonSettingState?.submitFontColor,fontSize: themeSettingState?.fontSize }}
            >{buttonSettingState?.submitLabelButton}</button>
          </div>
        </div>
      </div>
      {/* FOOTER */}
      {headerAndFooter.footer.show && (
        <div
          className="py-2 text-center"
          style={{ backgroundColor: headerAndFooter.footer.backgroundColor }}>
          {parse(headerAndFooter.footer.footerContent)}
        </div>
      )}
    </div>
  );
};

export default Preview;
