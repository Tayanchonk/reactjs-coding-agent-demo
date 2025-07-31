import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import TranslationsModue from "../../../../components/TranslationsModue";
import {
  TranslationField,
  Field,
} from "../../../../interface/purpose.interface";
import {
  ITranslateFields
} from "../../../../interface/interface.interface";
import { useEffect, useState } from "react";


const DataElementTranslation = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [fieldsets, setFieldsets] = useState<ITranslateFields[]>([{ name: "Data Element Name", value: "" }]);

  const context = useOutletContext<{
    dataElement: any;
    setDataElement: (data: any) => void;
    mode: string;
    errors: any;
    id?: string;
    organizations: any[];
  }>();


  const { dataElement, setDataElement, mode } = context;
  const isView = mode === "view";

  const setTranslationJson = (
    value: TranslationField[] | ((prev: TranslationField[]) => TranslationField[])
  ) => {
    setDataElement((prev: any) => {
      const prevTranslations = prev.translationJson || [];

      const nextValue = typeof value === "function"
        ? (value as (prev: TranslationField[]) => TranslationField[])(prevTranslations)
        : value;

      return {
        ...prev,
        translationJson: nextValue,
      };
    });
  };

  useEffect(() => {
    const fields: Field[] = [];
    if (dataElement.dataElementTypeName === "Selection") {
      fields.push({
        name: `Data Element Name`,
        value: dataElement.dataElementName,
        transalte: "",
      })
      dataElement.selectionJson.options.forEach((option: any, index: number) => {
        fields.push({
          name: `Option ${option.order}`,
          value: option.text,
          transalte: "",
        });
      })
    } else fields.push({
      name: `Data Element Name`,
      value: dataElement.dataElementName,
      transalte: "",
    })
    setFieldsets(fields)

  }, [dataElement.dataElementTypeName, dataElement.translationJson]);

  return (
    <div className="py-2">
      {/* ✅ Header Section */}
      <TranslationsModue
        isView={isView}
        translationJson={dataElement.translationJson}
        fields={fieldsets}
        titleDesc={t("dataelement.translationdescription")}
        addDesc={t("dataelement.addlanguage")}
        setTranslationJson={setTranslationJson} />
    </div>
  );
};

export default DataElementTranslation;
