"use client"

import { useEffect, useState, use } from "react"
import { ExternalLink, AlertCircle, Lock } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"
import Image from "next/image"

export default function RedirectPage({ params }: { params: Promise<{ shortCode: string }> }) {
  const unwrappedParams = use(params);
  const { shortCode } = unwrappedParams;

  const [countdown, setCountdown] = useState(5)
  const [longUrl, setLongUrl] = useState<string | null>(null)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Fetch the original URL from the backend
    const fetchUrl = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/redirect/${shortCode}`);
        const data = await response.json();
        if (response.ok) {
          setLongUrl(data.data.longUrl);
        } else {
          setErrorStatus(response.status);
          setErrorMessage(data.message || "An error occurred");
        }
      } catch (error) {
        setErrorStatus(500);
        setErrorMessage("Internal Server Error");
      }
    };

    fetchUrl();
  }, [shortCode]);

  useEffect(() => {
    if (countdown > 0 && !errorStatus) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, errorStatus])

  const handleOpen = () => {
    if (countdown === 0 && longUrl) {
      window.location.href = longUrl
    }
  }

  // Error States
  if (errorStatus === 404) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-2xl shadow-sm border border-border p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="font-display text-2xl text-ink font-semibold mb-2">Link Not Found</h1>
          <p className="text-steel mb-8">The short link you are trying to visit does not exist or has been deleted.</p>
          <a href="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            Return to Homepage
          </a>
        </div>
      </div>
    )
  }

  if (errorStatus === 423) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-2xl shadow-sm border border-border p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="font-display text-2xl text-ink font-semibold mb-2">Link Inactive</h1>
          <p className="text-steel mb-8">This link has been temporarily deactivated by its owner.</p>
          <a href="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            Return to Homepage
          </a>
        </div>
      </div>
    )
  }

  if (errorStatus) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-2xl shadow-sm border border-border p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-steel" />
          </div>
          <h1 className="font-display text-2xl text-ink font-semibold mb-2">Oops! Something went wrong</h1>
          <p className="text-steel mb-8">{errorMessage || "An unexpected error occurred while fetching the link."}</p>
          <a href="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            Return to Homepage
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border p-8 text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400"></div>
        
        {/* Logo area */}
        <div className="mx-auto mb-8 flex justify-center">
          <Image src="/ZipLinkerLogo.svg" alt="Ziplinker" width={60} height={60} className="rounded-xl" />
        </div>

        <h1 className="font-display text-2xl text-ink font-semibold mb-2">
          You are being redirected
        </h1>
        <p className="text-steel mb-8">
          Please wait while we prepare your destination link.
        </p>

        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center">
            {/* The circular progress indicator */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-beige-deep"
              />
              <circle
                cx="48"
                cy="48"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * ((5 - countdown) / 5))}
                className="text-primary transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl font-bold text-ink">{countdown > 0 ? countdown : 0}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpen}
          disabled={countdown > 0 || !longUrl}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all duration-300 ${
            countdown > 0 || !longUrl
              ? "bg-steel/10 text-steel cursor-not-allowed"
              : "bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          {countdown > 0 ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-steel border-t-transparent animate-spin mr-2"></div>
              Preparing Link...
            </>
          ) : (
            <>
              Open Link
              <ExternalLink className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
