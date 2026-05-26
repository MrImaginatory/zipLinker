"use client"

import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

type LogoAppearance = "color" | "white" | "auto"
type LogoSize = "sm" | "md"

interface LogoProps {
  appearance?: LogoAppearance
  size?: LogoSize
  className?: string
  showText?: boolean
}

const productName = process.env.NEXT_PUBLIC_PRODUCT_NAME || ""

function resolveLogo(appearance: LogoAppearance, resolvedTheme: string | undefined) {
  const colorLogo = process.env.NEXT_PUBLIC_LOGO_PATH || "/logo.svg"
  const whiteLogo = process.env.NEXT_PUBLIC_LOGO_LIGHT_PATH || "/logo-light.svg"

  if (appearance === "color") return colorLogo
  if (appearance === "white") return whiteLogo
  return resolvedTheme === "dark" ? whiteLogo : colorLogo
}

const sizeClasses = {
  sm: "h-6",
  md: "h-5",
}

export function Logo({ appearance = "auto", size = "md", className, showText = true }: LogoProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <img
        src={resolveLogo(appearance, resolvedTheme)}
        alt={productName || "Ziplinker"}
        className={cn(sizeClasses[size], "w-auto", className)}
      />
      {productName && showText && (
        <span className="font-display text-xl tracking-tight text-primary max-sm:hidden">
          {productName}
        </span>
      )}
    </div>
  )
}
