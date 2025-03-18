"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import type { Message } from "../App"
import MedicineInfo from "./MedicineInfo"

interface ChatHistoryProps {
  messages: Message[]
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Try to parse JSON for medicine info
  const tryParseJSON = (content: string) => {
    try {
      const data = JSON.parse(content)
      if (data && typeof data === "object" && "name" in data) {
        return <MedicineInfo info={data} />
      }
    } catch (e) {
      // Not valid JSON, just return the content
    }
    return content
  }

  return (
    <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">No messages yet</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-blue-600 text-white" : "bg-white border text-gray-800"
                }`}
              >
                {message.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={message.imageUrl || "/placeholder.svg"}
                      alt="Uploaded medicine"
                      className="max-h-48 rounded-md"
                    />
                  </div>
                )}
                <div>{message.role === "assistant" ? tryParseJSON(message.content) : message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}

export default ChatHistory

