import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { MdDragIndicator } from "react-icons/md";
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { CheckBox, Radio, Toggle, InputText } from "../../../../components/CustomComponent";

export default function ManageOptions({ mode, dataElement, setDataElement }) {
  let { t } = useTranslation();

  useEffect(() => {
    setDataElement((prevDataElement) => {
      let newDefault = prevDataElement.selectionJson.default;

      // Ensure default always has at least one valid text option
      if (!newDefault.length || !prevDataElement.selectionJson.options.some(opt => opt.text === newDefault[0])) {
        newDefault = [prevDataElement.selectionJson.options[0]?.text || ""];
      }

      return {
        ...prevDataElement,
        selectionJson: {
          ...prevDataElement.selectionJson,
          default: newDefault,
        },
      };
    });
  }, [dataElement.selectionJson.options, setDataElement]);

  const toggleSelection = (text) => {
    setDataElement((prevDataElement) => {
      const newDefault = prevDataElement.selectionJson.multipleSelections
        ? prevDataElement.selectionJson.default.includes(text)
          ? prevDataElement.selectionJson.default.filter((t) => t !== text) // Deselect if already selected
          : [...prevDataElement.selectionJson.default, text] // Add to selection
        : [text]; // Single selection for radio buttons

      return {
        ...prevDataElement,
        selectionJson: {
          ...prevDataElement.selectionJson,
          default: newDefault,
        },
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setDataElement((prevDataElement) => {
        const oldIndex = prevDataElement.selectionJson.options.findIndex((item) => item.order === active.id);
        const newIndex = prevDataElement.selectionJson.options.findIndex((item) => item.order === over.id);

        // Rearrange options and reassign order numbers
        const updatedOptions = arrayMove(prevDataElement.selectionJson.options, oldIndex, newIndex)
          .map((item, index) => ({ ...item, order: index + 1 }));

        // Update translationJson fields: Rename "Option X" and update values
        const updatedTranslationJson = prevDataElement.translationJson.map((translation) => ({
          ...translation,
          fields: translation.fields.map((field) => {
            const matchedOption = updatedOptions.find(opt => `Option ${opt.order}` === field.name);
            return matchedOption
              ? { ...field, name: `Option ${matchedOption.order}`, value: matchedOption.text }
              : field;
          }),
        }));

        return {
          ...prevDataElement,
          selectionJson: { ...prevDataElement.selectionJson, options: updatedOptions },
          translationJson: updatedTranslationJson,
        };
      });
    }
  };


  const addOption = () => {
    setDataElement((prevDataElement) => {
      const newOrder = prevDataElement.selectionJson.options.length + 1;
      const newOption = { text: "", order: newOrder };

      // Add new translation fields for all languages
      const updatedTranslationJson = prevDataElement.translationJson.map((translation) => ({
        ...translation,
        fields: [
          ...translation.fields,
          { name: `Option ${newOrder}`, value: "", transalte: "" }, // Add blank option for translation
        ],
      }));

      return {
        ...prevDataElement,
        selectionJson: {
          ...prevDataElement.selectionJson,
          options: [...prevDataElement.selectionJson.options, newOption],
        },
        translationJson: updatedTranslationJson,
      };
    });
  };



  const updateOptionText = (order, text) => {
    setDataElement((prevDataElement) => {
      const updatedOptions = prevDataElement.selectionJson.options.map(option =>
        option.order === order ? { ...option, text } : option
      );

      // Update translationJson to reflect text changes
      const updatedTranslationJson = prevDataElement.translationJson.map((translation) => ({
        ...translation,
        fields: translation.fields.map((field) =>
          field.name === `Option ${order}` ? { ...field, value: text } : field
        ),
      }));

      return {
        ...prevDataElement,
        selectionJson: {
          ...prevDataElement.selectionJson,
          options: updatedOptions,
        },
        translationJson: updatedTranslationJson,
      };
    });
  };

  const deleteOption = (order) => {
    setDataElement((prevDataElement) => {
      // Remove the deleted option and reassign new order numbers
      const updatedOptions = prevDataElement.selectionJson.options
        .filter(option => option.order !== order) // Remove deleted option
        .map((option, index) => ({ ...option, order: index + 1 })); // Reorder options

      let newDefault = prevDataElement.selectionJson.default.filter(selectedText =>
        updatedOptions.some(option => option.text === selectedText)
      );

      // If default becomes empty, set the first available text as default
      if (!newDefault.length && updatedOptions.length) {
        newDefault = [updatedOptions[0].text];
      }

      // Update translationJson: Remove deleted option and **shift all remaining ones**
      const updatedTranslationJson = prevDataElement.translationJson.map((translation) => {
        let updatedFields = translation.fields
          .filter((field) => !field.name.includes(`Option ${order}`)) // Remove deleted option
          .map((field) => {
            // Rename options to new correct order
            const match = field.name.match(/^Option (\d+)$/);
            if (match) {
              let oldOrder = parseInt(match[1], 10);
              if (oldOrder > order) {
                return { ...field, name: `Option ${oldOrder - 1}` }; // Shift down
              }
            }
            return field;
          });

        return { ...translation, fields: updatedFields };
      });

      return {
        ...prevDataElement,
        selectionJson: {
          ...prevDataElement.selectionJson,
          options: updatedOptions,
          default: newDefault,
        },
        translationJson: updatedTranslationJson,
      };
    });
  };

  const toggleMultipleSelections = () => {
    setDataElement((prevDataElement) => {
      const isNowSingleSelection = !prevDataElement.selectionJson.multipleSelections;

      let newDefault;
      if (isNowSingleSelection) {
        // Store previous multiple selections
        prevDataElement.selectionJson._previousDefault = prevDataElement.selectionJson.default;
        // Reduce to a single selection (first valid text)
        newDefault = prevDataElement.selectionJson.default.length > 0
          ? [prevDataElement.selectionJson.default[0]]
          : [prevDataElement.selectionJson.options[0]?.text || ""];
      } else {
        // Restore previous multiple selections when switching back to checkbox mode
        newDefault = prevDataElement.selectionJson._previousDefault || prevDataElement.selectionJson.default;
      }

      return {
        ...prevDataElement,
        selectionJson: {
          ...prevDataElement.selectionJson,
          multipleSelections: isNowSingleSelection,
          default: newDefault,
        },
      };
    });
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  return (
    <div className="border border-lilac-gray px-5 py-2">
      <h3 className="text-lg font-semibold">{t("dataelement.form.manageoption")}</h3>
      <p className="">{t("dataelement.form.manageoptiondesc")}</p>

      {/* English Translation Label */}
      <div className="mt-7 flex">
        {/* <label className="inline-flex items-center mb-5 cursor-pointer"> */}
        <Toggle
          disabled={mode === "view"}
          checked={dataElement.selectionJson.multipleSelections}
          onChange={toggleMultipleSelections}
        />
        <p className="ml-4 font-semibold">
          {t("dataelement.form.multipleselections")}
        </p>
        {/* </label> */}
      </div>
      <div className="mt-7 flex">
        <div className="w-1/12"></div>
        <div className="w-2/12">
          <span className="w-3/12 ">
            {t("consent.preferencePurpose.default")}
          </span>
        </div>
        <div className="w-7/12">
          <span className="w-9/12">
            {t("consent.preferencePurpose.options")}
          </span>
        </div>
      </div>
      <DndContext key={mode} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dataElement.selectionJson.options.map((o) => o.order)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {dataElement.selectionJson.options.map((option, index) => (
              <SortableItem key={mode === "view" ? null : option.order} id={mode === "view" ? null : option.order}>
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg shadow-sm cursor-grab">
                  <MdDragIndicator className="text-xl text-[#656668]" />
                  {dataElement.selectionJson.multipleSelections ?
                    <CheckBox
                      disabled={mode === "view"}
                      checked={dataElement.selectionJson.default.includes(option.text)}
                      onChange={() => toggleSelection(option.text)}
                    />
                    :
                    <Radio
                      disabled={mode === "view"}
                      checked={dataElement.selectionJson.default.includes(option.text)}
                      onChange={() => toggleSelection(option.text)}
                    />
                  }
                  <div className="relative w-full">
                    <InputText
                      disabled={mode === "view"}
                      value={option.text}
                      onChange={(e) => updateOptionText(option.order, e.target.value)}
                      className={`ml-2 border ${(option.text === "" || dataElement.selectionJson.options.findIndex(o => o.text === option.text) !== index) ? "border-red-500" : "border-gray-300"} 
    text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10`} // pr-10 for right padding
                      placeholder="Options"
                    />
                    {/* Delete button inside the text field */}
                    {mode !== "view" &&
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        onClick={() => deleteOption(option.order)}
                        className="size-5 absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>}
                  </div>
                </div>
                {option.text === "" && (
                  <p className="text-red-500 text-xs pt-2 pl-4">
                    {t("dataelement.form.requirefield")}
                  </p>
                )}
                {dataElement.selectionJson.options.findIndex(o => o.text === option.text) !== index && (
                  <p className="text-red-500 text-xs pt-2 pl-4">
                    {t("dataelement.form.duplicated")}
                  </p>
                )
                }
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button
        disabled={mode === "view"}
        onClick={addOption}
        className="font-semibold text-sm text-primary-blue p-4">
        {t("dataelement.form.addoption")}
      </button>
    </div >
  );
}
