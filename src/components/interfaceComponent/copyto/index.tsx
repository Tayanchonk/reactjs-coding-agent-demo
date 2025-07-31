import { Dialog } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IOrganizations } from '../../../interface/interface.interface';
import { Button, Dropdown, DropdownOption, InputText, TextArea } from '../../CustomComponent';

interface FormData {
  interfaceName: string;
  description: string;
  organizationId: string;
}

interface CopyToModalProps {
  isOpen: boolean;
  organizations: IOrganizations[];
  onClose: () => void;
  onSubmit: (formData: any, isError: boolean) => void;
}

const Copyto: React.FC<CopyToModalProps> = ({ isOpen, organizations, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    interfaceName: "",
    description: "",
    organizationId: ""
  });
  const [selectedOrganization, setSelectedOrganization] = useState<IOrganizations | null>(null);
  const [interfaceNameError, setInterfaceNameError] = useState(false);
  const [interfaceDescriptionError, setInterfaceDescriptionError] = useState(false);
  const [organizationError, setOrganizationError] = useState(false);

  useEffect(() => {
    setFormData({
      interfaceName: "",
      description: "",
      organizationId: ""
    })
    setSelectedOrganization(null)
  }, [isOpen])
  useEffect(() => {
    setInterfaceNameError(false)
  }, [formData.description])
  useEffect(() => {
    setInterfaceDescriptionError(false)
  }, [formData.interfaceName])
  useEffect(() => {
    setOrganizationError(false)
  }, [formData.organizationId])

  const handSubmit = () => {
    let isError = false
    if (formData.interfaceName === "") {
      isError = true
      setInterfaceNameError(true)
    }
    if (formData.description === "") {
      isError = true
      setInterfaceDescriptionError(true)
    }
    if (formData.organizationId === "") {
      isError = true
      setOrganizationError(true)
    }
    onSubmit(formData, isError)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="pt-6 pr-6 pl-6 pb-3">
          <h2 className="text-xl font-semibold">{t("interface.copyTo.title")}</h2>
          <p className="text-gray-600 text-base mt-1">
            {t("interface.copyTo.titledesc")}.
          </p>
        </div>
        <hr className="border-t border-gray-200 w-full"></hr>
        <div className="grid-cols-12 col-span-5 px-8 py-5">
          <div className="mb-4">
            <h1 className="pb-2 text-base font-semibold">
              <span className="text-red-500">*</span> {t("interface.info.interfaceName")}
            </h1>
            <InputText
              type="text"
              placeholder=""
              value={formData.interfaceName}
              isError={interfaceNameError}
              className="font-base"
              onChange={(e: any) => setFormData({ ...formData, interfaceName: e.target.value })}
            />
            {interfaceNameError && <p className="text-red-500 pt-2">{t("thisfieldisrequired")}</p>}
          </div>
          <div className="mb-4">
            <h1 className="text-base font-semibold pb-2">
              <span className="text-red-500">*</span> {t("interface.info.description")}
            </h1>
            <TextArea
              placeholder=""
              value={formData.description}
              isError={interfaceDescriptionError}
              className="text-base"
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
              minHeight="10rem"
            />
            {interfaceDescriptionError && <p className="text-red-500 pt-2">{t("thisfieldisrequired")}</p>}
          </div>

          <div className="mb-10">
            <label className="block text-base font-semibold pb-2">
              <span className="text-red-500">*</span> {t("interface.info.organization")}
            </label>
            <Dropdown
              id="selectedOrganization"
              title=""
              className="w-full mt-2 text-base"
              isError={organizationError}
              selectedName={selectedOrganization?.organizationName || ""}
            >
              {organizations.map((item) => (
                <DropdownOption
                  className="h-[2.625rem]"
                  selected={selectedOrganization?.organizationId === item.organizationId}
                  onClick={() => {
                    setSelectedOrganization(item)
                    setFormData({ ...formData, organizationId: item.organizationId })
                  }}
                  key={item.organizationId}
                >
                  <span className={`${selectedOrganization?.organizationId === item.organizationId ? 'text-white' : ''}`}>{item.organizationName}</span>
                </DropdownOption>
              ))}
            </Dropdown>
            {organizationError && <p className="text-red-500 pt-2">{t("thisfieldisrequired")}</p>}
          </div>
        </div>
        <hr className="border-t border-gray-200 w-full"></hr>
        <div className="mt-3 flex justify-end gap-2 pr-6 pl-6 pb-4">
          <Button onClick={onClose} className="text-base px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">{t("cancel")}</Button>
          <Button onClick={handSubmit} className="text-base px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{t("interface.copyTo.copy")}</Button>
        </div>
      </div>
    </Dialog>
  );
}

export default Copyto;
