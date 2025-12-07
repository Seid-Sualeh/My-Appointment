

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import toast from "react-hot-toast";

const schema = yup.object({
  serviceType: yup.string().required("Service type is required"),
  date: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  notes: yup.string().optional(),
});

const AppointmentForm = ({ business, timeSlot, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      serviceType: "",
      date: timeSlot?.date?.split("T")[0] || "",
      startTime: timeSlot?.startTime || "",
      endTime: timeSlot?.endTime || "",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const appointmentData = {
        ...data,
        businessId: business._id,
      };

      const response = await api.post("/appointments", appointmentData);
      toast.success("Appointment booked successfully!");
      onSuccess(response.data.appointment);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service Type
        </label>
        <select
          {...register("serviceType")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a service</option>
          <option value="consultation">Consultation</option>
          <option value="repair">Repair</option>
          <option value="maintenance">Maintenance</option>
          <option value="checkup">Check-up</option>
          <option value="other">Other</option>
        </select>
        {errors.serviceType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.serviceType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          {...register("date")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min={new Date().toISOString().split("T")[0]}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            {...register("startTime")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            {...register("endTime")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600">
              {errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Any additional information..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
};

export default AppointmentForm;
