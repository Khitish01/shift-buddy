'use client'

import { useEffect, useState } from "react";
import { Ban, CheckCircle, CircleX, Edit, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { apiCall } from "@/lib/apiCall";
import { useTopLoader } from "@/context/TopLoader";
import { ColumnDefinition, DataTable, SortConfig, TableAction } from "../common/DataTable";
import { SideDrawer } from "../common/SIdeDrawer";
import { BookSlotContent } from "../scheduler/SlotBooking";
import { BookingDetailsContent } from "../scheduler/BookingDetails";
import { usePopup } from "@/context/PopupContext";
import { adminClient } from "@/lib/apiClient";
import dayjs from "dayjs";
import { ConfirmModal } from "../common/ConfirmModal";

const LeaveComponent = () => {
    const [data, setData] = useState<any[]>([]);
    const { showPopup, updatePopupStatus } = usePopup();
    const [loading, setLoading] = useState(false);
    const [shiftTabs, setShiftTabs] = useState<any[]>([]);
    const [search, setSearch] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [activeTab, setActiveTab] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
    const [selectedRequest, setSelectedRequest] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const [open, setOpen] = useState(false);
    // Column definitions
    const columns: ColumnDefinition[] = [
        {
            key: "carrierId._id",
            label: "ID",
            type: "text",
            sortable: false,
            width: "120px",
        },
        {
            key: "carrierId.name",
            label: "Carer name",
            type: "text",
            sortable: true,
        },
        {
            key: "startDate",
            label: "Start Date",
            type: "date",
            sortable: true,
        },
        {
            key: "endDate",
            label: "End Date",
            type: "date",
            sortable: true,
        },
        {
            key: "totalDays",
            label: " Total Day",
            type: "text",
            sortable: false,
        },
        {
            key: "leaveType.leaveType",
            label: "Leave Type",
            type: "badge",
            sortable: false,
            badgeColorMap: {
                "Annual Leave": "text-[#1F9254] bg-[#EBF9F1]",
                "Sick Leave": "text-[#FF8285] bg-[#FBE7E8]",
                "Emergency Leave": "text-[#909090] bg-[#90909036]",
                "Personal Leave": "text-[#69417E] bg-[#F2C7AC59]",
                "Medical Leave": "text-[#69417E] bg-[#F2C7AC59]",
                "Long Service Leave": "text-[#69417E] bg-[#F2C7AC59]",
            },
        },
        {
            key: "actions",
            label: "Action",
            type: "actions",
            sortable: false,
            width: "100px",
        },
    ]

    // Action definitions - dynamic based on status
    const actions = (row: any): TableAction[] => {
        if (row.status === 'Approved') {
            return [{
                id: "approved",
                label: "Approved",
                icon: <span className="flex gap-2 items-center "><CheckCircle />Approved</span>,
                onClick: () => { },
                variant: "ghost",
                className: "bg-[#69417E21] text-[#69417E] hover:bg-[#69417E21] hover:text[#69417E]",
            }]
        }
        if (row.status === 'Deny') {
            return [{
                id: "deny",
                label: "Denied",
                icon: <span className="flex gap-2 items-center "><CircleX />Denied</span>,
                onClick: () => { },
                variant: "ghost",
                className: "bg-[#F2C7AC59] text-[#69417E] hover:bg-[#F2C7AC59] hover:text[#69417E]",
            }]
        }

        return [
            {
                id: "approve",
                label: "Approve",
                onClick: (row) => {
                    setSelectedStatus('approved')
                    setSelectedRequest(row._id)
                    setOpen(true)
                },
                variant: "ghost",
                className: "bg-[#F2C7AC] text-[#69417E] hover:bg-[#F2C7AC]",
            },
            {
                id: "deny",
                label: "Deny",
                onClick: (row) => {
                    setSelectedStatus('deny')
                    setSelectedRequest(row._id)
                    setOpen(true)
                },
                variant: "ghost",
                className: "bg-[#EAEAEA] text-[#69417E] hover:bg-[#EAEAEA]",
            },
        ]
    }
    // const [showCarerModal, setShowCarerModal] = useState(false)
    // const [showShiftModal, setShowShiftModal] = useState(false)
    // const addCarerShift = async () => {

    //     showPopup('Processing', "Carer new shift is processing.."); // Optional message & duration
    //     try {

    //     } catch (error) {
    //         console.error('Error setting role:', error)
    //     } finally {
    //         // loader.hideLoader()
    //         updatePopupStatus('success', 'Carer added to the shift', "Congratulation, Carer has been added to the shift.", 4000); // Optional message & duration
    //     }
    // }
    // const addNewShift = async () => {

    //     showPopup('Processing', "New shift creation is processing.."); // Optional message & duration
    //     try {

    //     } catch (error) {
    //         console.error('Error setting role:', error)
    //     } finally {
    //         // loader.hideLoader()
    //         updatePopupStatus('success', 'Added', "Congratulation, New Shift has been added.", 4000); // Optional message & duration
    //     }
    // }


    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setCurrentPage(1) // Reset to first page
    }

    const handleSortChange = (newSortConfig: SortConfig | null) => {
        setSortConfig(newSortConfig)
        setCurrentPage(1) // Reset to first page when sorting changes
    }


    const loader = useTopLoader()

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const getList = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/leave/v1/get_carrier_leaves',
                {
                    "page": currentPage,
                    "limit": pageSize,
                    "search": debouncedSearch
                }
            )
            console.log(res);
            const data: any[] = []
            res.data.forEach((x: any) => {
                x['totalDays'] = dayjs(x.endDate).diff(dayjs(x.startDate), 'day')
                data.push(x)
            })
            setData(data)
            setTotalCount(res?.pagination?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }
    }
    useEffect(() => {
        getList()
    }, [currentPage, pageSize, debouncedSearch])


    const changeLeaveStatus = async (selectedRequest: string) => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/leave/v1/update_leaves_status',
                {
                    leaveId: selectedRequest,
                    status: selectedStatus //approved/deny
                }
            )
            console.log(res);
            // showSucessToast(res?.msg)
            showPopup(`Request ${selectedStatus == 'approved' ? 'Approved' : 'Denied'}`, `This Leave Request has been ${selectedStatus == 'approved' ? 'Approved' : 'Denied'}`);
            updatePopupStatus("success", `Request ${selectedStatus == 'approved' ? 'Approved' : 'Denied'}`, `This Leave Request has been ${selectedStatus == 'approved' ? 'Approved' : 'Denied'}`, 4000);
            getList()

            // setData(res?.data)
            // setTotalCount(res?.count)
        } catch (error) {
            console.error('Error setting role:', error)
            showPopup(`Something went wrong`, `Your booking has not been Cancelled`);
            updatePopupStatus("error", `Something went wrong`, `Your booking has not been Cancelled`, 4000);
        } finally {
            loader.hideLoader()
        }
    }

    return (
        // <main className="pt-24 pl-20 p-6 w-[calc(100vw-1rem)]">
        <div className="bg-white">
            {/* This is carrier listing page */}

            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl md:text-2xl">Leave Request Dashboard </h1>
                <div className="flex items-center gap-3">
                    <Input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>


            <DataTable
                data={data}
                columns={columns}
                actions={actions}
                sortable={true}
                paginated={true}
                currentPage={currentPage}
                pageSizeOptions={[5, 10, 20, 50]}
                pageSize={pageSize}
                totalCount={totalCount}
                sortConfig={sortConfig}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onSortChange={handleSortChange}
                loading={loading}
                emptyMessage="No leave requests found"
            // onRowClick={(row) => openDrawer('details', row.personalInfo.name)}
            />


            <ConfirmModal
                open={open}
                title={`Are you sure to ${selectedStatus == 'approved' ? 'Approve' : 'Deny'}?`}
                message={
                    <>
                        This action <strong>cannot be undone</strong>. This will {selectedStatus == 'approved' ? 'Approve' : 'Deny'} the carer leave request.
                    </>
                }
                confirmText="Confirm"
                cancelText="Cancel"
                tone="danger"
                onConfirm={() => {
                    // alert("Deleted!");
                    changeLeaveStatus(selectedRequest)
                    setOpen(false);
                }}
                onCancel={() => setOpen(false)}
            />

        </div>

    )
}
export default LeaveComponent;