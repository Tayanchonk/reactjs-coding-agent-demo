import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { RootState } from "../../../../../../store";
import { useSelector, useDispatch } from "react-redux";
import {
  addSectionsPersonalData,
  removeSectionsPersonalData,
  setSectionsPersonalData,
  updateSectionsPersonalData,
  setUpdateShowhideSectionPersonalData,
} from "../../../../../../store/slices/sectionPersonalDataBuilderAndBrandingSlice";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIcon from "../../../../../../assets/icons/drag_icon.svg";
import ModalAddSection from "./ModalAddSection";
import ModalEditSection from "./ModalEditSection";
import ScreenContent from "./ScreenContentPersonalData";
import { useTranslation } from "react-i18next";
import { useConfirm, ModalType } from "../../../../../../context/ConfirmContext";
import ModalEditPage from "./ModalEditPage";
import { GetPageTypes, GetContentFieldType } from "../../../../../../services/consentInterfaceService";
import { generateUUID } from "../../../../../../utils/Utils";
import { setDataSelectionPreview } from "../../../../../../store/slices/dataBuilderAndBrandingSlice";
import { setContentShowHidePersonalData } from "../../../../../../store/slices/contentPersonalDataBuilderAndBrandingSlice";

interface ScreenPersonalDataProps {
  setOpenScreenPersonalData: (open: boolean) => void;
  setOpenScreenHeaderAndFooter: (open: boolean) => void;
  setOpenScreenConsentData: (open: boolean) => void;
  pageId: string;
  mode: string;
}

const ScreenPersonalData: React.FC<ScreenPersonalDataProps> = ({
  setOpenScreenPersonalData,
  setOpenScreenHeaderAndFooter,
  setOpenScreenConsentData,
  pageId,
  mode,
}) => {
  // console.log("🚀 ~ pageId:-------", pageId,mode)
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { t, i18n } = useTranslation();
  // const [items, setItems] = useState([]);
  const section = useSelector(
    (state: RootState) => state.sectionPersonalDataBuilderAndBranding.sections
  );
  // console.log("🚀 ~ section:", section)

  // const page = useSelector(
  //   (state: RootState) => state.pageBuilderAndBranding.pages
  // );

  const page = useSelector((state: RootState) =>
    state.pageBuilderAndBranding.pages.find((page: any) => page.pageId === pageId)
  );
  const contents = useSelector((state: RootState) => state.contentPersonalDataBuilderAndBranding.contents);
  // console.log("🚀 ~ page:------>", page,mode)
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editText, setEditText] = useState("");
  const [hideShow, setHideShow] = useState(false);
  const [openContent, setOpenContent] = useState({
    sectionId: "",
    openScreen: false,
    textValue: "",
  });

  const [openModalEditPage, setOpenModalEditPage] = useState({
    open: false,
    pageName: "",
    pageId: "", // เพิ่ม pageId ที่นี่
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // setItems((prev) => {
      //   const oldIndex = prev.findIndex((item) => item.id === active.id);
      //   const newIndex = prev.findIndex((item) => item.id === over.id);
      //   return arrayMove(prev, oldIndex, newIndex);
      // });
      // Get the current sections from the Redux store
      const currentSections = [...section];

      // Find the old and new indices
      const oldIndex = currentSections.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = currentSections.findIndex((item) => item.id === over.id);

      // Reorder the sections using arrayMove
      const updatedSections = arrayMove(currentSections, oldIndex, newIndex);

      // Dispatch the updated sections to the Redux store
      dispatch(setSectionsPersonalData(updatedSections));
    }
  };

  const addSection = (sectionName: string, show: boolean) => {
    console.log("🚀 ~ addSection ~ show:", !show)
    const newItem = {
      pageId: pageId,
      id: generateUUID(), // ใช้ section.length แทน items.length
      text: sectionName,
      show: !show,
    };

    // Dispatch action เพื่อเพิ่ม section ใหม่ใน global state
    dispatch(addSectionsPersonalData(newItem));
  };

  const editSection = (id: string, sectionName: string, show: boolean) => {

    const updatedItem = {
      id: id,
      text: sectionName,
      show: show,
    };
    sessionStorage.setItem('textValueForBuilderAndBranding', sectionName); // Save textValue to localStorage
    // Dispatch action เพื่ออัปเดต section ใน global state
    dispatch(updateSectionsPersonalData(updatedItem));
  };

  const handleDragClick = (id: string) => {
    console.log("Clicked Drag Icon on Section ID:", id);
  };

  const toggleOptionsMenu = (id: string) => {
    setActiveItemId(activeItemId === id ? null : id);
  };

  const handleEdit = (id: string) => {
    const item = section.find((item) => item.id === id);
    if (item) {
      setId(id);
      setEditText(item.text);
      setHideShow(item.show);
      setOpenEditModal(true);

    }
  };
  const handleDelete = (id: string) => {
    confirm({
      title: t("roleAndPermission.confirmDelete"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmDelete"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      modalType: ModalType.Delete, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        dispatch(removeSectionsPersonalData(id));
      },
      notify: true,
      onClose: async () => { }, //ใส่หรือไม่ใส่ก็ได้
      successMessage: t("modal.success"), //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: t("modal.error"), //ใส่หรือไม่ใส่ก็ได้ auto notify
    });
    setActiveItemId(null);
    // 
  };

  const handleEditPage = () => {
    setOpenModalEditPage({
      open: true,
      pageName: page?.pageName,
      pageId: page?.pageId, // ส่ง pageId ไปยัง ModalEditPage
    })
  }

  const handleHideShow = (id: string) => {
    setHideShow(!hideShow);
  };

  function SortableItem({
    id,
    text,
    onDragClick,
  }: {
    id: string;
    text: string;
    onDragClick: (id: string) => void;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    //   useEffect(() => {
    //     console.log("🚀 ~ section changed:", section);
    //     setItems(section);
    // }, [section]);

    useEffect(() => {
      const getPageTypess = async () => {
        const response = await GetPageTypes();
        // console.log("🚀 ~ getPageType ~ response:", response)
        // setItems(response);
      }
      const GetContentFieldTypes = async () => {
        const response = await GetContentFieldType();
        // console.log("🚀 ~ GetContentFieldType ~ response:", response?.data)
      }
      getPageTypess();
      GetContentFieldTypes()
    }, [])

    const fncShowHideSectionAndContent = (id: string, statusShow: boolean) => {
      const filterContentBySectionId = contents?.filter((data) => data.sectionId === id)?.map(data => {
        return {
          sectionId: id,
          id: data.ContentId,
          hide: !statusShow,
        }
      })
      dispatch(
        setUpdateShowhideSectionPersonalData({
          id,
          show: section.find((item) => item.id === id)?.show
            ? false
            : true,
        })
      );
      if (filterContentBySectionId.length) {
        filterContentBySectionId.forEach(data => {
          dispatch(setContentShowHidePersonalData(data))
        })
      }
      setActiveItemId(null);
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between p-3 mb-2 bg-white border hover:text-[#3758F9] hover:border-[#3758F9] rounded-lg cursor-pointer shadow-sm h-[50px]"
      >
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing"
        >
          {mode === "view" ? null : <img
            src={DragIcon}
            alt="Drag Icon"
            className="w-5 h-5"
            onClick={() => onDragClick(id)}
          />}

        </div>
        <span
          className="flex-1 px-3"
          onClick={() => {
            setOpenContent({
              sectionId: id,
              openScreen: true,
              textValue: text,

            });
            sessionStorage.setItem("sectionIdForBuilderAndBranding", id); // Save sectionId to localStorage
            sessionStorage.setItem("textValueForBuilderAndBranding", text); // Save textValue to localStorage
            dispatch(setDataSelectionPreview({
              pageId: pageId,
              sectionId: id,
            }))
          }}
        >
          {text}
        </span>
        {mode === "view" ? null :
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

                    handleDelete(id);

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
                    const show = section.find((item) => item.id === id)?.show ? false : true;
                    fncShowHideSectionAndContent(id, show);

                  }}
                >
                  {section.find((item) => item.id === id)?.show ? (
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
          </div>
        }

      </div>
    );
  }

  return (
    <>
      {openContent.openScreen ? (
        <ScreenContent
          sectionId={openContent.sectionId}
          valueText={openContent.textValue}
          setOpenContent={setOpenContent}
          pageId={pageId}
          pageType={page?.pageType || ""}
          mode={mode}
        />
      ) : (
        <>
          <div className="">
            <div className="flex pb-5 border-1 border-b mr-4 pt-5">
              <div className="pt-4">
                <button
                  onClick={() => {
                    setOpenScreenPersonalData(false);
                    setOpenScreenHeaderAndFooter(false);
                    setOpenScreenConsentData(false);
                    dispatch(setDataSelectionPreview({
                      pageId: "",
                      sectionId: "",
                    })); // Clear pageId and sectionId in Redux store
                  }}
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
                <p className="text-xs">{t('builderAndBranding.page')}</p>
                <p className="text-base font-semibold text-[#3758F9]">
                  {page?.pageName}
                </p>
                {/* {JSON.stringify(pageId)} */}
              </div>
              <div className="w-1/6 flex justify-end items-center pt-3">
                {mode === "view" ? null : (<button onClick={handleEditPage}>
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
                </button>)}


              </div>
            </div>
            <div className="flex pb-5">
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={section}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="w-full  mx-auto p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-4">{t('builderAndBranding.section')}</h2>
                    {section.map((item) => (
                      <SortableItem
                        key={item.id}
                        id={item.id}
                        text={item.text}
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
                        <p className="pl-2  font-semibold text-lg">{t('builderAndBranding.addSection')}</p>
                      </button>
                    }

                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
          <ModalAddSection
            open={openAddModal}
            setOpen={setOpenAddModal}
            onConfirm={addSection}
          />
          <ModalEditSection
            open={openEditModal}
            setOpen={setOpenEditModal}
            onConfirm={(id, sectionName, hideSection) => {
              editSection(id, sectionName, !hideSection); // Ensure correct values are passed
            }}
            id={id}
            initialText={editText}
            show={hideShow}
          />
          <ModalEditPage
            openModalEditPage={openModalEditPage} // ส่ง state ไปยัง ModalEditPage
            setOpenModalEditPage={setOpenModalEditPage} // ส่งฟังก์ชัน setState ไปยัง ModalEditPage
          />
        </>
      )}
    </>
  );
};

export default ScreenPersonalData;
