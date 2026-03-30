import React from "react"
import { createPortal } from "react-dom"
import { X, FileText } from "lucide-react"
import { API_BASE_URL } from "../../../services/axiosInstance"

const FileViewerModal = ({ file, darkMode, onClose }) => {
  if (!file) return null

  const fileKey = file.fileUrl || ""
  const encodedPath = fileKey.split('/').map(segment => encodeURIComponent(segment)).join('/')
  const fileUrl = fileKey
    ? `${API_BASE_URL}/admin/content/files/${encodedPath}`
    : null

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
      <div
        className={`${darkMode ? "bg-gray-900" : "bg-white"
          } rounded-2xl shadow-xl w-[95vw] h-[95vh] flex flex-col`}
      >
        {/* HEADER */}
        <div
          className={`p-4 border-b ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
            } flex justify-between`}
        >
          <h2
            className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"
              }`}
          >
            📄 {file.title || file.fileName}
          </h2>

          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-gray-50"} flex-1`}>
          {fileUrl && file.fileName?.toLowerCase().endsWith(".pdf") ? (
            <iframe
              src={fileUrl}
              title={file.title}
              className="w-full h-full border-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText
                className={`w-20 h-20 ${darkMode ? "text-blue-400" : "text-blue-500"
                  }`}
              />
              <p className="mt-4 text-gray-500">Preview not available</p>

              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Download File
                </a>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"
            } flex justify-end`}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default FileViewerModal
