import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../auth/authApi";
import { useAuth } from "../auth/AuthContext";
import { Icon, type IconName } from "./Icon";
import { Avatar, Brand } from "./ui";

const travelerNav: readonly { to: string; label: string; icon: IconName }[] = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/assistant", label: "Travel Assistant", icon: "sparkles" },
  { to: "/helpers", label: "Travel Helper", icon: "users" },
  { to: "/comparison", label: "Market Analysis", icon: "scale" },
  { to: "/sos", label: "SOS", icon: "shield" },
  { to: "/profile", label: "Profile", icon: "user" }
];

const helperNav: readonly { to: string; label: string; icon: IconName }[] = [
  { to: "/helper/dashboard", label: "Helper home", icon: "dashboard" },
  { to: "/helpers", label: "Helper network", icon: "users" },
  { to: "/helpers/alert", label: "Raise alert", icon: "shield" },
  { to: "/profile", label: "My profile", icon: "user" }
];

export default function AppShell({ children, fullHeight, helperMode = false }: { children: ReactNode; fullHeight?: boolean; helperMode?: boolean }) {
  const navigate = useNavigate();
  const { user, signOut, isHelper } = useAuth();
  const showHelperNavigation = helperMode || isHelper;
  const nav = showHelperNavigation ? helperNav : travelerNav;

  async function handleLogout() {
    await logout();
    signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <NavLink to={showHelperNavigation ? "/helper/dashboard" : "/dashboard"} className="shrink-0">
              <Brand />
            </NavLink>
            <nav className="hidden items-center gap-1.5 lg:flex">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/helpers"}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors ${
                      isActive
                        ? "bg-ink text-canvas shadow-sm"
                        : "text-ink-soft hover:bg-surface hover:text-ink"
                    }`
                  }
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="hidden items-center gap-4 lg:flex">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name} />
                <div className="text-right">
                  <p className="text-sm font-medium leading-tight">{user?.name}</p>
                  <p className="text-xs text-ink-faint">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="btn btn-ghost px-3!"
              >
                <Icon name="logout" className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <Avatar name={user?.name} className="h-8 w-8 text-[0.7rem]" />
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="btn btn-ghost px-2.5!"
              >
                <Icon name="logout" className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-ink text-canvas"
                      : "text-ink-soft hover:bg-surface hover:text-ink"
                  }`
                }
              >
                <Icon name={item.icon} className="h-3.5 w-3.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main
        id="main-content"
        className={
          fullHeight
            ? "page-fade flex h-[calc(100vh-4rem)] flex-col overflow-hidden"
            : "page-fade mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12"
        }
      >
        {children}
      </main>
    </div>
  );
}
