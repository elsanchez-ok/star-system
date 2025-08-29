"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Send,
  Users,
  Phone,
  Paperclip,
  Smile,
  Search,
  Settings,
  MoreVertical,
  Bell,
  BellOff,
} from "lucide-react"

interface ChatMessage {
  id: string
  sender: string
  senderRole: string
  message: string
  timestamp: string
  channel: string
  type: "text" | "image" | "file" | "system"
  status: "sent" | "delivered" | "read"
  replyTo?: string
}

interface ChatUser {
  id: string
  name: string
  role: string
  status: "online" | "away" | "offline"
  avatar?: string
  lastSeen?: string
}

interface ChatSystemProps {
  currentUser: {
    name: string
    role: string
    id: string
  }
  availableChannels: string[]
}

const mockUsers: ChatUser[] = [
  { id: "1", name: "DIRECTOR GENERAL", role: "DIRECCIÓN", status: "online" },
  { id: "2", name: "ADMIN PRINCIPAL", role: "ADMINISTRACIÓN", status: "online" },
  { id: "3", name: "CONSEJERA MARÍA", role: "CONSEJERÍA", status: "online" },
  { id: "4", name: "OPERADOR JUAN", role: "REGISTRO", status: "away" },
  { id: "5", name: "PROF. CARLOS", role: "DOCENTE", status: "online" },
  { id: "6", name: "PROF. ANA", role: "DOCENTE", status: "offline", lastSeen: "Hace 2 horas" },
  { id: "7", name: "PADRE GONZÁLEZ", role: "PADRE", status: "away" },
  { id: "8", name: "MADRE LÓPEZ", role: "PADRE", status: "online" },
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "DIRECTOR GENERAL",
    senderRole: "DIRECCIÓN",
    message: "Buenos días a todos. Recordatorio de la reunión de coordinación a las 10:00 AM",
    timestamp: "09:15",
    channel: "general",
    type: "text",
    status: "read",
  },
  {
    id: "2",
    sender: "ADMIN PRINCIPAL",
    senderRole: "ADMINISTRACIÓN",
    message: "Confirmado. ¿Necesitan algún reporte específico para la reunión?",
    timestamp: "09:17",
    channel: "general",
    type: "text",
    status: "read",
  },
  {
    id: "3",
    sender: "CONSEJERA MARÍA",
    senderRole: "CONSEJERÍA",
    message: "Tengo el reporte de asistencia actualizado hasta ayer",
    timestamp: "09:18",
    channel: "general",
    type: "text",
    status: "delivered",
  },
  {
    id: "4",
    sender: "PROF. CARLOS",
    senderRole: "DOCENTE",
    message: "¿Alguien puede ayudarme con el sistema de calificaciones?",
    timestamp: "09:20",
    channel: "docentes",
    type: "text",
    status: "sent",
  },
]

export default function ChatSystem({ currentUser, availableChannels }: ChatSystemProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [activeChannel, setActiveChannel] = useState(availableChannels[0] || "general")
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserList, setShowUserList] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: currentUser.name,
        senderRole: currentUser.role,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" }),
        channel: activeChannel,
        type: "text",
        status: "sent",
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const sendWhatsAppMessage = (phoneNumber: string, message: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400"
      case "away":
        return "bg-yellow-400"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "DIRECCIÓN":
        return "text-purple-400 border-purple-400"
      case "ADMINISTRACIÓN":
        return "text-blue-400 border-blue-400"
      case "CONSEJERÍA":
        return "text-green-400 border-green-400"
      case "REGISTRO":
        return "text-orange-400 border-orange-400"
      case "DOCENTE":
        return "text-cyan-400 border-cyan-400"
      case "PADRE":
        return "text-pink-400 border-pink-400"
      default:
        return "text-gray-400 border-gray-400"
    }
  }

  const filteredMessages = messages.filter((msg) => msg.channel === activeChannel)
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const onlineUsers = mockUsers.filter((user) => user.status === "online")
  const channelUsers = mockUsers.filter((user) => {
    if (activeChannel === "general") return true
    if (activeChannel === "docentes")
      return user.role === "DOCENTE" || user.role === "DIRECCIÓN" || user.role === "ADMINISTRACIÓN"
    if (activeChannel === "administracion") return user.role === "ADMINISTRACIÓN" || user.role === "DIRECCIÓN"
    if (activeChannel === "consejeria") return user.role === "CONSEJERÍA" || user.role === "DIRECCIÓN"
    if (activeChannel === "padres")
      return user.role === "PADRE" || user.role === "CONSEJERÍA" || user.role === "DIRECCIÓN"
    return true
  })

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Users Sidebar */}
      {showUserList && (
        <Card className="glass border-gray-600 lg:w-80 flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-400" />
                USUARIOS ({onlineUsers.length} en línea)
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNotifications(!notifications)}
                  className="text-gray-400"
                >
                  {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.id === user.id ? "bg-purple-600/20" : "bg-gray-800 hover:bg-gray-750"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{user.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </Badge>
                        {user.status === "offline" && user.lastSeen && (
                          <span className="text-gray-500 text-xs">{user.lastSeen}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-gray-400 p-1">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        sendWhatsAppMessage("50412345678", `Hola ${user.name}, necesito comunicarme contigo.`)
                      }}
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Area */}
      <Card className="glass border-gray-600 flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowUserList(!showUserList)}
                className="text-gray-400 lg:hidden"
              >
                <Users className="h-4 w-4" />
              </Button>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-400" />
                SISTEMA DE COMUNICACIÓN
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-purple-400 text-purple-300">
                {channelUsers.length} participantes
              </Badge>
              <Button size="sm" variant="ghost" className="text-gray-400">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Channel Tabs */}
          <Tabs value={activeChannel} onValueChange={setActiveChannel} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-gray-800 border border-gray-600">
              {availableChannels.map((channel) => (
                <TabsTrigger key={channel} value={channel} className="data-[state=active]:bg-purple-600 text-xs">
                  {channel === "general" && "GENERAL"}
                  {channel === "docentes" && "DOCENTES"}
                  {channel === "administracion" && "ADMIN"}
                  {channel === "consejeria" && "CONSEJERÍA"}
                  {channel === "padres" && "PADRES"}
                  {channel === "direccion" && "DIRECCIÓN"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col pt-0">
          {/* Messages Area */}
          <div className="flex-1 bg-gray-800 rounded-lg p-4 mb-4 overflow-y-auto max-h-96">
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === currentUser.name ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === currentUser.name ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    {message.sender !== currentUser.name && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{message.sender}</span>
                        <Badge variant="outline" className={`text-xs ${getRoleColor(message.senderRole)}`}>
                          {message.senderRole}
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">{message.timestamp}</span>
                      {message.sender === currentUser.name && (
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              message.status === "read"
                                ? "bg-blue-400"
                                : message.status === "delivered"
                                  ? "bg-gray-400"
                                  : "bg-yellow-400"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="text-gray-400">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder={`Escribir en ${activeChannel}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-gray-800 border-gray-600 text-white"
            />
            <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => sendWhatsAppMessage("50412345678", newMessage)}
              className="bg-green-600 hover:bg-green-700"
            >
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
