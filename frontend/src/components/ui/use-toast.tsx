import * as React from "react"
import { createRoot } from "react-dom/client"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
}

const Toast: React.FC<ToastProps & { onClose: () => void }> = ({ 
  title, 
  description, 
  variant = "default", 
  onClose 
}) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const variants = {
    default: "bg-white border-gray-200 text-gray-900",
    destructive: "bg-red-50 border-red-200 text-red-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  }

  const icons = {
    default: <Info className="text-blue-500" size={20} />,
    destructive: <AlertCircle className="text-red-500" size={20} />,
    success: <CheckCircle className="text-emerald-500" size={20} />,
  }

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex w-full max-w-md animate-in slide-in-from-right-5 duration-300`}>
      <div className={`flex w-full items-start gap-4 rounded-xl border p-4 shadow-lg backdrop-blur-sm ${variants[variant]}`}>
        <div className="mt-0.5">{icons[variant]}</div>
        <div className="flex-1 space-y-1">
          {title && <h3 className="text-sm font-bold leading-none">{title}</h3>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        <button onClick={onClose} className="rounded-lg p-1 opacity-50 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export const toast = ({ title, description, variant }: ToastProps) => {
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)

  const handleClose = () => {
    root.unmount()
    document.body.removeChild(container)
  }

  root.render(<Toast title={title} description={description} variant={variant} onClose={handleClose} />)
}

export const useToast = () => {
  return { toast }
}
