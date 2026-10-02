import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import { UserContext } from "../context/UserContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {
  Button,
  EmptyState,
  ProductImage,
  Section,
} from "../components/common";

export default function Cart({ navigate }) {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } =
    useContext(CartContext);

  const { allProducts } = useContext(ProductContext);

  const { isLoggedIn } = useContext(UserContext);

  // Controls checkout login popup
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const rec = allProducts
    .filter((p) => !items.some((x) => x.id === p.id))
    .slice(0, 4);

  const handleCheckout = () => {
    // Not logged in → show popup
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    // Logged in → directly go to checkout
    navigate("checkout");
  };

  return (
    <>
      <Header navigate={navigate} />
      <Navigation navigate={navigate} />

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6">
        <h1 className="text-3xl font-black">Your Cart</h1>

        {!items.length ? (
          <EmptyState
            title="Your cart is empty"
            description="Add something you like and it will appear here."
            action="Start Shopping"
            onAction={() => navigate("products")}
          />
        ) : (
          <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {items.map((p) => (
                <article
                  key={p.id}
                  className="flex gap-4 rounded-2xl border bg-[var(--theme-surface)] p-4"
                >
                  <div className="h-36 w-36 shrink-0 overflow-hidden rounded-xl">
                    <ProductImage
                      src={p.image}
                      alt={p.name}
                      product={p}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--theme-muted)]">
                      {p.brand}
                    </p>

                    <h2 className="font-black">{p.name}</h2>

                    <b className="mt-2 block">
                      ₹{p.price.toLocaleString()}
                    </b>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-xl border">
                        <button
                          onClick={() =>
                            updateQuantity(p.id, p.quantity - 1)
                          }
                          className="px-3 py-2"
                        >
                          −
                        </button>

                        <span className="px-3 font-bold">
                          {p.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(p.id, p.quantity + 1)
                          }
                          className="px-3 py-2"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(p.id)}
                        className="font-bold text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-3xl border p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-black">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <b>₹{subtotal.toLocaleString()}</b>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <b>{shipping ? `₹${shipping}` : "FREE"}</b>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg">
                  <span>Total</span>
                  <b>₹{total.toLocaleString()}</b>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[var(--theme-bg)] p-4 text-sm font-bold">
                {subtotal >= 999
                  ? "🎉 You unlocked free shipping"
                  : "Add ₹" +
                    (999 - subtotal).toLocaleString() +
                    " for free shipping"}
              </div>

              <Button
                className="mt-5 w-full"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </aside>
          </div>
        )}

        <Section title="You may also like">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {rec.map((p) => (
              <article key={p.id} className="rounded-2xl border p-3">
                <ProductImage
                  src={p.image}
                  alt={p.name}
                  product={p}
                  className="aspect-square w-full rounded-xl"
                />

                <p className="mt-2 line-clamp-2 text-sm font-bold">
                  {p.name}
                </p>

                <button
                  onClick={() => navigate("productDetails", p)}
                  className="mt-2 font-bold text-[var(--theme-primary)]"
                >
                  View →
                </button>
              </article>
            ))}
          </div>
        </Section>
      </main>

      {/* ============================= */}
      {/* CHECKOUT LOGIN POPUP */}
      {/* ============================= */}

      {showLoginPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-7 text-center shadow-2xl">

            {/* Lock Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              🔐
            </div>

            {/* Title */}
            <h2 className="mt-6 text-2xl font-black text-[#111827]">
              Login to continue
            </h2>

            {/* Description */}
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Please login or create an account before proceeding to
              checkout.
            </p>

            {/* Login */}
            <button
              onClick={() => {
                setShowLoginPopup(false);
                navigate("login");
              }}
              className="mt-7 w-full rounded-xl bg-[#111827] px-5 py-4 font-black text-white transition hover:opacity-90"
            >
              Login →
            </button>

            {/* Create Account */}
            <button
              onClick={() => {
                setShowLoginPopup(false);
                navigate("register");
              }}
              className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-5 py-4 font-black text-[#111827] transition hover:bg-gray-50"
            >
              Create Account
            </button>

            {/* Cancel */}
            <button
              onClick={() => setShowLoginPopup(false)}
              className="mt-5 font-bold text-gray-400 transition hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}