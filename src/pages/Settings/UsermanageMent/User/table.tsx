
import { T } from "@faker-js/faker/dist/airline-BnpeTvY9";
import { Checkbox, Table } from "flowbite-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CiMenuKebab } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { formatDate } from "../../../../utils/Utils";

interface TableRoleProps {
  role: any;
  organizations: any;
  handleAction: (id: any, event: any) => void;
  selectRow: [];
  setSelectRow: (value: any) => void;
  isShow: boolean;
}

export function TableRole({ role, organizations, handleAction, selectRow, setSelectRow, isShow = true }: TableRoleProps) {




  const [isCheckAll, setIsCheckAll] = useState(false);

  const handleCheckAllChange = () => {
    setIsCheckAll(!isCheckAll);
    setSelectRow(role.map((row: any) => row.rolePermissionId));
  };


  const handleCheckboxChange = (row: any) => {



    if (Array.isArray(selectRow) && selectRow.some((r: any) => r.rolePermissionId === row.rolePermissionId)) {
      setSelectRow(selectRow.filter((r: any) => r.rolePermissionId !== row.rolePermissionId));
    } else {
      
      try {
        const newRow: any = [...selectRow];
        newRow.push(row);
    

        setSelectRow(newRow);

      } catch (error) {
        console.log('error', error);

      }


    }
  };

  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            {isShow &&
              <Checkbox
                checked={selectRow?.length === role?.length && role?.length !== 0}
                className="bg-white dark:bg-gray-800"

                onChange={(event) => {
                  if (event.target.checked) {
                    setSelectRow(role);
                  } else {
                    setSelectRow([]);
                  }
                }}
              />}
          </Table.HeadCell>
          <Table.HeadCell className="text-base font-semibold" style={{ textTransform: "none" }}>{t('userManagement.roleName')}</Table.HeadCell>
          <Table.HeadCell className="text-base font-semibold" style={{ textTransform: "none" }}>{t('userManagement.organization')}</Table.HeadCell>
          <Table.HeadCell className="text-base font-semibold" style={{ textTransform: "none" }}>{t('userManagement.descriptionTable')}</Table.HeadCell>
          <Table.HeadCell className="text-base font-semibold" style={{ textTransform: "none" }}>{t('userManagement.headerColumn.modifiedByName')}</Table.HeadCell>
          <Table.HeadCell className="text-base font-semibold" style={{ textTransform: "none" }}>{t('userManagement.headerColumn.modifiedDate')}</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">{t('userManagement.edit')}</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {role.map((row: any, index: number) => (
            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                {isShow && <Checkbox
                className="bg-white dark:bg-gray-800"
                  checked={selectRow?.find((r: any) => r.rolePermissionId === row.rolePermissionId)}
                  onChange={() => handleCheckboxChange(row)}
                />
                }
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-normal text-gray-900 dark:text-white">{row.rolePermissionName}</Table.Cell>
              <Table.Cell className="font-normal text-gray-900">{organizations?.find((r: any, i: number) => r.organizationId == row.organizationId)?.organizationName}</Table.Cell>
              <Table.Cell className="font-normal text-gray-900">{row.description}</Table.Cell>
              <Table.Cell className="font-normal text-gray-900">{row.modifiedByName}</Table.Cell>
              <Table.Cell className="font-normal text-gray-900">{formatDate('datetime', row.modifiedDate)}</Table.Cell>
              <Table.Cell>
                {isShow &&
                  <button onClick={(event: any) => handleAction(row.rolePermissionId, event)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                    <MdDelete />
                  </button>
                }
              </Table.Cell>
            </Table.Row>
          ))}


        </Table.Body>
      </Table>
    </div>
  );
}
