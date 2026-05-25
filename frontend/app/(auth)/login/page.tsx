"use client"

import { useState } from "react"
import Link from "next/link"
import { FormField } from "@/components/auth/form-field"
import { PasswordInput } from "@/components/auth/password-input"
import { SubmitButton } from "@/components/auth/submit-button"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.email) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address"
    if (!form.password) errs.password = "Password is required"
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
  }

  return (
    <div className="w-full rounded-lg border border-beige-deep bg-cream p-8 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-ink dark:text-zinc-100">Welcome back</h1>
        <p className="mt-1 text-sm text-steel">Enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="hello@example.com"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-primary underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-xs text-steel">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary underline-offset-2 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
