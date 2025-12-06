// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   createTimeSlot,
//   updateTimeSlot,
//   deleteTimeSlot,
// } from "../../services/appointmentService";
// import LoadingSpinner from "../common/LoadingSpinner";
// import "./TimeSlotManager.css";

// const TimeSlotManager = ({ businessId }) => {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingSlot, setEditingSlot] = useState(null);
//   const [selectedDay, setSelectedDay] = useState(0);

//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const daysOfWeek = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   useEffect(() => {
//     fetchTimeSlots();
//   }, [businessId]);

//   const fetchTimeSlots = async () => {
//     try {
//       setLoading(true);
//       // This would be implemented to fetch time slots
//       // const data = await getTimeSlots(businessId);
//       setTimeSlots([]); // Placeholder
//     } catch (err) {
//       setError(err.message || "Failed to load time slots");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveTimeSlot = async (slotData) => {
//     try {
//       setSaving(true);

//       const slotInfo = {
//         ...slotData,
//         business: businessId,
//         dayOfWeek: selectedDay,
//       };

//       if (editingSlot) {
//         await updateTimeSlot(editingSlot._id, slotInfo);
//       } else {
//         await createTimeSlot(slotInfo);
//       }

//       await fetchTimeSlots();
//       setShowForm(false);
//       setEditingSlot(null);
//     } catch (err) {
//       setError(err.message || "Failed to save time slot");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteTimeSlot = async (slotId) => {
//     if (!window.confirm("Are you sure you want to delete this time slot?")) {
//       return;
//     }

//     try {
//       await deleteTimeSlot(slotId);
//       await fetchTimeSlots();
//     } catch (err) {
//       setError(err.message || "Failed to delete time slot");
//     }
//   };

//   const handleEditTimeSlot = (slot) => {
//     setEditingSlot(slot);
//     setSelectedDay(slot.dayOfWeek || 0);
//     setShowForm(true);
//   };

//   const getTimeSlotsForDay = (dayIndex) => {
//     return timeSlots.filter((slot) => (slot.dayOfWeek || 0) === dayIndex);
//   };

//   if (loading) {
//     return <LoadingSpinner message="Loading time slots..." />;
//   }

//   return (
//     <div className="time-slot-manager">
//       <div className="manager-header">
//         <h2>Time Slot Manager</h2>
//         <button
//           onClick={() => {
//             setEditingSlot(null);
//             setSelectedDay(0);
//             setShowForm(true);
//           }}
//           className="btn-primary"
//         >
//           Add Time Slot
//         </button>
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       <div className="time-slot-content">
//         <div className="day-selector">
//           <h3>Select Day</h3>
//           <div className="day-buttons">
//             {daysOfWeek.map((day, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedDay(index)}
//                 className={`day-btn ${selectedDay === index ? "active" : ""}`}
//               >
//                 {day}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="time-slots-display">
//           <h3>{daysOfWeek[selectedDay]} Schedule</h3>

//           {getTimeSlotsForDay(selectedDay).length === 0 ? (
//             <div className="empty-state">
//               <p>No time slots set for {daysOfWeek[selectedDay]}</p>
//               <button
//                 onClick={() => {
//                   setEditingSlot(null);
//                   setShowForm(true);
//                 }}
//                 className="btn-primary"
//               >
//                 Add First Time Slot
//               </button>
//             </div>
//           ) : (
//             <div className="slots-list">
//               {getTimeSlotsForDay(selectedDay).map((slot) => (
//                 <div key={slot._id} className="time-slot-item">
//                   <div className="slot-info">
//                     <div className="slot-time">
//                       {slot.startTime} - {slot.endTime}
//                     </div>
//                     <div className="slot-details">
//                       <span className="slot-duration">
//                         Duration: {slot.duration || 30} minutes
//                       </span>
//                       <span className="slot-capacity">
//                         Max bookings: {slot.maxBookings || 1}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="slot-actions">
//                     <button
//                       onClick={() => handleEditTimeSlot(slot)}
//                       className="btn-secondary"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteTimeSlot(slot._id)}
//                       className="btn-danger"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Time Slot Form Modal */}
//       {showForm && (
//         <TimeSlotForm
//           slot={editingSlot}
//           selectedDay={selectedDay}
//           onSave={handleSaveTimeSlot}
//           onCancel={() => {
//             setShowForm(false);
//             setEditingSlot(null);
//           }}
//           saving={saving}
//         />
//       )}
//     </div>
//   );
// };

// // Time Slot Form Component
// const TimeSlotForm = ({ slot, selectedDay, onSave, onCancel, saving }) => {
//   const [formData, setFormData] = useState({
//     startTime: slot?.startTime || "09:00",
//     endTime: slot?.endTime || "17:00",
//     duration: slot?.duration || 30,
//     maxBookings: slot?.maxBookings || 1,
//     isActive: slot?.isActive !== false,
//   });

//   const [validationErrors, setValidationErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//     // Clear validation error when user starts typing
//     if (validationErrors[name]) {
//       setValidationErrors((prev) => ({
//         ...prev,
//         [name]: null,
//       }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.startTime) {
//       errors.startTime = "Start time is required";
//     }

//     if (!formData.endTime) {
//       errors.endTime = "End time is required";
//     }

//     if (formData.startTime && formData.endTime) {
//       if (formData.startTime >= formData.endTime) {
//         errors.endTime = "End time must be after start time";
//       }
//     }

//     if (!formData.duration || formData.duration < 15) {
//       errors.duration = "Duration must be at least 15 minutes";
//     }

//     if (!formData.maxBookings || formData.maxBookings < 1) {
//       errors.maxBookings = "Max bookings must be at least 1";
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       onSave(formData);
//     }
//   };

//   const generateTimeOptions = () => {
//     const options = [];
//     for (let hour = 6; hour < 22; hour++) {
//       for (let minute = 0; minute < 60; minute += 15) {
//         const time = `${hour.toString().padStart(2, "0")}:${minute
//           .toString()
//           .padStart(2, "0")}`;
//         options.push(time);
//       }
//     }
//     return options;
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>{slot ? "Edit Time Slot" : "Add Time Slot"}</h3>
//           <button onClick={onCancel} className="close-btn">
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="time-slot-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="startTime">Start Time</label>
//               <select
//                 id="startTime"
//                 name="startTime"
//                 value={formData.startTime}
//                 onChange={handleChange}
//                 disabled={saving}
//               >
//                 {generateTimeOptions().map((time) => (
//                   <option key={time} value={time}>
//                     {time}
//                   </option>
//                 ))}
//               </select>
//               {validationErrors.startTime && (
//                 <span className="error-text">{validationErrors.startTime}</span>
//               )}
//             </div>

//             <div className="form-group">
//               <label htmlFor="endTime">End Time</label>
//               <select
//                 id="endTime"
//                 name="endTime"
//                 value={formData.endTime}
//                 onChange={handleChange}
//                 disabled={saving}
//               >
//                 {generateTimeOptions().map((time) => (
//                   <option key={time} value={time}>
//                     {time}
//                   </option>
//                 ))}
//               </select>
//               {validationErrors.endTime && (
//                 <span className="error-text">{validationErrors.endTime}</span>
//               )}
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="duration">Duration (minutes)</label>
//               <select
//                 id="duration"
//                 name="duration"
//                 value={formData.duration}
//                 onChange={handleChange}
//                 disabled={saving}
//               >
//                 <option value={15}>15 minutes</option>
//                 <option value={30}>30 minutes</option>
//                 <option value={45}>45 minutes</option>
//                 <option value={60}>1 hour</option>
//                 <option value={90}>1.5 hours</option>
//                 <option value={120}>2 hours</option>
//               </select>
//               {validationErrors.duration && (
//                 <span className="error-text">{validationErrors.duration}</span>
//               )}
//             </div>

//             <div className="form-group">
//               <label htmlFor="maxBookings">Max Bookings</label>
//               <input
//                 type="number"
//                 id="maxBookings"
//                 name="maxBookings"
//                 min="1"
//                 max="10"
//                 value={formData.maxBookings}
//                 onChange={handleChange}
//                 disabled={saving}
//               />
//               {validationErrors.maxBookings && (
//                 <span className="error-text">
//                   {validationErrors.maxBookings}
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="form-group">
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name="isActive"
//                 checked={formData.isActive}
//                 onChange={handleChange}
//                 disabled={saving}
//               />
//               <span className="checkmark"></span>
//               Active (customers can book during this time)
//             </label>
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="btn-secondary"
//               disabled={saving}
//             >
//               Cancel
//             </button>
//             <button type="submit" className="btn-primary" disabled={saving}>
//               {saving ? "Saving..." : slot ? "Update" : "Create"} Time Slot
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TimeSlotManager;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const timeSlotSchema = yup.object({
  date: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup
    .string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return (
          new Date(`1970-01-01T${value}`) > new Date(`1970-01-01T${startTime}`)
        );
      }
    ),
  maxAppointments: yup
    .number()
    .min(1, "Minimum 1 appointment")
    .max(10, "Maximum 10 appointments")
    .default(1),
  serviceTypes: yup.string().optional(),
});

const TimeSlotManager = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(timeSlotSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "17:00",
      maxAppointments: 1,
      serviceTypes: "consultation,repair,maintenance",
    },
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      // Get business ID from user context or profile
      const response = await api.get("/business/time-slots");
      setTimeSlots(response.data.timeSlots || []);
    } catch (error) {
      toast.error("Failed to fetch time slots");
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    if (!startTime || !endTime) return [];

    const slots = [];
    let current = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    while (current < end) {
      const slotStart = current.toTimeString().slice(0, 5);
      current.setMinutes(current.getMinutes() + 30);
      const slotEnd = current.toTimeString().slice(0, 5);

      if (current <= end) {
        slots.push({
          start: slotStart,
          end: slotEnd,
          label: `${formatTime(slotStart)} - ${formatTime(slotEnd)}`,
        });
      }
    }

    return slots;
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${suffix}`;
  };

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        serviceTypes: data.serviceTypes
          ? data.serviceTypes
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
      };

      if (editingSlot) {
        await api.put(`/business/time-slots/${editingSlot._id}`, formattedData);
        toast.success("Time slot updated successfully");
      } else {
        await api.post("/business/time-slots", formattedData);
        toast.success("Time slot created successfully");
      }

      reset();
      setEditingSlot(null);
      setShowForm(false);
      fetchTimeSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save time slot");
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setValue("date", new Date(slot.date).toISOString().split("T")[0]);
    setValue("startTime", slot.startTime);
    setValue("endTime", slot.endTime);
    setValue("maxAppointments", slot.maxAppointments);
    setValue("serviceTypes", slot.serviceTypes?.join(", ") || "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this time slot?"))
      return;

    try {
      await api.delete(`/business/time-slots/${id}`);
      toast.success("Time slot deleted successfully");
      fetchTimeSlots();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete time slot"
      );
    }
  };

  const handleCancel = () => {
    reset();
    setEditingSlot(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Time Slots
          </h2>
          <p className="text-gray-600">Set your available appointment times</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Time Slot
          </button>
        )}
      </div>

      {/* Time Slot Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">
              {editingSlot ? "Edit Time Slot" : "Create New Time Slot"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  {...register("date")}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <select
                  {...register("startTime")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 24 * 2 }).map((_, i) => {
                    const hour = Math.floor(i / 2);
                    const minute = i % 2 === 0 ? "00" : "30";
                    const time = `${hour
                      .toString()
                      .padStart(2, "0")}:${minute}`;
                    return (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    );
                  })}
                </select>
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <select
                  {...register("endTime")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 24 * 2 }).map((_, i) => {
                    const hour = Math.floor(i / 2);
                    const minute = i % 2 === 0 ? "00" : "30";
                    const time = `${hour
                      .toString()
                      .padStart(2, "0")}:${minute}`;
                    return (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    );
                  })}
                </select>
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Appointments
                </label>
                <input
                  type="number"
                  {...register("maxAppointments")}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.maxAppointments && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maxAppointments.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Maximum number of appointments for this time slot
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Types (comma separated)
                </label>
                <input
                  type="text"
                  {...register("serviceTypes")}
                  placeholder="consultation, repair, maintenance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  List services available during this time
                </p>
              </div>
            </div>

            {/* Generated Time Slots Preview */}
            {startTime && endTime && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slots Preview (30-minute intervals)
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {generateTimeSlots().map((slot, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
                      >
                        {slot.label}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {generateTimeSlots().length} slots generated
                  </p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : editingSlot ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Time Slots List */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Available Time Slots
          </h3>
        </div>
        <div className="p-6">
          {timeSlots.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSlots.map((slot) => (
                    <tr key={slot._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(slot.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            slot.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {slot.isAvailable ? "Available" : "Booked"} (
                          {slot.currentAppointments}/{slot.maxAppointments})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {slot.serviceTypes?.map((service, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(slot)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(slot._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
                <CalendarDaysIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No time slots created
              </h3>
              <p className="text-gray-500 mb-6">
                Add your available time slots to start receiving appointments
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Time Slot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotManager;
