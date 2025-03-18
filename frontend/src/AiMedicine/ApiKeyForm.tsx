"use client"

import type React from "react"
import { useState } from "react"

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      onSubmit(apiKey.trim())
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 text-center">Enter Your Gemini API Key</h2>
      <p className="text-sm text-gray-600 mb-4">
        To use this application, you need a Gemini API key from Google AI Studio.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your Gemini API key"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Start Using PharmaScan AI
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        Your API key is stored locally in your browser and is never sent to our servers.
      </div>
    </div>
  )
}

export default ApiKeyForm

