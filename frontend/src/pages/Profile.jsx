import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const profileSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().optional(),
  businessName: yup.string().when("role", {
    is: "business",
    then: (schema) => schema.required("Business name is required"),
    otherwise: (schema) => schema.optional(),
  }),
  businessDescription: yup.string().optional(),
});

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      const userData = response.data.user;
      setProfileData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        businessName: userData.businessName || "",
        businessDescription: userData.businessDescription || "",
        role: userData.role,
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put("/auth/me", data);
      toast.success("Profile updated successfully");
      fetchProfile(); // Refresh profile data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      reset(profileData);
    }
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-t-green-500 border-r-2 border-r-yellow-500 border-b-2 border-b-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-purple-100">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.name}
              </h2>
              <p className="text-gray-600 capitalize">{profileData.role}</p>
              {profileData.role === "business" && profileData.businessName && (
                <p className="text-purple-600 font-medium mt-2">
                  {profileData.businessName}
                </p>
              )}
            </div>
            // Add this inside the Profile component, after the role display
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Account Verification
              </h4>

              <div
                className={`p-4 rounded-lg ${
                  profileData.emailVerified
                    ? "bg-green-50 border border-green-200"
                    : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Email Verification:{" "}
                      {profileData.emailVerified ? "Verified" : "Pending"}
                    </p>
                    <p className="text-sm mt-1">
                      {profileData.emailVerified
                        ? "Your email address has been verified successfully."
                        : "Please verify your email address to access all features."}
                    </p>
                  </div>
                  {!profileData.emailVerified && (
                    <Link
                      to="/resend-verification"
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      Resend Verification
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="text-gray-700">Member Since</span>
                </div>
                <span className="font-medium">2024</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Account Status</span>
                </div>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-gray-700">Change Password</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-gray-700">Notification Settings</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-gray-700">Privacy Settings</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-red-600">Delete Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Profile
              </h3>
              <p className="text-gray-600">
                Update your personal and business information
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        {...register("email")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <PhoneIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                      <span className="font-medium capitalize">
                        {profileData.role}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Cannot be changed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information (only for business role) */}
              {profileData.role === "business" && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    Business Information
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        {...register("businessName")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors.businessName
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.businessName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.businessName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description
                      </label>
                      <textarea
                        {...register("businessDescription")}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Describe your business services..."
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        This description will be visible to customers when they
                        search for businesses.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-6 border-t">
                <div className="flex justify-end space-x-4">
                  {isDirty && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !isDirty}
                    className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
