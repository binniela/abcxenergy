"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ArrowRight,
  Home,
} from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { Container, Eyebrow, Button } from "@/components/ui";
import { Field, Input, Textarea, Select } from "@/components/form";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  const [topic, setTopic] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [requestId, setRequestId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <Container className="py-12 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="max-w-xl">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-1 sm:text-4xl">
            Talk to a real person who knows HVAC.
          </h1>
          <p className="mt-3 text-ink-2">
            Pricing, stock, specs, warranty, or you&apos;re a homeowner who
            needs an installer. Tell us what&apos;s up.
          </p>

          {/* Homeowner secondary path — capture & hand off, never dominate */}
          <div className="mt-6 flex items-start gap-3 rounded-[--r-md] border border-line bg-surface-2/60 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-[--r-sm] bg-surface-3 text-ink-3">
              <Home size={17} />
            </span>
            <p className="text-sm text-ink-2">
              <span className="font-semibold text-ink-1">Homeowner? </span>{" "}
              We&apos;re a wholesaler, so we do not install, but pick “Find an
              installer” below and we&apos;ll connect you with a vetted TCL
              contractor near you.
            </p>
          </div>

          {sent ? (
            <div className="mt-8 rounded-[--r-md] border border-eco/30 bg-eco-tint/50 p-6">
              <CheckCircle2 className="text-eco" size={28} />
              <h2 className="mt-3 font-display text-xl font-semibold text-ink-1">
                Message prepared.
              </h2>
              <p className="mt-2 text-ink-2">
                Your details are ready for follow-up. For urgent pricing, stock,
                or installer help, call{" "}
                <a href={SITE.phoneHref} className="font-medium text-brand">
                  {SITE.phone}
                </a>
                .
              </p>
              {requestId && (
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-3">
                  Request ID {requestId}
                </p>
              )}
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setError(null);
                const form = new FormData(e.currentTarget);
                const response = await fetch("/api/contact-requests", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    topic,
                    name: String(form.get("name") ?? ""),
                    email: String(form.get("email") ?? ""),
                    message: String(form.get("message") ?? ""),
                  }),
                });
                const payload = await response.json();
                setIsSubmitting(false);
                if (!response.ok || !payload.ok) {
                  setError(payload.error ?? "Could not prepare message.");
                  return;
                }
                setRequestId(payload.id ?? null);
                setSent(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-8 flex flex-col gap-5"
            >
              <Field label="I'm reaching out about" required>
                <Select
                  name="topic"
                  value={topic}
                  onChange={setTopic}
                  placeholder="Choose a topic"
                  options={[
                    { value: "pricing", label: "Pricing & availability" },
                    { value: "account", label: "Opening a wholesale account" },
                    { value: "specs", label: "Specs / warranty question" },
                    {
                      value: "installer",
                      label: "Homeowner - find an installer",
                    },
                    { value: "other", label: "Something else" },
                  ]}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" required>
                  <Input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Email" required>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                  />
                </Field>
              </div>
              <Field label="Message" required>
                <Textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="How can we help?"
                />
              </Field>
              <Button type="submit" size="lg" className="self-start">
                {isSubmitting ? "Preparing..." : "Prepare message"}{" "}
                <ArrowRight size={18} />
              </Button>
              {error && <p className="text-sm text-danger">{error}</p>}
            </form>
          )}
        </div>

        {/* NAP aside */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[--r-md] border border-line bg-surface-1 p-6 shadow-[var(--shadow-sm)]">
            <dl className="space-y-4 text-[15px]">
              <Row icon={<MapPin size={18} />} label="Address">
                {SITE.address.full}
              </Row>
              <Row icon={<Phone size={18} />} label="Phone">
                <a
                  href={SITE.phoneHref}
                  className="text-brand hover:text-brand-hover"
                >
                  {SITE.phone}
                </a>
              </Row>
              <Row icon={<Mail size={18} />} label="Email">
                <a
                  href={SITE.emailHref}
                  className="text-brand hover:text-brand-hover"
                >
                  {SITE.email}
                </a>
              </Row>
              <Row icon={<Clock size={18} />} label="Hours">
                {SITE.hours}
              </Row>
            </dl>
          </div>
          <Link
            href="/dealers"
            className="mt-4 flex items-center justify-between gap-3 rounded-[--r-md] border border-line bg-brand-tint p-4 text-brand transition-colors hover:bg-brand/15"
          >
            <span className="text-sm font-semibold">
              Ready to open an account?
            </span>
            <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </Container>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[--r-sm] bg-surface-2 text-ink-3">
        {icon}
      </span>
      <div>
        <dt className="font-mono text-xs uppercase tracking-wider text-ink-3">
          {label}
        </dt>
        <dd className="mt-0.5 text-ink-1">{children}</dd>
      </div>
    </div>
  );
}
