"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Camera,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Trash2,
  Download,
  Check,
} from "lucide-react";
import { useAuth } from "../lib/auth-context";
import Header from "../components/header";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile form state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    location: "",
    website: "",
    bio: "",
    profileImage: "",
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobAlerts: true,
    marketingEmails: false,
    securityAlerts: true,
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [newProfileImage, setNewProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingField, setEditingField] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        jobTitle: user.jobTitle || "",
        location: user.location || "",
        website: user.website || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
      });
      setImagePreview(user.profileImage || "");

      // Load notification preferences
      setNotifications({
        emailNotifications: user.emailNotifications !== false,
        jobAlerts: user.jobAlerts !== false,
        marketingEmails: user.marketingEmails === true,
        securityAlerts: user.securityAlerts !== false,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }

      setNewProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("requireAuth", "true");

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload profile image");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updatedProfile = { ...profile };

      // Upload new image if selected
      if (newProfileImage) {
        const imageUrl = await uploadImageToCloudinary(newProfileImage);
        updatedProfile.profileImage = imageUrl;
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setNewProfileImage(null);

      // Auto-hide success message
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Auto-hide success message
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/profile/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(notifications),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update notifications");
      }

      setMessage({
        type: "success",
        text: "Notification preferences updated!",
      });

      // Auto-hide success message
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    const confirmText = prompt("Type 'DELETE' to confirm account deletion:");
    if (confirmText !== "DELETE") {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/profile/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      alert(
        "Account deleted successfully. You will be redirected to the home page."
      );
      router.push("/");
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch("/api/profile/export-data", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `profile-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: "success", text: "Data exported successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export data" });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Account Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account information and preferences
              </p>
            </div>

            {/* Tabs */}
            <div className="px-6">
              <nav className="flex space-x-8" aria-label="Tabs">
                {[
                  { id: "profile", name: "Profile", icon: User },
                  { id: "security", name: "Security", icon: Shield },
                  { id: "notifications", name: "Notifications", icon: Bell },
                  { id: "privacy", name: "Privacy", icon: Eye },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800"
                  : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Profile Information
                </h2>

                {/* Profile Image */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Camera size={16} />
                    </label>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Profile Photo
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Upload a new profile photo. Max size: 5MB
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={profile.company}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={profile.jobTitle}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Security Settings
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Shield size={16} />
                      )}
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Notification Preferences
                </h2>

                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailNotifications",
                        title: "Email Notifications",
                        description:
                          "Receive general email notifications about your account",
                      },
                      {
                        key: "jobAlerts",
                        title: "Job Alerts",
                        description:
                          "Get notified about new job opportunities that match your profile",
                      },
                      {
                        key: "marketingEmails",
                        title: "Marketing Emails",
                        description:
                          "Receive promotional emails and company updates",
                      },
                      {
                        key: "securityAlerts",
                        title: "Security Alerts",
                        description:
                          "Important security notifications about your account",
                      },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleNotificationChange(item.key)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            notifications[item.key]
                              ? "bg-primary border-primary text-white"
                              : "border-gray-300 dark:border-gray-600 hover:border-primary"
                          }`}
                        >
                          {notifications[item.key] && <Check size={12} />}
                        </button>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Bell size={16} />
                      )}
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Privacy & Data
                </h2>

                <div className="space-y-6">
                  {/* Account Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Account Information
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>
                        <span className="font-medium">Member since:</span>{" "}
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </p>
                      <p>
                        <span className="font-medium">Last login:</span>{" "}
                        {user?.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Unknown"}
                      </p>
                      <p>
                        <span className="font-medium">Account status:</span>{" "}
                        {user?.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  {/* Data Export */}
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Export Your Data
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Download a copy of all your personal data stored in
                          our system
                        </p>
                      </div>
                      <button
                        onClick={exportData}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                      >
                        <Download size={16} />
                        Export Data
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-red-900 dark:text-red-200">
                          Delete Account
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
