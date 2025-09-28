'use client'

import { useEffect, useState } from "react";
import { Ban, CheckCircle, CircleX, Edit, Eye, Pencil, Plus, Trash, Trash2 } from "lucide-react";
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
import { AttendanceHistory } from "./AttendanceHistory";

export const TimeSheetComponent = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)


    const [selectedVehicle, setSelectedVehicle] = useState<any>();
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        avatar: '',
        title: ''
    });
    // Column definitions
    const columns: ColumnDefinition[] = [
        {
            key: "carrier.carrierId",
            label: "Carer ID",
            type: "text",
            sortable: false,
            width: "120px",
        },
        {
            key: "carrier.profileImage",
            label: "Img",
            type: "image",
            sortable: true,
        },
        {
            key: "carrier.name",
            label: "Carer Name",
            type: "text",
            sortable: true,
        },
        {
            key: "date",
            label: "Date",
            type: "date",
            sortable: true,
        },
        {
            key: "time",
            label: "Time",
            type: "text",
            sortable: false,
        },
        {
            key: "overTime",
            label: "Overtime",
            type: "text",
            sortable: false,
        },
    ]
    const closeDrawer = () => {
        setDrawerState(prev => ({ ...prev, isOpen: false }));

        // setCalenderDrawer(false)

    };


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
        setLoading(true)
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/timeSheet/v1/get_attendence',
                {
                    page: currentPage,
                    limit: pageSize,
                    search: debouncedSearch,
                    sortBy: "date",
                    sortOrder: "desc",
                }
            )
            console.log(res);

            const data: any[] = []
            res.data.forEach((x: any) => {
                const loginTime = dayjs(`2000-01-01 ${x.loginTime}`, 'YYYY-MM-DD hh:mm').format('hh:mm A');
                const logoutTime = x.logoutTime ? dayjs(`2000-01-01 ${x.logoutTime}`, 'YYYY-MM-DD hh:mm').format('hh:mm A') : 'NA';
                x['time'] = `${loginTime} - ${logoutTime}`;
                data.push(x)
            })
            setData(res?.data)

            setTotalCount(res?.pagination?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
            setLoading(false)
        }
    }
    useEffect(() => {
        getList()
    }, [currentPage, pageSize, debouncedSearch])


    return (
        // <main className="pt-24 pl-20 p-6 w-[calc(100vw-1rem)]">
        <div className="bg-white">
            {/* This is carrier listing page */}

            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl md:text-2xl">TimeSheet Management</h1>
                <div className="flex items-center gap-3">
                    <Input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

                </div>
            </div>


            <DataTable
                data={data}
                columns={columns}
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
                emptyMessage="No attendance found"
                onRowClick={(row) => {
                    setSelectedVehicle(row)
                    console.log(row);
                    setDrawerState({
                        isOpen: true,
                        avatar: '',
                        title: row?.carrier?.name
                    })
                }}
            />

            <SideDrawer
                isOpen={drawerState.isOpen}
                onClose={closeDrawer}
                avatar={drawerState.avatar}
                title={drawerState.title}
            >
                <AttendanceHistory carrier={selectedVehicle} />
            </SideDrawer>

        </div>

    )
}