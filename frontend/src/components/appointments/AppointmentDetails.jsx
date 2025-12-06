import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getAppointmentById,
  cancelAppointment,
  updateAppointment,
} from "../../services/appointmentService";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  XMarkIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ClockIcon,
  TagIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";
import toast from "react-hot-toast";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const data = await getAppointmentById(id);
      setAppointment(data);
    } catch (err) {
      setError(err.message || "Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setActionLoading(true);
      await cancelAppointment(id);
      navigate("/appointments");
    } catch (err) {
      setError(err.message || "Failed to cancel appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAppointment = async () => {
    try {
      setActionLoading(true);
      await updateAppointment(id, { status: "confirmed" });
      await fetchAppointmentDetails();
    } catch (err) {
      setError(err.message || "Failed to confirm appointment");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading appointment details..." />;
  }

  if (error) {
    return (
      <div className="appointment-error">
        <h3>Error Loading Appointment</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={fetchAppointmentDetails} className="btn-primary">
            Try Again
          </button>
          <Link to="/appointments" className="btn-secondary">
            Back to Appointments
          </Link>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="appointment-not-found">
        <h3>Appointment Not Found</h3>
        <p>The appointment you're looking for doesn't exist.</p>
        <Link to="/appointments" className="btn-primary">
          Back to Appointments
        </Link>
      </div>
    );
  }

  const isPast = new Date(appointment.date) < new Date();
  const canCancel =
    appointment.status === "confirmed" || appointment.status === "pending";
  const canConfirm =
    user?.role === "business" && appointment.status === "pending";
  const canEdit = user?.role === "business" && !isPast;

  return (
    <div className="appointment-details">
      <div className="details-header">
        <div className="header-content">
          <h1>Appointment Details</h1>
          <div className="status-badge-container">
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(appointment.status) }}
            >
              {appointment.status}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <Link to="/appointments" className="btn-secondary">
            ← Back to Appointments
          </Link>

          {canEdit && (
            <button
              onClick={() => navigate(`/appointments/${id}/edit`)}
              className="btn-outline"
            >
              Edit Appointment
            </button>
          )}
        </div>
      </div>

      <div className="details-content">
        <div className="details-main">
          <div className="appointment-info-card">
            <h2>Appointment Information</h2>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Service:</span>
                <span className="info-value">{appointment.service}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Date:</span>
                <span className="info-value">
                  {formatDate(appointment.date)}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Time:</span>
                <span className="info-value">
                  {appointment.timeSlot?.startTime} -
                  {appointment.timeSlot?.endTime}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Duration:</span>
                <span className="info-value">
                  {appointment.timeSlot?.duration || 30} minutes
                </span>
              </div>

              {appointment.notes && (
                <div className="info-item full-width">
                  <span className="info-label">Notes:</span>
                  <span className="info-value">{appointment.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="business-info-card">
            <h2>Business Information</h2>

            {appointment.business && (
              <div className="business-details">
                <h3>{appointment.business.name}</h3>
                <p className="business-description">
                  {appointment.business.description}
                </p>

                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-label">Address:</span>
                    <span className="contact-value">
                      {appointment.business.address}
                    </span>
                  </div>

                  <div className="contact-item">
                    <span className="contact-label">Phone:</span>
                    <a
                      href={`tel:${appointment.business.phone}`}
                      className="contact-link"
                    >
                      {appointment.business.phone}
                    </a>
                  </div>

                  <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <a
                      href={`mailto:${appointment.business.email}`}
                      className="contact-link"
                    >
                      {appointment.business.email}
                    </a>
                  </div>

                  {appointment.business.website && (
                    <div className="contact-item">
                      <span className="contact-label">Website:</span>
                      <a
                        href={appointment.business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        {appointment.business.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="details-sidebar">
          {user?.role === "customer" && appointment.customer && (
            <div className="customer-info-card">
              <h3>Your Information</h3>
              <div className="customer-details">
                <p>
                  <strong>Name:</strong> {appointment.customer.name}
                </p>
                <p>
                  <strong>Email:</strong> {appointment.customer.email}
                </p>
                {appointment.customer.phone && (
                  <p>
                    <strong>Phone:</strong> {appointment.customer.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {user?.role === "business" && appointment.customer && (
            <div className="customer-info-card">
              <h3>Customer Information</h3>
              <div className="customer-details">
                <p>
                  <strong>Name:</strong> {appointment.customer.name}
                </p>
                <p>
                  <strong>Email:</strong> {appointment.customer.email}
                </p>
                {appointment.customer.phone && (
                  <p>
                    <strong>Phone:</strong> {appointment.customer.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="actions-card">
            <h3>Actions</h3>

            {canConfirm && (
              <button
                onClick={handleConfirmAppointment}
                disabled={actionLoading}
                className="btn-primary full-width"
              >
                {actionLoading ? "Confirming..." : "Confirm Appointment"}
              </button>
            )}

            {canCancel && !isPast && (
              <button
                onClick={handleCancelAppointment}
                disabled={actionLoading}
                className="btn-danger full-width"
              >
                {actionLoading ? "Cancelling..." : "Cancel Appointment"}
              </button>
            )}

            <button
              onClick={() => navigate(`/appointments/${id}/reschedule`)}
              disabled={isPast || appointment.status === "cancelled"}
              className="btn-outline full-width"
            >
              Reschedule
            </button>

            <Link
              to={`/businesses/${appointment.business?._id}`}
              className="btn-secondary full-width"
            >
              View Business Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "#28a745";
    case "pending":
      return "#ffc107";
    case "cancelled":
      return "#dc3545";
    case "completed":
      return "#6c757d";
    default:
      return "#6c757d";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default AppointmentDetails;
