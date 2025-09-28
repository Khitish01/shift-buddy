import { useEffect, useState } from "react";
import { ColumnDefinition, DataTable } from "../common/DataTable";
import { useTopLoader } from "@/context/TopLoader";
import { apiCall } from "@/lib/apiCall";
import { adminClient } from "@/lib/apiClient";
import dayjs from "dayjs";

interface CarerProps {
    carrier: any;
}

export const AttendanceHistory: React.FC<CarerProps> = ({ carrier }) => {

    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [timesheetData, setTimesheetData] = useState<any[]>([]);
    const [stats, setStats] = useState<any>();
    const [loading, setLoading] = useState(false);
    const loader = useTopLoader()
    const overtimeColumns: ColumnDefinition[] = [
        { key: "date", label: "Date", type: "text", sortable: false },
        { key: "scheduled", label: "Scheduled Hours", type: "text", sortable: false },
        { key: "worked", label: "Worked Hours", type: "text", sortable: false },
        { key: "overtime", label: "Overtime Hours", type: "text", sortable: false },
        { key: "status", label: "Status", type: "badge", sortable: false }
    ];

    const timesheetColumns: ColumnDefinition[] = [
        { key: "date", label: "Date", type: "date", sortable: false },
        { key: "participant", label: "Participant", type: "text", sortable: false },
        { key: "time", label: "Time", type: "text", sortable: false },
        { key: "totalHours", label: "Total hours", type: "text", sortable: false },
        { key: "overTime", label: "Overtime", type: "text", sortable: false }
    ];

    const getList = async () => {
        setLoading(true)
        loader.showLoader()
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/timeSheet/v1/get_attendence_history',
                {
                    carrierId: carrier?.carrierId,
                    startDate: "",
                    endDate: "",
                    sortBy: "date",
                    sortOrder: "desc",
                }
            )
            console.log(res);

            const regularShiftsData: any[] = []
            res?.regularShifts.forEach((x: any) => {
                const loginTime = dayjs(`2000-01-01 ${x.loginTime}`, 'YYYY-MM-DD hh:mm').format('hh:mm A');
                const logoutTime = x.logoutTime ? dayjs(`2000-01-01 ${x.logoutTime}`, 'YYYY-MM-DD hh:mm').format('hh:mm A') : 'NA';
                x['time'] = `${loginTime} - ${logoutTime}`;
                
                if (x.loginTime && x.logoutTime) {
                    const login = dayjs(`2000-01-01 ${x.loginTime}`, 'YYYY-MM-DD HH:mm');
                    const logout = dayjs(`2000-01-01 ${x.logoutTime}`, 'YYYY-MM-DD HH:mm');
                    const diffHours = logout.diff(login, 'hour', true);
                    x['totalHours'] = `${diffHours.toFixed(1)}h`;
                } else {
                    x['totalHours'] = 'NA';
                }
                
                regularShiftsData.push(x)
            })
            const overtimeShiftsData: any[] = []
            res?.overtimeShifts.forEach((x: any) => {
                const loginTime = dayjs(`2000-01-01 ${x.loginTime}`, 'YYYY-MM-DD hh:mm').format('hh:mm A');
                const logoutTime = x.logoutTime ? dayjs(`2000-01-01 ${x.logoutTime}`, 'YYYY-MM-DD hh:mm').format('hh:mm A') : 'NA';
                x['time'] = `${loginTime} - ${logoutTime}`;
                
                if (x.loginTime && x.logoutTime) {
                    const login = dayjs(`2000-01-01 ${x.loginTime}`, 'YYYY-MM-DD HH:mm');
                    const logout = dayjs(`2000-01-01 ${x.logoutTime}`, 'YYYY-MM-DD HH:mm');
                    const diffHours = logout.diff(login, 'hour', true);
                    x['totalHours'] = `${diffHours.toFixed(1)}h`;
                } else {
                    x['totalHours'] = 'NA';
                }
                
                overtimeShiftsData.push(x)
            })


            setAttendanceData(overtimeShiftsData)
            setTimesheetData(regularShiftsData)
            setStats(res?.stats)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
            setLoading(false)
        }
    }
    useEffect(() => {
        getList()
    }, [])

    return (
        <div className="p-6 min-h-screen">
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-6">
                <div className="flex items-center gap-3">
                    <img
                        src={carrier?.carrier?.profileImage}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="font-semibold text-lg">{carrier?.carrier?.name}</h2>
                        <p className="text-gray-500 text-sm">{carrier?.carrier?.carrierId}</p>
                    </div>
                </div>
            </div>


            {/* Attendance Summary */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Attendance Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-[#69417E] font-semibold">{stats?.totalShifts}</span>
                        </div>
                        <p className="text-sm font-semibold">Total Shift</p>
                    </div>
                    <div className="bg-[#69417E] text-white p-4 rounded-lg text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-black font-bold">{stats?.totalHours}h</span>
                        </div>
                        {/* <div className="text-2xl font-bold mb-1">{stats?.totalHours}h</div> */}
                        <p className="">Total Hours</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-[#69417E] font-semibold">{stats?.overtimeShiftsCount}h</span>
                        </div>
                        <p className="text-sm font-semibold">Overtime Hours (Total)</p>
                    </div>
                </div>
            </div>

            {/* Overtime History */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Overtime History</h3>
                <DataTable
                    data={attendanceData}
                    columns={overtimeColumns}
                    sortable={false}
                    paginated={false}
                    loading={false}
                    emptyMessage="No overtime records found" currentPage={0} pageSize={0} totalCount={0} />
            </div>

            {/* Timesheet History */}
            <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">Timesheet History</h3>
                <DataTable
                    data={timesheetData}
                    columns={timesheetColumns}
                    sortable={false}
                    paginated={false}
                    loading={false}
                    emptyMessage="No timesheet records found" currentPage={0} pageSize={0} totalCount={0} />
            </div>
        </div>
    );
}