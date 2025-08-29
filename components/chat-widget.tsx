"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"
import ChatSystem from "./chat-system"

interface ChatWidgetProps {
  currentUser: {
    name: string
    role: string
    id: string
  }
  availableChannels: string[]
}

export default function ChatWidget({ currentUser, availableChannels }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 rounded-full w-14 h-14 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="glass border-gray-600 w-96 h-96 flex flex-col shadow-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-purple-400" />
              CHAT RÁPIDO
            </CardTitle>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 p-1"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 p-1">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {!isMinimized && (
          <CardContent className="flex-1 pt-0">
            <div className="h-full">
              <ChatSystem currentUser={currentUser} availableChannels={availableChannels} />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
