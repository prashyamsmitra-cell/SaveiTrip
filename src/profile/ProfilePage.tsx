import AppShell from "../shared/AppShell";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <section className="max-w-3xl">
        <p className="text-sm text-ink-faint">Account</p>
        <h1 className="font-display mt-3 text-4xl">Your SaveiTrip profile</h1>
        <div className="mt-8 rounded-sm bg-surface p-6 shadow-[0_24px_70px_-45px_rgba(32,29,24,0.35)]">
          {[
            ["Name", user?.name],
            ["Email", user?.email],
            ["Authentication provider", user?.authProvider],
            ["Created", user?.createdAt ? new Date(user.createdAt).toLocaleString() : ""]
          ].map(([label, value]) => (
            <div key={label} className="border-b border-line py-4 last:border-none">
              <p className="text-xs text-ink-faint">{label}</p>
              <p className="mt-1 font-medium">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
