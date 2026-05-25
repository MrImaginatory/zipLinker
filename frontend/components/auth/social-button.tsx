interface SocialButtonProps {
  provider: string
  icon: React.ReactNode
}

export function SocialButton({ provider, icon }: SocialButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {icon}
      {provider}
    </button>
  )
}
