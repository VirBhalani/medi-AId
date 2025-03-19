"use client"
import { Phone, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import AmbulanceAlertModal from "./ambulance-alert-modal"

// Example of how to integrate the ambulance alert button in your Dashboard component
export function DashboardButtons() {
  const [showCallDialog, setShowCallDialog] = useState(false)
  const [showAmbulanceAlert, setShowAmbulanceAlert] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <motion.button
        data-tour="new-ai-check"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center space-x-2 bg-blue-600 
          text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md 
          transition-all duration-300"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">New AI Check</span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowCallDialog(true)}
        className="flex items-center justify-center space-x-2 bg-green-600 
          text-white px-5 py-2.5 rounded-lg hover:bg-green-700 shadow-sm hover:shadow-md 
          transition-all duration-300"
      >
        <Phone className="w-4 h-4" />
        <span className="text-sm font-medium">S.O.S. / Distress Call</span>
      </motion.button>

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

      {/* Add the modal component at the bottom of your Dashboard component */}
      <AmbulanceAlertModal isOpen={showAmbulanceAlert} onClose={() => setShowAmbulanceAlert(false)} />

      {/* Your existing CallWaitingDialog component */}
      {/* <CallWaitingDialog 
        isOpen={showCallDialog} 
        onClose={() => setShowCallDialog(false)} 
      /> */}
    </div>
  )
}

