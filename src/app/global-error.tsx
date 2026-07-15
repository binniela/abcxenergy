"use client"; // Root fallback — replaces the entire document when the shell itself fails.

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#f7f9fa",
          color: "#1d2b33",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: 480 }}>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Summit HVAC Supply is briefly unavailable</h1>
          <p style={{ marginTop: 12, lineHeight: 1.6, color: "#44565f" }}>
            Please try again — or call <a href="tel:+14159884445" style={{ color: "#1f5f4f", fontWeight: 600 }}>(415) 988-4445</a> and
            we&apos;ll help you by phone.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: 12, color: "#8a979e", fontFamily: "ui-monospace, monospace" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={() => unstable_retry()}
            style={{
              marginTop: 20,
              height: 44,
              padding: "0 24px",
              borderRadius: 7,
              border: "none",
              background: "#1f5f4f",
              color: "#f4faf8",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
