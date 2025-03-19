"use client"

import { Phone } from "lucide-react"
import { useState } from "react"
import AmbulanceAlertModal from "./ambulance-alert-modal"
import { motion } from "framer-motion"

// This is a code snippet to update your existing Dashboard component
// Add this state and function to your Dashboard component
const DashboardUpdate = () => {
  // Add this state to your Dashboard component
  const [showAmbulanceAlert, setShowAmbulanceAlert] = useState(false)

  // Replace your existing button with this one
  return (
    <>
      {/* Replace your existing "Ambulance Alert" button with this one */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowAmbulanceAlert(true)}
        className="flex items-center justify-center space-x-2 bg-red-600 
          text-white px-5 py-2.5 rounded-lg hover:bg-red-700 shadow-sm hover:shadow-md 
          transition-all duration-300"
      >
        <Phone className="w-4 h-4" />
        <span className="text-sm font-medium">Ambulance Alert</span>
      </motion.button>

      {/* Add this to the bottom of your Dashboard component */}
      <AmbulanceAlertModal isOpen={showAmbulanceAlert} onClose={() => setShowAmbulanceAlert(false)} />
    </>
  )
}

export default DashboardUpdate

