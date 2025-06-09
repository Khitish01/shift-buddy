import { Calendar, BarChart3, Users, UserCheck, DollarSign } from "lucide-react"

const Dashboard = () => {
    const carersData = [
        { name: 'Liam Smith', id: '000989', income: 86789, shifts: 568, type: 'Full-Time' },
        { name: 'Noah Johnson', id: '007890', income: 345, shifts: 760, type: 'Part-Time' },
        { name: 'James Brown', id: '005648', income: 7890, shifts: 23, type: 'Part-Time' }
    ];

    const shiftData = [
        { id: 'OL678057', vehicle: 'BMW', carer: 'William Garcia', payment: '$560' },
        { id: 'OL678057', vehicle: 'BMW', carer: 'Lucas Davis', payment: '$658' },
        { id: 'OL678057', vehicle: 'BMW', carer: 'Mia Davis', payment: '$980' }
    ];
    return (
        // <main className="pt-24 pl-20 p-6 w-[calc(100vw-1rem)]">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Dashboard</h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>2023 - 2024</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">7,30,456</p>
                                <p className="text-gray-600 text-sm">Total Bookings</p>
                            </div>
                            <BarChart3 className="text-blue-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">2,456</p>
                                <p className="text-gray-600 text-sm">Total Participant</p>
                            </div>
                            <Users className="text-orange-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">200</p>
                                <p className="text-gray-600 text-sm">Total Carers</p>
                            </div>
                            <UserCheck className="text-purple-500" size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">24</p>
                                <p className="text-gray-600 text-sm">Total Income</p>
                            </div>
                            <DollarSign className="text-green-500" size={24} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Carer List */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Carer List</h3>
                                <button className="text-purple-600 text-sm font-medium">View All</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
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
                            </table>
                        </div>
                    </div>

                    {/* Active Carers Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                                <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-purple-500 border-t-transparent border-r-transparent transform rotate-45"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold">46</span>
                                </div>
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
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Total Income by month</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar size={16} />
                                <span>2023 - 2024</span>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => (
                                <div key={month} className="flex flex-col items-center space-y-2">
                                    <div className="w-8 bg-purple-500 rounded-t" style={{ height: `${Math.random() * 120 + 40}px` }}></div>
                                    <span className="text-xs text-gray-600">{month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shift List */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Shift List</h3>
                                <button className="text-purple-600 text-sm font-medium">View All</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
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
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        // </main>
    )
}
export default Dashboard