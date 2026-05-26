import { Zap, Link as LinkIcon, BarChart3, ShieldCheck } from "lucide-react"

const features = [
  {
    name: "Lightning Fast",
    description: "Experience 10ms average redirect speeds for seamless user routing.",
    icon: Zap,
  },
  {
    name: "Custom Aliases",
    description: "Claim vanity URLs and match your links perfectly to your brand.",
    icon: LinkIcon,
  },
  {
    name: "Detailed Analytics",
    description: "Track clicks, referrers, and locations from our comprehensive dashboard.",
    icon: BarChart3,
  },
  {
    name: "Reliable Uptime",
    description: "Trust your links with our 99.9% guaranteed service uptime.",
    icon: ShieldCheck,
  },
]

export function Features() {
  return (
    <section className="relative z-10 bg-cream py-24 dark:bg-zinc-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
          <p className="font-display mt-2 text-3xl tracking-tight text-ink dark:text-zinc-100 sm:text-4xl">
            Short links with superpowers
          </p>
          <p className="mt-6 text-lg leading-8 text-steel dark:text-zinc-400">
            Ziplinker goes beyond just shortening. We provide the tools you need to manage, track, and brand every link you share.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-ink dark:text-zinc-100">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-steel dark:text-zinc-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
