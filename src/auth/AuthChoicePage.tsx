import { Link } from "react-router-dom";
import { AuthFrame } from "./LoginPage";
import { Icon } from "../shared/Icon";

type ChoiceMode = "login" | "signup";

export default function AuthChoicePage({ mode }: { mode: ChoiceMode }) {
  const isSignup = mode === "signup";

  return (
    <AuthFrame
      compact
      title={isSignup ? "Choose your starting point." : "Choose your way in."}
      subtitle={isSignup ? "Create the SaveiTrip account that fits how you travel." : "Continue to the workspace built for your journey."}
    >
      <div className="space-y-3">
        <Link
          to={isSignup ? "/signup" : "/login"}
          className="group card flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-card-hover"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-green-soft text-accent-green transition-colors group-hover:bg-accent-green group-hover:text-canvas">
            <Icon name="user" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-2xl">Traveler</span>
            <span className="mt-1 block text-sm leading-5 text-ink-soft">Plan trips, explore destinations, and travel with more confidence.</span>
          </span>
          <Icon name="arrow-right" className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-ink" />
        </Link>

        <Link
          to={isSignup ? "/helper/signup" : "/helper/login"}
          className="group card flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-card-hover"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-amber-soft text-accent-amber transition-colors group-hover:bg-accent-amber group-hover:text-canvas">
            <Icon name="users" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-2xl">Travel Helper</span>
            <span className="mt-1 block text-sm leading-5 text-ink-soft">Share local knowledge and help travelers discover India.</span>
          </span>
          <Icon name="arrow-right" className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-ink" />
        </Link>
      </div>
    </AuthFrame>
  );
}
