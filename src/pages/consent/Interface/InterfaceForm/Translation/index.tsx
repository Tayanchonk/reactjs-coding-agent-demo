import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TranslationsModue from "../../../../../components/TranslationsModue";
import {
	TranslationField,
	Field,
} from "../../../../../interface/purpose.interface";
import {
	IConsentInterface,
	ITranslateFields
} from "../../../../../interface/interface.interface";

const InterfaceTranslation = () => {
	const { t } = useTranslation();
	const context = useOutletContext<{
		consentInterface: IConsentInterface;
		setConsentInterface: (data: any) => void;
		mode: string;
		errors: any;
		id?: string;
	}>();
	const { consentInterface, setConsentInterface, mode, id } = context;
	const [fieldsets, setFieldsets] = useState<ITranslateFields[]>([]);
	const setTranslationJson = (
		value: TranslationField[] | ((prev: TranslationField[]) => TranslationField[])
	) => {
		setConsentInterface((prev: any) => {
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
		fields.push({
			name: "Consent Interface Name",
			value: consentInterface.interfaceName,
			transalte: "",
		})
		fields.push({
			name: "Description",
			value: consentInterface.description,
			transalte: "",
		})
		consentInterface.builder.forEach((page) => {
			fields.push({
				name: `Page: ${page.pageName}`,
				value: page.pageName,
				transalte: "",
			});

			page.sections.forEach((section: any, index: any) => {
				fields.push({
					name: `Section: ${section.text}`,
					value: section.text,
					transalte: "",
				});
			});
		});
		setFieldsets(fields);
	}, [consentInterface.builder]);

	return (
		<div className="p-4">
			<TranslationsModue
				isView={mode === "view"}
				translationJson={consentInterface.translationJson}
				fields={fieldsets}
				titleDesc={t("interface.translationDescription")}
				addDesc={t("interface.addLanguage")}
				setTranslationJson={setTranslationJson} />
		</div>
	);
};

export default InterfaceTranslation;