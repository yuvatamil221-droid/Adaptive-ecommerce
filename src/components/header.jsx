import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { UserContext } from "../context/UserContext";
import ExperienceSwitcher from "./experienceSwitcher";

export default function Header({ navigate }) {
  const { items } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { isLoggedIn, account, activeProfile } = useContext(UserContext);
  const initial = (activeProfile?.name || account?.name || "A")
    .trim()
    .slice(0, 1)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={() => navigate("home")}
          aria-label="Adaptive home"
          className="flex items-center gap-2 text-xl font-black tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--theme-primary)] text-white shadow-sm">
            A
          </span>
          <span className="hidden sm:inline">
            Adaptive<span className="text-[var(--theme-primary)]">.</span>
          </span>
        </button>

        <button
          onClick={() => navigate("search")}
          className="hidden sm:flex flex-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg)] px-5 py-3 text-left text-sm text-[var(--theme-muted)] md:block"
        >
          Search products, brands and categories…
        </button>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
          <ExperienceSwitcher navigate={navigate} />
          <button
  aria-label="Search"
  onClick={() => navigate("search")}
  className="flex sm:hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-[var(--theme-surface)]"
>
            ⌕
          </button>
          <button
            onClick={() => navigate("wishlist")}
            className="relative rounded-full p-3"
          >
            ♡
            {wishlist.length > 0 && (
              <b className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--theme-primary)] px-1 text-[10px] text-white">
                {wishlist.length}
              </b>
            )}
          </button>
          <button
            onClick={() => navigate("cart")}
            className="relative rounded-full p-3"
          >
            🛒
            {items.length > 0 && (
              <b className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--theme-primary)] px-1 text-[10px] text-white">
                {items.length}
              </b>
            )}
          </button>
          <button
            onClick={() => navigate(isLoggedIn ? "profile" : "login")}
            aria-label={isLoggedIn ? "Profile" : "Login"}
            style={
              isLoggedIn
                ? {
                    backgroundColor: "var(--theme-primary)",
                    borderColor: "var(--theme-primary)",
                    color: "#fff",
                  }
                : undefined
            }
className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--theme-border)] font-black"
          >
            {isLoggedIn ? initial : "↪"}
          </button>
        </div>
      </div>
    </header>
  );
}
