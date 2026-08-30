import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../auth/authApi";
import { useAuth } from "../auth/AuthContext";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/trips/new", label: "Trip consultation" },
  { to: "/comparison", label: "Market analysis" },
  { to: "/prediction", label: "Intelligence" },
  { to: "/sos", label: "SOS research" },
  { to: "/profile", label: "Profile" }
];

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await logout();
    signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center justify-between gap-4">
            <NavLink to="/dashboard" className="font-display text-lg">
              Savei<span className="text-accent-green">Trip</span>
            </NavLink>
            <div className="md:hidden text-right text-xs text-ink-faint">{user?.name}</div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `shrink-0 rounded-sm px-3 py-2 text-sm transition ${
                    isActive ? "bg-ink text-canvas" : "text-ink-soft hover:bg-surface hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-ink-faint">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="rounded-sm border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-ink hover:text-ink">
              Log out
            </button>
          </div>
          <button onClick={handleLogout} className="rounded-sm border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-ink hover:text-ink md:hidden">
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">{children}</main>
    </div>
  );
}
