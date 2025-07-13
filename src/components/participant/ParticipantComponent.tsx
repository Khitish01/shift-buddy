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
// const sampleData = [
//     {
//         id: '000989',
//         name: 'Liam Smith',
//         totalIncome: 86789,
//         totalShift: 568,
//         jobType: 'Full-Time'
//     },
//     {
//         id: '007890',
//         name: 'Noah Johnson',
//         totalIncome: 345,
//         totalShift: 760,
//         jobType: 'Part-Time'
//     },
//     {
//         id: '005648',
//         name: 'James Brown',
//         totalIncome: 7890,
//         totalShift: 23,
//         jobType: 'Part-Time'
//     },
//     {
//         id: '001234',
//         name: 'Emma Wilson',
//         totalIncome: 95000,
//         totalShift: 480,
//         jobType: 'Full-Time'
//     },
//     {
//         id: '002456',
//         name: 'Oliver Davis',
//         totalIncome: 12500,
//         totalShift: 320,
//         jobType: 'Part-Time'
//     },
//     {
//         id: '003789',
//         name: 'Ava Miller',
//         totalIncome: 78000,
//         totalShift: 520,
//         jobType: 'Full-Time'
//     }
// ];

// const mockData = [
//     {
//         id: "20462",
//         carerId: "#20462",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Matt Dickerson",
//         joiningDate: "2022-05-13",
//         totalShift: 189,
//         mobileNo: "9098765678",
//         status: "active",
//     },
//     {
//         id: "18933",
//         carerId: "#18933",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Wiktoria",
//         joiningDate: "2022-05-22",
//         totalShift: 263,
//         mobileNo: "9098765678",
//         status: "active",
//     },
//     {
//         id: "45169",
//         carerId: "#45169",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Trixie Byrd",
//         joiningDate: "2022-06-15",
//         totalShift: 45,
//         mobileNo: "9098765678",
//         status: "active",
//     },
//     {
//         id: "34304",
//         carerId: "#34304",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Brad Mason",
//         joiningDate: "2022-09-06",
//         totalShift: 86,
//         mobileNo: "9098765678",
//         status: "active",
//     },
//     {
//         id: "17188",
//         carerId: "#17188",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Sanderson",
//         joiningDate: "2022-09-25",
//         totalShift: 90,
//         mobileNo: "9098765678",
//         status: "inactive",
//     },
//     {
//         id: "73003",
//         carerId: "#73003",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Jun Redfern",
//         joiningDate: "2022-10-04",
//         totalShift: 13,
//         mobileNo: "9098765678",
//         status: "active",
//     },
//     {
//         id: "58825",
//         carerId: "#58825",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Miriam Kidd",
//         joiningDate: "2022-10-17",
//         totalShift: 177,
//         mobileNo: "9098765678",
//         status: "active",
//     },
//     {
//         id: "44122",
//         carerId: "#44122",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Dominic",
//         joiningDate: "2022-10-24",
//         totalShift: 245,
//         mobileNo: "9098765678",
//         status: "active",
//     },
//     {
//         id: "89094",
//         carerId: "#89094",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Shanice",
//         joiningDate: "2022-11-01",
//         totalShift: 679,
//         mobileNo: "9098765678",
//         status: "inactive",
//     },
//     {
//         id: "85252",
//         carerId: "#85252",
//         img: "/placeholder.svg?height=40&width=40",
//         name: "Poppy-Rose",
//         joiningDate: "2022-11-22",
//         totalShift: 387,
//         mobileNo: "9098765678",
//         status: "inactive",
//     },
// ]

// type Employee = typeof sampleData[0];
const ParticipantComponent = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState<string>('')
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
            key: "_id",
            label: "Participant ID",
            type: "text",
            sortable: false,
            width: "120px",
        },
        {
            key: "personalInfo.name",
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

    const openDrawer = (type: 'book' | 'details' | 'career', name: string = '') => {
        setDrawerState({
            isOpen: true,
            type,
            avatar:
                type === 'career'
                    ? ''
                    : type === 'book'
                        ? ''
                        : 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face',
            title: type === 'career' ? '' : type === 'book' ? 'Add Participant' : name
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

    useEffect(() => {
        const getList = async () => {
            loader.showLoader()
            try {
                const res = await apiCall<any>('POST', '/slot/v1/get_slot',
                    {
                        "startDate": "2025-05-25",
                        "endDate": "2025-07-25"
                    }
                )
                console.log(res);
                setData(res?.data)
                setTotalCount(res?.count)
            } catch (error) {
                console.error('Error setting role:', error)
            } finally {
                loader.hideLoader()
            }
        }
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
                emptyMessage="No Bookings found"
                onRowClick={(row) =>  openDrawer('details', row.personalInfo.name)}
            // className="border rounded-lg"
            />
            <SideDrawer
                isOpen={drawerState.isOpen}
                onClose={closeDrawer}
                avatar={drawerState.avatar}
                title={drawerState.title}
            >
                {drawerState.type === 'book' ? <AddParticipant /> : <BookingDetailsContent />}
            </SideDrawer>

        </div>

    )
}
export default ParticipantComponent;