"use client"

import type React from "react"

import { useState, useRef } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Save, X } from "lucide-react"
import { toast } from "sonner"

/**
 * Formulario de Estudiante Reutilizable
 *
 * Propósito: Componente reutilizable para crear y editar estudiantes
 * con captura de fotografía integrada y validación de datos.
 *
 * Características:
 * - Formulario completo con validación
 * - Captura de fotografía con cámara web
 * - Generación automática de códigos QR
 * - Interfaz glassmorphism
 * - Manejo de estados de carga
 */

interface StudentFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  grade: string
  section: string
  parentName: string
  parentPhone: string
  parentEmail: string
  address: string
  birthDate: string
  photo?: string
}

interface StudentFormProps {
  initialData?: StudentFormData
  onSubmit: (data: StudentFormData & { photo?: string }) => void
  onCancel: () => void
  isEditing?: boolean
}

export function StudentForm({ initialData, onSubmit, onCancel, isEditing = false }: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      grade: "",
      section: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      address: "",
      birthDate: "",
    },
  )

  const [capturedPhoto, setCapturedPhoto] = useState<string>(initialData?.photo || "")
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Iniciar cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      toast.error("Error al acceder a la cámara")
      console.error("Error accessing camera:", error)
    }
  }

  // Capturar fotografía
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedPhoto(photoData)

        // Detener cámara
        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsCameraActive(false)

        toast.success("Fotografía capturada correctamente")
      }
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.grade) {
      toast.error("Por favor complete los campos obligatorios")
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formData,
        photo: capturedPhoto,
      })
    } catch (error) {
      toast.error("Error al guardar los datos")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{isEditing ? "Editar Estudiante" : "Registrar Nuevo Estudiante"}</h2>
        <NeonButton variant="secondary" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </NeonButton>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sección de fotografía */}
          <div className="lg:col-span-1">
            <Label className="text-base font-semibold mb-4 block">Fotografía del Estudiante</Label>

            {!isCameraActive && !capturedPhoto && (
              <div className="aspect-square bg-muted rounded-xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-muted-foreground/30">
                <Camera className="h-12 w-12 text-muted-foreground" />
                <NeonButton type="button" onClick={startCamera} size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Activar Cámara
                </NeonButton>
              </div>
            )}

            {isCameraActive && (
              <div className="space-y-4">
                <video ref={videoRef} autoPlay playsInline className="w-full aspect-square object-cover rounded-xl" />
                <NeonButton type="button" onClick={capturePhoto} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Capturar Foto
                </NeonButton>
              </div>
            )}

            {capturedPhoto && (
              <div className="space-y-4">
                <img
                  src={capturedPhoto || "/placeholder.svg"}
                  alt="Foto del estudiante"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <NeonButton
                  type="button"
                  onClick={() => {
                    setCapturedPhoto("")
                    startCamera()
                  }}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Tomar Nueva Foto
                </NeonButton>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Formulario de datos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos personales */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="glass"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="glass"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass"
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="glass"
                  />
                </div>
              </div>
            </div>

            {/* Datos académicos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Datos Académicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade">Grado *</Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Seleccionar grado" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Grado {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="section">Sección</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => setFormData({ ...formData, section: value })}
                  >
                    <SelectTrigger className="glass">
                      <SelectValue placeholder="Seleccionar sección" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D"].map((section) => (
                        <SelectItem key={section} value={section}>
                          Sección {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Datos del padre/tutor */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Datos del Padre/Tutor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Nombre del Padre/Tutor</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="glass"
                  />
                </div>
                <div>
                  <Label htmlFor="parentPhone">Teléfono del Padre/Tutor</Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="glass"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="parentEmail">Email del Padre/Tutor</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="glass"
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="glass"
                rows={3}
              />
            </div>

            {/* Botón de envío */}
            <div className="flex justify-end">
              <NeonButton type="submit" size="lg" className="group" disabled={isSubmitting}>
                <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Estudiante" : "Registrar Estudiante"}
              </NeonButton>
            </div>
          </div>
        </div>
      </form>
    </GlassCard>
  )
}
