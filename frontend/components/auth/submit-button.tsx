"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SubmitButtonProps {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
}

export function SubmitButton({ children, loading = false, disabled = false }: SubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={disabled || loading}>
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="loader" style={{ '--loader-size': '16px' } as React.CSSProperties}></div>
          {children}
        </span>
      ) : (
        children
      )}
    </Button>
  )
}
