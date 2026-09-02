import AppShell from "../shared/AppShell";
import { useAuth } from "../auth/AuthContext";
import { Avatar } from "../shared/ui";

const fields = ["Name", "Email", "Authentication provider", "Created"] as const;

export default function ProfilePage() {
  const { user } = useAuth();

  const valueMap: Record<string, string | undefined> = {
    Name: user?.name,
    Email: user?.email,
    "Authentication provider": user?.authProvider ? user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1) : undefined,
    Created: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : undefined
  };

  return (
    <AppShell>
      <section className="max-w-3xl">
        <p className="kicker">Account</p>
        <h1 className="font-display mt-3 text-4xl">Your SaveiTrip profile</h1>

        <div className="mt-8 flex items-center gap-5 rounded-xl border border-line bg-surface px-6 py-5 shadow-card">
          <Avatar name={user?.name} className="h-14 w-14 text-xl" />
          <div>
            <p className="font-display text-2xl">{user?.name}</p>
            <p className="text-sm text-ink-soft">{user?.email}</p>
          </div>
        </div>

        <div className="mt-5 card p-0 overflow-hidden">
          {fields.map((label, i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-6 py-4 ${
                i < fields.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <span className="text-sm text-ink-soft">{label}</span>
              <span className="text-sm font-medium">{valueMap[label]}</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
