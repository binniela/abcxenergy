import { requireStaff } from "@/lib/backend/auth";
import { signOut } from "@/lib/backend/auth-actions";
import { hasSupabaseAuthEnv } from "@/lib/backend/supabase-ssr";

/**
 * Staff-only gate. When Supabase auth is configured, non-staff and guests are
 * redirected (the page never renders). Without auth env (local seeded mode), it
 * falls through so the demo dashboard stays viewable.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let staffName: string | null = null;

  if (hasSupabaseAuthEnv()) {
    const profile = await requireStaff();
    staffName = profile.name;
  }

  return (
    <>
      {staffName && (
        <div className="border-b border-line bg-surface-1">
          <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-2 text-sm sm:px-6 lg:px-8">
            <span className="text-ink-3">
              Signed in as <span className="font-medium text-ink-1">{staffName}</span>
            </span>
            <form action={signOut}>
              <button type="submit" className="font-medium text-brand hover:text-brand-hover">
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
