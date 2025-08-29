import { Building2 } from "lucide-react"

export default function DirectionLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Cargando Panel de Dirección</h2>
        <p className="text-blue-200">Preparando reportes ejecutivos...</p>
      </div>
    </div>
  )
}
