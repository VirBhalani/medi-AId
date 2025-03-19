"use client"

import { motion } from "framer-motion"
import { Download, Loader2 } from "lucide-react"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import PropTypes from "prop-types"
import { useState } from "react"

const ExportPDFButton = ({ formData }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    try {
      setIsGenerating(true)

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      let page = pdfDoc.addPage([595.28, 841.89]) // A4 size

      // Set font size and position variables
      const titleSize = 20
      const headingSize = 16
      const subheadingSize = 14
      const fontSize = 11
      let yPosition = 800
      const leftMargin = 50
      const contentIndent = 20
      const lineHeight = 16

      // Add title and date
      page.drawText("Health Profile Report", {
        x: leftMargin,
        y: yPosition,
        size: titleSize,
        font: timesBoldFont,
        color: rgb(0, 0, 0.8),
      })

      yPosition -= 20

      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      page.drawText(`Generated on: ${currentDate}`, {
        x: leftMargin,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0.4, 0.4, 0.4),
      })

      yPosition -= 40

      // Function to format values properly
      const formatValue = (value) => {
        if (value === null || value === undefined) return "N/A"
        if (typeof value === "boolean") return value ? "Yes" : "No"
        if (Array.isArray(value)) {
          if (value.length === 0) return "None"

          // Check if array contains objects
          if (typeof value[0] === "object" && value[0] !== null) {
            return value
              .map((item) => {
                // Handle common patterns in medical records
                if (item.name) return item.name
                if (item.medication) return item.medication
                if (item.condition) return item.condition
                if (item.vaccine) return item.vaccine
                if (item.surgery) return item.surgery
                if (item.allergy) return item.allergy

                // If none of the above patterns match, try to extract all properties
                return Object.entries(item)
                  .map(([key, val]) => {
                    // Skip id or empty fields
                    if (key === "id" || val === "" || val === null) return null

                    const formattedKey = key
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")

                    return `${formattedKey}: ${val}`
                  })
                  .filter(Boolean) // Remove null entries
                  .join(", ")
              })
              .join("; ")
          }

          return value.join(", ")
        }
        return String(value)
      }

      // Function to add sections to PDF
      const addSection = (title, data) => {
        // Check if we need a new page
        if (yPosition < 100) {
          page = pdfDoc.addPage([595.28, 841.89])
          yPosition = 800
        }

        // Draw section title with background
        page.drawRectangle({
          x: leftMargin - 10,
          y: yPosition - 5,
          width: 505,
          height: 25,
          color: rgb(0.95, 0.95, 0.95),
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 1,
        })

        page.drawText(title, {
          x: leftMargin,
          y: yPosition,
          size: headingSize,
          font: timesBoldFont,
          color: rgb(0, 0, 0.7),
        })

        yPosition -= 30

        Object.entries(data).forEach(([key, value]) => {
          // Format the key for display
          const formattedKey = key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            // For nested objects, print the key as a subheading
            page.drawText(formattedKey, {
              x: leftMargin,
              y: yPosition,
              size: subheadingSize,
              font: timesBoldFont,
              color: rgb(0.3, 0.3, 0.6),
            })

            yPosition -= lineHeight

            // Check if we need a new page
            if (yPosition < 100) {
              page = pdfDoc.addPage([595.28, 841.89])
              yPosition = 800
            }

            // Process the nested object's contents
            Object.entries(value).forEach(([subKey, subValue]) => {
              const formattedSubKey = subKey
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")

              const formattedSubValue = formatValue(subValue)

              page.drawText(`${formattedSubKey}: `, {
                x: leftMargin + contentIndent,
                y: yPosition,
                size: fontSize,
                font: timesBoldFont,
                color: rgb(0.3, 0.3, 0.3),
              })

              // Calculate the width of the key text to position the value
              const keyWidth = timesRomanFont.widthOfTextAtSize(`${formattedSubKey}: `, fontSize)

              page.drawText(formattedSubValue, {
                x: leftMargin + contentIndent + keyWidth,
                y: yPosition,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0.6),
              })

              yPosition -= lineHeight

              // Check if we need a new page
              if (yPosition < 100) {
                page = pdfDoc.addPage([595.28, 841.89])
                yPosition = 800
              }
            })
          } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
            // Special handling for arrays of objects (like medical records)
            page.drawText(`${formattedKey}:`, {
              x: leftMargin,
              y: yPosition,
              size: fontSize,
              font: timesBoldFont,
              color: rgb(0.3, 0.3, 0.3),
            })

            yPosition -= lineHeight

            // For each item in the array, create a bullet point entry
            value.forEach((item, index) => {
              // Check if we need a new page
              if (yPosition < 100) {
                page = pdfDoc.addPage([595.28, 841.89])
                yPosition = 800
              }

              // Create a formatted string for this item
              let itemText = ""

              if (typeof item === "object" && item !== null) {
                // Extract the most important properties
                const entries = Object.entries(item).filter(([k, v]) => k !== "id" && v !== "" && v !== null)

                if (entries.length > 0) {
                  itemText = entries
                    .map(([k, v]) => {
                      const formattedK = k
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                      return `${formattedK}: ${v}`
                    })
                    .join(", ")
                } else {
                  itemText = "No details available"
                }
              } else {
                itemText = String(item)
              }

              // Draw bullet point
              page.drawText("•", {
                x: leftMargin + contentIndent,
                y: yPosition,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0.3, 0.3, 0.3),
              })

              // Draw item text
              page.drawText(itemText, {
                x: leftMargin + contentIndent + 15,
                y: yPosition,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0, 0.6),
              })

              yPosition -= lineHeight
            })

            yPosition -= 5 // Add a little extra space after the list
          } else {
            // For simple key-value pairs or arrays of primitives
            const formattedValue = formatValue(value)

            page.drawText(`${formattedKey}: `, {
              x: leftMargin,
              y: yPosition,
              size: fontSize,
              font: timesBoldFont,
              color: rgb(0.3, 0.3, 0.3),
            })

            // Calculate the width of the key text to position the value
            const keyWidth = timesRomanFont.widthOfTextAtSize(`${formattedKey}: `, fontSize)

            page.drawText(formattedValue, {
              x: leftMargin + keyWidth,
              y: yPosition,
              size: fontSize,
              font: timesRomanFont,
              color: rgb(0, 0, 0.6),
            })

            yPosition -= lineHeight

            // Check if we need a new page
            if (yPosition < 100) {
              page = pdfDoc.addPage([595.28, 841.89])
              yPosition = 800
            }
          }
        })

        yPosition -= 20
      }

      // Add personal details section with a profile summary
      page.drawText("Profile Summary", {
        x: leftMargin,
        y: yPosition,
        size: subheadingSize,
        font: timesBoldFont,
        color: rgb(0.3, 0.3, 0.6),
      })

      yPosition -= lineHeight

      const name = formData.personal_details.name || "User"
      const age = formData.personal_details.age || "N/A"
      const gender = formData.personal_details.gender || "N/A"
      const bloodType = formData.personal_details.blood_type || "N/A"

      page.drawText(
        `This report contains health information for ${name}, ${age} years old, ${gender.toLowerCase()}, with blood type ${bloodType}.`,
        {
          x: leftMargin,
          y: yPosition,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0.6),
        },
      )

      yPosition -= 30

      // Add personal details section
      addSection("Personal Details", formData.personal_details)

      // Add medical history sections
      const medicalHistoryData = {
        chronic_conditions: formData.medical_history.chronic_conditions,
        allergies: formData.medical_history.allergies,
        medications: formData.medical_history.medications,
        surgeries: formData.medical_history.surgeries,
        vaccinations: formData.medical_history.vaccinations,
      }

      addSection("Medical History", medicalHistoryData)

      // Add insurance details
      addSection("Insurance Details", formData.medical_history.insurance_details)

      // Add lifestyle information
      addSection("Lifestyle Information", formData.medical_history.lifestyle)

      // Add family history
      addSection("Family History", formData.medical_history.family_history)

      // Add footer to each page
      const pageCount = pdfDoc.getPageCount()
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i)
        const { width, height } = page.getSize()

        // Add page number
        page.drawText(`Page ${i + 1} of ${pageCount}`, {
          x: width / 2 - 40,
          y: 30,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.5, 0.5, 0.5),
        })

        // Add confidentiality notice
        page.drawText("CONFIDENTIAL HEALTH INFORMATION", {
          x: width / 2 - 100,
          y: 15,
          size: 8,
          font: timesRomanFont,
          color: rgb(0.5, 0.5, 0.5),
        })
      }

      // Save the PDF
      const pdfBytes = await pdfDoc.save()

      // Create a blob from the PDF data
      const blob = new Blob([pdfBytes], { type: "application/pdf" })

      // Create a URL for the blob
      const url = URL.createObjectURL(blob)

      // Create a link element and trigger a download
      const link = document.createElement("a")
      link.href = url
      link.download = `health_profile_${formData.personal_details.name || "user"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up by revoking the object URL
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={generatePDF}
      disabled={isGenerating}
      className="mt-5 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-500 
        transition-colors flex items-center justify-center space-x-2 shadow-lg disabled:bg-green-400 disabled:cursor-not-allowed"
    >
      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      <span>{isGenerating ? "Generating PDF..." : "Export PDF"}</span>
    </motion.button>
  )
}

ExportPDFButton.propTypes = {
  formData: PropTypes.object.isRequired,
}

export default ExportPDFButton

