import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdOutlineFileUpload } from "react-icons/md";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TableRole } from "./table";
import { CreateModal } from "../../../../components/Modals/CreateModal";
import {
  createUser,
  getListManager,
  getOrganization,
  getRole,
  getUser,
  postRolePermission,
  updateUser,
} from "../../../../services/userService";
import { useLocation, useNavigate } from "react-router-dom";
import { IUserData } from "../../../../interface/user.interface";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import { ModalType } from "../../../../enum/ModalType";
import { useDispatch, useSelector } from "react-redux";

import {
  setOpenLoadingFalse,
  setOpenLoadingTrue,
} from "../../../../store/slices/loadingSlice";
import Alert from "../../../../components/Alert";
import { IoAdd, IoTriangle } from "react-icons/io5";
import { formatDate } from "../../../../utils/Utils";
import { FaCalendarAlt } from "react-icons/fa";
import Select, { StylesConfig } from "react-select";
import { RootState } from "../../../../store";
import InputText from "../../../../components/CustomComponent/InputText";
import CheckBox from "../../../../components/CustomComponent/CheckBox";
import {
  Button,
  ComboBox,
  ComboBoxOption,
  LogInfo,
  MultipleSelect,
  MutipleSelectOption,
  Toggle,
} from "../../../../components/CustomComponent";
import { use } from "i18next";
import { stat } from "fs";
import DatePicker from "../../../../components/CustomComponent/DatePicker";

interface IManager {
  email: string;
  firstName: string;
  lastName: string;
}

interface IOrganizations {
  organizationId: string;
  customerId: string;
  organizationName: string;
  organizationParentId: string | null;
  defaultLanguage: string | null;
  description: string | null;
  isActiveStatus: boolean | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string;
  modifiedBy: string | null;
  isDelete: boolean | null;
  createdByName: string | null;
  modifiedByName: string | null;
}

const customStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    background: "#fff",
    // borderColor: '#e5e7eb',
    minHeight: "42px",
    height: "42px",
    // zIndex: 500,
    borderColor: "#e5e7eb",
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

const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
  <button
    type="button"
    className="border h-[2.6rem] border-[#e5e7eb] text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex justify-between items-center"
    onClick={onClick}
    ref={ref}
  >
    <span>{value || "Select Expiration Date"}</span>
    <svg
      className="ml-20"
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.30775 19.5C1.80258 19.5 1.375 19.325 1.025 18.975C0.675 18.625 0.5 18.1974 0.5 17.6923V4.30777C0.5 3.8026 0.675 3.37502 1.025 3.02502C1.375 2.67502 1.80258 2.50002 2.30775 2.50002H3.69225V0.384766H5.23075V2.50002H12.8077V0.384766H14.3077V2.50002H15.6923C16.1974 2.50002 16.625 2.67502 16.975 3.02502C17.325 3.37502 17.5 3.8026 17.5 4.30777V17.6923C17.5 18.1974 17.325 18.625 16.975 18.975C16.625 19.325 16.1974 19.5 15.6923 19.5H2.30775ZM2.30775 18H15.6923C15.7692 18 15.8398 17.9679 15.9038 17.9038C15.9679 17.8398 16 17.7693 16 17.6923V8.30777H2V17.6923C2 17.7693 2.03208 17.8398 2.09625 17.9038C2.16025 17.9679 2.23075 18 2.30775 18ZM2 6.80777H16V4.30777C16 4.23077 15.9679 4.16026 15.9038 4.09626C15.8398 4.0321 15.7692 4.00002 15.6923 4.00002H2.30775C2.23075 4.00002 2.16025 4.0321 2.09625 4.09626C2.03208 4.16026 2 4.23077 2 4.30777V6.80777ZM9 12.077C8.75517 12.077 8.5465 11.9908 8.374 11.8183C8.20167 11.6459 8.1155 11.4373 8.1155 11.1923C8.1155 10.9474 8.20167 10.7388 8.374 10.5663C8.5465 10.3939 8.75517 10.3078 9 10.3078C9.24483 10.3078 9.4535 10.3939 9.626 10.5663C9.79833 10.7388 9.8845 10.9474 9.8845 11.1923C9.8845 11.4373 9.79833 11.6459 9.626 11.8183C9.4535 11.9908 9.24483 12.077 9 12.077ZM5 12.077C4.75517 12.077 4.5465 11.9908 4.374 11.8183C4.20167 11.6459 4.1155 11.4373 4.1155 11.1923C4.1155 10.9474 4.20167 10.7388 4.374 10.5663C4.5465 10.3939 4.75517 10.3078 5 10.3078C5.24483 10.3078 5.4535 10.3939 5.626 10.5663C5.79833 10.7388 5.8845 10.9474 5.8845 11.1923C5.8845 11.4373 5.79833 11.6459 5.626 11.8183C5.4535 11.9908 5.24483 12.077 5 12.077ZM13 12.077C12.7552 12.077 12.5465 11.9908 12.374 11.8183C12.2017 11.6459 12.1155 11.4373 12.1155 11.1923C12.1155 10.9474 12.2017 10.7388 12.374 10.5663C12.5465 10.3939 12.7552 10.3078 13 10.3078C13.2448 10.3078 13.4535 10.3939 13.626 10.5663C13.7983 10.7388 13.8845 10.9474 13.8845 11.1923C13.8845 11.4373 13.7983 11.6459 13.626 11.8183C13.4535 11.9908 13.2448 12.077 13 12.077ZM9 16C8.75517 16 8.5465 15.9138 8.374 15.7413C8.20167 15.5689 8.1155 15.3603 8.1155 15.1155C8.1155 14.8705 8.20167 14.6618 8.374 14.4895C8.5465 14.317 8.75517 14.2308 9 14.2308C9.24483 14.2308 9.4535 14.317 9.626 14.4895C9.79833 14.6618 9.8845 14.8705 9.8845 15.1155C9.8845 15.3603 9.79833 15.5689 9.626 15.7413C9.4535 15.9138 9.24483 16 9 16ZM5 16C4.75517 16 4.5465 15.9138 4.374 15.7413C4.20167 15.5689 4.1155 15.3603 4.1155 15.1155C4.1155 14.8705 4.20167 14.6618 4.374 14.4895C4.5465 14.317 4.75517 14.2308 5 14.2308C5.24483 14.2308 5.4535 14.317 5.626 14.4895C5.79833 14.6618 5.8845 14.8705 5.8845 15.1155C5.8845 15.3603 5.79833 15.5689 5.626 15.7413C5.4535 15.9138 5.24483 16 5 16ZM13 16C12.7552 16 12.5465 15.9138 12.374 15.7413C12.2017 15.5689 12.1155 15.3603 12.1155 15.1155C12.1155 14.8705 12.2017 14.6618 12.374 14.4895C12.5465 14.317 12.7552 14.2308 13 14.2308C13.2448 14.2308 13.4535 14.317 13.626 14.4895C13.7983 14.6618 13.8845 14.8705 13.8845 15.1155C13.8845 15.3603 13.7983 15.5689 13.626 15.7413C13.4535 15.9138 13.2448 16 13 16Z"
        fill="#9CA3AF"
      />
    </svg>
  </button>
));

function EditUser() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ใช้แทน useHistory
  const [openModal, setOpenModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [organizations, setOrganizations] = useState<IOrganizations[]>([]);
  const [listManager, setListManager] = useState<IManager[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [roles, setRoles] = useState<any>([]);
  const [selectRow, setSelectRow] = useState<any>([]);
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [isOpen, setIsOpen] = useState(false);
  const [Info, setInfo] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [typeAlert, setTypeAlert] = useState("");
  const [formatD, setFormatD] = useState("dd/MM/yyyy");
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    OrganizationId: false,
    status: false,
    role: false,
  });

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );

  const { status, id } = location.state || {};

  // for modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() =>
    Promise.resolve()
  );

  const [action, setAction] = useState("");
  const [query, setQuery] = useState("");

  const [roleSet, setRoleSet] = useState<any>([]);
  const [userData, setUserData] = useState<IUserData>({
    userAccountId: "",
    customerId: "",
    firstName: "",
    lastName: "",
    email: "",
    accountType: "",
    source: {},
    businessUnit: "",
    department: "",
    division: "",
    employeeId: "",
    jobTitle: "",
    manager: {
      managerId: "",
      firstName: "",
      lastName: "",
      email: "",
    },

    userAccountOrganizations: {
      userAccountId: "",
      organizationId: "",

      isActiveStatus: true,

      organizationName: "",
    },
    rolePermissions: [],
    managerLagacy: "",
    officeLocation: "",
    sessionProtection: true,
    isSystemAccount: true,
    profileImageBase64: "",
    expirationDate: new Date().toISOString(),
    lastLoginDate: new Date().toISOString(),
    isActiveStatus: true,
    createdBy: "",
    modifiedBy: "",
    modifiedDate: "",
    createdDate: "",
    createdByName: "",
    modifiedByName: "",
  });

  const onClose = () => {
    setIsOpen(false);
  };

  const openInfo = () => {
    setInfo(!Info);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    setUserData((prevState: any) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevState: any) => ({
          ...prevState,
          profileImageBase64: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDelete = () => {
    setUserData((prevState: any) => ({
      ...prevState,
      profileImageBase64: "",
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setUserData((prevState: any) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  const handleGetRole = async () => {
    try {
      const roleres = await getRole();
      setRoles(
        roleres.sort((a: any, b: any) =>
          a.rolePermissionName.localeCompare(b.rolePermissionName)
        )
      );
      // setOrganizations(organizationres);

      setSelectedRole("");
      setOpenModal(true);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleAddRole = async () => {
    try {
      if (selectedRole === "") {
        alert("Please select role");
        return;
      }

      const data = {
        rolePermissionIds: [selectedRole],
      };

      const resp: any = await postRolePermission(data);

      //  check add dupicate
      const checkDuplicate = roleSet.find(
        (role: any) => role.rolePermissionId === resp[0].rolePermissionId
      );
      if (checkDuplicate) {
        //   alert('Role already exists');
        setOpenModal(false);
        return;
      }

      setRoleSet((prevState: any) => [...prevState, ...resp]);

      setOpenModal(false);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profileImage")?.click();
  };

  const handleInputChangeDate = (date: Date) => {
    handleFormatDate();

    setUserData((prevState: any) => ({
      ...prevState,
      expirationDate: date.toISOString(),
    }));
  };

  const handleConfirm = async () => {
    await handleUpdateUser();
  };

  const handleUpdateUser = async () => {
    try {
      const userdata = sessionStorage.getItem("user");
      const customer_id = JSON.parse(userdata as string).customerId;

      // if (roleSet.length === 0) {
      //     alert('Please select role');
      //     return;
      // }
      // setLoading(true);

      const userdatas = sessionStorage.getItem("user");
      const data: any = {
        ...userData,
        rolePermissions: roleSet,
        customerId: customer_id,
        modifiedBy: JSON.parse(userdatas as string).user_account_id,
      };

      // trim email and convert after @ to lowercase
      data.email = data.email.trim();
      const emailSplit = data.email.split("@");
      data.email = emailSplit[0] + "@" + emailSplit[1].toLowerCase();

      data.modifiedDate = new Date().toISOString();
      data.createdDate = new Date().toISOString();

      if (status === "create") {
        const userdata = sessionStorage.getItem("user");
        if (userdata) {
          const customer_id = JSON.parse(userdata).customer_id;
          data.userAccountId = JSON.parse(userdata).user_account_id;
          data.customerId = customer_id;
          (data.userAccountOrganizations = {
            ...userData.userAccountOrganizations,
            customerId: customer_id,
            userAccountId: JSON.parse(userdata).user_account_id,
          }),
            (data.createdBy = JSON.parse(userdata).user_account_id);
          data.modifiedBy = JSON.parse(userdata).user_account_id;
          const resp = await createUser(data);
        }
      } else {
        const resp = await updateUser(data, userData.userAccountId);
      }

      setLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setUserData({
          userAccountId: "",
          customerId: "",
          firstName: "",
          lastName: "",
          email: "",
          accountType: "",
          source: {},
          businessUnit: "",
          department: "",
          division: "",
          employeeId: "",
          jobTitle: "",
          manager: {
            managerId: "",
            firstName: "",
            lastName: "",
            email: "",
          },

          userAccountOrganizations: {
            userAccountId: "",
            organizationId: "",

            isActiveStatus: true,

            organizationName: "",
          },
          rolePermissions: [],
          managerLagacy: "",
          officeLocation: "",
          sessionProtection: true,
          isSystemAccount: true,
          profileImageBase64: "",
          expirationDate: new Date().toISOString(),
          lastLoginDate: new Date().toISOString(),
          isActiveStatus: true,
          createdBy: "",
          modifiedBy: "",
        });

        setRoleSet([]);

        if (action === "close") {
          navigate("/setting/user-management/user");
        }
      }, 500);
    } catch (error: any) {
      console.error("There was an error!", error);
      // setOpenAlert(true);

      // setAlertMessage(error.response.data.message);
      // setTypeAlert('error');

      throw error;

      // setTimeout(() => {
      //     setOpenAlert(false);
      // }, 3000);
    }
  };

  const handleCancel = () => {
    setConfirmTitle(t("modal.confirmCancel")); // text for header modal
    setConfirmDetail(t("modal.descriptionConfirmCancel")); // text decription in mdaol
    setConfirmType(ModalType.Cancel); // type modal
    setIsConfirmModalOpen(true); // open modal
    setIsOpen(true);
    setConfirmAction(() => async () => {
      navigate("/setting/user-management/user");
    });
  };

  const getUserById = async (userId: string) => {
    try {
      // setLoading(true);
      const response = await getUser(userId);

      setRoleSet(response.rolePermissions);
      setUserData(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("There was an error fetching the user data!", error);
    }
  };

  const handleGetManager = async () => {
    try {
      dispatch(setOpenLoadingTrue());
      const response = await getListManager();

      // sort by email desc
      setListManager(
        response.sort((a: any, b: any) => a.email.localeCompare(b.email))
      );
    } catch (error) {
      dispatch(setOpenLoadingFalse());
      console.error("There was an error fetching the user data!", error);
    }
  };

  const filteredOptions = listManager.filter((option: any) =>
    option.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleGetOrganization = async () => {
    try {
      const response = await getOrganization();

      // sort by organizationName desc
      setOrganizations(
        response
          .sort((a: any, b: any) =>
            a.organizationName.localeCompare(b.organizationName)
          )
          ?.filter((organization: any) => organization.isActiveStatus === true)
      );
      dispatch(setOpenLoadingFalse());
    } catch (error) {
      dispatch(setOpenLoadingFalse());
      console.error("There was an error fetching the user data!", error);
    }
  };

  const handleActionRole = (id: any, event: any) => {
    event.preventDefault();
    let data = roleSet.filter((role: any) => role.rolePermissionId !== id);
    setRoleSet(data);
  };

  const handleDeleteRole = () => {
    // delete role from roleSet by selectRow
    const data = userData.rolePermissions.filter(
      (role: any) =>
        selectRow.find(
          (r: any) => r.rolePermissionId == role.rolePermissionId
        ) === undefined
    );
    setRoleSet(data);
  };

  // const handleFormatDate = () => {
  //     const formatDate = localStorage.getItem('datetime')
  //     const dataformat  = JSON.parse(formatDate as string);
  //     console.log('dataformat', dataformat);

  //     return dataformat.dateFormat;
  // }

  const handleFormatDate = () => {
    const datef = localStorage.getItem("datetime");
    const dataformat = JSON.parse(datef as string);

    // Convert format to lowercase
    const formattedDate = dataformat.dateFormat
      .replace(/D/g, "d")
      .replace(/Y/g, "y");
    setFormatD(formattedDate);
  };

  const handleAction = (action: string) => {
    setAction(action);
    let statusCheck = false;
    // validate
    if (userData.firstName === "") {
      setErrors((prevState) => ({
        ...prevState,
        firstName: true,
      }));

      statusCheck = true;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        firstName: false,
      }));
    }
    if (userData.lastName === "") {
      setErrors((prevState) => ({
        ...prevState,
        lastName: true,
      }));
      statusCheck = true;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        lastName: false,
      }));
    }
    if (userData.email === "") {
      setErrors((prevState) => ({
        ...prevState,
        email: true,
      }));

      statusCheck = true;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        email: false,
      }));
    }
    //   check format email
    if (!userData.email.includes("@")) {
      setErrors((prevState) => ({
        ...prevState,
        email: true,
      }));

      statusCheck = true;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        email: false,
      }));
    }

    //  check rolepermission
    if (roleSet.length > 0) {
      setErrors((prevState) => ({
        ...prevState,
        role: false,
      }));
    } else {
      // setErrors(prevState => ({
      //     ...prevState,
      //     role: true
      // }))
      setTypeAlert("error");
      setAlertMessage(t("modal.requiredRole"));
      setOpenAlert(true);
      setTimeout(() => {
        setOpenAlert(false);
      }, 3000);

      statusCheck = true;
    }

    if (statusCheck) {
      return;
    }
    if (status === "create") {
      setConfirmTitle(t("modal.confirmSave")); // text for header modal
      setConfirmDetail(t("modal.descriptionConfirmSave")); // text decription in mdaol
    } else {
      setConfirmTitle(t("modal.confirmUpdate")); // text for header modal
      setConfirmDetail(t("modal.descriptionConfirmUpdate")); // text decription in mdaol
    }

    setIsOpen(true);
  };

  useEffect(() => {
    handleFormatDate();

    handleGetManager();
    handleGetOrganization();
  }, []);

  useEffect(() => {
    if (status == "view" || status == "edit") {
      getUserById(id);
    }
  }, [status]);

  return (
    <>
      <div className="relative ">
        <div className="w-full bg-white px-14 py-7">
          <form className="">
            <div className="flex pb-3 border-b border-[gainsboro]">
              <div className="w-9/12">
                <h1 className="text-xl font-semibold">{t("userinfo")}</h1>
                <p className="text-base">{t("userinfodescription")}</p>
              </div>
              <div className="w-5/12 text-right">
                <Button
                  onClick={handleCancel}
                  color="#DFE4EA"
                  className="mr-2"
                  variant="outlined"
                >
                  <p className="text-base">{t("cancel")}</p>
                </Button>
                {/* <Button
                  className="rounded mr-1 bg-[#ffffff] py-2 px-4 text-base text-black data-[hover]:bg-sky-500 data-[active]:bg-sky-700 font-bold border-2 border-[#E2E8F0]"
                  onClick={handleCancel}
                >
                  {t("cancel")}
                </Button> */}
                {status !== "view" && permissionPage.isCreate ? (
                  <>
                    <Button
                      className="rounded bg-[#3758F9] py-2 px-4 text-base text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 font-semibold"
                      onClick={() => handleAction("close")}
                    >
                      {t("submitAndClose")}
                    </Button>

                    {status === "create" && (
                      <Button
                        className="rounded ml-2 bg-[#163AEB] py-2 px-4 text-base text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 font-semibold"
                        onClick={() => handleAction("new")}
                      >
                        {t("submitAndContinue")}
                      </Button>
                    )}
                  </>
                ) : (
                  permissionPage?.isUpdate && (
                    <Button
                      className="rounded bg-[#3758F9] py-2 px-4 text-base text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 font-semibold"
                      onClick={() => {
                        navigate("/setting/user-management/user/users", {
                          state: { status: "edit", id: id },
                        });
                      }}
                    >
                      {t("edit")}
                    </Button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 border-b-2 ">
              <div className="col-span-4 border-r border-[#F6F6F6] p-3">
                <div className="flex flex-col mt-2 items-center bg-[#F6F6F6]   rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <img
                    className="w-20 h-20 mt-3 mb-3 ml-2 rounded-full shadow-lg"
                    src={
                      userData?.profileImageBase64
                        ? userData?.profileImageBase64
                        : "https://static.vecteezy.com/system/resources/previews/006/487/917/non_2x/man-avatar-icon-free-vector.jpg"
                    }
                    alt="Bonnie image"
                  />
                  <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
                      {t("userManagement.accountProfile")}
                    </h5>
                    <div className="flex mt-1 md:mt-1">
                      <input
                        type="file"
                        disabled={status === "view"}
                        id="profileImage"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <button
                        type="button"
                        disabled={status === "view"}
                        className="inline-flex items-center px-2 py-1 mb-1 text-xs font-medium text-center text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 me-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        onClick={triggerFileInput}
                      >
                        <MdOutlineFileUpload style={{ fontSize: "16px" }} />
                        {t("userManagement.upload")}
                      </button>
                      <button
                        type="button"
                        disabled={status === "view"}
                        className="px-4 py-1 mb-1 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        onClick={handleFileDelete}
                      >
                        {t("userManagement.remove")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label
                    htmlFor="firstName"
                    className="block mb-2 font-medium text-base/6"
                  >
                    <span style={{ color: "red" }}>*</span>{" "}
                    {t("userManagement.First Name")}
                  </label>
                  {/* <input
                    type="text"
                    disabled={status === "view"}
                    id="firstName"
                    value={userData.firstName}
                    className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    style={
                      errors.firstName
                        ? { border: "1px solid red" }
                        : { fontSize: "0.875rem" }
                    }
                    placeholder={t("userManagement.First Name")}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  /> */}

                  <InputText
                    disabled={status === "view"}
                    id="firstName"
                    value={userData.firstName}
                    placeholder={t("userManagement.First Name")}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    isError={errors.firstName}
                  />
                  {/* validate */}
                  {errors.firstName && (
                    <p className="pt-2 text-xs text-red-500">
                      {t("userManagement.firstNameRequire")}
                    </p>
                  )}
                </div>

                <div className="mt-3">
                  <label
                    htmlFor="lastName"
                    className="block mb-2 font-medium text-base/6"
                  >
                    <span style={{ color: "red" }}>*</span>{" "}
                    {t("userManagement.Last Name")}
                  </label>
                  {/* <input
                    type="text"
                    disabled={status === "view"}
                    id="lastName"
                    value={userData.lastName}
                    className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    style={
                      errors.lastName
                        ? { border: "1px solid red" }
                        : { fontSize: "0.875rem" }
                    }
                    placeholder={t("userManagement.Last Name")}
                    onChange={handleInputChange}
                  /> */}
                  <InputText
                    disabled={status === "view"}
                    id="lastName"
                    value={userData.lastName}
                    placeholder={t("userManagement.Last Name")}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    isError={errors.lastName}
                  />
                  {/* validate */}
                  {errors.lastName && (
                    <p className="pt-2 text-xs text-red-500">
                      {t("userManagement.lastNameRequire")}
                    </p>
                  )}
                </div>

                <div className="mt-3">
                  <label
                    htmlFor="email"
                    className="block mb-2 font-medium text-base/6"
                  >
                    <span style={{ color: "red" }}>*</span>{" "}
                    {t("userManagement.Email")}
                  </label>
                  {/* <input
                    type="email"
                    id="email"
                    disabled={status === "view"}
                    value={userData.email}
                    className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                    style={
                      errors.email
                        ? { border: "1px solid red" }
                        : { fontSize: "0.875rem" }
                    }
                    placeholder={t("userManagement.Email")}
                    onChange={handleInputChange}
                  /> */}
                  <InputText
                    disabled={status === "view"}
                    id="email"
                    value={userData.email}
                    placeholder={t("userManagement.Email")}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    isError={errors.email}
                  />
                  {/* validate */}
                  {errors.email && (
                    <p className="pt-2 text-xs text-red-500">
                      {t("userManagement.emailRequire")}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  {/* <label htmlFor="status" className="block mb-2 font-medium" style={{ fontSize: "16px" }}>
                                        <span style={{ color: "red" }}>*</span> {t('userManagement.Status')}
                                    </label> */}
                  <label className="inline-flex items-center mb-5 cursor-pointer">
                    {/* <input

                      type="checkbox"
                      value=""
                      className="bg-white sr-only peer dark:bg-gray-800 dark:border-gray-600"
                      style={{ backgroundColor: "white !important" }}
                      disabled={status === "view"}
                      checked={userData?.isActiveStatus}
                      onChange={handleCheckboxChange}
                      id="isActiveStatus"
                    /> */}
                    <Toggle
                      //  id="isActiveStatus"
                      checked={userData?.isActiveStatus}
                      disabled={status === "view"}
                      onChange={() => {
                        setUserData((prevState: any) => ({
                          ...prevState,
                          isActiveStatus: !prevState.isActiveStatus,
                        }));
                      }}
                    />
                    {/* <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div> */}
                    <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">
                      {userData.isActiveStatus
                        ? t("userManagement.active")
                        : t("userManagement.inactive")}
                    </span>
                  </label>
                  {/* validate */}
                  {errors.status && (
                    <p className="text-xs text-red-500">
                      Please fill out this field.
                    </p>
                  )}
                </div>

                {/* <div>
                  <button
                    onClick={openInfo}
                    type="button"
                    className="relative flex mb-2 md:mb-0 text-black bg-[#ECEEF0] font-medium rounded-lg text-sm px-5 py-1.5 text-center  "
                  >
                    <p className="pr-1">
                      {t("settings.organizations.create.loginfo")}
                    </p>
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
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                  </button>
                </div>

                {Info && (
                  <div className="relative">
                    <div className="arrow-box bg-black w-[350px] absolute z-10 left-[155px] text-white py-3 px-6 mt-[-85px] rounded rounded-lg">
                      <IoTriangle
                        className="absolute top-[59px] left-[-10px] text-black"
                        style={{ transform: "rotate(29deg)" }}
                      />
                      <div className="flex">
                        <div className="w-6/12">
                          <p className="font-semibold text-sm text-[gainsboro]">
                            {t("settings.organizations.create.createDate")}
                          </p>
                          <p className="pt-2 text-sm font-light">
                            {formatDate(
                              "datetime",
                              userData.createdDate || new Date()
                            )}
                          </p>
                          <p className="font-semibold text-sm pt-2 text-[gainsboro]">
                            {t("settings.organizations.create.updateDate")}
                          </p>
                          <p className="pt-2 text-sm font-light">
                            {formatDate(
                              "datetime",
                              userData.modifiedDate || new Date()
                            )}
                          </p>
                        </div>
                        <div className="w-6/12">
                          <p className="font-semibold text-sm text-[gainsboro]">
                            {t("settings.organizations.create.createdBy")}
                          </p>
                          <p className="pt-2 text-sm font-light">
                            {userData.createdByName}
                          </p>
                          <p className="font-semibold text-sm pt-2 text-[gainsboro]">
                            {t("settings.organizations.create.updatedBy")}
                          </p>
                          <p className="pt-2 text-sm font-light">
                            {userData.modifiedByName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}

                {status !== "create" && (

                  <LogInfo
                    createdBy={userData.createdByName}
                    createdDate={formatDate(
                      "datetime",
                      userData.createdDate || new Date()
                    )}
                    modifiedBy={userData.modifiedByName}
                    modifiedDate={formatDate(
                      "datetime",
                      userData.modifiedDate || new Date()
                    )}
                  />
                )}
              </div>

              <div className="col-span-8 mb-5">
                <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="businessUnit"
                      className="block font-medium text-gray-900 text-base/6"
                    >
                      {t("userManagement.businessUnit")}
                    </label>
                    <div className="mt-2">
                      {/* <input
                        type="text"
                        disabled={status === "view"}
                        value={userData.businessUnit}
                        name="businessUnit"
                        id="businessUnit"
                        className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        placeholder={t("userManagement.businessUnit")}
                        onChange={handleInputChange}
                      /> */}
                      <InputText
                        disabled={status === "view"}
                        id="businessUnit"
                        value={userData.businessUnit}
                        placeholder={t("userManagement.businessUnit")}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="division"
                      className="block font-medium text-gray-900 text-base/6"
                    >
                      {t("userManagement.division")}
                    </label>
                    <div className="mt-2">
                      {/* <input
                        type="text"
                        disabled={status === "view"}
                        value={userData.division}
                        name="division"
                        id="division"
                        className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        placeholder={t("userManagement.division")}
                        onChange={handleInputChange}
                      /> */}
                      <InputText
                        disabled={status === "view"}
                        id="division"
                        value={userData.division}
                        placeholder={t("userManagement.division")}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 mt-5 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="jobTitle"
                      className="block font-medium text-gray-900 text-base/6"
                    >
                      {t("userManagement.jobTitle")}
                    </label>
                    <div className="mt-2">
                      {/* <input
                        type="text"
                        disabled={status === "view"}
                        value={userData.jobTitle}
                        name="jobTitle"
                        id="jobTitle"
                        className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        placeholder={t("userManagement.jobTitle")}
                        onChange={handleInputChange}
                      /> */}
                      <InputText
                        disabled={status === "view"}
                        id="jobTitle"
                        value={userData.jobTitle}
                        placeholder={t("userManagement.jobTitle")}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="employeeId"
                      className="block font-medium text-gray-900 text-base/6"
                    >
                      {t("userManagement.employeeId")}
                    </label>
                    <div className="mt-2">
                      {/* <input
                        type="text"
                        disabled={status === "view"}
                        name="employeeId"
                        value={userData.employeeId}
                        id="employeeId"
                        className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        placeholder={t("userManagement.employeeId")}
                        onChange={handleInputChange}
                      /> */}
                      <InputText
                        disabled={status === "view"}
                        id="employeeId"
                        value={userData.employeeId}
                        placeholder={t("userManagement.employeeId")}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 mt-5 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="manager"
                      className="block font-medium text-gray-900 text-base/6"
                    >
                      {t("userManagement.manager")}
                    </label>
                    <div className="mt-2">
                      {/* <select
                                                id="manager"
                                                className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                                                onChange={(e) => {


                                                    setUserData((prevState: any) => ({
                                                        ...prevState,
                                                        manager: {
                                                            managerId: e.target.value,
                                                            email: listManager.find((manager: any) => manager.email == e.target.value)?.email,
                                                            firstName: listManager.find((manager: any) => manager.email == e.target.value)?.firstName,
                                                            lastName: listManager.find((manager: any) => manager.email == e.target.value)?.lastName
                                                        }
                                                    }));
                                                }
                                                }
                                                value={userData.manager?.email}
                                            >

                                                <option value="" disabled>Select</option>
                                                {listManager.map((manager: any, index: number) => (
                                                    <option key={index} value={manager.email}>{manager.firstName} {manager.lastName}</option>
                                                ))}
                                            </select> */}
                      <div className="flex w-full ">
                        <ComboBox
                          id="ddlRole"
                          placeholder={t("roleAndPermission.pleaseSelect")}
                          // isError={errors.organization}
                          minWidth="100%"
                          disabled={status === "view"}
                          onChange={(e) => {
                            setQuery(e);
                            // e.target.value === ""
                            // ? setErrors({ ...errors, organization: true })
                            // : setErrors({ ...errors, organization: false });
                          }}
                          onClose={() => setQuery("")}
                          displayName={
                            userData?.manager?.email
                              ? `${userData.manager.firstName} ${userData.manager.lastName}`
                              : ""
                          }
                          defaultValue={userData?.manager?.email || ""}
                        >
                          {filteredOptions.map((option: any, index) => (
                            <ComboBoxOption
                              onClick={() => {
                                setUserData((prevState: any) => ({
                                  ...prevState,
                                  manager: {
                                    managerId: option.email,
                                    email: option.email,
                                    firstName: option.firstName,
                                    lastName: option.lastName,
                                  },
                                }));
                              }}
                              key={index}
                              value={option}
                            >
                              <span className="text-steel-gray">
                                {option.firstName} {option.lastName}
                              </span>
                            </ComboBoxOption>
                          ))}
                        </ComboBox>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="managerLagacy"
                      className="block font-medium text-gray-900 text-base/6"
                    >
                      {t("userManagement.managerLegacy")}
                    </label>
                    <div className="mt-2">
                      {/* <input
                        type="text"
                        disabled={status === "view"}
                        name="managerLagacy"
                        id="managerLagacy"
                        value={userData?.managerLagacy}
                        className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        placeholder={t("userManagement.managerLegacy")}
                        onChange={handleInputChange}
                      /> */}

                      <InputText
                        disabled={status === "view"}
                        id="managerLagacy"
                        value={userData.managerLagacy}
                        placeholder={t("userManagement.managerLegacy")}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 mt-5 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="officeLocation"
                      className="block font-medium text-gray-900 text-base/6"
                    >
                      {t("userManagement.officeLocation")}
                    </label>
                    <div className="mt-2">
                      {/* <input
                        type="text"
                        disabled={status === "view"}
                        name="officeLocation"
                        id="officeLocation"
                        value={userData?.officeLocation}
                        className="border border-[#DFE4EA] text-gray-900 placeholder-[#9CA3AF] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                        placeholder={t("userManagement.officeLocation")}
                        onChange={handleInputChange}
                      /> */}

                      <InputText
                        disabled={status === "view"}
                        id="officeLocation"
                        value={userData.officeLocation}
                        placeholder={t("userManagement.officeLocation")}
                        onChange={(e) => {
                          handleInputChange(e);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                <div className="flex items-center">
                  {/* <CheckBox 
                shape="rounded"
                checked={userData?.accountType == "EXT"? true : false}
                 onChange={(e: any) => {
                  console.log("e.target.checked", e.target.checked);
                  
                      setUserData((prevState: any) => ({
                        ...prevState,
                        accountType: e.target.checked ? "EXT" : "INT",
                      }));
                    }}
                disabled = {status === "view"}
                
                /> */}
                  <input
                    checked={userData?.accountType == "EXT"}
                    onChange={(e: any) => {
                      setUserData((prevState: any) => ({
                        ...prevState,
                        accountType: e.target.checked ? "EXT" : "INT",
                      }));
                    }}
                    disabled={status === "view"}
                    id="isSystemAccount"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="isSystemAccount"
                    className="font-light text-gray-900 ms-2 text-base/6 dark:text-gray-300"
                  >
                    {t("userManagement.externalUser")}
                  </label>
                </div>

                {userData.accountType == "EXT" && (
                  <div className="grid grid-cols-1 mt-5 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="Expiration_Date"
                        className="block font-medium text-gray-900 text-base/6"
                      >
                        {t("userManagement.expirationDate")}
                      </label>
                      <div className="mt-2">
                        <div className="relative max-w-sm">
                          {/* <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                            </svg>
                                                        </div> */}

                          {/* <DatePicker
                                                            selected={userData.expirationDate ? new Date(userData.expirationDate) : new Date()}
                                                            id='expirationDate'
                                                            onChange={(date: Date | null) => handleInputChangeDate(date as Date)}
                                                            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholderText="Select Expiration Date"
                                                            showIcon
                                                            dateFormat={formatD}
                                                        /> */}

                          <DatePicker
                            disabled={status === "view"}
                            selectedDate={
                              userData.expirationDate
                                ? new Date(userData.expirationDate)
                                : new Date()
                            }
                            id="expirationDate"
                            onChange={(date: Date | null) =>
                              handleInputChangeDate(date as Date)
                            }
                            inline={true}
                            //  minWidth,

                            //  isError,
                            placeholder="Select Date"
                          />

                          {/* <DatePicker
                            disabled={status === "view"}
                            selected={
                              userData.expirationDate
                                ? new Date(userData.expirationDate)
                                : new Date()
                            }
                            id="expirationDate"
                            onChange={(date: Date | null) =>
                              handleInputChangeDate(date as Date)
                            }
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                            placeholderText="Select Expiration Date"
                            dateFormat={formatD}
                            customInput={<CustomInput />}

                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex mt-4 pb-3 border-b border-[gainsboro]">
              <div className="w-9/12">
                <h1 className="text-xl font-semibold">
                  {t("userManagement.assignRolesAndPermission")}
                </h1>
                <p className="text-base">
                  {t("userManagement.pleaseProvideBasicUserAttributes")}
                </p>
              </div>
              <div className="flex items-end justify-end w-3/12 space-x-2 text-right">
                {status !== "view" && (
                  <>
                    <Button
                      className="rounded-lg bg-[#ffffff] py-2 text-center items-center px-4 text-base text-[#E60E00] hover:bg-red-500 hover:text-white active:bg-red-700 font-semibold border-2 border-[#E60E00]"
                      onClick={handleDeleteRole}
                      disabled={selectRow.length === 0}
                    >
                      {t("userManagement.delete")}
                    </Button>
                    <Button
                      className="flex px-4 py-2 text-base text-white items-center bg-[#111928] hover:bg-[#111928] focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => handleGetRole()}
                    >
                      <IoAdd className="mr-1 text-lg font-semibold text-white" />
                      <p className="text-base font-semibold text-white">
                        {" "}
                        {t("userManagement.addRole")}{" "}
                      </p>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {errors.role && (
              <p className="text-xs italic text-red-500">
                Please fill out this role.
              </p>
            )}
            <TableRole
              role={roleSet}
              organizations={organizations}
              handleAction={handleActionRole}
              setSelectRow={setSelectRow}
              selectRow={selectRow}
              isShow={!(status === "view")}
            />
          </form>

          <CreateModal
            setOpenModal={setOpenModal}
            openModal={openModal}
            role={roles}
            organizations={organizations}
            setSelectedRole={setSelectedRole}
            selectRole={selectedRole}
            setSelectedOrganization={setSelectedOrganization}
            selectedOrganization={selectedOrganization}
            handleAddRole={handleAddRole}
          />
        </div>
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div role="status" className="relative">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        modalType={confirmType}
        isOpen={isOpen}
        onClose={onClose}
        //  title={t('userManagement.confirmUpdate')}
        //  detail={t('userManagement.descriptionConfrimUpdate')}
        title={confirmTitle}
        detail={confirmDetail}
        // onConfirm={ handleConfirm}
        onConfirm={confirmType == "Cancel" ? confirmAction : handleConfirm}
        notify={confirmType == ModalType.Cancel ? false : true}
      />
      {openAlert && <Alert typeAlert={typeAlert} description={alertMessage} />}
    </>
  );
}

export default EditUser;
