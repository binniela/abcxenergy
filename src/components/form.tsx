import * as React from "react";

/* Form primitives — inset control surface (darker than card), brand focus ring.
   Inputs are "wells" that receive content, per the depth system. */

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-1">
        {label}
        {required && <span className="ml-0.5 text-copper">*</span>}
        {hint && <span className="ml-2 font-normal text-ink-3">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const controlClass =
  "w-full rounded-[--r-sm] border border-control-border bg-control-bg px-3.5 text-[15px] text-ink-1 " +
  "placeholder:text-ink-4 transition-colors hover:border-ink-4 focus:border-brand focus:bg-surface-1 " +
  "focus:outline-none focus:ring-2 focus:ring-brand/25";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} h-11 ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlClass} resize-y py-2.5 ${props.className ?? ""}`} />;
}

/* Custom select trigger styled to match — native <select> can't be themed.
   Lightweight controlled version for prototype forms. */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  name?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${controlClass} flex h-11 items-center justify-between text-left ${
          selected ? "" : "text-ink-4"
        }`}
      >
        {selected ? selected.label : placeholder}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="ml-2 shrink-0 text-ink-3">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded-[--r-sm] border border-line bg-surface-1 p-1 shadow-[var(--shadow-lg)]"
        >
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full rounded-[5px] px-3 py-2 text-left text-sm transition-colors ${
                  o.value === value
                    ? "bg-brand-tint font-medium text-brand"
                    : "text-ink-1 hover:bg-surface-2"
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
