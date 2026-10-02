import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {
  EmptyState,
  Button,
  ProductImage,
  Section,
} from "../components/common";
export default function Wishlist({ navigate, goBack }) {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  return (
    <>
      <Header navigate={navigate} />
      <Navigation navigate={navigate} />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6">
        <button onClick={goBack} className="mb-5 font-bold">
          ← Back
        </button>
        <h1 className="text-3xl font-black">Wishlist</h1>
        {!wishlist.length ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Save products you love and compare them later."
            action="Explore Products"
            onAction={() => navigate("products")}
          />
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((p) => (
              <article key={p.id} className="flex gap-4 rounded-2xl border p-4 min-w-0 overflow-hidden">
                <div className="w-32 h-32 shrink-0 overflow-hidden rounded-xl">
  <ProductImage
    src={p.image}
    alt={p.name}
    product={p}
    className="w-full h-full object-cover rounded-xl"
  />
</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--theme-muted)]">{p.brand}</p>
                  <h2 className="line-clamp-2 font-black">{p.name}</h2>
                  <b className="mt-2 block">₹{p.price.toLocaleString()}</b>
                  <div className="mt-3 flex gap-2">
                    <Button className="px-3 py-2" onClick={() => addToCart(p)}>
                      Move to cart
                    </Button>
                    <button
                      onClick={() => removeFromWishlist(p.id)}
                      className="px-3 font-bold text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
