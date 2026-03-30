import React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { API_BASE_URL } from "../../../services/axiosInstance"

const VideoPlayerModal = ({ video, darkMode, onClose }) => {
  if (!video) return null

  // Ensure we use the full S3 key/path or just the filename depending on how it's stored
  const fileName = video.filePath || ""
  const encodedPath = fileName.split('/').map(segment => encodeURIComponent(segment)).join('/')
  const videoUrl = fileName
    ? `${API_BASE_URL}/admin/content/files/${encodedPath}`
    : null

  // ✅ SAFE fallback
  const modalRoot = document.getElementById("modal-root") || document.body

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center">
      <div className={`relative w-[95vw] h-[95vh] rounded-xl overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">
            🎥 {video.title || video.fileName}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video */}
        <div className="w-full h-[calc(100%-64px)] bg-black">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white">
              Video not found
            </div>
          )}
        </div>
      </div>
    </div>,
    modalRoot
  )
}

export default VideoPlayerModal
