"use client"

import { useState } from "react"
import Image from "next/image"

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    skinType: "Combination",
    skinConcerns: ["Acne", "Dark Spots"],
    allergies: "None",
    profileImage: "/placeholder.svg?height=200&width=200",
  })

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "skin", label: "Skin Profile", icon: "✨" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "history", label: "History", icon: "📊" },
  ]

  const skinAnalysisHistory = [
    {
      date: "2024-01-15",
      skinType: "Combination",
      concerns: ["Acne", "Dark Spots"],
      recommendations: 5,
      score: 85,
    },
    {
      date: "2023-12-20",
      skinType: "Oily",
      concerns: ["Acne", "Large Pores"],
      recommendations: 4,
      score: 78,
    },
    {
      date: "2023-11-10",
      skinType: "Combination",
      concerns: ["Dryness", "Fine Lines"],
      recommendations: 6,
      score: 82,
    },
  ]

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to your backend
    console.log("Saving profile data:", profileData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={profileData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-white text-purple-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center md:text-left text-white">
                <h1 className="text-4xl font-bold mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-purple-100 text-lg mb-4">{profileData.email}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                    Skin Type: {profileData.skinType}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                    Member since 2023
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Personal Info Tab */}
          {activeTab === "personal" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    isEditing
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                  } transform hover:scale-105`}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skin Profile Tab */}
          {activeTab === "skin" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Skin Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skin Type</label>
                    <select
                      value={profileData.skinType}
                      onChange={(e) => handleInputChange("skinType", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Dry">Dry</option>
                      <option value="Oily">Oily</option>
                      <option value="Combination">Combination</option>
                      <option value="Sensitive">Sensitive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skin Concerns</label>
                    <div className="space-y-2">
                      {["Acne", "Dark Spots", "Fine Lines", "Large Pores", "Dryness", "Sensitivity"].map((concern) => (
                        <label key={concern} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={profileData.skinConcerns.includes(concern)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProfileData((prev) => ({
                                  ...prev,
                                  skinConcerns: [...prev.skinConcerns, concern],
                                }))
                              } else {
                                setProfileData((prev) => ({
                                  ...prev,
                                  skinConcerns: prev.skinConcerns.filter((c) => c !== concern),
                                }))
                              }
                            }}
                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                          />
                          <span className="text-gray-700">{concern}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Known Allergies</label>
                    <textarea
                      value={profileData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                      placeholder="List any known allergies or sensitivities..."
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Latest Skin Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Skin Health Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-4/5" />
                        </div>
                        <span className="font-bold text-purple-600">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Analysis</span>
                      <span className="font-medium">Jan 15, 2024</span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                      Start New Analysis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Analysis History</h2>

              <div className="space-y-4">
                {skinAnalysisHistory.map((analysis, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-900">
                            {new Date(analysis.date).toLocaleDateString()}
                          </span>
                          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Score: {analysis.score}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-600">
                            {analysis.skinType}
                          </span>
                          {analysis.concerns.map((concern, i) => (
                            <span key={i} className="bg-white px-3 py-1 rounded-full text-sm text-gray-600">
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-2">{analysis.recommendations} recommendations</div>
                        <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Security Settings</h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                      />
                    </div>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-2">Add an extra layer of security to your account</p>
                      <p className="text-sm text-gray-500">Status: Not enabled</p>
                    </div>
                    <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Preferences</h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {[
                      "Email notifications for new product recommendations",
                      "SMS alerts for skin analysis reminders",
                      "Push notifications for exclusive offers",
                      "Weekly skincare tips newsletter",
                    ].map((pref, index) => (
                      <label key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{pref}</span>
                        <input
                          type="checkbox"
                          defaultChecked={index < 2}
                          className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    {[
                      "Make my profile visible to other users",
                      "Allow brands to contact me with personalized offers",
                      "Share anonymous skin data for research purposes",
                    ].map((pref, index) => (
                      <label key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{pref}</span>
                        <input
                          type="checkbox"
                          defaultChecked={index === 2}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
