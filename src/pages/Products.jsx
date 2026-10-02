import { useContext, useEffect, useMemo, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { UserContext } from "../context/UserContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Product from "../components/product";
import Filters from "../components/filters";
import { EmptyState, SkeletonCard } from "../components/common";

function applyFilters(products, filters) {
  let list = [...products];

  if (filters.deal) {
    list = list.filter(function (p) { return p.deal && p.discount >= 20; });
  }

  if (filters.under999) {
    list = list.filter(function (p) { return p.price < 999; });
  }

  if (filters.flashSale) {
    list = list.filter(function (p) {
      return p.flashSale && p.discount >= 30;
    });
  }

  if (filters.newArrivals) {
    list = list.filter(function (p) {
      return p.newArrival;
    });
  }

  if (filters.trending) {
    list = list.filter(function (p) {
      return p.trending;
    });
  }

  if (filters.reorder) {
    list = list.filter(function (p) {
      return p.trending || p.newArrival;
    });
  }

  if (filters.minPrice) {
    list = list.filter(function (p) {
      return p.price >= Number(filters.minPrice);
    });
  }

  if (filters.maxPrice) {
    list = list.filter(function (p) {
      return p.price <= Number(filters.maxPrice);
    });
  }

  if (filters.category) {
    list = list.filter(function (p) {
      return p.category === filters.category || p.subCategory === filters.category;
    });
  }

  if (filters.minRating) {
    list = list.filter(function (p) {
      return Number(p.rating) >= Number(filters.minRating);
    });
  }

  if (filters.discount) {
    list = list.filter(function (p) {
      return Number(p.discount) >= Number(filters.discount);
    });
  }

  if (filters.priceRange) {
    {
      const parts = filters.priceRange.split("-").map(Number);
      const min = parts[0];
      const max = parts[1];
      list = list.filter(function (p) { return p.price >= min && p.price <= max; });
    }
  }

  return list;
}

export default function Products({ navigate, filters = {}, currentPage, currentData }) {
  const { allProducts, loading, error, recommend } = useContext(ProductContext);
  const { preferences } = useContext(UserContext);
  const [local, setLocal] = useState(filters || {});
  const [sort, setSort] = useState("recommended");

  useEffect(function () {
    setLocal(filters || {});
  }, [JSON.stringify(filters)]);

  const merged = { ...filters, ...local };

  const filtered = useMemo(function () {
    return applyFilters(allProducts, merged);
  }, [allProducts, JSON.stringify(merged)]);

  const recommended = useMemo(function () {
    return recommend(preferences, filtered);
  }, [filtered, preferences]);

  const sorted = useMemo(function () {
    const list = [...recommended];

    if (sort === "discount") list.sort(function (a, b) { return b.discount - a.discount; });
    if (sort === "rating") list.sort(function (a, b) { return b.rating - a.rating; });
    if (sort === "priceLow") list.sort(function (a, b) { return a.price - b.price; });
    if (sort === "priceHigh") list.sort(function (a, b) { return b.price - a.price; });

    return list;
  }, [recommended, sort]);

  const isFlash = !!merged.flashSale;

  let layoutClass = "lg:grid-cols-[260px_1fr]";
  if (isFlash || merged.under999) layoutClass = "";

  let title = "Shop Products";
  if (isFlash) {
    title = "Flash Sale";
  } else if (merged.under999) {
    title = "Under ₹999";
  } else if (merged.deal) {
    title = "Top Deals";
  } else if (merged.category) {
    title = String(merged.category).replace(/-/g, " ") + " Products";
  }

  function clearFilters() {
    setLocal({deal:filters.deal,flashSale:filters.flashSale,under999:filters.under999});
  }

  return (
    <>
      <Header navigate={navigate} />
      <Navigation
        navigate={navigate}
        currentPage={currentPage}
        currentData={currentData}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[var(--theme-primary)]">
              {preferences.experience}
            </p>
            <h1 className="text-3xl font-black capitalize">{title}</h1>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">
              {sorted.length} products available from the online source
            </p>
          </div>

          <select
            value={sort}
            onChange={function (e) { setSort(e.target.value); }}
            className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 text-sm font-bold"
          >
            <option value="recommended">Recommended</option>
            <option value="discount">Discount</option>
            <option value="rating">Rating</option>
            <option value="priceLow">Price low to high</option>
            <option value="priceHigh">Price high to low</option>
          </select>
        </div>

        {isFlash && (
          <div className="mt-5 rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[.25em]">Limited time</p>
            <h2 className="mt-2 text-3xl font-black">Flash Sale</h2>
            <p className="mt-1">Only products with a strong flash-sale discount are shown here.</p>
          </div>
        )}

        <div className={"mt-6 grid gap-6 " + layoutClass}>
          {!isFlash && !merged.under999 && (
            <Filters
              products={allProducts}
              value={local}
              onChange={setLocal}
            />
          )}

          <div>
            {error ? (
              <EmptyState
                title="Product API error"
                description={error}
                action="Try again"
                onAction={function () { location.reload(); }}
              />
            ) : loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(function (x) {
                  return <SkeletonCard key={x} />;
                })}
              </div>
            ) : sorted.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try another category, price range, rating or discount combination."
                action="Clear filters"
                onAction={clearFilters}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {sorted.map(function (p, i) {
                  return <Product key={p.id} product={p} navigate={navigate} priority={i < 12} />;
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
