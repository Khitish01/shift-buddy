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
import { AddVehicle } from "./AddVehicle";
import { VehicleDetails } from "./VehicleDetails";

const VehicleComponent = () => {
    const [data, setData] = useState<any[]>([]);
    const { showPopup, updatePopupStatus } = usePopup();
    const [loading, setLoading] = useState(false);
   
    const [search, setSearch] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
   

    const [selectedVehicle, setSelectedVehicle] = useState<any>();
    const [selectedAction, setSelectedActione] = useState<string>('');

    const [open, setOpen] = useState(false);
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        type: 'book', // 'book' or 'details' or 'career'
        avatar: '',
        title: ''
    });
    // Column definitions
    const columns: ColumnDefinition[] = [
        {
            key: "registrationNo",
            label: "Registration No.",
            type: "text",
            sortable: false,
            width: "120px",
        },
        {
            key: "vehicleImage",
            label: "Img",
            type: "image",
            sortable: true,
        },
        {
            key: "modelName",
            label: "Model Name",
            type: "text",
            sortable: true,
        },
        {
            key: "onboardDate",
            label: "Onboard Date",
            type: "date",
            sortable: true,
        },
        {
            key: "assignee.name",
            label: "Assignee",
            type: "text",
            sortable: false,
        },
        {
            key: "assignee.mobileNumber",
            label: "Assignee Contact",
            type: "text",
            sortable: false,
        },
        {
            key: "status",
            label: "Status",
            type: "badge",
            sortable: false,
            badgeColorMap: {
                "Active": "text-[#1F9254] bg-[#EBF9F1]",
                "Inactive": "text-[#FF8285] bg-[#FBE7E8]"
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
    const actions : TableAction[] = [
        {
            id: "inactive",
            label: "Inactive",
            icon: <Ban className="h-4 w-4 text-gray-500" />,
            onClick: (row) => {
                setOpen(true)
                setSelectedActione('inactive')
                setSelectedVehicle(row)
            },
            variant: "ghost",
        },
        {
            id: "edit",
            label: "Edit",
            icon: <Edit className="h-4 w-4 " />,
            onClick: (row) => {
                setSelectedVehicle(row)
                openDrawer('edit', row.registrationNo)
            },
            variant: "ghost",
        },
        {
            id: "delete",
            label: "Delete",
            icon: <Trash2 className="h-4 w-4 text-red-500" />,
            onClick: (row) => {
                setSelectedVehicle(row)
                setSelectedActione('delete')
                setOpen(true)
            },
            variant: "ghost",
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
            title: type === 'edit' ? 'Edit Vehicle' : type === 'book' ? 'Add Vehicle' : "View Vehicle logs (" + name + ")"
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
        setLoading(true)
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/vehicle/v1/vehicleList',
                {
                    page: currentPage,
                    limit: pageSize,
                    search: debouncedSearch,
                    sortBy: "createdAt",
                    sortOrder: "desc",
                }
            )
            console.log(res);
           
            setData(res?.data)
            setTotalCount(res?.total)
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


    const deleteVehicle = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/vehicle/v1/deleteVehicle',
                {
                    vehicleId: selectedVehicle._id
                }
            )
            console.log(res);
            // showSucessToast(res?.msg)
            showPopup(`Deleted Successfully`, `This vehicle has been deleted successfully`);
            updatePopupStatus("success", `Deleted Successfully`, `This vehicle has been deleted successfully`, 4000);
            getList()
        } catch (error) {
            console.error('Error setting role:', error)
            showPopup(`Something went wrong`, `Your booking has not been Cancelled`);
            updatePopupStatus("error", `Something went wrong`, `Your booking has not been Cancelled`, 4000);
        } finally {
            loader.hideLoader()
        }
    }

    const changeVehicleStatus = async () => {
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/vehicle/v1/updateVehicle',
                {
                    vehicleId: selectedVehicle._id,
                    status: selectedVehicle.status == 'Active' ? 'Inactive' : 'Active'
                }
            )
            console.log(res);
            // showSucessToast(res?.msg)
            showPopup(`Vehicle ${selectedVehicle.status == 'Active' ? 'Inactived' : 'Actived'}`, `This Vehicle has been ${selectedVehicle.status == 'Active' ? 'Inactived' : 'Actived'}`);
            updatePopupStatus("success", `Vehicle ${selectedVehicle.status == 'Active' ? 'Inactived' : 'Actived'}`, `This Vehicle has been ${selectedVehicle.status == 'Active' ? 'Inactived' : 'Actived'}`, 4000);
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
                <h1 className="font-semibold text-xl md:text-2xl">Vehicle Listing</h1>
                <div className="flex items-center gap-3">
                    <Input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className="bg-primary w-[75%] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-900"
                        style={{ boxShadow: '0px 1px 2px 0px #1018280D' }}
                        onClick={() => openDrawer('book')}
                    >
                        <Plus size={16} />
                        <span>Add Vehicle</span>
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
                emptyMessage="No vehicles found"
                onRowClick={(row) => {
                    setSelectedVehicle(row)
                    console.log(row);

                    openDrawer('details', row.registrationNo)
                }}
            />

            <SideDrawer
                isOpen={drawerState.isOpen}
                onClose={closeDrawer}
                avatar={drawerState.avatar}
                title={drawerState.title}
            >
                {drawerState.type === 'book' ? <AddVehicle onSuccess={() => {
                    closeDrawer();
                    getList();
                }} /> : drawerState.type == 'edit' ? <AddVehicle vehicle={selectedVehicle} onSuccess={() => {
                    closeDrawer();
                    getList();
                }} /> : <VehicleDetails selectedVehicle={selectedVehicle} />}
            </SideDrawer>


            <ConfirmModal
                open={open}
                title={`Are you sure to ${selectedAction == 'delete' ? 'Delete' : selectedVehicle?.status == 'Active' ? 'Inactive' : 'Active'}?`}
                message={
                    <>
                        This action <strong>cannot be undone</strong>. This will {selectedAction == 'delete' ? 'Delete' : selectedVehicle?.status == 'Active' ? 'Inactive' : 'Active'} the vehicle.
                    </>
                }
                confirmText="Confirm"
                cancelText="Cancel"
                tone="danger"
                onConfirm={() => {
                    // alert("Deleted!");
                    if (selectedAction == 'delete') {

                        deleteVehicle()
                    } else {
                        changeVehicleStatus()
                    }
                    setOpen(false);
                }}
                onCancel={() => setOpen(false)}
            />

        </div>

    )
}
export default VehicleComponent;