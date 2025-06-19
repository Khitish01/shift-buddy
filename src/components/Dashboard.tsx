'use client'
import { Calendar, BarChart3, Users, UserCheck, DollarSign } from "lucide-react"
import BarChart from "./DashboardBarchart";
import DonutChart from "./DashboardDonutchart";
import { Column } from "@/types/table";
import { CellRenderers, TableActions } from "./table-actions";
import { ColumnDefinition, DataTable } from "./DataTable";
import { useState } from "react";

const sampleData = [
    {
        id: '000989',
        name: 'Liam Smith',
        totalIncome: 86789,
        totalShift: 568,
        jobType: 'Full-Time'
    },
    {
        id: '007890',
        name: 'Noah Johnson',
        totalIncome: 345,
        totalShift: 760,
        jobType: 'Part-Time'
    },
    {
        id: '005648',
        name: 'James Brown',
        totalIncome: 7890,
        totalShift: 23,
        jobType: 'Part-Time'
    },
    // {
    //     id: '001234',
    //     name: 'Emma Wilson',
    //     totalIncome: 95000,
    //     totalShift: 480,
    //     jobType: 'Full-Time'
    // },
    // {
    //     id: '002456',
    //     name: 'Oliver Davis',
    //     totalIncome: 12500,
    //     totalShift: 320,
    //     jobType: 'Part-Time'
    // },
    // {
    //     id: '003789',
    //     name: 'Ava Miller',
    //     totalIncome: 78000,
    //     totalShift: 520,
    //     jobType: 'Full-Time'
    // }
];
const mockData = [
    {
        id: "20462",
        carerId: "#20462",
        img: "/placeholder.svg?height=40&width=40",
        name: "Matt Dickerson",
        joiningDate: "2022-05-13",
        totalShift: 189,
        mobileNo: "9098765678",
        status: "active",
    },
    {
        id: "18933",
        carerId: "#18933",
        img: "/placeholder.svg?height=40&width=40",
        name: "Wiktoria",
        joiningDate: "2022-05-22",
        totalShift: 263,
        mobileNo: "9098765678",
        status: "active",
    },
    {
        id: "45169",
        carerId: "#45169",
        img: "/placeholder.svg?height=40&width=40",
        name: "Trixie Byrd",
        joiningDate: "2022-06-15",
        totalShift: 45,
        mobileNo: "9098765678",
        status: "active",
    },
    // {
    //     id: "34304",
    //     carerId: "#34304",
    //     img: "/placeholder.svg?height=40&width=40",
    //     name: "Brad Mason",
    //     joiningDate: "2022-09-06",
    //     totalShift: 86,
    //     mobileNo: "9098765678",
    //     status: "active",
    // },
    // {
    //     id: "17188",
    //     carerId: "#17188",
    //     img: "/placeholder.svg?height=40&width=40",
    //     name: "Sanderson",
    //     joiningDate: "2022-09-25",
    //     totalShift: 90,
    //     mobileNo: "9098765678",
    //     status: "inactive",
    // },
    // {
    //     id: "73003",
    //     carerId: "#73003",
    //     img: "/placeholder.svg?height=40&width=40",
    //     name: "Jun Redfern",
    //     joiningDate: "2022-10-04",
    //     totalShift: 13,
    //     mobileNo: "9098765678",
    //     status: "active",
    // },
    // {
    //     id: "58825",
    //     carerId: "#58825",
    //     img: "/placeholder.svg?height=40&width=40",
    //     name: "Miriam Kidd",
    //     joiningDate: "2022-10-17",
    //     totalShift: 177,
    //     mobileNo: "9098765678",
    //     status: "active",
    // },
    // {
    //     id: "44122",
    //     carerId: "#44122",
    //     img: "/placeholder.svg?height=40&width=40",
    //     name: "Dominic",
    //     joiningDate: "2022-10-24",
    //     totalShift: 245,
    //     mobileNo: "9098765678",
    //     status: "active",
    // },
    // {
    //     id: "89094",
    //     carerId: "#89094",
    //     img: "/placeholder.svg?height=40&width=40",
    //     name: "Shanice",
    //     joiningDate: "2022-11-01",
    //     totalShift: 679,
    //     mobileNo: "9098765678",
    //     status: "inactive",
    // },
    // {
    //     id: "85252",
    //     carerId: "#85252",
    //     img: "/placeholder.svg?height=40&width=40",
    //     name: "Poppy-Rose",
    //     joiningDate: "2022-11-22",
    //     totalShift: 387,
    //     mobileNo: "9098765678",
    //     status: "inactive",
    // },
]

type Employee = typeof sampleData[0];

const Dashboard = () => {
    const carersData = [
        { name: 'Liam Smith', id: '000989', income: 86789, shifts: 568, type: 'Full-Time' },
        { name: 'Noah Johnson', id: '007890', income: 345, shifts: 760, type: 'Part-Time' },
        { name: 'James Brown', id: '005648', income: 7890, shifts: 23, type: 'Part-Time' }
    ];

    const [data, setData] = useState(sampleData);
    const [loading, setLoading] = useState(false);

    const shiftData = [
        { id: 'OL678057', vehicle: 'BMW', carer: 'William Garcia', payment: '$560' },
        { id: 'OL678057', vehicle: 'BMW', carer: 'Lucas Davis', payment: '$658' },
        { id: 'OL678057', vehicle: 'BMW', carer: 'Mia Davis', payment: '$980' }
    ];

    const columns: ColumnDefinition[] = [
        {
            key: "carerId",
            label: "Carer ID",
            type: "text",
            sortable: false,
            width: "120px",
        },
        {
            key: "img",
            label: "Img",
            type: "image",
            sortable: false,
            width: "80px",
        },
        {
            key: "name",
            label: "Name",
            type: "text",
            sortable: true,
        },
        {
            key: "joiningDate",
            label: "Joining Date",
            type: "date",
            sortable: true,
        },
        {
            key: "totalShift",
            label: "Total Shift",
            type: "number",
            sortable: true,
        },
        {
            key: "mobileNo",
            label: "Mobile No.",
            type: "text",
            sortable: false,
        },
        {
            key: "status",
            label: "Status",
            type: "badge",
            sortable: true,
            badgeColorMap: {
                active: "default",
                inactive: "destructive",
            },
        },
    ];

    // Define actions for each row
    const actions = [
        TableActions.viewAction<Employee>((row) => {
            // toast({
            //     title: "View Employee",
            //     description: `Viewing details for ${row.name} (ID: ${row.id})`
            // });
        }),
        TableActions.editAction<Employee>((row) => {
            // toast({
            //     title: "Edit Employee",
            //     description: `Editing ${row.name}'s information`
            // });
        }),
        TableActions.deleteAction<Employee>((row) => {
            // toast({
            //     title: "Delete Employee",
            //     description: `Are you sure you want to delete ${row.name}?`,
            //     variant: "destructive"
            // });
        })
    ];
    return (
        // <main className="pt-24 pl-20 p-6 w-[calc(100vw-1rem)]">
        <div className="space-y-4 bg-[#fafafa] p-5 m-[-20px]">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-600 bg-white ">
                    <Calendar size={16} />
                    <span>2023 - 2024</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <BarChart3 className="text-blue-500" size={24} />
                            <div>
                                <p className="text-2xl font-bold " style={{ lineHeight: '23px' }}>7,30,456</p>
                                <p className="text-gray-600 text-sm mt-3">Total Bookings</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <Users className="text-orange-500" size={24} />
                            <div>
                                <p className="text-2xl font-bold" style={{ lineHeight: '23px' }}>2,456</p>
                                <p className="text-gray-600 text-sm mt-3">Total Participant</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <UserCheck className="text-purple-500" size={24} />
                            <div>
                                <p className="text-2xl font-bold" style={{ lineHeight: '23px' }}>200</p>
                                <p className="text-gray-600 text-sm mt-3">Total Carers</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <DollarSign className="text-green-500" size={24} />

                            <div>
                                <p className="text-2xl font-bold" style={{ lineHeight: '23px' }}>24</p>
                                <p className="text-gray-600 text-sm mt-3">Total Income</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Carer List */}
                <div className="lg:col-span-2 bg-white rounded-lg ">
                    <div className="p-6 pb-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Carer List</h3>
                            <button className="text-primary underline text-sm font-medium">View All</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        {/* <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Income</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Shift</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {carersData.map((carer, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{carer.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{carer.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{carer.income.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{carer.shifts}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{carer.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> */}

                        <div className="p-4 pt-0">
                            <DataTable
                                data={mockData}
                                columns={columns}
                                actions={[]}
                                // searchable={false}
                                // searchPlaceholder="Search employees..."
                                sortable={false}
                                paginated={false} // Pagination is enabled
                                pageSize={5}
                                loading={loading}
                                emptyMessage="No employees found. Add some employees to get started."
                                className="bg-white rounded-lg " currentPage={1} totalCount={3}                            />
                        </div>
                    </div>
                </div>

                {/* Active Carers Chart */}
                <div className="bg-white p-6 rounded-lg ">
                    <div className="flex flex-col items-center">
                        <div className="relative  mb-4">
                            {/* <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-purple-500 border-t-transparent border-r-transparent transform rotate-45"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold">46</span>
                            </div> */}
                            <DonutChart />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">46/90</p>
                            <p className="text-sm text-gray-600">Active Carers</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Chart */}
                <div className="bg-white p-6 rounded-lg ">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Total Income by month</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 px-3 py-2 rounded-lg bg-[#FBF4FF]">
                            <Calendar size={16} />
                            <span>2023 - 2024</span>
                        </div>
                    </div>
                    <div className="flex items-end justify-between space-x-2">
                        {/* {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => (
                                <div key={month} className="flex flex-col items-center space-y-2">
                                    <div className="w-8 bg-purple-500 rounded-t" style={{ height: `${Math.random() * 120 + 40}px` }}></div>
                                    <span className="text-xs text-gray-600">{month}</span>
                                </div>
                            ))} */}
                        <BarChart />
                    </div>
                </div>

                {/* Shift List */}
                <div className="bg-white rounded-lg ">
                    <div className="p-6 pb-1">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Shift List</h3>
                            <button className="text-primary underline text-sm font-medium">View All</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        {/* <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {shiftData.map((shift, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.vehicle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shift.carer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{shift.payment}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> */}
                        <div className="p-4 pt-0">
                            <DataTable
                                data={mockData}
                                columns={columns}
                                actions={[]}
                                // searchable={false}
                                // searchPlaceholder="Search employees..."
                                sortable={false}
                                paginated={false} // Pagination is enabled
                                pageSize={5}
                                loading={loading}
                                emptyMessage="No employees found. Add some employees to get started."
                                className="bg-white rounded-lg " currentPage={1} totalCount={1}                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // </main>
    )
}
export default Dashboard