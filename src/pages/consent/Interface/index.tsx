import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { FaRegCopy, FaRegCheckCircle } from "react-icons/fa";
import { IoAdd, IoFilterOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../../store';
import {
	Button,
	InputText,
	Table,
	SortingHeader,
	Tag,
	Dropdown,
	DropdownOption,
} from "../../../components/CustomComponent";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { setMenuDescription } from '../../../store/slices/menuDescriptionSlice';
import { IConsentInterface } from '../../../interface/interface.interface';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineUnpublished } from 'react-icons/md';
import dayjs from 'dayjs';
import { createConsentInterface, getConsentInterfaceByID, getConsentInterfaces, updateConsentInterface } from '../../../services/consentInterfaceService';
import { getOrganizationChart } from "../../../services/organizationService";
import Copyto from '../../../components/interfaceComponent/copyto';
import { ModalType, useConfirm } from '../../../context/ConfirmContext';
import { PopupPublish, PopupUnpublish } from '../../../components/interfaceComponent';
import notification from '../../../utils/notification';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Interface = () => {
	const confirm = useConfirm();
	const [loading, setLoading] = useState(true);
	const [organizations, setOrganizations] = useState<any[]>([]);
	const [isCopyToModalOpen, setIsCopyToModalOpen] = useState(false);
	const [consentInterface, setConsentInterface] = useState({} as IConsentInterface);
	const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);
	const [isConfirmUnpublishOpen, setIsConfirmUnpublishOpen] = useState(false);
	const [publishId, setPublishId] = useState('');
	const dispatch = useDispatch();
	let { t, i18n } = useTranslation();
	const orgparent = useSelector(
		(state: RootState) => state.orgparent.orgParent
	);
	const datimeformat = JSON.parse(localStorage.getItem("datetime") || "{}");
	const navigate = useNavigate()
	const [interfaces, setInterfaces] = useState<{
		data: IConsentInterface[];
		pagination: { page: number; total_pages: number };
	}>({
		data: [],
		pagination: { page: 1, total_pages: 1 },
	});
	const [selectedStatus, setSelectedStatus] = useState({
		id: "All Status",
		label: "All Status",
		value: "All Status"
	});
	const [stdStatus, setStdStatus] = useState([
		{
			id: "AllStatus",
			label: t('dataelement.form.allstatus'),
			value: "all"
		},
		{
			id: "98641aa6-383d-43a3-80ba-5bfceb050360",
			label: t('dataelement.form.draft'),
			value: 'Draft'
		},
		{
			id: "b2f54e97-b9d7-47a2-9990-7ce7a5b55a64",
			label: t('dataelement.form.published'),
			value: 'Published'
		},
		{
			id: "68b297d8-e097-4b84-a885-d3d33f607ec4",
			label: "Unpublished",
			value: "Unpublished"
		}
	]);
	const searchConditionRef = useRef({
		searchTerm: '',
		statusFilter: 'all',
		page: 1,
		pageSize: 20,
		sort: '',
		column: '',
	});

	const handleSearch = useCallback(
		debounce((searchTerm: string) => {
			let limit = 20;
			searchConditionRef.current.searchTerm = searchTerm;

			handleGetConsentInterface(limit);
		}, 300),
		[]
	);

	const permissionPage = useSelector(
		(state: RootState) => state.permissionPage.permission
	);

	const handleGetConsentInterface = async (limit: number) => {
		try {
			if (orgparent !== "") {
				setLoading(true);
				const customerId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).customer_id : '';
				var res = await getOrganizationChart(customerId, orgparent);
				var org = res.data.data;
				const orgList: string[] = [];
				const orgLists: any[] = [];
				orgList.push(org[0].id);
				orgLists.push(org[0]);
				if (org[0].organizationChildRelationship.length > 0) {
					org[0].organizationChildRelationship.forEach((element: any) => {
						orgList.push(element.id);
						orgLists.push(element);
						if (element.organizationChildRelationship.length > 0) {
							element.organizationChildRelationship.forEach((child: any) => {
								orgList.push(child.id);
								orgLists.push(child);
								if (child.organizationChildRelationship.length > 0) {
									child.organizationChildRelationship.forEach((child2: any) => {
										orgList.push(child2.id);
										orgLists.push(child2);
									});
								}
							});
						}
					});
				}
				await setOrganizations(orgLists.map((item: any) => {
					return {
						organizationId: item.id,
						organizationName: item.orgName
					};
				}));
				console.log(orgLists)
				const response: any = await getConsentInterfaces(limit, { OrganizationIds: orgList }, searchConditionRef.current);
				console.log(response)
				setInterfaces(response);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.error('error', error);
		}
	}

	useEffect(() => {
		handleGetConsentInterface(20);
	}, [orgparent]);

	useEffect(() => {
		dispatch(setMenuDescription("interface.listview.description"));
		return () => {
			dispatch(setMenuDescription(""));
		};
	}, []);

	function handlePageChange(page: number): void {
		searchConditionRef.current.page = page;
		let limit = 20;
		handleGetConsentInterface(limit);
	}

	function handleSort(column: string): void {
		searchConditionRef.current.sort = searchConditionRef.current.sort === 'ASC' ? 'DESC' : 'ASC';
		searchConditionRef.current.column = column;
		let limit = 20;
		handleGetConsentInterface(limit);
	}

	function getStatusStyle(status: string) {
		switch (status) {
			case "Draft":
				return "text-gray-600 bg-gray-200";
			case "Retired":
				return "text-red-600 bg-red-100";
			case "Published":
				return "text-green-600 bg-green-100";
			case "Unpublished":
				return "text-orange-600 bg-orange-100";
			default:
				return "text-gray-600 bg-gray-200";
		}
	}

	function formatDate(datetime: string) {
		return dayjs(datetime).format(`${datimeformat.dateFormat} ${datimeformat.timeFormat}`)
	}

	const handleOpenCopyTo = async (id: string) => {
		setIsCopyToModalOpen(true);
		const response = await getConsentInterfaceByID(id);
		console.log("setConsentInterface", response)
		setConsentInterface(response);
	}

	const handleCopyTo = async (formData: any, isError: boolean) => {
		const newInterface = { ...consentInterface };
		newInterface.interfaceName = formData.interfaceName;
		newInterface.description = formData.description;
		newInterface.parentVersionId = "00000000-0000-0000-0000-000000000000";
		newInterface.organizationId = formData.organizationId;
		newInterface.interfaceStatusName = "Draft";
		newInterface.versionNumber = 1;
		if (!isError) {
			confirm({
				modalType: ModalType.Save,
				onConfirm: async () => {
					setIsCopyToModalOpen(false);
					setLoading(true);
					await createConsentInterface(newInterface);
					handleGetConsentInterface(20)
				},
			});
		}
	}

	const handlePublished = async () => {
		setIsConfirmPublishOpen(false)
		setLoading(true);
		try {
			const response = await getConsentInterfaceByID(publishId);
			await updateConsentInterface({ ...response, interfaceStatusName: "Published" });
			notification.success(t("modal.successConfirmSave"));
			handleGetConsentInterface(20)
		} catch (error) {
			notification.error(t("modal.errorConfirmSave"));
			setLoading(false);
		}

	};

	const handleUnpublish = async () => {
		setIsConfirmUnpublishOpen(false)
		setLoading(true);
		try {
			const response = await getConsentInterfaceByID(publishId);
			await updateConsentInterface({ ...response, interfaceStatusName: "Unpublished" });
			notification.success(t("modal.successConfirmSave"));
			handleGetConsentInterface(20)
		} catch (error) {
			notification.error(t("modal.errorConfirmSave"));
			setLoading(false);
		}
	}

	const columns = useMemo(() => {
		return [
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("InterfaceName")}
						title={t('interface.listview.columns.interfaceName')}
					/>
				),
				accessor: "interfaceName",
				Cell: ({ row }: { row: any }) => (
					<div className="flex items-center" onClick={() => {
						localStorage.setItem("nameConsent", row.original.interfaceName);
						console.log(row.original)
						navigate(`/consent/consent-interface/view/${row.original.interfaceId}/info`);
					}}>
						<div className="relative group justify-start">
							<p className="text-base font-semibold text-primary-blue cursor-pointer text-left truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original.interfaceName}</p>
							<div
								className="absolute bottom-full left-0 translate-y-[-6px] z-50 
				   hidden group-hover:inline-block bg-gray-800 text-white text-xs rounded py-1 px-2 
				   shadow-lg break-words min-w-max max-w-[300px]"
								style={{
									whiteSpace: "normal",
									wordWrap: "break-word",
									overflowWrap: "break-word"
								}}
							>
								{row.original.interfaceName}
							</div>
						</div>
					</div>
				),
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("DataElementName")}
						title={t('interface.listview.columns.identifier')}
						center={true}
					/>
				),
				accessor: "dataElementName",
				Cell: ({ value }: { value: any }) =>
					<span className="flex justify-center items-center w-full">
						{value ? value : "-"}
					</span>
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("InterfaceStatusName")}
						title={t('interface.listview.columns.status')}
						center={true}
					/>
				),
				accessor: "interfaceStatusName",
				Cell: ({ value }: { value: string }) => (
					<span className="flex justify-center items-center w-full">
						<Tag size="sm" minHeight="1.625rem" className={`px-3 py-1 rounded-md text-base max-w-max ${getStatusStyle(value ? value : "Draft")}`}>
							{value ? value : "Draft"}
						</Tag>
					</span>
				),
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("VersionNumber")}
						title={t('interface.listview.columns.version')}
						center={true}
					/>
				),
				accessor: "versionNumber",
				Cell: ({ value }: { value: number }) =>
					<span className="flex justify-center items-center w-full">
						<Tag size="sm" minHeight="1.625rem" className=" text-primary-blue font-medium px-3 py-1 rounded-md text-base bg-blue-100 max-w-max">
							Version {value}
						</Tag>
					</span>
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("Receipts")}
						title={t('interface.listview.columns.receipts')}
						center={true}
					/>
				),
				accessor: "receipts",
				Cell: ({ value }: { value: number }) => (
					<span className="flex items-center justify-center">
						{value}
					</span>
				)
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("transactions")}
						title={t('interface.listview.columns.transactions')}
						center={true}
					/>
				),
				accessor: "transactions",
				Cell: ({ value }: { value: number }) => (
					<span className="flex items-center justify-center">
						{value}
					</span>
				)
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("ModifiedBy")}
						title={t('interface.listview.columns.publishedBy')}
					/>
				),
				accessor: "publishedBy",
				Cell: ({ row }: { row: any }) => (
					<span >
						{row.original.publishedBy ? row.original.publishedBy : "-"}
					</span>
				),
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("ModifiedDate")}
						title={t('interface.listview.columns.publishedDate')}
						center={true}
					/>
				),
				accessor: "publishedDate",
				Cell: ({ row }: { row: any }) => (
					<span className="flex items-center justify-center">
						{row.original.publishedDate ? formatDate(row.original.publishedDate) : "-"}
					</span>
				),
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("ModifiedBy")}
						title={t('interface.listview.columns.nodifiedBy')}
					/>
				),
				accessor: "modifiedBy",
				Cell: ({ value }: { value: string }) => (
					<span >
						{value ? value : "-"}
					</span>
				),
			},
			{
				Header: (
					<SortingHeader
						onClick={() => handleSort("ModifiedDate")}
						title={t('interface.listview.columns.nodifiedDate')}
						center={true}
					/>
				),
				accessor: "modifiedDate",
				Cell: ({ value }: { value: string }) => (
					<span className="flex justify-center items-center w-full">
						{value ? formatDate(value) : "-"}
					</span>
				),
			},
			{
				Header: "",
				accessor: "actions",
				Cell: ({ row }: { row: any }) => {
					return (
						<Menu as="div" className="relative inline-block text-left">
							<MenuButton className="cursor-pointer">
								<BsThreeDotsVertical />
							</MenuButton>
							<MenuItems className="absolute z-[9999] right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
								{row.original.interfaceStatusName === "Draft" && <MenuItem>
									<button
										className=" w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
										onClick={() => {
											localStorage.setItem("nameConsent", row.original.interfaceName);
											navigate(`/consent/consent-interface/edit/${row.original.interfaceId}/info`)
										}
										}
									>
										<FiEdit style={{ fontSize: "20px" }} />
										<span className="text-base">
											{t("interface.listview.menu.edit")}
										</span>
									</button>
								</MenuItem>
								}
								<MenuItem>
									<button
										className=" w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
										onClick={() => { handleOpenCopyTo(row.original.interfaceId) }}
									>
										<FaRegCopy style={{ fontSize: "20px" }} />
										<span className="text-base">
											{t("interface.listview.menu.copyto")}
										</span>
									</button>
								</MenuItem>
								{(row.original.interfaceStatusName === "Draft" || row.original.interfaceStatusName === "Unpublished") &&
									<MenuItem>
										<button
											className=" w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
											onClick={() => {
												setPublishId(row.original.interfaceId)
												setIsConfirmPublishOpen(true)
											}}
										>
											<FaRegCheckCircle style={{ fontSize: "20px" }} />
											<span className="text-base">
												{t("interface.listview.menu.publish")}
											</span>
										</button>
									</MenuItem>}
								{(row.original.interfaceStatusName === "Published") &&
									<MenuItem>
										<button
											className=" w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
											onClick={() => {
												setPublishId(row.original.interfaceId)
												setIsConfirmUnpublishOpen(true)
											}}
										>
											<MdOutlineUnpublished style={{ fontSize: "20px" }} />
											<span className="text-base">
												{t("interface.listview.menu.unpublish")}
											</span>
										</button>
									</MenuItem>}
							</MenuItems>
						</Menu>
					);
				},
			},
		];
	}, [t, interfaces, permissionPage]);

	return (
		<div className="px-4 py-1 bg-white">
			{
				loading ? <LoadingSpinner /> :
					<div className="px-4">
						<div className="flex justify-between w-100 mt-4">
							<div className="flex gap-2 items-center">
								<InputText
									onChange={(e) => handleSearch(e.target.value)}
									type="search"
									placeholder={t("interface.listview.input.search")}
									minWidth="20rem"
								></InputText>
								<Dropdown
									id="selectedStatus"
									title=""
									className="w-full"
									selectedName={selectedStatus.label}
									disabled={false}
									isError={false}
									minWidth="10rem"
								>
									{stdStatus.map((item) => (
										<DropdownOption
											selected={selectedStatus.value === item.value}
											onClick={() => {
												setSelectedStatus(item);
												searchConditionRef.current.statusFilter = item.value;
												let limit = 20;
												handleGetConsentInterface(limit);
											}}
											key={item.id}
										>
											<span
												className={`${selectedStatus.value === item.value ? "text-white" : ""
													}`}
											>
												{item.label}
											</span>
										</DropdownOption>
									))}
								</Dropdown>
							</div>
							<div className="w-2/12 px-2 flex items-center">
								<IoFilterOutline className="text-[1.75rem] text-dark-gray"></IoFilterOutline>
							</div>
							<div className="w-9/12 flex justify-end">
								<Button
									className="flex items-center gap-2 bg-primary-blue text-white"
									onClick={() => {
										navigate(`/consent/consent-interface/create/info`);
									}}
								>
									<IoAdd className="text-lg"></IoAdd>
									<span className="text-white text-sm font-semibold">
										{t("interface.listview.buttom.createNew")}
									</span>
								</Button>
							</div>
						</div>
						<div className="w-full pb-4" >
							<Table
								columns={columns}
								data={interfaces.data}
								pagination={interfaces.pagination}
								loading={loading}
								handlePageChange={handlePageChange}
							/>
						</div>

					</div>
			}
			<Copyto
				isOpen={isCopyToModalOpen}
				organizations={organizations}
				onClose={() => setIsCopyToModalOpen(false)}
				onSubmit={handleCopyTo}
			/>
			<PopupPublish
				isOpen={isConfirmPublishOpen}
				onClose={() => setIsConfirmPublishOpen(false)}
				onPublish={handlePublished}
			/>
			<PopupUnpublish
				isOpen={isConfirmUnpublishOpen}
				onClose={() => setIsConfirmUnpublishOpen(false)}
				onUnpublish={handleUnpublish}
			/>
		</div>
	)
}

export default Interface;