"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useRouter } from "next/navigation";
import { useTopLoader } from "@/context/TopLoader";
import { apiCall } from "@/lib/apiCall";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminClient } from "@/lib/apiClient";
// import { useModal } from "@/hooks/useModal";
// import { Modal } from "@/components/ui/modal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

interface CarerProfileProps {
  carrierId: string;
  carrierName: string;
}

const CalendarPage: React.FC<CarerProfileProps> = ({ carrierId, carrierName }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
   const [currentDate, setCurrentDate] = useState(dayjs());
  //   const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter()

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    // Initialize with some events
    setEvents([
      {
        id: "1",
        title: "Event Conf.",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Danger" },
      },
      {
        id: "2",
        title: "Meeting",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success" },
      },
      {
        id: "3",
        title: "Workshop",
        start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        extendedProps: { calendar: "Primary" },
      },
    ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log('sfmafsgahsfh');
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    // openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    console.log(event);
    const id = carrierId;
    const status = event.title.split('(')?.[0];
    const date = dayjs(event.start).format('YYYY-MM-DD');

    const url = `/admin/scheduler/${id}?status=${encodeURIComponent(status)}&date=${encodeURIComponent(date)}&name=${encodeURIComponent(carrierName)}`;

    router.push(url);
    // router.push(`/admin/scheduler/${{ id: 10000, status: 'completed', date: '15/06/2025' }}`)
    // openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
              ...event,
              title: eventTitle,
              start: eventStartDate,
              end: eventEndDate,
              extendedProps: { calendar: eventLevel },
            }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    // closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  const loader = useTopLoader();
  const [bookingDetails, setBookingDetails] = useState<any>();
  const statusToCalendar: any = {
    cancelled: calendarsEvents.Danger,
    completed: calendarsEvents.Success,
    pending: calendarsEvents.Primary,
    default: calendarsEvents.Warning,
  };

  const getBookingDetails = async () => {
    loader.showLoader()
    let payload = {
      carrierId,
      startDate: dayjs(currentDate).startOf('month').format('YYYY-MM-DD'),
      endDate: dayjs(currentDate).endOf('month').format('YYYY-MM-DD'),
      // page: "1",
      // limit: "20",
      slotView: "calendar",
      // sortBy: "createdAt",
      // sortOrder: "desc",
    }
    const res = await apiCall<any>(adminClient, 'POST', `/slot/v1/get_carrier_slot`, payload)
    console.log(res);
    setBookingDetails(res.data);

    const events = res?.data.map((item: any, index: number) => ({
      id: String(index + 1),
      title: `${item.status}(${item.count})`,
      start: item.date,
      extendedProps: { calendar: statusToCalendar[item.status] || statusToCalendar.default }
    }));
    setEvents(events)
    loader.hideLoader()
  }
  useEffect(() => {
    getBookingDetails()
  }, [carrierId, currentDate]);
  // const calendarRef = useRef<FullCalendar | null>(null);
 

  const updateCurrentDate = () => {
    if (calendarRef.current) {
      setCurrentDate(dayjs(calendarRef.current.getApi().getDate()));
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateCurrentDate();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateCurrentDate();
    }
  };
  return (
    <div className=" dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        {/* Custom header */}
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="px-2 py-1 rounded-sm border border-[#E4E7EC] hover:bg-[#F9FAFB]"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className="px-2 py-1 rounded-sm border border-[#E4E7EC] hover:bg-[#F9FAFB] "
            >
              <ChevronRight />
            </button>
          </div>
          <div className="font-semibold text-xl">{carrierName}(carer)</div>
          <div className="text-[#1D2939] font-semibold text-2xl">{currentDate.format("MMMM YYYY")}</div>
        </div>

        {/* FullCalendar without default header */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          selectable
          datesSet={updateCurrentDate} // updates month/year on swipe or nav
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
        />
        {/* <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "timeGridDay,dayGridMonth,timeGridWeek",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              //   click: openModal,
            },
          }}
        /> */}
      </div>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default CalendarPage;
