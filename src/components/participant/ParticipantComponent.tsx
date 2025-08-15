'use client'

import { useEffect, useState } from "react";
import { Ban, Edit, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { apiCall } from "@/lib/apiClient";
import { useTopLoader } from "@/context/TopLoader";
import { ColumnDefinition, DataTable, SortConfig, TableAction } from "../common/DataTable";
import { SideDrawer } from "../common/SIdeDrawer";
import { BookSlotContent } from "../scheduler/SlotBooking";
import { BookingDetailsContent } from "../scheduler/BookingDetails";
import { AddParticipant } from "./AddParticipant";
import { ParticipantProfile } from "./ParticipantDeatils";

const ParticipantComponent = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState<string>('')
    const [selectedClient, setSelectedClient] = useState<any>()
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        type: 'book', // 'book' or 'details' or 'career'
        avatar: '',
        title: ''
    });
    // Column definitions
    const columns: ColumnDefinition[] = [
        {
            key: "clientId",
            label: "Participant ID",
            type: "text",
            sortable: false,
            width: "120px",
        },
        {
            key: "personalInfo.profileImage",
            label: "Img",
            type: "image",
            sortable: false,
            width: "100px",
        },
        {
            key: "personalInfo.name",
            label: "Name",
            type: "text",
            sortable: true,
        },
        {
            key: "startDate",
            label: "Booking Date",
            type: "date",
            sortable: true,
        },
        {
            key: "startTime",
            label: "Total bookings",
            type: "number",
            sortable: true,
        },
        {
            key: "personalInfo.mobileNumber",
            label: "Mobile No",
            type: "text",
            sortable: false,
        },
        {
            key: "status",
            label: "Booking Status",
            type: "badge",
            sortable: false,
            badgeColorMap: {
                active: "default",
                inactive: "destructive",
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

    // Action definitions
    const actions: TableAction[] = [
        {
            id: "edit",
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: (row) => console.log("Edit", row),
            variant: "ghost",
        },
        {
            id: "delete",
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (row) => console.log("Delete", row),
            variant: "ghost",
            className: "text-destructive hover:text-destructive",
        },
    ]

    const openDrawer = (type: 'book' | 'details' | 'career', name: string = '', profileImage: string = '') => {
        setDrawerState({
            isOpen: true,
            type,
            avatar:
                type === 'career'
                    ? ''
                    : type === 'book'
                        ? ''
                        : profileImage,
            title: type === 'career' ? '' : type === 'book' ? 'Add Participant' : name +' (Patient)'
        });
    };
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
        loader.showLoader()
        try {
            const res = await apiCall<any>('POST', 'client/v1/client_list',
                {
                    "search": debouncedSearch,
                    "sortBy": "createdAt",
                    "sortOrder": "desc",
                    "page": currentPage,
                    "limit": pageSize
                }
            )
            console.log(res);
            setData(res?.data)
            setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
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
                <h1 className="font-semibold text-xl md:text-2xl">Participant Listing</h1>
                <div className="flex items-center gap-3">
                    <Input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className="bg-primary w-full text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-900"
                        style={{ boxShadow: '0px 1px 2px 0px #1018280D' }}
                        onClick={() => openDrawer('book')}
                    >
                        <Plus size={16} />
                        <span>Add Participant</span>
                    </button>
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
                emptyMessage="No Participant found"
                onRowClick={(row) => {
                    setSelectedClient(row);
                    openDrawer('details', row.personalInfo.name, row.personalInfo.profileImage);
                }}
            // className="border rounded-lg"
            />
            <SideDrawer
                isOpen={drawerState.isOpen}
                onClose={closeDrawer}
                avatar={drawerState.avatar}
                title={drawerState.title}
            >
                {drawerState.type === 'book' ? <AddParticipant /> : <ParticipantProfile clientId={selectedClient.clientId} />}
            </SideDrawer>

        </div>

    )
}
export default ParticipantComponent;