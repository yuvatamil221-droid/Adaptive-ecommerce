import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { ProductImage, EmptyState } from "./common";
export default function Search({ navigate, goBack }) {
  const { allProducts } = useContext(ProductContext);
  const [q, setQ] = useState("");
  const recent = ["sneakers", "smart watch", "beauty", "headphones"];
  const results = q
    ? allProducts
        .filter((p) =>
          `${p.name} ${p.brand} ${p.category} ${p.department}`
            .toLowerCase()
            .includes(q.toLowerCase()),
        )
        .slice(0, 30)
    : [];
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 pb-28 sm:px-6">
      <button
        onClick={goBack || (() => navigate("home"))}
        className="font-black"
      >
        ← Back
      </button>
      <h1 className="mt-5 text-3xl font-black">Search</h1>
      <div className="mt-5 flex gap-2">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, brands or categories"
          className="flex-1 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-4 outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
        />
        <button
          onClick={() => setQ("")}
          className="rounded-2xl border px-5 font-bold"
        >
          Clear
        </button>
      </div>
      {!q && (
        <div className="mt-8">
          <p className="font-black">Trending searches</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recent.map((x) => (
              <button
                key={x}
                onClick={() => setQ(x)}
                className="rounded-full bg-[var(--theme-bg)] px-4 py-2 text-sm font-bold"
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      )}
      {q && (
        <div className="mt-8">
          {results.length === 0 ? (
            <EmptyState
              title="No results"
              description="Try another product, brand or category."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate("productDetails", p)}
                  className="overflow-hidden rounded-2xl border text-left"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
  <ProductImage
    src={p.image}
    images={p.images}
    alt={p.name}
    product={p}
    className="absolute inset-0 h-full w-full object-cover"
  />
</div>
                  <div className="p-3">
                    <p className="text-xs text-[var(--theme-muted)]">
                      {p.brand}
                    </p>

                    <p className="mt-1 font-bold">{p.name}</p>

                    <b className="mt-2 block">
                      ₹{p.price.toLocaleString("en-IN")}
                    </b>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
