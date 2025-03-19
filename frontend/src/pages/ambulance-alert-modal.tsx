"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface AmbulanceAlertModalProps {
  isOpen: boolean
  onClose: () => void
}

const AmbulanceAlertModal = ({ isOpen, onClose }: AmbulanceAlertModalProps) => {
  // Simple state to track if iframe is loaded
  const [isLoaded, setIsLoaded] = useState(false)

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Ambulance Alert Service</h3>
          <p className="text-sm text-gray-600">Use this service to request emergency medical transportation</p>
        </div>

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-[5]">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Iframe container with fixed height */}
        <div className="w-full h-[500px] bg-[rgb(247,247,247)] overflow-hidden rounded-lg border border-gray-200">
        <iframe
  src="https://medcab.in/services/air-ambulance-service-in-mumbai"
  className="border-none"
  onLoad={() => setIsLoaded(true)}
  title="Ambulance Service"
  style={{
    position: "absolute",
    width: "100%",
    height: "100%",
  }}
  scrolling="no"
/>

        </div>
      </motion.div>
    </motion.div>
  )
}

export default AmbulanceAlertModal

