"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Is Ziplinker free to use?",
    answer:
      "Yes, our core features including unlimited links and basic analytics are completely free forever.",
  },
  {
    question: "Can I track who clicked my link?",
    answer:
      "Yes, our dashboard provides click analytics so you can see when and where your links are being used.",
  },
  {
    question: "Do my short links expire?",
    answer:
      "Not unless you set an explicit expiration date. By default, your links will remain active indefinitely.",
  }
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white py-24 dark:bg-zinc-900 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-zinc-200 dark:divide-zinc-800">
          <h2 className="font-display text-2xl font-bold leading-10 tracking-tight text-ink dark:text-zinc-100">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-zinc-200 dark:divide-zinc-800">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div key={faq.question} className="pt-6">
                  <dt>
                    <button
                      onClick={() => toggle(index)}
                      className="flex w-full items-start justify-between text-left text-ink dark:text-zinc-100"
                    >
                      <span className="text-base font-semibold leading-7">
                        {faq.question}
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        <ChevronDown
                          className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                            }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </dt>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.dd
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden pr-12"
                      >
                        <p className="mt-2 pb-2 text-base leading-7 text-steel dark:text-zinc-400">
                          {faq.answer}
                        </p>
                      </motion.dd>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </section>
  )
}
