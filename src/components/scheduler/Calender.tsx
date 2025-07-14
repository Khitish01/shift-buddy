'use client'

import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { BarChart3, Calendar, ChevronLeft, ChevronRight, DollarSign, Plus, Search, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import NoBookings from "../common/NoData";
import { SideDrawer } from "../common/SIdeDrawer";
import { BookSlotContent } from "./SlotBooking";
import { BookingDetailsContent } from "./BookingDetails";
import CarerProfilePage from "../carrier/CareerProfile";
import CalendarPage from "../carrier/CarrerprofileDetails";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
dayjs.extend(isSameOrBefore);

const Calender = () => {
    const [activeView, setActiveView] = useState('schedule');
    const [currentDate] = useState(dayjs());
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [selectedDayCalender, setSelectedDayCalender] = useState<dayjs.Dayjs>(dayjs())
    const [dates, setDates] = useState<any[]>([]);
    const isMobile = useIsMobile();
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

    const assignees = [
        { name: 'Emma Watson', color: 'bg-purple-500' },
        { name: 'John Smith', color: 'bg-orange-500' },
        { name: 'Michael Johnson', color: 'bg-blue-500' },
        { name: 'Ana Lee', color: 'bg-pink-500' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Daniel Miller', color: 'bg-gray-700' },
        { name: 'Joseph Harris', color: 'bg-yellow-500' }
    ];

    // const carrierId = useParams()
    const carrierId = useParams(); // for [id]
    const searchParams = useSearchParams(); // for query string

    const id = carrierId.id;
    const status = searchParams.get('status');
    const date = searchParams.get('date');


    useEffect(() => {
        console.log(id);
        console.log(status);
        console.log(date);
        // console.log(carrierId);

    }, [])

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
            title: type === 'career' ? '' : type === 'book' ? 'Book Slot' : name
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

        return slots;
    };
    const timeSlots = generateTimeSlots();

    const scheduleData = [
        { time: '00:00', employee: 'Emily Harrington', duration: '00:00 - 00:30 am', avatar: employees[0].avatar },
        { time: '00:00', employee: 'Leo Carter', duration: '00:00 - 00:30 am', avatar: employees[1].avatar },
        { time: '00:00', employee: 'Emily Harrington', duration: '00:00 - 00:30 am', avatar: employees[0].avatar },
        { time: '00:30', employee: 'Emily Harrington', duration: '00:30 - 01:00 am', avatar: employees[0].avatar },
        { time: '00:30', employee: 'Emily Harrington', duration: '08:30 - 01:00 am', avatar: employees[0].avatar },
        { time: '08:00', employee: 'Emily Harrington', duration: '08:00 - 08:30 am', avatar: employees[0].avatar },
        { time: '08:00', employee: 'Emily Harrington', duration: '08:00 - 08:30 am', avatar: employees[0].avatar },
        { time: '08:00', employee: 'Leo Carter', duration: '08:00 - 08:30 am', avatar: employees[1].avatar },
        { time: '08:00', employee: 'Emily Harrington', duration: '09:00 - 10:00 am', avatar: employees[0].avatar },
        { time: '08:30', employee: 'Leo Carter', duration: '08:00 - 08:30 am', avatar: employees[1].avatar },
        { time: '08:30', employee: 'Emily Harrington', duration: '08:00 - 08:30 am', avatar: employees[0].avatar },
        { time: '09:00', employee: 'Emily Harrington', duration: '09:00 - 10:00 am', avatar: employees[0].avatar },
        { time: '10:00', employee: 'Leo Carter', duration: '10:00 - 11:00 am', avatar: employees[1].avatar },
        { time: '10:00', employee: 'Leo Carter', duration: '10:00 - 11:00 am', avatar: employees[1].avatar }
    ];


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
                                    <div className="font-medium text-[#3A3A3A]">{time}</div>
                                    <div className="text-xs text-[#8C8C8C]">AM</div>
                                </div>
                                <div className="flex-1 py-4 px-4 border-b border-gray-100 " onClick={() => {
                                    if (!carrierId.id) {

                                        openDrawer('book')
                                    }
                                }}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {scheduleData
                                            .filter(item => item.time === time)
                                            .map((item, idx) => (
                                                <div key={idx} className="bg-purple-50 p-3 rounded-4xl border border-purple-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevents triggering openDrawer('book')
                                                        openDrawer('details', item.employee)
                                                    }}>
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={item.avatar}
                                                            alt={item.employee}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-sm">{item.employee}</div>
                                                            <div className="text-xs text-gray-500">{item.duration}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {scheduleData.filter(item => item.time === time).length === 0 && (
                                            <div className="col-span-3 py-8 text-center text-gray-400 text-sm">
                                                <img src="/images/no-booking.svg" alt="" />
                                                {/* <NoBookings /> */}
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
                            <h3 className="font-medium mb-4">Assignee</h3>
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Type to search"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div className="space-y-3 overflow-auto max-h-[20rem] custom-scrollbar">
                                {assignees.map((assignee, index) => (
                                    <div key={index} className="bg-[#69417E14] px-3 py-2 gap-2 inline-block mr-3 rounded-full"
                                        onClick={() => openDrawer('career')}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full ${assignee.color} flex items-center justify-center text-white text-xs font-medium`}>
                                                {assignee.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm">{assignee.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                {drawerState.type === 'book' ? <BookSlotContent /> : drawerState.type === 'career' ? <CarerProfilePage OpenCalendarView={() => setCalenderDrawer(true)} /> : <BookingDetailsContent />}
            </SideDrawer>
            <SideDrawer
                isOpen={calenderDrawer}
                onClose={closeCalenderDrawer}
                avatar={''}
                title={''}
                width={'75%'}
            >
                <CalendarPage />
            </SideDrawer>
        </div>

    )
}

export default Calender;