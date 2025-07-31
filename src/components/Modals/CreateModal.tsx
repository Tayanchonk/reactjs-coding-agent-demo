import { Modal } from "flowbite-react";
import Select, { StylesConfig } from "react-select";
import { t } from "i18next";
import React, { useState } from "react";
import ComboBox from "../CustomComponent/ComboBox";
import { Button, ComboBoxOption } from "../CustomComponent";

interface CreateModalProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  role: any;
  organizations: any;
  setSelectedRole: (value: any) => void;
  selectRole: any;
  setSelectedOrganization: (value: any) => void;
  selectedOrganization: any;
  handleAddRole: () => void;
}

const customStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    background: "#fff",
    borderColor: "#e5e7eb",
    minHeight: "42px",
    height: "42px",
    zIndex: 500,
    // boxShadow: state.isFocused ? '' : '',
    borderRadius: "6px",
    "& input": {
      boxShadow: state.isFocused ? "none!important" : provided.boxShadow,
    },
    // boxShadow: "none", // เอา shadow ออก
    // input border ไม่มี
    // borderColor: state.isFocused ? "#ff5733" : "#ccc", // เปลี่ยนสีเส้นขอบเมื่อโฟกัส
    // boxShadow: state.isFocused ? "0 0 5px rgba(255, 87, 51, 0.5)" : "none",
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "42px",
    padding: "0 6px",
  }),

  input: (provided) => ({
    ...provided,
    outline: "none", // ป้องกันเส้นขอบ default
  }),

  indicatorSeparator: (state) => ({
    display: "none",
  }),

  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "42px",
  }),
};

export function CreateModal({
  openModal,
  setOpenModal,
  role,
  organizations,
  setSelectedOrganization,
  selectRole,
  setSelectedRole,
  selectedOrganization,
  handleAddRole,
}: CreateModalProps) {
  const [query, setQuery] = useState("");
  const filteredOptions = role.filter((option: any) =>
    option.rolePermissionName.toLowerCase().includes(query.toLowerCase())
  );
  const [error, setError] = useState(false);

  return (
    <>
      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Modal.Header className="relative flex items-center">
          {/* ไอคอนของคุณ */}
          {/* ปุ่มปิดเอง (icon) */}
          {/* <Button
                        className="absolute  text-gray-500 hover:text-gray-700"
                        // style={{ top: "1.5rem", right: "1.05rem" }}
                        onClick={() => setOpenModal(false)}
                    >
                        <svg width="38" height="37" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_410_8516" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="38" height="37">
                                <rect x="0.5" width="37.1028" height="37" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_410_8516)">
                                <path d="M13.2183 25.9563L11.5742 24.3167L17.4071 18.5L11.5742 12.7218L13.2183 11.0823L19.0512 16.899L24.8454 11.0823L26.4895 12.7218L20.6567 18.5L26.4895 24.3167L24.8454 25.9563L19.0512 20.1396L13.2183 25.9563Z" fill="#111928" />
                            </g>
                        </svg>
                    </Button> */}

          {/* ข้อความของ Header */}
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("userManagement.addRole")}
            </h2>
            <p className="font-light text-sm">
              {t("userManagement.descriptionAddRole")}
            </p>
          </div>
        </Modal.Header>

        <Modal.Body style={{ overflow: "unset" }}>
          <div className="pl-5 pr-5">
            {/* role select input */}
            <div className="mt-4">
              <label
                htmlFor="role"
                className="block text-base/6 font-medium text-gray-900"
              >
                <span style={{ color: "red" }}>*</span>{" "}
                {t("userManagement.roleName")}
              </label>
              <div className="flex w-full mt-2">
                <ComboBox
                  id="ddlRole"
                  placeholder={t("roleAndPermission.pleaseSelect")}
                  minWidth="100%"
                  onChange={(e) => {
                    setQuery(e);
                  }}
                  onClose={() => setQuery("")}
                  displayName={
                    (selectRole &&
                      role.find(
                        (option: any) => option.rolePermissionId === selectRole
                      ).rolePermissionName) ||
                    ""
                  }
                  defaultValue={""}
                  className="z-50"
                >
                  <div className="z-[11111111] relative bg-white border border-gray-300 rounded-lg">
                    {filteredOptions.map((option: any, index: any) => (
                      <ComboBoxOption
                        onClick={() => {
                          console.log("option", option);

                          setSelectedRole(option.rolePermissionId);
                          setError(false);
                        }}
                        key={index}
                        value={option}
                        className="z-50"
                      >
                        <span className="text-steel-gray">
                          {option.rolePermissionName}
                        </span>
                      </ComboBoxOption>
                    ))}
                  </div>
                </ComboBox>
              </div>
              {/* <Select
                                id="role"
                                name="role"

                                className="text-sm p-3 z-50"
                                styles={customStyles}
                                // value={selectRole}
                                // onChange={(e) => setSelectedRole(e.target.value)}


                                onChange={(e: any) => {
                                    setSelectedRole(e.value);
                                    setError(false);
                                }
                                }

                                options={role?.map((val: any, index: any) => (
                                    { value: val.rolePermissionId, label: val.rolePermissionName }
                                ))}
                                placeholder={t('userManagement.selectRole')}
                                isSearchable={true}
                            // isClearable={true}
                            /> */}
              {/* แสดง error หากไม่มีการเลือก */}
              {selectRole === "" && error && (
                <p className="text-red-500 ml-4 text-xs pt-1">
                  {t("userManagement.pleaseSelectRole")}
                </p>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="flex justify-end z-0">
          <Button
            onClick={() => setOpenModal(false)}
            className="bg-white text-black border border-[#E2E8F0] px-3 py-1 rounded hover:bg-gray-100"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              // เช็คว่ามีการเลือก role หรือไม่
              if (selectRole === "") {
                setError(true);
                return;
              }
              setOpenModal(false);
              handleAddRole();
            }}
            className="bg-[#3758F9] text-white px-3 py-1 rounded ml-2 hover:bg-blue-700"
          >
            {t("add")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
