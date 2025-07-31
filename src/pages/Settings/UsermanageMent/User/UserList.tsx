import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaSearch } from "react-icons/fa";
import { IoAdd, IoFilterOutline } from "react-icons/io5";
import { HiArrowsUpDown } from "react-icons/hi2";
import { BsArrow90DegDown, BsFillHouseAddFill, BsThreeDotsVertical } from "react-icons/bs";
import customStyles from "../../../../utils/styleForReactSelect";
import Select, { StylesConfig } from 'react-select';
import TableUser from "../../../../components/Table";
import debounce from 'lodash.debounce';
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deleteUserAccount, getUsers } from '../../../../services/userService';
import { UserResponse } from '../../../../model/user.model';
import { TiEdit } from "react-icons/ti";
import dayjs from 'dayjs';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { setOpenLoadingFalse, setOpenLoadingTrue } from '../../../../store/slices/loadingSlice';

import { UserAccountData } from "../../../../interface/user.interface";
import ConfirmModal from '../../../../components/Modals/ConfirmModal';
import { ModalType } from '../../../../enum/ModalType';
import { formatDate } from '../../../../utils/Utils';
import { RootState } from '../../../../store';
import { Button, Dropdown, DropdownOption, InputText } from '../../../../components/CustomComponent';

interface ActionCellProps {
  row: any;
}


const UserList = () => {
  let { t, i18n } = useTranslation();
  const navigate = useNavigate(); // ใช้แทน useHistory
  const dispatch = useDispatch();
  const location = useLocation(); 
  const id = location.state?.id;
  const [isView,setIsView] = useState<any>(localStorage.getItem('view_id') || '');
  
  const [users, setUsers] = useState<UserAccountData>({ data: [], pagination: { page: 1, per_page: 5, total_pages: 1, total_items: 1 } });
  const [loading, setLoading] = useState(false);
  const [confirmType, setConfirmType] = useState<ModalType>(ModalType.Save);
  const [isOpen, setIsOpen] = useState(false);
  // useRef ใช้เก็บค่าไว้ แต่ไม่ทำให้ render ใหม่
  const [idDelete, setIdDelete] = useState('');
  const orgparent = useSelector((state: RootState) => state.orgparent.orgParent);
  const [selectStatus, setSelectStatus] = useState({ value: "all", label: t("userManagement.user.allStatus") });







    // Parse the query string to get the ID
    // const queryParams = new URLSearchParams(location.search);
    // const id = queryParams.get('id');

    // console.log('id', id);
    

  const permissionPage = useSelector(
    (state: RootState) => state.permissionPage.permission
  );




  const searchConditionRef = useRef({
    searchTerm: '',
    status: 'all',
    page: 1,
    pageSize: 20,
    sort: '',
    column: '',
  });


  const columns = useMemo(
    () => [
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t('userManagement.headerColumn.accountName')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-4"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("firstName")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: "firstName",

        Cell: ({ row }: { row: any }) => (
          <div className="flex items-center cursor-pointer" onClick={()=>{
          
             navigate(`/setting/user-management/user/users`, { state: { status: 'view' , id: row.original.userAccountId } });
            
          }}>
            
            {
              row.original.profileImageBase64 === null || row.original.profileImageBase64 === "" ? (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <img
                  src={row.original.profileImageBase64}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              )
            }
            <div className="relative justify-start ml-2 group">
              <p className="text-[#3758F9] font-semibold text-base " style={{  maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original.firstName} {row.original.lastName}</p>
              <div className="absolute hidden px-2 py-1 mb-2 text-xs text-left text-white transform -translate-x-1/2 bg-gray-800 rounded bottom-full left-1/2 group-hover:block">
                {row.original.firstName} {row.original.lastName}
              </div>
            </div>
          </div>
        ),
      },

      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t('userManagement.headerColumn.email')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-4"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("email")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),

        accessor: 'email',
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t('userManagement.headerColumn.userType')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-4"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("accountType")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: 'accountType',
        // header center
        align: 'center',
        Cell: ({ value }: { value: string }) => (
          <p className="text-center">{value}</p>
        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center", textAlign: "center",justifyContent:"center" }}>
              {t('userManagement.headerColumn.status')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-4"
                // style={{ marginLeft: "auto" }}
                onClick={() => handleSort("isActiveStatus")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        align: 'center',
        accessor: 'isActiveStatus',
        Cell: ({ value }: { value: string }) => (
          <p className={value ? "font-normal bg-[#eff7f1]  p-1 rounded-md w-[70px] text-center text-[#157535]" : "border border-[#D8DCD9] text-center p-1 rounded-md"}>
            {value ? t('userManagement.active') : t('userManagement.inactive')}
          </p>
        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center",justifyContent:"center" }}>
              {t('userManagement.headerColumn.expirationDate')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-4"
                // style={{ marginLeft: "auto" }}
                onClick={() => handleSort("expirationDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        align: 'center',
        accessor: 'checkExt',
        Cell: ({ row }: { row: any }) => {

          return (
            <div className="text-center">
              {
                row?.original?.accountType === 'EXT' && (
                  formatDate('date', row.original.expirationDate)
                )}
            </div>

          )

        },
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" ,justifyContent:"center"}}>
              {t('userManagement.headerColumn.lastLoginDate')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-4"
                // style={{ marginLeft: "auto" }}
                onClick={() => handleSort("lastLoginDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),

        align: 'center',
        accessor: 'lastLoginDate',
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">
            {
              formatDate('datetime', value)
            }
          </div>

        ),
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {t('userManagement.headerColumn.modifiedByName')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-4"
                style={{ marginLeft: "auto" }}
                onClick={() => handleSort("modifiedByName")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        accessor: 'modifiedByName',
      },
      {
        Header: (
          <>
            <div style={{ display: "flex", alignItems: "center",justifyContent:"center" }}>
              {t('userManagement.headerColumn.modifiedDate')}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-4"
                // style={{ marginLeft: "auto" }}
                onClick={() => handleSort("modifiedDate")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                />
              </svg>
            </div>
          </>
        ),
        align: 'center',
        accessor: 'modifiedDate',
        Cell: ({ value }: { value: string }) => (
          <div className="text-center">
            {
              // dayjs(value).format('DD/MM/YY HH:mm')
              formatDate('datetime', value)
            }
          </div>

        ),
      },
      {
        Header: '',
        accessor: 'actions',
        Cell: ({ row }: { row: any }) => {


          return (
            permissionPage?.isUpdate && (
            // icon menu
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="cursor-pointer">
                <BsThreeDotsVertical />
              </MenuButton>
              
                <MenuItems className="absolute right-0 z-10 w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">

                  <MenuItem>

                    <button
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100"
                      onClick={() => {

                        navigate(`/setting/user-management/user/users`, { state: { status: 'edit' , id: row.original.userAccountId } });
                      }}
                    >

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mt-1 size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      <span style={{ marginTop: "5px", color: "#000" }}>{t('edit')}</span>

                    </button>



                  </MenuItem>

                  {/* <MenuItem>
                  <Button
                    className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100"
                    onClick={() => {
                      console.log('delete', row.original.userAccountId);
                      setIdDelete(row.original.userAccountId);
                      setIsOpen(true);
                    }}
                  >
                    <MdOutlineDeleteOutline /> delete
                  </Button>
                </MenuItem> */}
                  {/* Add more menu items here if needed */}
                </MenuItems>
            
            </Menu>
              )
          );
        }
      },
    ],
    [t]
  );




  const handleView = (id: string) => {
    setIsView(id)
  }


  const handleConfirm = async () => {
    await handleDelete(idDelete);
  }

  const onClose = () => {
    setIsOpen(false);
  }

  const optionsStatus=[
    { value: 'all', label: t('userManagement.user.allStatus') },
    { value: 'active', label: t('userManagement.active') },
    { value: 'inactive', label: t('userManagement.inactive') },
  ]


  const handleDelete = async (id: string) => {
    try {
    
      const response = await deleteUserAccount(id);

    

      let limit = 10;
      handleGetUser(limit);
    } catch (error) {
      console.error('errordelete', error);
    }
  }
  const handleGetUser = async (limit: number) => {
    try {

      setLoading(true);
     

      const response: any = await getUsers(limit, searchConditionRef.current);
   
      setUsers(response);
      setLoading(false);
      // dispatch(setOpenLoadingFalse());
    } catch (error) {
      setLoading(false);
      // dispatch(setOpenLoadingFalse());
      console.error('error', error);
    }
  }

  const handlePageChange = (page: number) => {
  
    let limit = 10;
    let searchTerm = '';
    let pageSize = 5;
    searchConditionRef.current.page = page;
    // ?customerId=123e4567-e89b-12d3-a456-426614174000&page=1&pageSize=10&status=all
    handleGetUser(limit);
  }

  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
     
      let limit = 10;
      searchConditionRef.current.searchTerm = searchTerm;


      handleGetUser(limit);
    }, 300), // 300ms delay
    []
  );

  const handleSort = (column: string) => {
    searchConditionRef.current.sort = searchConditionRef.current.sort === 'ASC' ? 'DESC' : 'ASC';
    searchConditionRef.current.column = column;
    let limit = 10;
    handleGetUser(limit);
  }

  React.useEffect(() => {
    let limit = 10;

    const handleStorageChange = (event:any) => {
      if (event.key === 'view_id') {
        
        setIsView("")
        localStorage.removeItem('view_id');
        // Perform any action you need when view_id changes
      }
    };

    window.addEventListener('view_id', handleStorageChange);


    // dispatch(setOpenLoadingTrue());
    handleGetUser(limit);



    return () => {
      // This function will be called when the component is unmounted
      localStorage.removeItem('view_id');
      setIsView("")
    };
  }, []);

  React.useEffect(() => {
    let limit = 10;
    handleGetUser(limit);
  },[orgparent]);


  return (
 
    <div className="px-1 pl-1">
      <div className="flex pb-2">
        <div className="w-9/12">
          <h2 className="text-xl font-semibold ">{t('userManagement.user.user')}</h2>
          <p className="text-base">
            {t('userManagement.user.userListDescription')}
          </p>
        </div>
      </div>
      <div className="flex">
        <div className="relative w-auto w-2/12 mx-0 my-auto">
          {/* <div className="absolute inset-y-0 bottom-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-1 text-black text-sm w-48 h-[32px] border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t('userManagement.user.searchPlaceholder')}
            onChange={(e) => handleSearch(e.target.value)}
          /> */}
           <InputText
              type="search"
              placeholder={t('userManagement.user.searchPlaceholder')}
              minWidth="20rem"
              height="2.625rem"
              // className="mt-2 "
              onChange={(e) => handleSearch(e.target.value)}
            ></InputText>
        </div>
        <div className="w-2/12 mx-1 my-auto">
          {/* <Select
            className="text-sm"
            styles={customStyles}
            placeholder={t('userManagement.user.allStatus')}
            onChange={(selectedOption: any) => {
              console.log('selectedOption', searchConditionRef.current);
              searchConditionRef.current.status = selectedOption.value;
              let limit = 10;
              handleGetUser(limit);
            }
            }

            options={[
              { value: 'all', label: t('userManagement.user.allStatus') },
              { value: 'active', label: t('userManagement.active') },
              { value: 'inactive', label: t('userManagement.inactive') },
            ]}
          /> */}
            <Dropdown
                  id="selectStatus"
                  title=""
                  className="w-full"
                  selectedName={(selectStatus.label)}
                
              >
                  {optionsStatus.map((item) => (
                      <DropdownOption
                          className="h-[2.625rem]"
                          onClick={() => {
                            setSelectStatus(item)
                            searchConditionRef.current.status = item.value;
                            let limit = 20;
                            handleGetUser(limit);
                          }}
                          key={item.value}
                      >
                          <span>{item.label}</span>
                      </DropdownOption>
                  ))}
              </Dropdown>
        </div>
        <div className="flex w-2/12 mx-0 my-auto">
          {/* <HiArrowsUpDown className="mx-2 text-2xl text-gray-500 cursor-pointer" /> */}
          {/* <IoFilterOutline className="mx-2 text-2xl text-gray-500 cursor-pointer" /> */}
        </div>
        <div className="flex justify-end w-6/12">
          <Menu>

            {permissionPage?.isCreate && (
              // <MenuButton className="flex rounded ml-1 bg-[#3758F9] py-2 px-4 text-sm text-white hover:shadow-lg font-bold"
              //   onClick={() => {
              //     navigate('/setting/user-management/user/users', { state: { status: 'create' } });
              //   }}
              // >
              //   <IoAdd className='mr-1 text-lg font-bold text-white' />
              //   <p className='m-auto'>{t('userManagement.user.createUser')}</p>
              // </MenuButton>
              <Button
                onClick={() => {
                  navigate('/setting/user-management/user/users', { state: { status: 'create' } });
                }}
              variant="contained"
              className={` flex pt-3 font-semibold
              ${!permissionPage.isCreate && "hidden"} 
              `}
            >
                <IoAdd className="text-white text-lg mr-1 mt-0.5" />
              <p className="pb-0 mb-0 text-base text-white">
                {t('userManagement.user.createUser')}
              </p>
            </Button>
            )}

          </Menu>
        </div>
      </div>




      {/* responsive talbe */}
      {/* <div className="flex"> */}
      <TableUser columns={columns} data={users.data || []} pagination={users.pagination}
        handlePageChange={handlePageChange}
        loading={loading}
        pageSize={searchConditionRef.current.pageSize}
      />
      {/* </div> */}
      {/* responsive talbe */}


      <ConfirmModal modalType={confirmType} isOpen={isOpen} onClose={onClose} title={'Confrim Delete'} detail={'Are you sure you want to delete?'} onConfirm={handleConfirm} />

    </div>
  );
};
export default UserList;
