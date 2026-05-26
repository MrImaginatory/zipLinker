"use client"

import { useState } from "react"
import Link from "next/link"
import { FormField } from "@/components/auth/form-field"
import { PasswordInput } from "@/components/auth/password-input"
import { SubmitButton } from "@/components/auth/submit-button"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: "", email: "", password: "" })
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
    if (!form.username) errs.username = "Username is required"
    else if (form.username.length < 3)
      errs.username = "Username must be at least 3 characters"
    if (!form.email) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address"
    if (!form.password) errs.password = "Password is required"
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters"
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200))
    
    // Set a simple auth token cookie for the prototype
    document.cookie = "auth-token=demo-token-123; path=/; max-age=86400"
    
    // Redirect to dashboard (hard refresh so middleware kicks in)
    window.location.href = "/dashboard"
  }

  return (
    <div className="w-full rounded-lg border border-beige-deep bg-cream p-8 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-ink dark:text-zinc-100">Create an account</h1>
        <p className="mt-1 text-sm text-steel">Enter your details to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField
          label="Username"
          name="username"
          placeholder="yourname"
          required
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
        />
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
          placeholder="Create a password"
          required
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>

      <p className="mt-6 text-center text-xs text-steel">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
