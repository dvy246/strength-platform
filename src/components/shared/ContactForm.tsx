import React, { useState } from "react"
import { Send, Copy, Check, ExternalLink } from "lucide-react"

type InquiryCategory = "feedback" | "standards" | "bug" | "feature" | "partnership"

const CATEGORIES: { id: InquiryCategory; label: string }[] = [
  { id: "feedback", label: "General Feedback" },
  { id: "standards", label: "Data / Standards Inquiry" },
  { id: "feature", label: "Feature Request" },
  { id: "bug", label: "Report a Bug" },
  { id: "partnership", label: "Partnership / Research" },
]

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState<InquiryCategory>("feedback")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supportEmail = "support@strengthchecker.com"

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(false)
    }
  }

  const buildMailtoUrl = () => {
    const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label || "Inquiry"
    const fullSubject = `[${categoryLabel}] ${subject.trim() || "StrengthAtlas Inquiry"}`
    const bodyContent = `Name: ${name}
Email: ${email}
Category: ${categoryLabel}

Message:
${message}

---
Sent via StrengthAtlas Contact Form`

    return `mailto:${supportEmail}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(bodyContent)}`
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      return
    }

    setIsSubmitting(true)

    // Trigger mail client as fallback & update UI
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Open the user's default email client pre-filled
      const mailtoUrl = buildMailtoUrl()
      window.location.href = mailtoUrl
    }, 400)
  }

  const handleReset = () => {
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setCategory("feedback")
    setIsSubmitted(false)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 shadow-md md:p-8 backdrop-blur-sm">
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Check className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-foreground">Message Ready to Send!</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            Your default email client has been opened with your inquiry pre-populated. If it didn't open automatically, you can send it directly to our support inbox:
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildMailtoUrl()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Launch Mail Client</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy {supportEmail}</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="mt-6 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Submit Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
          {/* Category Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Inquiry Type
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    category === cat.id
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name and Email Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Your Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Bench Press coefficient calibration suggestion"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
            />
          </div>

          {/* Message Area */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Message <span className="text-primary">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide as much context as possible (exercise names, formula suggestions, browser/device info if reporting an issue)..."
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim() || !message.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 active:scale-[0.99] select-none transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <span>Preparing Message...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-[0.98] cursor-pointer"
              title="Copy direct email address"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
