import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {
  Button,
  EmptyState,
  ProductImage,
  Section,
} from "../components/common";
export default function Cart({ navigate, goBack }) {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } =
    useContext(CartContext);
  const { allProducts } = useContext(ProductContext);
  const rec = allProducts
    .filter((p) => !items.some((x) => x.id === p.id))
    .slice(0, 4);
  return (
    <>
      <Header navigate={navigate} />
      <Navigation navigate={navigate} />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-36 sm:px-6">
       <button
  type="button"
  onClick={goBack}
  className="mb-6 inline-flex items-center font-bold text-gray-600 hover:text-gray-900"
>
  ← Back
</button>
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
                  <div className="w-36 h-36 shrink-0 overflow-hidden rounded-xl">
  <ProductImage
    src={p.image}
    alt={p.name}
    product={p}
    className="w-full h-full object-cover rounded-xl"
  />
</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--theme-muted)]">
                      {p.brand}
                    </p>
                    <h2 className="font-black">{p.name}</h2>
                    <b className="mt-2 block">₹{p.price.toLocaleString()}</b>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-xl border">
                        <button
                          onClick={() => updateQuantity(p.id, p.quantity - 1)}
                          className="px-3 py-2"
                        >
                          −
                        </button>
                        <span className="px-3 font-bold">{p.quantity}</span>
                        <button
                          onClick={() => updateQuantity(p.id, p.quantity + 1)}
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
                <div className="border-t pt-3 flex justify-between text-lg">
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
                onClick={() => navigate("checkout")}
              >
                Checkout
              </Button>
            </aside>
          </div>
        )}
        <Section title="You may also like">
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pb-24">
    {rec.map((p) => (
      <article
        key={p.id}
        className="min-w-0 h-full rounded-2xl border p-3 flex flex-col overflow-hidden"
      >
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl">
          <ProductImage
            src={p.image}
            alt={p.name}
            product={p}
            className="absolute inset-0 h-full w-full object-cover rounded-xl"
          />
        </div>

        <p className="mt-2 min-h-[48px] text-sm font-bold leading-6 break-words">
          {p.name}
        </p>

        <button
          onClick={() => navigate("productDetails", p)}
          className="mt-2 shrink-0 text-left font-bold text-[var(--theme-primary)]"
        >
          View →
        </button>
      </article>
    ))}
  </div>
</Section>
      </main>
    </>
  );
}
