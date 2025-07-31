import React, { useState, useEffect, useRef, useMemo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { RootState } from "../../../../../../store";
import { useSelector, useDispatch } from "react-redux";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIcon from "../../../../../../assets/icons/drag_icon.svg";
import ModalAddContent from "./ModalAddContent";
import ModalEditSection from "./ModalEditSection";
import {
  getContentPersonalDataBySectionId,
  setFilteredContentsPersonalData,
  setContentsPersonalData,
  setContentShowHidePersonalData,
  removeContentPersonalData,
} from "../../../../../../store/slices/contentPersonalDataBuilderAndBrandingSlice";
import ModalUpdateContent from "./ModalUpdateContent";
import { useConfirm, ModalType } from "../../../../../../context/ConfirmContext";
import { useTranslation } from "react-i18next";
import { getSectionById, removeSectionsPersonalData, setUpdateShowhideSectionPersonalData, updateSectionsPersonalData } from "../../../../../../store/slices/sectionPersonalDataBuilderAndBrandingSlice";
import { removeSectionsConsentData, updateSectionsConsentData } from "../../../../../../store/slices/sectionConsentDataBuilderAndBrandingSlice";
import { setDataSelectionPreview } from "../../../../../../store/slices/dataBuilderAndBrandingSlice";

interface ScreenPersonalDataProps {
  //   setOpenScreenPersonalData: (open: boolean) => void;
  //   setOpenScreenHeaderAndFooter: (open: boolean) => void;
  pageId: string;
  sectionId: string;
  valueText: string;
  pageType: string;
  mode: string;
  setOpenContent: React.Dispatch<
    React.SetStateAction<{
      sectionId: string;
      openScreen: boolean;
      textValue: string;
    }>
  >;
}
const ScreenContent: React.FC<ScreenPersonalDataProps> = ({
  //   setOpenScreenPersonalData,
  //   setOpenScreenHeaderAndFooter,
  sectionId,
  setOpenContent,
  valueText,
  pageId,
  pageType,
  mode
}) => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { t, i18n } = useTranslation();

  const contents = useSelector((state: RootState) =>
    getContentPersonalDataBySectionId(
      state.contentPersonalDataBuilderAndBranding,
      sectionId,
      pageId
    )
  );

  const sectionById = useSelector((state: RootState) =>
    getSectionById(
      pageType === "personal_data"
        ? state.sectionPersonalDataBuilderAndBranding
        : state.sectionConsentDataBuilderAndBranding,
      sectionId,
      pageId
    )
  );


  const [items, setItems] = useState([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [dataUpdateContent, setDataUpdateContent] = useState<any>(null);

  const [editText, setEditText] = useState("");
  const [hideShow, setHideShow] = useState(false);

  const [openPanelHeaderSection, setOpenPanelHeaderSection] = useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return; // หากไม่มีการเปลี่ยนตำแหน่งหรือไม่มีเป้าหมาย ให้หยุดทำงาน
    }

    const oldIndex = contents.findIndex(
      (item: any) => item.ContentId === active.id
    );
    const newIndex = contents.findIndex(
      (item: any) => item.ContentId === over.id
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedContents = arrayMove(contents, oldIndex, newIndex); // จัดเรียงใหม่

      // ตรวจสอบว่า updatedContents เป็น array หรือไม่
      if (!Array.isArray(updatedContents)) {
        console.error("Invalid updatedContents: ", updatedContents);
        return;
      }

      dispatch(
        setContentsPersonalData({
          sectionId,
          contents: updatedContents, // อัปเดตเฉพาะ contents ของ sectionId นี้
          pageId: pageId,
        })
      );
    }
  };

  // const addContent = (
  //   sectionId: string,
  //   fieldTypeId: string,
  //   fieldTypeName: string,
  //   element: Record<string, any>, // เก็บ element JSON object dynamic by fieldTypeId
  //   isRequired: boolean,
  //   isIdentifier: boolean,
  //   hide: boolean
  // ) => {
  //   const newContent = {
  //     sectionId,
  //     id:  "xxx", // สร้าง id แบบ unique (ใช้ timestamp)
  //     element: {
  //       fieldTypeId,
  //       fieldTypeName,
  //       ...element, // รวมข้อมูล dynamic

  //     },
  //     hide,
  //     isRequired,
  //     isIdentifier,
  //   };

  //   // Dispatch action เพื่อเพิ่ม content ใหม่ใน Redux store
  //   dispatch(addContent(newContent));
  // };
  // const editSection = (sectionName: string) => {
  //   setItems((prev) =>
  //     prev.map((item) =>
  //       item.id === activeItemId ? { ...item, text: sectionName } : item
  //     )
  //   );
  // };

  const handleDragClick = (id: string) => {
    console.log("Clicked Drag Icon on Section ID:", id);
  };

  const toggleOptionsMenu = (id: string) => {
    setActiveItemId(activeItemId === id ? null : id);
  };

  const handleEdit = (id: string) => {
    const item = contents.find((item) => item.ContentId === id);
    if (item) {
      console.log("===================item:", item);
      setDataUpdateContent(item);
      setOpenUpdateModal(true);
      // setActiveItemId(id);
      // setOpenUpdateModal(true);
    }
  };

  const handleEditSection = () => {

    if (sectionById) {

      setEditText(sectionById.text);
      setHideShow(sectionById.show);
      setOpenEditModal(true);

    }
  };

  const handleDelete = (id: string, type: string) => {
    console.log("🚀 ~ handleDelete ~ id:", id, type,contents)

    let deleteStdAndPfrPurpose = []
    if (type === 'standard_purpose') {
      const getDataStdPurpose = contents.find((item: any) => {

        return item.ContentId === id;
      });

      const stdPurposeId = getDataStdPurpose?.element?.selectedStandardPurpose?.standardPurposeId;
      console.log("🚀 ~ handleDelete ~ stdPurposeId:", stdPurposeId)

      const findPreferencePurposeChild = contents.filter((item:any)=>{
        return item.element.selectedPreferencePurpose?.stdPurposeId === stdPurposeId
      })
      console.log("🚀 ~ findPreferencePurposeChild ~ findPreferencePurposeChild:", findPreferencePurposeChild)
      const mapData = findPreferencePurposeChild.map((data) => ({
        pageId: pageId,
        sectionId:sectionId,
        id:data.ContentId
      }));
      deleteStdAndPfrPurpose.push(...mapData);
      deleteStdAndPfrPurpose.push({
        pageId:pageId,
        sectionId:sectionId,
        id:id
      })
    }
      console.log("🚀 ~ handleDelete ~ deleteStdAndPfrPurpose:", deleteStdAndPfrPurpose)

    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        if(type === 'standard_purpose'){

          deleteStdAndPfrPurpose.forEach((data) => {
            dispatch(removeContentPersonalData(data));
          });
         
        }
        else{
          dispatch(
            removeContentPersonalData({
              pageId: pageId,
              sectionId,
              id,
            })
          );
        }
      
      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });



    setActiveItemId(null);
  };

  const handleHideShow = (id: string) => {
    console.log("🚀 ~ handleHideShow ~ id:", id);
    // setHideShow(!hideShow);
    const contentsfilter = contents.find((item: any) => item.ContentId === id);
    dispatch(
      setContentShowHidePersonalData({
        // pageId,
        sectionId,
        id,
        hide: !contentsfilter?.hide,
      })
    );
  };

  function SortableItem({
    id,
    text,
    subText,
    onDragClick,
    isIdentifier,
    isHide,
  }: {
    id: string;
    text: string;
    subText: string;
    onDragClick: (id: string) => void;
    isIdentifier: boolean;
    isHide: boolean;
  }) {
    console.log("🚀 ~ text:", text)
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between p-3 mb-2 bg-white border hover:text-[#3758F9] hover:border-[#3758F9] rounded-lg cursor-pointer shadow-sm min-h-[60px] h-auto"
      >
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing"
        >
          {mode === 'view' ? null : <img
            src={DragIcon}
            alt="Drag Icon"
            className="w-5 h-5"
            onClick={() => onDragClick(id)}
          />}

        </div>
        <div className="flex-1 ">
          <p className="px-3 whitespace-normal break-words break-all">
            {text}
          </p>
          <div className="flex">
            <p
              className="text-sm text-[#656668] pl-3 pr-1"

            >
              {subText === "data_element" ? "Data Element" : subText === "standard_purpose" ? "Standard Purpose" : subText === 'content_text' ? "Content Text" : subText === 'preference_purpose' ? 'Preference Purpose' : subText}
            </p>
            {isIdentifier && (
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
            )}
          </div>
        </div>
        {mode === 'view' ? null :
          <div className="relative">
            <button onClick={() => toggleOptionsMenu(id)} className="mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </button>
            {activeItemId === id && (
              <div className="flex absolute z-10 right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg">
                <button
                  className="p-2 block w-full text-sm text-gray-700 hover:bg-gray-100 border-r"
                  onClick={() => {
                    handleEdit(id);
                    setActiveItemId(null);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  className="p-2 block w-full text-sm text-gray-700 hover:bg-gray-100 border-r"
                  onClick={() => {
                    handleDelete(id, subText);


                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  className="p-2 block w-full text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    handleHideShow(id);
                    setActiveItemId(null);
                  }}
                >
                  {isHide ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>


                  )}
                </button>
              </div>
            )}
          </div>
        }

      </div>
    );
  }

  const openPanelHeadSection = () => {
    setOpenPanelHeaderSection(!openPanelHeaderSection);
  }

  const editSection = (id: string, sectionName: string, show: boolean) => {

    const updatedItem = {
      id: id,
      text: sectionName,
      show: show,
    };
    sessionStorage.setItem('textValueForBuilderAndBranding', sectionName); // Save textValue to localStorage
    // Dispatch action เพื่ออัปเดต section ใน global state
    if (pageId === 'cebaf439-4537-41b0-8ba9-52cfbfb0fa75') {
      dispatch(updateSectionsPersonalData(updatedItem));
    }
    else {
      dispatch(updateSectionsConsentData(updatedItem));
    }
  };
  const handleDeleteSection = () => {
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        const id = sectionById?.id as string;
        if (pageId === 'cebaf439-4537-41b0-8ba9-52cfbfb0fa75') {
          dispatch(removeSectionsPersonalData(id));
        }
        else {
          dispatch(removeSectionsConsentData(id));
        }

        setOpenContent({
          sectionId: sectionId,
          openScreen: false,
          textValue: "",
        });
        sessionStorage.removeItem("textValueForBuilderAndBranding");
        sessionStorage.setItem("sectionIdForBuilderAndBranding", "0"); // Save sectionId to localStorage

      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
  }
  return (
    <>
      <div className="">
        <div className="flex pb-5 border-1 border-b mr-4 pt-5">
          <div className="pt-4">
            <button
              onClick={
                () => {
                  setOpenContent({
                    sectionId: sectionId,
                    openScreen: false,
                    textValue: "",
                  });
                  sessionStorage.removeItem("textValueForBuilderAndBranding");
                  sessionStorage.setItem("sectionIdForBuilderAndBranding", "0"); // Save sectionId to localStorage
                  dispatch(setDataSelectionPreview({ pageId: pageId, sectionId: "" })); // Reset pageId and sectionId in global state
                } // Close openContent
              }
              className="w-[20px] text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          </div>
          <div className="w-5/6 pl-4">
            <p className="text-xs">{t('builderAndBranding.section')}</p>
            <p className="text-base font-semibold text-[#3758F9]">
              {sectionById?.text}
            </p>
          </div>
          <div className="w-1/6 flex justify-end items-center pt-3">
            {mode === 'view' ? null :
              <button onClick={openPanelHeadSection} className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
                {openPanelHeaderSection && (
                  <div className="flex absolute z-10 right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg">
                    <button
                      className="p-2 block w-full text-sm text-gray-700 hover:bg-gray-100 border-r"
                      onClick={() => {
                        handleEditSection();
                        // setActiveItemId(null);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 block w-full text-sm text-gray-700 hover:bg-gray-100 border-r"
                      onClick={() => {
                        handleDeleteSection()
                        // handleDelete(id);

                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 block w-full text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        dispatch(
                          setUpdateShowhideSectionPersonalData({
                            id: sectionById?.id || "",
                            show: !sectionById?.show,
                          })
                        );
                      }}
                    >
                      {sectionById?.show ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </button>
            }


          </div>
        </div>
        <div className="flex pb-5">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={contents.map((item: any) => item.ContentId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="w-full mx-auto p-4 bg-white">
                <h2 className="text-lg font-semibold mb-4">{t('builderAndBranding.content')}</h2>
                {contents?.map((item: any) => (
                  <SortableItem
                    key={item.ContentId}
                    id={item.ContentId}
                    isHide={item.hide}
                    text={
                      item?.fieldTypeName === "data_element"
                        ? item?.element?.selectedDataElement?.dataElementName
                        : item?.fieldTypeName === "standard_purpose"
                          ? item?.element?.selectedStandardPurpose?.name
                          :
                          item?.fieldTypeName === "preference_purpose" ?
                            item?.element?.selectedPreferencePurpose?.prefPurposeName
                            : item?.element?.selectedContentText?.contentTitle
                    }
                    subText={item?.fieldTypeName}
                    isIdentifier={item?.isIdentifier}
                    onDragClick={handleDragClick}
                  />
                ))}
                {mode === 'view' ? null :
                  <button
                    onClick={() => setOpenAddModal(true)}
                    className="pt-2 flex justify-center mt-2 h-[50px] w-full py-2 border-2 border-dashed border-[#3758F9] text-[#3758F9] rounded bg-white hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="pl-2  font-semibold text-lg">{t('builderAndBranding.addContent')}</p>
                  </button>
                }

              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <ModalAddContent
        open={openAddModal}
        setOpen={setOpenAddModal}
        sectionIdProps={sectionId}
        sectionNameProps={valueText}
        pageId={pageId}
        pageType={pageType}

      // onConfirm={addContent}
      />
      {dataUpdateContent && (
        <ModalUpdateContent
          open={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          data={dataUpdateContent}
        />
      )}
      <ModalEditSection
        open={openEditModal}
        setOpen={setOpenEditModal}
        onConfirm={(id, sectionName, hideSection) => {
          editSection(id, sectionName, !hideSection); // Ensure correct values are passed
        }}
        id={sectionById?.id as string}
        initialText={editText}
        show={hideShow}
      />
    </>
  );
};

export default ScreenContent;
