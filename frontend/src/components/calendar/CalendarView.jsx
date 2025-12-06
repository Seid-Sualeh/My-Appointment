import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import toast from "react-hot-toast";

const CalendarView = ({ businessId, onSlotSelect }) => {
  const [events, setEvents] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (businessId) {
      fetchTimeSlots();
      fetchAppointments();
    }
  }, [businessId]);

  const fetchTimeSlots = async () => {
    try {
      const response = await api.get(`/business/time-slots/${businessId}`);
      const formattedSlots = response.data.timeSlots.map((slot) => ({
        id: slot._id,
        title: "Available",
        start: `${slot.date.split("T")[0]}T${slot.startTime}`,
        end: `${slot.date.split("T")[0]}T${slot.endTime}`,
        backgroundColor: slot.isAvailable ? "#10b981" : "#ef4444",
        borderColor: slot.isAvailable ? "#10b981" : "#ef4444",
        extendedProps: {
          isAvailable: slot.isAvailable,
          maxAppointments: slot.maxAppointments,
          currentAppointments: slot.currentAppointments,
        },
      }));
      setTimeSlots(formattedSlots);
    } catch (error) {
      toast.error("Failed to fetch time slots");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/my-appointments");
      const formattedAppointments = response.data.appointments.map((apt) => ({
        id: apt._id,
        title: `${apt.serviceType} - ${apt.customer.name}`,
        start: `${apt.date.split("T")[0]}T${apt.startTime}`,
        end: `${apt.date.split("T")[0]}T${apt.endTime}`,
        backgroundColor: getStatusColor(apt.status),
        borderColor: getStatusColor(apt.status),
        extendedProps: apt,
      }));
      setEvents(formattedAppointments);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      confirmed: "#10b981",
      cancelled: "#ef4444",
      completed: "#6b7280",
      paid: "#3b82f6",
    };
    return colors[status] || "#6b7280";
  };

  const handleDateClick = (info) => {
    if (user?.role === "customer" && info.event?.extendedProps?.isAvailable) {
      onSlotSelect(info.event.extendedProps);
    }
  };

  const handleEventClick = (info) => {
    if (user?.role === "business") {
      // Show appointment details for business
      console.log("Appointment details:", info.event.extendedProps);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={[...timeSlots, ...events]}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        slotDuration="00:30:00"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        height="auto"
        editable={user?.role === "business"}
        selectable={user?.role === "customer"}
      />
    </div>
  );
};

export default CalendarView;
