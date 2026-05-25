"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PasswordInputProps {
  label: string
  name: string
  placeholder?: string
  required?: boolean
  error?: string
  autoComplete?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PasswordInput({
  label,
  name,
  placeholder,
  required = false,
  error,
  autoComplete,
  value,
  onChange,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      </div>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className="pr-9"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-0 top-0 flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p id={`${name}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
