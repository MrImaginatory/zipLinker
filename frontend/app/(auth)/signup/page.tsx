"use client"

import { useState } from "react"
import Link from "next/link"
import { FormField } from "@/components/auth/form-field"
import { PasswordInput } from "@/components/auth/password-input"
import { SubmitButton } from "@/components/auth/submit-button"

import { fetchApi } from "@/lib/api"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ userName: "", email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")

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
    setServerError("")
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.userName) errs.userName = "Username is required"
    else if (form.userName.length < 3)
      errs.userName = "Username must be at least 3 characters"
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
    setServerError("")
    
    try {
      await fetchApi("/users/register", {
        method: "POST",
        body: JSON.stringify(form)
      })
      
      // Redirect to login page
      window.location.href = "/login"
    } catch (err: any) {
      setServerError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full rounded-lg border border-beige-deep bg-cream p-8 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold text-ink dark:text-zinc-100">Create an account</h1>
        <p className="mt-1 text-sm text-steel">Enter your details to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {serverError && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}
        <FormField
          label="Username"
          name="userName"
          placeholder="yourname"
          required
          autoComplete="username"
          value={form.userName}
          onChange={handleChange}
          error={errors.userName}
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
