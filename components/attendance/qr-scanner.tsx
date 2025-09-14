"use client"

import { useState, useRef, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonButton } from "@/components/ui/neon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scan, QrCode, Zap, CheckCircle } from "lucide-react"
import { toast } from "sonner"

/**
 * Componente Escáner QR/Código de Barras
 *
 * Propósito: Componente especializado para capturar códigos QR y de barras
 * mediante escáner USB que funciona como entrada de teclado.
 *
 * Características:
 * - Detección automática de entrada del escáner USB
 * - Procesamiento en tiempo real de códigos
 * - Efectos visuales de confirmación
 * - Validación de códigos
 * - Integración con sistema de asistencias
 */

interface QRScannerProps {
  onScan: (code: string) => void
  isProcessing?: boolean
  placeholder?: string
}

export function QRScanner({
  onScan,
  isProcessing = false,
  placeholder = "Escanee código QR o de barras...",
}: QRScannerProps) {
  const [scanInput, setScanInput] = useState("")
  const [lastScanTime, setLastScanTime] = useState<number>(0)
  const [scanCount, setScanCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const scanTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-focus en el input para capturar entrada del escáner
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && !isProcessing) {
        inputRef.current.focus()
      }
    }

    // Mantener foco en el input
    const interval = setInterval(focusInput, 1000)
    focusInput()

    return () => clearInterval(interval)
  }, [isProcessing])

  // Manejar entrada del escáner USB
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) {
        if (event.key === "Enter" && scanInput.trim()) {
          processScan(scanInput.trim())
          setScanInput("")
        }
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [scanInput])

  // Procesar código escaneado
  const processScan = (code: string) => {
    const now = Date.now()

    // Evitar escaneos duplicados muy rápidos (menos de 1 segundo)
    if (now - lastScanTime < 1000) {
      return
    }

    setLastScanTime(now)
    setScanCount((prev) => prev + 1)

    // Validar formato del código
    if (code.length < 3) {
      toast.error("Código demasiado corto")
      return
    }

    // Efecto visual de escaneo exitoso
    if (inputRef.current) {
      inputRef.current.classList.add("ring-2", "ring-lime-500")
      setTimeout(() => {
        inputRef.current?.classList.remove("ring-2", "ring-lime-500")
      }, 500)
    }

    // Llamar función de callback
    onScan(code)

    // Limpiar timeout anterior
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
    }

    // Auto-limpiar input después de un tiempo
    scanTimeoutRef.current = setTimeout(() => {
      setScanInput("")
    }, 2000)
  }

  // Procesar manualmente
  const handleManualScan = () => {
    if (scanInput.trim()) {
      processScan(scanInput.trim())
      setScanInput("")
    }
  }

  return (
    <GlassCard
      className={`p-6 transition-all duration-300 ${isProcessing ? "ring-2 ring-lime-500 shadow-lg shadow-lime-500/20" : ""}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Indicador visual */}
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-xl transition-all duration-300 ${
              isProcessing
                ? "bg-gradient-to-r from-lime-500 to-cyan-500 animate-pulse"
                : "bg-gradient-to-r from-violet-500 to-purple-500"
            }`}
          >
            {isProcessing ? (
              <Zap className="h-8 w-8 text-white animate-spin" />
            ) : (
              <Scan className="h-8 w-8 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Escáner Automático
              {scanCount > 0 && <CheckCircle className="h-5 w-5 text-lime-500" />}
            </h2>
            <p className="text-muted-foreground">
              {isProcessing
                ? "Procesando código..."
                : scanCount > 0
                  ? `${scanCount} códigos procesados`
                  : "Listo para escanear"}
            </p>
          </div>
        </div>

        {/* Input del escáner */}
        <div className="flex-1">
          <Label htmlFor="scanner-input" className="sr-only">
            Input del escáner USB
          </Label>
          <Input
            id="scanner-input"
            ref={inputRef}
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder={placeholder}
            className="glass text-lg font-mono transition-all duration-300"
            disabled={isProcessing}
            autoComplete="off"
            autoFocus
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">💡 Mantenga el cursor aquí para captura automática</p>
            {scanInput && <p className="text-sm text-lime-500 font-mono">{scanInput.length} caracteres</p>}
          </div>
        </div>

        {/* Botón manual */}
        <NeonButton
          onClick={handleManualScan}
          disabled={!scanInput.trim() || isProcessing}
          className="group"
          variant="primary"
        >
          <QrCode className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
          Procesar
        </NeonButton>
      </div>

      {/* Estadísticas de escaneo */}
      {scanCount > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 dark:border-slate-700/20">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Códigos procesados: {scanCount}</span>
            <span>Último escaneo: {new Date(lastScanTime).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
