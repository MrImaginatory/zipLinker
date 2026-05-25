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
          <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </Button>
  )
}
