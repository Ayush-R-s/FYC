"use client"

import { useState } from "react"

export default function StudentDetailsModal({ student, isOpen, onClose, onEdit }) {
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [showAutoGenPassword, setShowAutoGenPassword] = useState(false)

  if (!isOpen || !student) return null

  // Helper classes - Fixed to Light Mode
  const modalBg = "bg-white"
  const textPrimary = "text-slate-900"
  const textSecondary = "text-slate-600"
  const textSubtle = "text-slate-500"
  const borderRelaxed = "border-slate-200"
  const detailBoxBg = "bg-slate-50"

  // Check if student is newly added (no tests or videos)
  const isNewStudent = student.testsAttempted === 0 && student.videosWatched === 0
  const hasPassword = student?.password && student.password.length > 0

  // Check if password is expired
  const isPasswordExpired = () => {
    if (!student.passwordCreatedAt) return false
    const created = new Date(student.passwordCreatedAt)
    const now = new Date()
    const oneYearLater = new Date(created)
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)
    return now > oneYearLater
  }

  // Get days remaining for password expiry
  const getDaysRemaining = () => {
    if (!student.passwordCreatedAt) return null
    const created = new Date(student.passwordCreatedAt)
    const now = new Date()
    const oneYearLater = new Date(created)
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)
    const daysRemaining = Math.ceil((oneYearLater - now) / (1000 * 60 * 60 * 24))
    return daysRemaining > 0 ? daysRemaining : 0
  }

  // Format expiry date
  const getFormattedExpiryDate = () => {
    if (!student.passwordExpiryDate) return null
    return new Date(student.passwordExpiryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format creation date
  const getFormattedCreatedDate = () => {
    if (!student.passwordCreatedAt) return null
    return new Date(student.passwordCreatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const daysRemaining = getDaysRemaining()
  const expired = isPasswordExpired()

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(student.password)
    setCopiedPassword(true)
    setTimeout(() => setCopiedPassword(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${modalBg} rounded-xl max-w-4xl w-full max-h-[90dvh] sm:max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative`}>
        {/* Absolute Close Button for Mobile Accessibility */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={`${modalBg} border-b ${borderRelaxed} px-6 py-4 flex items-center justify-between rounded-t-xl sticky top-0 z-10 backdrop-blur-md`}>
          <h2 className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>Student Details</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Student Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
            <div className="w-20 h-20 shrink-0 rounded-full bg-white border-4 border-orange-300 flex items-center justify-center text-orange-600 font-bold text-2xl shadow-lg">
              {student.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{student.name}</h3>
              <p className="text-slate-600 font-mono text-sm mb-2 break-all">{student.id}</p>
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${student.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {student.status}
                </span>
                {isNewStudent && (
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-100 text-blue-700">
                    New Student
                  </span>
                )}
                {hasPassword && (
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-purple-100 text-purple-700">
                    Account Created
                  </span>
                )}
                {hasPassword && expired && (
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-red-100 text-red-700 animate-pulse">
                    ⚠️ Expired
                  </span>
                )}
                {hasPassword && !expired && daysRemaining !== null && daysRemaining < 30 && (
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-yellow-100 text-yellow-700">
                    ⏰ Soon
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* New Student Message */}
          {isNewStudent && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                  🎓
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-800 mb-2">Welcome New Student!</h4>
                  <p className="text-blue-700 text-sm">
                    This student has recently joined and hasn't attended any classes or taken any tests yet.
                    Performance data will appear once they start their academic activities.
                  </p>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Tests Taken</p>
                      <p className="text-blue-800 font-bold">0</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Videos Watched</p>
                      <p className="text-blue-800 font-bold">0</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Study Time</p>
                      <p className="text-blue-800 font-bold">0h 0m</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Pass Rate</p>
                      <p className="text-blue-800 font-bold">0%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Information with Password Expiry (if password exists) */}
          {hasPassword && (
            <div className={`rounded-lg p-6 border-2 ${expired
              ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
              : daysRemaining !== null && daysRemaining < 30
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
              }`}>
              <div className="space-y-4">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${expired
                      ? 'bg-red-100 text-red-600'
                      : daysRemaining !== null && daysRemaining < 30
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-emerald-100 text-emerald-600'
                      }`}>
                      {expired ? '⚠️' : '🔐'}
                    </div>
                    <div>
                      <p className={`font-medium ${expired
                        ? 'text-red-800'
                        : daysRemaining !== null && daysRemaining < 30
                          ? 'text-yellow-800'
                          : 'text-emerald-800'
                        }`}>
                        Account Credentials
                      </p>
                      <p className={`text-sm ${expired
                        ? 'text-red-700'
                        : daysRemaining !== null && daysRemaining < 30
                          ? 'text-yellow-700'
                          : 'text-emerald-700'
                        }`}>
                        {expired ? 'Password has expired' : 'Generated during student registration'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Student Password Display */}
                <div className="space-y-2">
                  <p className={`text-xs font-semibold ${expired
                    ? 'text-red-600'
                    : 'text-slate-600'
                    }`}>
                    Student Password
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className={`flex-1 px-4 py-3 rounded-lg font-mono text-base sm:text-lg font-bold bg-white border break-all ${expired
                      ? 'border-red-300 text-red-900'
                      : 'border-slate-300 text-slate-900'
                      }`}>
                      {student.password}
                    </div>
                    <button
                      onClick={handleCopyPassword}
                      className={`px-4 py-3 rounded-lg transition-all font-medium text-sm whitespace-nowrap ${copiedPassword
                        ? expired
                          ? 'bg-red-200 text-red-700'
                          : 'bg-green-200 text-green-700'
                        : expired
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {copiedPassword ? '✓ Copied' : 'Copy Password'}
                    </button>
                  </div>
                </div>

                {/* Auto-Generated System Password Section */}
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-indigo-600">System Password (Auto-Generated)</p>
                    {student.autoGeneratedPassword && (
                      <button
                        onClick={() => setShowAutoGenPassword(!showAutoGenPassword)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        {showAutoGenPassword ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>
                  {showAutoGenPassword && student.autoGeneratedPassword && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 px-4 py-3 rounded-lg font-mono text-sm font-bold bg-indigo-50 border border-indigo-300 text-indigo-900">
                        {student.autoGeneratedPassword}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(student.autoGeneratedPassword)
                          setCopiedPassword(true)
                          setTimeout(() => setCopiedPassword(false), 2000)
                        }}
                        className="px-4 py-3 rounded-lg transition-all font-medium text-sm whitespace-nowrap bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                  {!student.autoGeneratedPassword && (
                    <p className="text-xs text-slate-400 italic">No auto-generated password set</p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">🔐 For account recovery and admin purposes only</p>
                </div>

                {/* Password Expiry Details */}
                {student.passwordCreatedAt && (
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t ${expired
                    ? 'border-red-300'
                    : daysRemaining !== null && daysRemaining < 30
                      ? 'border-yellow-300'
                      : 'border-emerald-300'
                    }`}>
                    <div className={`p-3 rounded-lg ${expired
                      ? 'bg-red-100/50'
                      : daysRemaining !== null && daysRemaining < 30
                        ? 'bg-yellow-100/50'
                        : 'bg-white/50'
                      }`}>
                      <p className={`text-xs font-semibold mb-1 ${expired
                        ? 'text-red-600'
                        : daysRemaining !== null && daysRemaining < 30
                          ? 'text-yellow-600'
                          : 'text-emerald-600'
                        }`}>
                        Created On
                      </p>
                      <p className={`font-medium ${expired
                        ? 'text-red-800'
                        : daysRemaining !== null && daysRemaining < 30
                          ? 'text-yellow-800'
                          : 'text-emerald-800'
                        }`}>
                        {getFormattedCreatedDate()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${expired
                      ? 'bg-red-100/50'
                      : daysRemaining !== null && daysRemaining < 30
                        ? 'bg-yellow-100/50'
                        : 'bg-white/50'
                      }`}>
                      <p className={`text-xs font-semibold mb-1 ${expired
                        ? 'text-red-600'
                        : daysRemaining !== null && daysRemaining < 30
                          ? 'text-yellow-600'
                          : 'text-emerald-600'
                        }`}>
                        Expires On
                      </p>
                      <p className={`font-medium ${expired
                        ? 'text-red-800'
                        : daysRemaining !== null && daysRemaining < 30
                          ? 'text-yellow-800'
                          : 'text-emerald-800'
                        }`}>
                        {getFormattedExpiryDate()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${expired
                      ? 'bg-red-100/50'
                      : daysRemaining !== null && daysRemaining < 30
                        ? 'bg-yellow-100/50'
                        : 'bg-white/50'
                      }`}>
                      <p className={`text-xs font-semibold mb-1 ${expired
                        ? 'text-red-600'
                        : daysRemaining !== null && daysRemaining < 30
                          ? 'text-yellow-600'
                          : 'text-emerald-600'
                        }`}>
                        Days Remaining
                      </p>
                      <p className={`font-bold text-lg ${expired
                        ? 'text-red-800'
                        : daysRemaining !== null && daysRemaining < 30
                          ? 'text-yellow-800'
                          : 'text-emerald-800'
                        }`}>
                        {expired ? '0 (Expired)' : `${daysRemaining}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Expiry Warning */}
                {expired && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-2">
                    <p className="text-red-800 text-sm font-medium">
                      ⚠️ This password has expired. It will be automatically renewed and the admin will be notified.
                    </p>
                  </div>
                )}

                {daysRemaining !== null && daysRemaining < 30 && !expired && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-2">
                    <p className="text-yellow-800 text-sm font-medium">
                      ⏰ Password will expire in {daysRemaining} days. Please plan for renewal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4 pb-2 border-b ${borderRelaxed}`}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>Email</p>
                <p className={`${textPrimary} font-medium truncate`}>{student.email}</p>
              </div>
              <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>Mobile</p>
                <p className={`${textPrimary} font-medium`}>{student.mobile}</p>
              </div>
              <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>Date of Birth</p>
                <p className={`${textPrimary} font-medium`}>{student.dob || "Not provided"}</p>
              </div>
              <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>Education</p>
                <p className={`${textPrimary} font-medium`}>{student.education || "Not provided"}</p>
              </div>
              <div className={`md:col-span-2 p-3 rounded-lg ${detailBoxBg}`}>
                <p className={`text-sm ${textSecondary} mb-1`}>Address</p>
                <p className={`${textPrimary} font-medium`}>{student.address || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Guardian Information (if available) */}
          {student.guardianName && (
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4 pb-2 border-b ${borderRelaxed}`}>Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Guardian Name</p>
                  <p className={`${textPrimary} font-medium`}>{student.guardianName}</p>
                </div>
                <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Relation</p>
                  <p className={`${textPrimary} font-medium`}>{student.guardianRelation}</p>
                </div>
                <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Guardian Mobile</p>
                  <p className={`${textPrimary} font-medium`}>{student.guardianMobile}</p>
                </div>
                <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Guardian Email</p>
                  <p className={`${textPrimary} font-medium`}>{student.guardianEmail}</p>
                </div>
                <div className={`md:col-span-2 p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Guardian Address</p>
                  <p className={`${textPrimary} font-medium`}>{student.guardianAddress}</p>
                </div>
              </div>
            </div>
          )}

          {/* Academic Information (only if student has data) */}
          {!isNewStudent && (
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary} mb-4 pb-2 border-b ${borderRelaxed}`}>Academic Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Pass Rate</p>
                  <p className="text-emerald-600 font-bold text-xl">{student.passRate}%</p>
                </div>
                <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Tests Attempted</p>
                  <p className={`${textPrimary} font-bold text-xl`}>{student.testsAttempted}</p>
                </div>
                <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Videos Watched</p>
                  <p className="text-blue-600 font-bold text-xl">{student.videosWatched}</p>
                </div>
                <div className={`p-3 rounded-lg ${detailBoxBg}`}>
                  <p className={`text-sm ${textSecondary} mb-1`}>Study Time</p>
                  <p className={`${textPrimary} font-bold text-xl`}>{student.videoTime}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Close Button */}
        <div className={`p-4 border-t ${borderRelaxed} flex justify-end sticky bottom-0 bg-white z-10 backdrop-blur-md`}>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm uppercase tracking-widest"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  )
}