import { useState, useEffect, useRef } from "react";
import { getMenus } from "../../../../services/menuService";
import {
  getOrganizationList,
  createRolePermission,
  getRolePermissionById,
  updateRolePermissionById,
} from "../../../../services/rolePermissionService";
import {
  InputText,
  Button,
  MoreButton,
  Dropdown,
  DropdownOption,
  ComboBox,
  ComboBoxOption,
} from "../../../../components/CustomComponent";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import Select from "react-select";
import customStyles from "../../../../utils/styleForReactSelect";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { get } from "lodash";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
// import { ModalType } from "../../../../enum/ModalType";
import { useConfirm, ModalType } from "../../../../context/ConfirmContext";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { extractOrgs } from "../../../../utils/Utils";
import { getOrganizationChart } from "../../../../services/organizationService";
import { he } from "@faker-js/faker/.";
interface Permission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  moduleName?: string;
  permissions: Permission;
  expanded?: boolean;
  children?: MenuItem[];
  isFirstOfModule?: boolean;
  isExpandModule?: boolean;
}

export default function RolePermission() {
  const confirm = useConfirm();
  const location = useLocation();
  const { status, rolePermissionId, copyRoleName, copyDescription } =
    location.state || {};

  const { t, i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.language.language);
  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );
  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  console.log("🚀 ~ RolePermission ~ menu:", menu)
  const menuRef = useRef([]);
  const [optionOrg, setOptionOrg] = useState([]);
  // console.log("🚀 ~ RolePermission ~ optionOrg:", optionOrg)
  const [roleName, setRoleName] = useState("");
  const [organization, setOrganization] = useState("");
  const [description, setDescription] = useState("");
  const [dataById, setDataById] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    roleName: false,
    organization: false,
    description: false,
  });
  // for type edit and copy
  const [optionOrgEdit, setOptionOrgEdit] = useState({
    value: "",
    label: "",
  });

  const [dataChecked, setDataChecked] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState("");
  // for modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDetail, setConfirmDetail] = useState("");
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
  const [confirmErrorMessage, setConfirmErrorMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() =>
    Promise.resolve()
  );


  const getUserSession: any = sessionStorage.getItem("user");
  const customerId = JSON.parse(getUserSession).customer_id;
  const userId = JSON.parse(getUserSession).user_account_id;
  const firstName = JSON.parse(getUserSession).first_name;
  const lastName = JSON.parse(getUserSession).last_name;
  const orgparent = useSelector(
    (state: RootState) => state.orgparent.orgParent
  );

  const user = JSON.parse(getUserSession);
  // const handleCheckboxChange = (itemName: string, type: keyof Permission) => {
  //   setMenu((prevMenu) =>
  //     prevMenu.map((item) => updateItem(item, itemName, type))
  //   );
  // };
  const filteredOptions = optionOrg.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );
  const handleCheckAll = (type: keyof Permission) => {
    setMenu((prevMenu) => {
      const allChecked = prevMenu.every((item) => item.permissions[type]);
      const updatedMenu = prevMenu.map((item) =>
        updatePermissions(item, type, !allChecked)
      );

      // ถ้า type เป็น create, update, หรือ delete และมีการ check ทั้งหมด
      if (type !== "read" && !allChecked) {
        return updatedMenu.map((item) => updatePermissions(item, "read", true));
      }

      // ถ้า type เป็น read และมีการ uncheck ทั้งหมด
      if (type === "read" && allChecked) {
        return updatedMenu.map((item) => clearAllPermissions(item));
      }

      return updatedMenu;
    });
  };

  const handleCheckboxChange = (itemName: string, type: keyof Permission) => {
    setMenu((prevMenu) =>
      prevMenu.map((item) => updateItem(item, itemName, type))
    );
  };

  const updateItem = (
    item: MenuItem,
    itemName: string,
    type: keyof Permission
  ): MenuItem => {
    if (item.name === itemName) {
      let newPermissions = {
        ...item.permissions,
        [type]: !item.permissions[type],
      };

      if (type === "read" && !newPermissions.read) {
        newPermissions = {
          read: false,
          create: false,
          update: false,
          delete: false,
        };
        if (item.children?.length) {
          return {
            ...item,
            permissions: newPermissions,
            children: item.children.map((child) => clearAllPermissions(child)),
          };
        }
      } else if (newPermissions[type]) {
        newPermissions.read = true;
      }

      if (item.children?.length) {
        return {
          ...item,
          permissions: newPermissions,
          children: item.children.map((child) =>
            updatePermissions(child, type, newPermissions[type])
          ),
        };
      }
      return { ...item, permissions: newPermissions };
    }

    if (item.children?.length) {
      const updatedChildren = item.children.map((child) =>
        updateItem(child, itemName, type)
      );
      const shouldUpdateParentPermission = updatedChildren.every(
        (child) => child.permissions[type]
      );

      // Check if all children have read permission as false
      const allChildrenReadFalse = updatedChildren.every(
        (child) => !child.permissions.read
      );

      // If all children have read permission as false, clear all parent permissions
      if (allChildrenReadFalse) {
        return clearAllPermissions(item);
      }

      // Check if any child has read permission
      const shouldUpdateParentRead = updatedChildren.some(
        (child) => child.permissions.read
      );

      return {
        ...item,
        permissions: {
          ...item.permissions,
          [type]: shouldUpdateParentPermission ? true : false,
          read: shouldUpdateParentRead ? true : false,
        },
        children: updatedChildren,
      };
    }
    return item;
  };

  const clearAllPermissions = (item: MenuItem): MenuItem => {
    return {
      ...item,
      permissions: { read: false, create: false, update: false, delete: false },
      children:
        item.children && item.children.length > 0
          ? item.children.map(clearAllPermissions)
          : item.children, // ไม่เซ็ตเป็น [] ถ้ามี children อยู่
    };
  };

  const updatePermissions = (
    item: MenuItem,
    type: keyof Permission,
    value: boolean
  ): MenuItem => {
    const newPermissions = { ...item.permissions, [type]: value };

    if (value && type !== "read") {
      newPermissions.read = true; // Auto-select Read when Create/Update/Delete is selected
    }

    const updatedItem = {
      ...item,
      permissions: newPermissions,
      children: item.children?.map((child) =>
        updatePermissions(child, type, value)
      ),
    };

    // Check if all children are checked for create, update, delete, read
    if (updatedItem.children && updatedItem.children.length > 0) {
      const allChildrenChecked = updatedItem.children.every(
        (child) => child.permissions[type]
      );
      if (allChildrenChecked) {
        updatedItem.permissions[type] = true;
      }

      // If read is unchecked, clear all children permissions
      if (type === "read" && !value) {
        updatedItem.children = updatedItem.children.map(clearAllPermissions);
      }
    }

    // If read is unchecked, clear all permissions
    if (type === "read" && !value) {
      updatedItem.permissions = {
        read: false,
        create: false,
        update: false,
        delete: false,
      };
    }

    return updatedItem;
  };

  const toggleExpand = (itemName: string) => {
    setMenu((prevMenu) =>
      prevMenu.map((item) =>
        item.name === itemName ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const handleSubmit = () => {
    const newErrors = {
      roleName: !roleName,
      organization: !organization,
      description: !description,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const roleAssignmentList = menu.flatMap((item) => {
      const parentPermissions = {
        roleAssignmentId: "string", // ระบบ gen
        customerId: customerId,
        rolePermissionId: "d625be08-0991-4fd5-93a1-cebf2e39ab5d",
        menuId: item.id, // id ของ menu
        isCreate: item.permissions.create, // checkbox value
        isRead: item.permissions.read, // checkbox value
        isUpdate: item.permissions.update, // checkbox value
        isDelete: item.permissions.delete, // checkbox value
        isActiveStatus: true,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        createdBy: userId,
        modifiedBy: userId,
      };

      const childPermissions = item.children?.map((child) => ({
        roleAssignmentId: "string", // ระบบ gen
        customerId: customerId,
        rolePermissionId: "d625be08-0991-4fd5-93a1-cebf2e39ab5d",
        menuId: child.id, // id ของ menu
        isCreate: child.permissions.create, // checkbox value
        isRead: child.permissions.read, // checkbox value
        isUpdate: child.permissions.update, // checkbox value
        isDelete: child.permissions.delete, // checkbox value
        isActiveStatus: true,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        createdBy: userId,
        modifiedBy: userId,
      }));

      return [parentPermissions, ...(childPermissions || [])];
    });
    const dataInsert = {
      rolePermissionId: status === "edit" ? rolePermissionId : "string", // null
      customerId: customerId, // session storage
      organizationId: organization.value, // select
      rolePermissionName: roleName, // Role Name
      description: description, // Description
      isActiveStatus: true,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      createdBy: userId,
      modifiedBy: userId,
      createdByName: firstName + " " + lastName,
      modifiedByName: firstName + " " + lastName,
      organization: {
        organizationId: "string",
        customerId: "string",
        organizationName: "string",
        organizationParentId: "string",
        defaultLanguage: "string",
        description: "string",
        isActiveStatus: true,
        createdDate: "2025-02-13T09:29:27.760Z",
        modifiedDate: "2025-02-13T09:29:27.760Z",
        createdBy: "string",
        modifiedBy: "string",
        isDelete: true,
      },
      roleAssignmentList: roleAssignmentList,
    };
    console.log("🚀 ~ handleSubmit ~ dataInsert:", dataInsert);

    if (status === "create" || status === "copy") {
      confirm({
        title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        notify: true, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          createRolePermission(dataInsert).then((res) => {
            if (res.data.isError === false)
              console.log("🚀 ~ createRolePermission ~ res:", res);
            navigate("/setting/user-management/role-permission");
            setConfirmSuccessMessage("Changes saved successfully"); // success message
            setConfirmErrorMessage("Failed to save changes"); // error message
            // write a redirect to /setting/user-management/role-permission
            navigate("/setting/user-management");
          });
        }, //จำเป็น
        onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
        successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
      });

      // setConfirmTitle(t("roleAndPermission.confirmSave")); // text for header modal
      // setConfirmDetail(t("roleAndPermission.descriptionConfirmSave")); // text decription in mdaol
      // setConfirmType(ModalType.Save); // type modal
      // setIsConfirmModalOpen(true); // open modal
      // setConfirmAction(() => async () => {
      //   // async function to insert to db
      //   createRolePermission(dataInsert).then((res) => {
      //     setConfirmSuccessMessage("Changes saved successfully"); // success message
      //     setConfirmErrorMessage("Failed to save changes"); // error message
      //     // write a redirect to /setting/user-management/role-permission
      //     navigate("/setting/user-management");
      //   });
      // });
    }
    if (status === "edit") {
      confirm({
        // title: t("roleAndPermission.confirmSave"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
        // detail: t("roleAndPermission.descriptionConfirmSave"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
        notify: true, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
        modalType: ModalType.Save, //จำเป็น Save Cancel Delete Active Inactive
        onConfirm: async () => {
          updateRolePermissionById(dataInsert).then((res) => {
            if (res.data.isError === false)
              console.log("🚀 ~ createRolePermission ~ res:", res);
            navigate("/setting/user-management/role-permission");
            setConfirmSuccessMessage("Changes saved successfully"); // success message
            setConfirmErrorMessage("Failed to save changes"); // error message
            // write a redirect to /setting/user-management/role-permission
            navigate("/setting/user-management");
          });
        }, //จำเป็น
        onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
        successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
        errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
      });

      // setConfirmTitle("Update Changes"); // text for header modal
      // setConfirmDetail("Are you sure you want to update changes?"); // text decription in mdaol
      // setConfirmType(ModalType.Save); // type modal
      // setIsConfirmModalOpen(true); // open modal
      // setConfirmAction(() => async () => {
      //   // async function to insert to db
      //   updateRolePermissionById(dataInsert).then((res) => {
      //     setConfirmSuccessMessage("Changes Update successfully"); // success message
      //     setConfirmErrorMessage("Failed to Update changes"); // error message
      //     // write a redirect to /setting/user-management/role-permission
      //     navigate("/setting/user-management");
      //   });
      // });
    }
    // ส่ง roleAssignmentList ไปยัง API เพื่อ insert ลงฐานข้อมูล
  };

  useEffect(() => {
    getMenus().then((res) => {
      console.log("🚀 ~ getMenus ~ res:", res)
      const dataMenu = res?.data?.data.map((item: any) => {
        const menuItem: MenuItem = {
          id: item.menuId,
          name: item.menuName,
          moduleName: item.module.moduleName,
          permissions: {
            read: false,
            create: false,
            update: false,
            delete: false,
          },
          expanded: false,
          children: [],
        };

        if (item.subMenu.length > 0) {
          menuItem.expanded =
            status === "edit" || status === "copy" || status === "view"
              ? true
              : false;
          menuItem.children = item.subMenu.map((subItem: any) => ({
            id: subItem.menuId,
            name: subItem.menuName,
            permissions: {
              read: false,
              create: false,
              update: false,
              delete: false,
            },
          }));
        }

        return menuItem;
      });

      //   const groupedData = Object.values(
      //     dataMenu.reduce((acc:any, item:any) => {
      //         const module = item.moduleName;
      //         if (!acc[module]) {
      //             acc[module] = { module, data: [] };
      //         }
      //         acc[module].data.push(item);
      //         return acc;
      //     }, {})
      // );

      // console.log(groupedData);

      function addIsFirstOfModule(data: any) {
        const moduleTracker = {};

        return data.map((item: any) => {
          if (!moduleTracker[item.moduleName]) {
            moduleTracker[item.moduleName] = true;
            return { ...item, isFirstOfModule: true, isExpandModule: false };
          }
          return { ...item, isFirstOfModule: false, isExpandModule: false };
        });
      }

      const addFirstofModule = addIsFirstOfModule(dataMenu);
      // console.log("🚀 ~ getMenus ~ addFirstofModule:", addFirstofModule);

      menuRef.current = addFirstofModule;
      setMenu(addFirstofModule);
    });
    if (orgparent !== "") {
      getOrganizationChart(user.customer_id, orgparent).then((res) => {
        if (res.data.isError === false) {
          const allOrgs = extractOrgs(res.data.data);

          setOptionOrg(allOrgs);
          setLoading(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (orgparent !== "") {
      getOrganizationChart(user.customer_id, orgparent).then((res) => {
        if (res.data.isError === false) {
          const allOrgs = extractOrgs(res.data.data);

          setOptionOrg(allOrgs);
          setLoading(false);
        }
      });
    }
  }, [orgparent]);

  const [statusShow, setStatusShow] = useState({
    status: false,
    moduleName: "",
  });
  const onToggleModule = (moduleName: string, status: boolean) => {

    setStatusShow({
      status: !status,
      moduleName: moduleName,
    });
  };

  useEffect(() => {
    if (status === "edit" || status === "copy" || status === "view") {
      getRolePermissionById(rolePermissionId)
        .then((res) => {
          const organization: any = optionOrg.find(
            (org: any) => org.value === res.data.data.organizationId
          );
          setOptionOrgEdit({
            value: res.data.data.organizationId,
            label: organization ? organization.label : "",
          });
          setOrganization({
            value: res.data.data.organizationId,
            label: organization ? organization.label : "",
          });
          setRoleName(
            status === "copy" ? copyRoleName : res.data.data.rolePermissionName
          );
          setDescription(
            status === "copy" ? copyDescription : res.data.data.description
          );
          setDataById(res.data.data.roleAssignmentList);
        })
        .catch((err) => {});
    }
  }, [status, rolePermissionId, optionOrg]);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (dataById.length > 0 && menuRef.current.length > 0) {
      const updatedMasterData = menu.map((item: any) => {
        const matchedRoleAssignment: any = dataById.find(
          (roleAssignment: any) => roleAssignment.menuId === item.id
        );

        if (matchedRoleAssignment) {
          item.permissions.read = matchedRoleAssignment.isRead;
          item.permissions.create = matchedRoleAssignment.isCreate;
          item.permissions.update = matchedRoleAssignment.isUpdate;
          item.permissions.delete = matchedRoleAssignment.isDelete;
        }

        if (item.children && item.children.length > 0) {
          item.children = item.children.map((child: any) => {
            const matchedChildRoleAssignment: any = dataById.find(
              (roleAssignment: any) => roleAssignment.menuId === child.id
            );

            if (matchedChildRoleAssignment) {
              child.permissions.read = matchedChildRoleAssignment.isRead;
              child.permissions.create = matchedChildRoleAssignment.isCreate;
              child.permissions.update = matchedChildRoleAssignment.isUpdate;
              child.permissions.delete = matchedChildRoleAssignment.isDelete;
            }

            return child;
          });
        }

        return item;
      });
      setDataChecked(updatedMasterData);
    }
  }, [dataById, menuRef.current]);

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      height: "42px",
      fontSize: "0.875rem",
      background: state.Disabled ? "rgb(223 228 234)" : "#fff",

      borderRadius: "0.375rem",
      "& input": {
        boxShadow: state.isFocused ? "none !important" : provided.boxShadow,
      },
      borderWidth: state.isFocused ? "1px !important" : provided.borderWidth,
      borderColor: state.isFocused
        ? "#3758F9 !important"
        : state.Disabled
        ? "rgb(223 228 234)"
        : errors.organization
        ? "red !important"
        : "rgb(223 228 234)",
      // fontSize: "16px",
      // borderRadius: "6px",
    }),
    menu: (provided: any, state: any) => ({
      ...provided,

      fontSize: "0.875rem",
      borderRadius: "7px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,

      fontSize: "0.875rem",
      borderRadius: "7px",
    }),
    singleValue: (provided: any, state: any) => ({
      ...provided,

      fontSize: "0.875rem",
      borderRadius: "7px",
    }),
  };
  const handleCancel = () => {
    confirm({
      title: t("roleAndPermission.confirmCancel"), //ใส่หรือไม่ใส่ก็ได้ title ของ popup
      detail: t("roleAndPermission.descriptionConfirmCancel"), //ใส่หรือไม่ใส่ก็ได้ detail ของ popup
      notify: false, //ใส่หรือไม่ใส่ก็ได้ จะ auto notify ไหม ไม่ใส่ default = true
      modalType: ModalType.Cancel, //จำเป็น Save Cancel Delete Active Inactive
      onConfirm: async () => {
        navigate("/setting/user-management/role-permission");
      }, //จำเป็น
      onClose: async () => {}, //ใส่หรือไม่ใส่ก็ได้
      successMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
      errorMessage: "", //ใส่หรือไม่ใส่ก็ได้ auto notify
    });

    // setConfirmTitle(t("roleAndPermission.confirmCancel")); // text for header modal
    // setConfirmDetail(t("roleAndPermission.descriptionConfirmCancel")); // text decription in mdaol
    // setConfirmType(ModalType.Cancel); // type modal
    // setIsConfirmModalOpen(true); // open modal
    // setNoti(true)
    // setConfirmAction(() => async () => {
    //   navigate("/setting/user-management/role-permission");
    // });
  };

  return (
    <div className="p-9 bg-white">
      <div className="flex pb-2 border-b border-solid border-1 ">
        <div className="w-9/12 pb-4">
          <h2 className="text-xl font-semibold">
            {" "}
            {status === "edit"
              ? t("roleAndPermission.edit") +
                " " +
                t("roleAndPermission.Role&Permission")
              : status === "view"
              ? t("roleAndPermission.Role&Permission")
              : t("roleAndPermission.create") +
                " " +
                t("roleAndPermission.Role&Permission")}
          </h2>
          <p className="text-base">
            {t("roleAndPermission.description")}
          </p>
        </div>
        <div className="w-3/12 text-right">
          {/* <Link to="/setting/user-management"> */}
          <Button
            className="rounded border border-[#E2E8F0] py-2 px-4  text-black data-[hover]:bg-sky-500 data-[active]:bg-sky-700 mr-2 text-base font-semibold border-b px-9 "
            onClick={handleCancel}
          >
            {t("roleAndPermission.cancel")}
          </Button>

          {permissionPage.isUpdate && status === "view" && (
            <Button
              className="rounded bg-[#3758F9] py-2 px-4 text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 text-base font-semibold border-b px-9 "
              // onClick={handleSubmit}
              onClick={() => {
                navigate(
                  "/setting/user-management/role-permission/role-permissions",
                  {
                    state: {
                      status: "edit",
                      rolePermissionId: rolePermissionId,
                    },
                  }
                );
              }}
            >
              {t("roleAndPermission.edit")}
            </Button>
          )}
          {/* </Link> */}
          {status !== "view" && (
            <Button
              className="rounded bg-[#3758F9] py-2 px-4  text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700 text-base font-semibold"
              onClick={handleSubmit}
            >
              {t("roleAndPermission.submit")}
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {" "}
          <div className="flex pb-4 pt-4 border-b border-solid border-1 ">
            <div className="w-4/12 p-1">
              <h1 className="font-semibold text-base pb-2">
                <span className="text-[red]">* </span> 
                {t("roleAndPermission.roleName")}
              </h1>
              {/* <input
                type="text"
                className={`border rounded-md h-[42px] w-full ${
                  errors.roleName ? "border-red-500" : "border-[#DFE4EA]"
                } ${status === "view" && "bg-[#f2f2f2] text-[#a499a4]"}`}
                disabled={status === "view"}
                placeholder={t("roleAndPermission.roleName")}
                defaultValue={
                  status === "edit" || status === "view"
                    ? roleName
                    : status === "copy"
                    ? copyRoleName
                    : ""
                }
                onChange={(e) => setRoleName(e.target.value)}
              /> */}
              <InputText
                disabled={status === "view"}
                type="text"
                placeholder={t("roleAndPermission.roleName")}
                minWidth="20rem"
                height="2.625rem"
                value={
                  status === "edit" || status === "view"
                    ? roleName
                    : status === "copy"
                    ? copyRoleName
                    : roleName
                }
                isError={errors.roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  e.target.value === ""
                    ? setErrors({ ...errors, roleName: true })
                    : setErrors({ ...errors, roleName: false });
                }}
                className="text-base"
              ></InputText>
              {errors.roleName && (
                <p className="text-red-500 text-sm pt-1">
                  {t("roleAndPermission.roleNameError")}
                </p>
              )}
            </div>
            <div className="w-4/12 p-1">
              <h1 className="font-semibold text-base pb-2">
                <span className="text-[red]">* </span>
                {t("roleAndPermission.organization")}
              </h1>
              {/* <div style={status === 'view' ? {cursor:'not-allowed'}: {}}> */}
              {/* <Select
                isDisabled={status === "view"}
                styles={customSelectStyles}
                options={optionOrg}
                value={optionOrgEdit?.value ? optionOrgEdit : null}
                onChange={(e: any) => {
                  setOptionOrgEdit(e);
                  setOrganization(e.value);
                  e.value === "" ? setErrors({...errors, organization: true}) : setErrors({...errors, organization: false})
                }}
                placeholder={t("roleAndPermission.pleaseSelect")}
                // defaultValue={status === "edit" || status === "copy" ? optionOrgEdit : null}
                className={`text-sm ${errors.organization ? "border-red-500 h-[43px]" : ""}`}
              /> */}
              <div className="flex w-full ">
                
                <ComboBox
                  id="ddlRole"
                  placeholder={t("roleAndPermission.pleaseSelect")}
                  isError={errors.organization}
                  minWidth="100%"
                  disabled={status === "view"}
                  onChange={(e) => {
                    console.log("🚀 ~ RolePermission ~ e:", e)
                    setQuery(e)
                    // e.target.value === ""
                    // ? setErrors({ ...errors, organization: true })
                    // : setErrors({ ...errors, organization: false });
                  }}
                  onClose={() => setQuery("")}
                  displayName={ organization.label }
                  className="text-base"
                  defaultValue={organization && organization.label ? organization.label  : ""  }
                >
                  {filteredOptions.map((option: any, index) => (
                    <ComboBoxOption
                      onClick={() => {
                        setOrganization(option)
                        
                      }}
                      key={index}
                      value={option}
                      className="hover:bg-gray-100 text-base"
                      selected={option.value === organization.value}
                    >
                      <span className="text-steel-gray">{option.label}</span>
                    </ComboBoxOption>
                  ))}
                </ComboBox>
              </div>
              {/* <Dropdown className="w-full" disabled={status === "view"} id="ddlRole">
                {optionOrg.map((item:any) => (
                                     <DropdownOption
                                        id="ddlRole"
                                         className="h-[2.625rem] w-full not-allowed"
                                      
                                        //  onClick={() => {
                                        //    setSelectStatus(item)
                                        //    searchConditionRef.current.status = item.value;
                                        //    let limit = 20;
                                        //    handleGetRoleAndPermission(limit,arrOrgToFilterByGlobal);
                                        //  }}
                                         key={item.value}
                                     >
                                         <span>{item.label}</span>
                                     </DropdownOption>
                                 ))}
              </Dropdown> */}
              {/* </div> */}

              {errors.organization && (
                <p className="text-red-500 text-sm pt-1">
                  {t("roleAndPermission.organizationError")}
                </p>
              )}
            </div>
            <div className="w-4/12 p-1">
              <h1 className="font-semibold text-base pb-2">
                <span className="text-[red]">* </span>
                {t("roleAndPermission.descriptionInput")}
              </h1>
              {/* <input
                type="text"
                className={`border rounded-md h-[42px] w-full ${
                  errors.description ? "border-red-500" : "border-[#DFE4EA]"
                } ${status === "view" && "bg-[#f2f2f2]  text-[#a499a4]"}`}
                placeholder={t("roleAndPermission.descriptionInput")}
                onChange={(e) => setDescription(e.target.value)}
                defaultValue={
                  status === "edit" || status === "view"
                    ? description
                    : status === "copy"
                    ? copyDescription
                    : ""
                }
              /> */}
              <InputText
                disabled={status === "view"}
                type="text"
                placeholder={t("roleAndPermission.descriptionInput")}
                minWidth="20rem"
                height="2.625rem"
                value={
                  status === "edit" || status === "view"
                    ? description
                    : status === "copy"
                    ? copyDescription
                    : description
                }
                isError={errors.description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  e.target.value === ""
                    ? setErrors({ ...errors, description: true })
                    : setErrors({ ...errors, description: false });
                }}
                className="text-base"
              ></InputText>
              {errors.description && (
                <p className="text-red-500 text-sm pt-1">
                  {t("roleAndPermission.descriptionError")}
                </p>
              )}
            </div>
          </div>
          <h1 className="text-xl font-semibold py-3">
            {t("roleAndPermission.setPermission")}
          </h1>
          <table className="w-full ">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 text-left text-base font-semibold">
                  {t("roleAndPermission.menuName")}
                </th>
                {[
                  t("roleAndPermission.read"),
                  t("roleAndPermission.create"),
                  t("roleAndPermission.update"),
                  t("roleAndPermission.delete"),
                ].map((perm) => (
                  <th key={perm} className="p-2 text-base font-semibold">
                    <p>{perm}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td className="p-2 text-left text-base font-semibold border-b">
                  {t("roleAndPermission.selectAll")}
                </td>
                {["read", "create", "update", "delete"].map((type) => (
                  <td key={type} className="p-2 text-center border-b">
                    <input
                      className="border rounded border-[#DFE4EA]"
                      type="checkbox"
                      disabled={status === "view"}
                      onChange={() => handleCheckAll(type as keyof Permission)}
                      checked={
                        type === "read"
                          ? menu.every(
                              (item: any) =>
                                item.permissions.read ||
                                item.permissions.create ||
                                item.permissions.update ||
                                item.permissions.delete
                            )
                          : menu.every(
                              (item: any) =>
                                item.permissions[type as keyof Permission]
                            )
                      }
                    />
                  </td>
                ))}
              </tr>

              {menu?.map((item: any, i) => {
                // console.log(item.isExpandModule);

                return (
                  <MenuRow
                    key={item.name}
                    item={item}
                    onChange={handleCheckboxChange}
                    onToggle={toggleExpand}
                    onToggleModule={onToggleModule}
                    statusShow={statusShow}
                    isChild={false}
                    statusView={status}
                    // styles="bg-red-900"
                  />
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={confirmTitle}
        modalType={confirmType}
        detail={confirmDetail}
        onConfirm={confirmAction}
        successMessage={confirmSuccessMessage}
        errorMessage={confirmErrorMessage}
        notify={true}
      ></ConfirmModal>
    </div>
  );
}

const MenuRow = ({
  item,
  onChange,
  onToggle,
  onToggleModule,
  statusShow,
  styles,
  isChild,
  statusView,
}: {
  item: MenuItem;
  onChange: any;
  onToggle: any;
  styles?: any;
  onToggleModule?: any;
  statusShow?: any;
  isChild?: boolean;
  statusView?: any;
}) => {
  const { t } = useTranslation();
  return (

    <>
      {item.isFirstOfModule && (
        <tr className={styles}>
          <td className="p-2 border-b flex">
            <p className=" text-left text-base font-semibold pl-7">
              {t("roleAndPermission.module")} :{" "}
              {t(`roleAndPermission.${item.moduleName}`)}
            </p>
          </td>
          <td className="border-b "></td>
          <td className="border-b "></td>
          <td className="border-b "></td>
          <td className="border-b "></td>
        </tr>
      )}

      <tr
        className={`${
          item.children ? `pl-12 border-b bg-[#f9fafb]` : `pl-8  border-b `
        } hover:bg-[#f1f1ff] `}
        id={item.moduleName}
      >
        <td
          className={`text-base border-b ${item.children ? "px-9" : "pl-16"} `}
          // className={
          //   item.children ? "text-sm px-3  border-b" : "text-sm pl-14  border-b"
          // }
        >
          {item.children && (
            <>
              <button onClick={() => onToggle(item.name)} className="mr-2">
                {item.expanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`${
                      item.children.length === 0 && `invisible`
                    } size-4 bg-[#EFEFEF] `}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`${
                      item.children.length === 0 && `invisible`
                    } size-4 bg-[#EFEFEF] `}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                )}
              </button>
            </>
          )}
          {`${item.children ? `` : `- `}${item.name}`}
        </td>
        {["read", "create", "update", "delete"].map((type) => (
          <td key={type} className="p-2 text-center">
            <input
              type="checkbox"
              disabled={statusView === "view"}
              className="border rounded border-[#DFE4EA]"
              checked={item.permissions[type as keyof Permission]}
              onChange={() => {
                onChange(item.name, type as keyof Permission);
                
              }}
            />
          </td>
        ))}
      </tr>

      {item.children &&
        item.expanded &&
        item.children.map((child) => (
          <MenuRow
            key={child.name}
            item={child}
            onChange={onChange}
            onToggle={onToggle}
            isChild={true}
            statusView={statusView}
            // onToggleModule={onToggleModule}
          />
        ))}
    </>
  );
};
