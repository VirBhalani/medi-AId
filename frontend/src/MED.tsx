"use client"

import { useState, useEffect } from "react"
import ImageUploader from "./AiMedicine/ImageUploader"
import ChatHistory from "./AiMedicine/ChatHistory"
import { analyzeMedicineImage } from "./services/geminiService"


export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  imageUrl?: string
}

export interface MedicineData {
  name: string
  type: string
  description: string
  dosage: string
  disease: string
}

function Med() {
  const [apiKey, setApiKey] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const handleApiKeySubmit = (key: string) => {
    setApiKey("AIzaSyBnUSVh8OFRzsAOMMS_3uGAJ4cRUks4GBQ")
    // Add welcome message
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Welcome to PharmaScan AI! Upload a medicine image to get detailed information.",
      },
    ])
  }

  useEffect(() => {
    handleApiKeySubmit("AIzaSyBnUSVh8OFRzsAOMMS_3uGAJ4cRUks4GBQ")
  }, [])

  const handleImageUpload = (file: File) => {
    setCurrentImage(file)
    setImagePreviewUrl(URL.createObjectURL(file))
    setError(null)
  }

  const handleAnalyzeImage = async () => {
    if (!currentImage || !apiKey) return

    setLoading(true)
    setError(null)

    // Add user message with image
    const userMessageId = Date.now().toString()
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: "Please analyze this medicine.",
        imageUrl: imagePreviewUrl || undefined,
      },
    ])

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.readAsDataURL(currentImage)

      reader.onloadend = async () => {
        const base64Image = reader.result as string

        // Call Gemini API
        const medicineInfo = await analyzeMedicineImage(apiKey, base64Image)

        // Add assistant response
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: JSON.stringify(medicineInfo),
          },
        ])

        // Clear current image
        setCurrentImage(null)
        setImagePreviewUrl(null)
      }
    } catch (err) {
      console.error(err)
      setError("Failed to analyze the medicine. Please check your API key and try again.")

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error analyzing that image. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <header className="bg-white text-gray-800 p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M9 12h6"></path>
                <path d="M12 9v6"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">PharmaScan AI</h1>
              <p className="text-sm text-gray-500">Upload medicine images for detailed information</p>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-blue-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </div>
                <h2 className="text-sm font-medium text-blue-800">How to use PharmaScan</h2>
              </div>
              <p className="text-sm text-blue-700">
                Take a clear photo of your medicine packaging or pill and upload it here. Our AI will analyze it and provide detailed information.
              </p>
            </div>

            <ChatHistory messages={messages} />

            <div className="mt-6 pt-4 border-t border-gray-100">
              <ImageUploader
                onImageUpload={handleImageUpload}
                onAnalyze={handleAnalyzeImage}
                imageUrl={imagePreviewUrl}
                isLoading={loading}
              />

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="bg-gray-50 p-4 text-xs text-gray-500 text-center border-t border-gray-100">
          Note: This tool is for informational purposes only. Always consult a healthcare professional.
        </footer>
      </div>
    </div>
  )
}

export default Med;