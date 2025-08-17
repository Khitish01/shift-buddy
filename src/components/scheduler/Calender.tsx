'use client'

import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { BarChart3, Calendar, ChevronDown, ChevronLeft, ChevronRight, DollarSign, Plus, Search, UserCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import NoBookings from "../common/NoData";
import { SideDrawer } from "../common/SIdeDrawer";
import { BookSlotContent } from "./SlotBooking";
import { BookingDetailsContent } from "./BookingDetails";
import CarerProfilePage from "../carrier/CareerProfile";
import CalendarPage from "../carrier/CarrerprofileDetails";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTopLoader } from "@/context/TopLoader";
import { apiCall } from "@/lib/apiCall";
import { adminClient } from "@/lib/apiClient";
import { AddCarer } from "../carrier/AddCarer";
dayjs.extend(isSameOrBefore);


const colorPalette = [
    "bg-purple-500",
    "bg-pink-400",
    "bg-yellow-400",
    "bg-orange-300",
    "bg-green-400",
    "bg-blue-400",
    "bg-indigo-400",
    "bg-red-400",
];

const getColorForName = (name: any) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorPalette[Math.abs(hash) % colorPalette.length];
};


const Calender = () => {
    const [activeView, setActiveView] = useState('schedule');
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedBooking, setSelectedBooking] = useState<string>('');
    const [currentDate] = useState(dayjs());
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [selectedDayCalender, setSelectedDayCalender] = useState<dayjs.Dayjs>(dayjs())
    const [dates, setDates] = useState<any[]>([]);
    const isMobile = useIsMobile();
    const loader = useTopLoader();
    const [showSidebarMobile, setShowSidebarMobile] = useState(false);
    const [drawerState, setDrawerState] = useState({
        isOpen: false,
        type: 'book', // 'book' or 'details' or 'career'
        avatar: '',
        title: ''
    });

    const employees = [
        { id: 1, name: 'Emily Harrington', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face' },
        { id: 2, name: 'Leo Carter', avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face' },
        { id: 3, name: 'William Garcia', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face' },
        { id: 4, name: 'Lucas Davis', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop&crop=face' },
    ];

    const assignees: any = [
        { name: 'Emma Watson' },
        { name: 'John Smith' },
        { name: 'Michael Johnson' },
        { name: 'Ana Lee' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Daniel Miller' },
        { name: 'Joseph Harris' }
    ];

    // const carrierId = useParams()
    const carrierId = useParams(); // for [id]
    const searchParams = useSearchParams(); // for query string

    const id = carrierId.id;
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const carerName = searchParams.get('name');


    useEffect(() => {
        console.log(id);
        console.log(status);
        console.log(date);
        if (id) {

            setSelectedDayCalender(dayjs(date, 'YYYY-MM-DD'))
        }
        // console.log(carrierId);

    }, [id])

    useEffect(() => {
        getDaysInMonth(selectedMonth)
    }, [])

    const getDaysInMonth = (date: string | dayjs.Dayjs) => {
        const month = dayjs(date); // Accepts "YYYY-MM" or a Dayjs object
        const startOfMonth = month.startOf('month');
        const totalDays = month.daysInMonth();

        const datesArray = Array.from({ length: totalDays }, (_, i) =>
            startOfMonth.add(i, 'day').format('YYYY-MM-DD')
        );

        setDates(datesArray); // or return datesArray if needed
    };

    const handlePrevMonth = () => {
        const newMonth = selectedMonth.subtract(1, 'month');
        setSelectedMonth(newMonth);
        getDaysInMonth(newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = selectedMonth.add(1, 'month');
        setSelectedMonth(newMonth);
        getDaysInMonth(newMonth);
    };



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
            title: type === 'career' ? '' : type === 'book' ? 'Book Slot' : name + ' (Patient)'
        });
    };


    const closeDrawer = () => {
        setDrawerState(prev => ({ ...prev, isOpen: false }));

        // setCalenderDrawer(false)

    };
    const closeCalenderDrawer = () => {
        // setDrawerState(prev => ({ ...prev, isOpen: false }));

        setCalenderDrawer(false)

    };
    const [calenderDrawer, setCalenderDrawer] = useState<boolean>(false);
    const [editCarer, setEditCarer] = useState<boolean>(false);
    // const openCalendarDrawer = () => {
    //     setCalederDrawer(true)
    // }
    const generateTimeSlots = (
        startTime = '00:00',
        endTime = '23:59',
        intervalMinutes = 30
    ) => {
        const slots: string[] = [];
        let current = dayjs(`2024-01-01 ${startTime}`);
        const end = dayjs(`2024-01-01 ${endTime}`);

        while (current.isBefore(end)) {
            slots.push(current.format('HH:mm'));
            current = current.add(intervalMinutes, 'minute');
        }

        // Force add the final end time if it's not already in the array
        if (slots[slots.length - 1] !== end.format('HH:mm')) {
            slots.push(end.format('HH:mm'));
        }
        // console.log(slots);

        return slots;
    };
    const timeSlots = generateTimeSlots();

    const [scheduleData, setScheduleData] = useState<any[]>([]);

    const getSlots = async () => {
        loader.showLoader()
        let payload = {
            startDate: dayjs(selectedDayCalender).format('YYYY-MM-DD'),
            endDate: dayjs(selectedDayCalender).format('YYYY-MM-DD'),
            page: 1,
            limit: 10,
            slotView: 'calendar',
            sortBy: 'createdAt',
            sortOrder: 'asc'
        }
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/slot/v1/get_slot', payload)
            console.log(res);
            setScheduleData(res?.data)
            // setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }

    }
    const getSlotByCarer = async () => {
        loader.showLoader()
        let payload = {
            startDate: dayjs(selectedDayCalender).format('YYYY-MM-DD'),
            endDate: dayjs(selectedDayCalender).format('YYYY-MM-DD'),
            // page: 1,
            // limit: 10,
            slotView: 'calendar',
            // sortBy: 'createdAt',
            // sortOrder: 'asc',
            status: status,
            carrierId: id
        }
        try {
            const res = await apiCall<any>(adminClient, 'POST', '/slot/v1/get_carrier_slot_with_status', payload)
            console.log(res);
            setScheduleData(res?.data)
            // setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }

    }
    const [assignee, setAssignee] = useState<any[]>([]);
    const assigneesWithColors = useMemo(
        () =>
            assignee.map((a: any) => ({
                ...a,
                color: getColorForName(a.name),
            })),
        [assignee]
    );

    const getCarer = async () => {
        loader.showLoader()
        try {
            let payload = {
                date: dayjs(selectedDayCalender).format('YYYY-MM-DD'),
                carrierType: activeTab
            }
            const res = await apiCall<any>(adminClient, 'POST', '/carrier/v1/get_today_carrier', payload)
            console.log(res);
            setAssignee(res?.data)
            // setTotalCount(res?.total)
        } catch (error) {
            console.error('Error setting role:', error)
        } finally {
            loader.hideLoader()
        }

    }
    const [search, setSearch] = useState('');
    const [selectedCarrier, setSelectedCarrier] = useState<any>();
    const [filteredAssignees, setFilteredAssignees] = useState<any[]>([]);

    useEffect(() => {
        const result = assigneesWithColors.filter((x: any) =>
            x.name.toLowerCase().includes(search.toLowerCase()) // case-insensitive
        );
        setFilteredAssignees(result);
    }, [search, assigneesWithColors]);

    useEffect(() => {
        if (!id) {
            getSlots();
            getCarer();
        }
        else {
            getSlotByCarer()
        }
    }, [selectedDayCalender])
    useEffect(() => {

        getCarer();

    }, [activeTab])


    return (
        // <main className="pt-24 pl-20 p-6 w-[calc(100vw-1rem)]">
        <div>
            <div className="flex items-center justify-between bg-[#fafafa] p-5 m-[-20px] mb-[-8px]">
                <div className="flex items-center space-x-4 ">

                    <div>
                        <h2 className="text-xl font-semibold">{dayjs(selectedDayCalender).format('MMMM D, YYYY')}</h2>
                        <p className="text-gray-500">{dayjs(selectedDayCalender).format('dddd')}</p>
                    </div>

                </div>
                {carrierId.id && <div className="font-semibold text-xl">{carerName}(carer) - {status}</div>}
                <div className="flex gap-4">
                    <div className="flex gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-lg border border-[#E4E7EC]"
                            onClick={() => setSelectedDayCalender(prev => dayjs(prev).add(-1, 'd'))}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg border border-[#E4E7EC]"
                            onClick={() => setSelectedDayCalender(prev => dayjs(prev).add(1, 'd'))}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    {!carrierId.id && <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-900"
                        style={{ boxShadow: '0px 1px 2px 0px #1018280D' }}
                        onClick={() => openDrawer('book')}
                    >
                        <span>Book Slot</span>
                        <Plus size={16} />
                    </button>}
                </div>
            </div>
            <div className="flex gap-6 border border-r-0 border-t-[#E4E7EC] bg-white">
                {/* Schedule Content */}

                <div className="flex-1">


                    {/* Time Slots */}
                    <div className="bg-white rounded-lg shadow-sm overflow-auto max-h-screen custom-scrollbar">
                        {timeSlots.map((time, index) => (
                            <div key={time} className="flex ">
                                <div className="w-20 pb-4 px-4 text-sm border-r border-[#E2E2E2]">
                                    <div className="font-medium text-[#3A3A3A]">{dayjs(time, "HH:mm").format("hh:mm")}</div>
                                    <div className="text-xs text-[#8C8C8C]">{dayjs(time, "HH:mm").format("A")}</div>
                                </div>
                                <div className="flex-1 py-4 px-4 border-b border-gray-100 " onClick={() => {
                                    if (!carrierId.id) {

                                        openDrawer('book')
                                    }
                                }}>
                                    <div className="flex flex-wrap gap-4">
                                        {(() => {
                                            const filtered = scheduleData.filter(item => item.startTime === time);
                                            const count = filtered.length;


                                            const getWidthClass = () => {
                                                if (count === 1) return 'w-full';
                                                if (count === 2) return 'w-[48%]';
                                                return 'w-[calc(95%/3)]'; // for 3 or more
                                            };

                                            return filtered.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`${getWidthClass()} bg-purple-50 p-3 rounded-full border border-purple-100`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedBooking(item._id);
                                                        openDrawer('details', item.clientName, item.clientProfileImage);
                                                    }}
                                                >
                                                    <div className="flex items-center space-x-5">
                                                        <img
                                                            src={item.clientProfileImage || '/images/default-avatar.png'}
                                                            alt={item.employee}
                                                            className="w-12 h-12 rounded-full"
                                                        />
                                                        <div className="flex flex-col gap-1">
                                                            <div className="font-medium text-sm">{item.clientName}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.startTime + ' - ' + item.endTime}
                                                            </div>
                                                            <div className="font-semibold text-xs bg-[#69417E14] text-black rounded-2xl py-1 px-2 pl-0 flex items-center gap-2">
                                                                <span className="text-white bg-primary p-1 rounded-full text-[9px]">
                                                                    {item.carrierName
                                                                        .split(' ')
                                                                        .map((x: any) => x.charAt(0))
                                                                        .join('')
                                                                        .toUpperCase()}
                                                                </span>
                                                                <span>{item.carrierName}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ));
                                        })()}

                                        {/* Show no bookings */}
                                        {scheduleData.filter(item => item.startTime === time).length === 0 && (
                                            <div className="w-full py-8 text-center text-gray-400 text-sm">
                                                <img src="/images/no-booking.svg" alt="No Bookings" />
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                {isMobile && showSidebarMobile && (
                    <div
                        className="fixed inset-0 bg-opacity-30 z-30"
                        onClick={() => setShowSidebarMobile(false)}
                    />
                )}
                <div
                    className={`space-y-6 transition-transform duration-300 ease-in-out
    ${isMobile
                            ? `fixed top-0 right-0 z-40 p-5 pt-2 bg-white h-full w-[75%] shadow-lg transform ${showSidebarMobile ? 'translate-x-0' : 'translate-x-full'
                            }`
                            : 'w-80'
                        }`}
                >
                    {/* Calendar */}
                    <div className="mt-4 p-4 rounded-t-lg shadow-sm" style={{
                        backgroundImage: 'url(/images/calendar-bg.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '100%',
                    }}>
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={handlePrevMonth} className="hover:bg-gray-100 rounded-full p-1"><ChevronLeft size={16} /></button>
                            <h3 className="font-medium">{selectedMonth.format('MMMM YYYY')}</h3>
                            <button onClick={handleNextMonth} className="hover:bg-gray-100 rounded-full p-1"><ChevronRight size={16} /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-3 text-center text-xs">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="py-2 font-medium text-gray-500">{day}</div>
                            ))}
                            {dates.map((day, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedDayCalender(dayjs(day, 'YYYY-MM-DD'))}
                                    className={`py-2 ${day ? 'hover:bg-[#FFFFFF] cursor-pointer rounded-full' : ''} ${dayjs(day, 'YYYY-MM-DD').isSame(selectedDayCalender, 'day') ? 'bg-[#FFFFFF] rounded-full ' : ''
                                        }`}
                                    style={dayjs(day, 'YYYY-MM-DD').isSame(selectedDayCalender, 'day') ? { boxShadow: '0px 2px 14px 0px #00000014' } : {}}
                                >
                                    {dayjs(day, 'YYYY-MM-DD').get('D')}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Assignee */}
                    {!carrierId.id && (
                        <div>
                            {/* Header with tabs */}
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Assign available worker:</h3>
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-6 mt-6 border-b border-gray-200">
                                {[{ name: 'All', key: 'ALL' }, { name: 'Available', key: 'A' }, { name: 'Unavailable', key: 'NA' }].map((tab) => (
                                    <button
                                        key={tab.key}
                                        className={`pb-2 text-sm font-medium relative ${activeTab === tab.key ? 'text-primary' : 'text-gray-500'
                                            }`}
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        {tab.name}
                                        {activeTab === tab.key && (
                                            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"></span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative mt-4 mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Type to search"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* All workers */}
                            {filteredAssignees.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3 overflow-auto  custom-scrollbar max-h-72">
                                    {filteredAssignees.map((assignee: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-1.5 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition"
                                            onClick={() => {
                                                setSelectedCarrier(assignee)
                                                openDrawer('career')
                                            }}
                                        >
                                            <div
                                                className={`p-1 h-6 w-6 rounded-full ${assignee.color} flex items-center justify-center text-white text-[10px] font-medium`}
                                            >
                                                {assignee.name.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                                            </div>
                                            <span title={assignee.name} className="text-[12px] whitespace-nowrap overflow-hidden  text-ellipsis max-w-16">{assignee.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center items-center">No Carer Found</div>
                            )}
                        </div>

                    )}
                </div>

            </div>
            {isMobile && (
                <button
                    className="fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-purple-900 transition"
                    onClick={() => setShowSidebarMobile(prev => !prev)}
                >
                    {showSidebarMobile ? <ChevronRight size={20} /> : <Calendar size={20} />}
                </button>
            )}
            {/* Side Drawer */}
            <SideDrawer
                isOpen={drawerState.isOpen}
                onClose={closeDrawer}
                avatar={drawerState.avatar}
                title={drawerState.title}
            >
                {drawerState.type === 'book' ? <BookSlotContent onSuccess={() => {
                    closeDrawer();
                    getSlots();
                }} /> : drawerState.type === 'career' ? <CarerProfilePage OpenEditView={ ()=>setEditCarer(true)} carrierId={selectedCarrier?.carrierId} OpenCalendarView={() => setCalenderDrawer(true)} /> : <BookingDetailsContent bookingId={selectedBooking} />}
            </SideDrawer>
            <SideDrawer
                isOpen={calenderDrawer}
                onClose={closeCalenderDrawer}
                avatar={''}
                title={''}
                width={'75%'}
            >
                <CalendarPage carrierId={selectedCarrier?._id} carrierName={selectedCarrier?.name} />
            </SideDrawer>
            <SideDrawer
                isOpen={editCarer}
                onClose={() => setEditCarer(false)}
                avatar={''}
                title={'Edit Carer/Staff'}
                // width={'75%'}
            >
                <AddCarer carerId={selectedCarrier?.carrierId} onSuccess={() => {
                    setEditCarer(false)
                    // getList();
                }} />
            </SideDrawer>
        </div>

    )
}

export default Calender;