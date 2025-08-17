'use client'

import { useEffect, useState } from "react";
import { Ban, CircleX, Edit, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { apiCall } from "@/lib/apiCall";
import { useTopLoader } from "@/context/TopLoader";
import { ColumnDefinition, DataTable, SortConfig, TableAction } from "../common/DataTable";
import { SideDrawer } from "../common/SIdeDrawer";
import { BookSlotContent } from "../scheduler/SlotBooking";
import { BookingDetailsContent } from "../scheduler/BookingDetails";
import dayjs from "dayjs";
import { adminClient } from "@/lib/apiClient";
import { showSucessToast } from "@/lib/toast";
import { ConfirmModal } from "../common/ConfirmModal";
import { usePopup } from "@/context/PopupContext";
const BookingComponent = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
    const [selectedBooking, setSelectedBooking] = useState<string>('');
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        type: 'book', // 'book' or 'details' or 'career'
        avatar: '',
        title: ''
    });
    const { showPopup, updatePopupStatus } = usePopup();
    // Column definitions
    const columns: ColumnDefinition[] = [
        {
            key: "_id",
            label: "Booking ID",
            type: "text",
            sortable: false,
            width: "120px",
        },
        {
            key: "clientName",
            label: "Percipient/ Client Name ",
            type: "text",
            sortable: false,
            width: "200px",
        },
        {
            key: "carrierName",
            label: "Carer / Worker Name",
            type: "text",
            sortable: true,
            width: "200px",
        },
        {
            key: "startDate",
            label: "Booking Date",
            type: "date",
            sortable: true,
        },
        {
            key: "startTime",
            label: "Booking Time",
            type: "text",
            sortable: true,
        },
        {
            key: "clientPhone",
            label: "Parcipient Mobile",
            type: "text",
            sortable: false,
        },
        {
            key: "slotStatusLabel",
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
            onClick: (row) => {
                setSelectedBooking(row._id)
                // setOpen(true)
                openDrawer('edit', row.clientName, row.clientProfileImage)
            },
            variant: "ghost",
        },
        {
            id: "delete",
            label: "Delete",
            icon: <CircleX className="h-4 w-4" />,
            onClick: (row) => {
                setOpen(true)
                setSelectedBooking(row._id)

            },
            variant: "ghost",
            className: "text-destructive hover:text-destructive",
        },
    ]

    const openDrawer = (type: 'book' | 'details' | 'edit', name: string = '', profileImage: string = '') => {
        setDrawerState({
            isOpen: true,
            type,
            avatar:
                type === 'edit'
                    ? ''
                    : type === 'book'
                        ? ''
                        : profileImage,
            title: type === 'edit' ? 'Edit Slot' : type === 'book' ? 'Book Slot' : name + ' (Patient)'
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

    const handleCancelBooking = async (slotId: string) => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/slot/v1/update_slot_status',
                {
                    slotId,
                    status: "cancel"
                }
            )
            console.log(res);
            // showSucessToast(res?.msg)
            showPopup("Booking cancelled", "Your booking has been Cancelled");
            updatePopupStatus("success", "Booking cancelled", "Your booking has been Cancelled", 4000);
            getList()

            // setData(res?.data)
            // setTotalCount(res?.count)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }
    }

    const getList = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/slot/v1/get_slot',
                {
                    startDate: dayjs().subtract(2, "month").format('YYYY-MM-DD'),
                    endDate: dayjs().add(2, "month").format('YYYY-MM-DD'),
                    page: currentPage,
                    limit: pageSize,
                    slotView: "list",
                    sortBy: "createdAt",
                    sortOrder: "desc"
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
    useEffect(() => {
        getList()
    }, [currentPage, pageSize, debouncedSearch])

    return (
        // <main className="pt-24 pl-20 p-6 w-[calc(100vw-1rem)]">
        <div className="bg-white">
            {/* This is carrier listing page */}

            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl md:text-2xl">List of Bookings </h1>
                <div className="flex items-center gap-3">
                    <Input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className="bg-primary w-[75%] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-900"
                        style={{ boxShadow: '0px 1px 2px 0px #1018280D' }}
                        onClick={() => openDrawer('book')}
                    >
                        <Plus size={16} />
                        <span>Book Slot</span>
                    </button>
                </div>
            </div>

            <DataTable
                data={data}
                columns={columns}
                actions={(row) => {
                    if (row.slotStatusLabel === "overdue" || row.slotStatusLabel === "cancel") {
                        return [] // no actions for these rows
                    }
                    return actions // otherwise show default actions
                }}
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
                onRowClick={(row) => {
                    setSelectedBooking(row._id);
                    openDrawer('details', row.clientName, row.clientProfileImage)
                }}
            // className="border rounded-lg"
            />
            <SideDrawer
                isOpen={drawerState.isOpen}
                onClose={closeDrawer}
                avatar={drawerState.avatar}
                title={drawerState.title}
            >
                {drawerState.type === 'book' ? <BookSlotContent onSuccess={() => {
                    closeDrawer();
                    getList();
                }} /> : drawerState.type == 'edit' ? <BookSlotContent slotId={selectedBooking} onSuccess={() => {
                    closeDrawer();
                    getList();
                }} /> : <BookingDetailsContent bookingId={selectedBooking} />}
            </SideDrawer>

            <ConfirmModal
                open={open}
                title="Are you sure to cancel?"
                message={
                    <>
                        This action <strong>cannot be undone</strong>. This will permanently cancel your slot.
                    </>
                }
                confirmText="Confirm"
                cancelText="Cancel"
                tone="danger"
                onConfirm={() => {
                    // alert("Deleted!");
                    handleCancelBooking(selectedBooking)
                    setOpen(false);
                }}
                onCancel={() => setOpen(false)}
            />

        </div>

    )
}
export default BookingComponent;