import { useContext, useMemo, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Product from "../components/product";
import { ProductImage, Section } from "../components/common";

const categoryConfig = [
  {
    key: "fashion",
    name: "Fashion",
    icon: "",
    subs: ["men fashion", "women fashion", "kids fashion"],
  },
  {
    key: "footwear",
    name: "Footwear",
    icon: "",
    subs: ["men footwear", "women footwear", "kids footwear"],
  },
  {
    key: "electronics",
    name: "Electronics",
    icon: "",
    subs: [
      "smartphones",
      "laptops",
      "tablets",
      "televisions",
      "cameras",
      "audio",
      "computer accessories",
      "wearables",
      "gaming",
    ],
  },
  {
    key: "beauty",
    name: "Beauty & Personal Care",
    icon: "",
    subs: ["skincare", "makeup", "haircare", "fragrance"],
  },
  {
    key: "toys",
    name: "Toys",
    icon: "",
    subs: ["kids toys", "educational toys", "board games"],
  },
  {
    key: "home",
    name: "Home",
    icon: "",
    subs: ["furniture", "home decor", "kitchen accessories"],
  },
  {
    key: "accessories",
    name: "Accessories",
    icon: "",
    subs: ["watches", "bags", "jewelry", "sunglasses"],
  },
  {
    key: "sports",
    name: "Sports",
    icon: "",
    subs: ["football", "cricket", "badminton", "tennis"],
  },
];

const title = (v) =>
  String(v || "").replace(/\b\w/g, (x) => x.toUpperCase());

export default function Categories({ navigate, currentData }) {
  const { allProducts } = useContext(ProductContext);

  const [selected, setSelected] = useState(() => {
    if (!currentData?.selectedCategory) return null;

    const category = categoryConfig.find(
      (c) => c.key === currentData.selectedCategory
    );

    if (!category) return null;

    return {
      ...category,
      sub: currentData.selectedSubCategory || "",
    };
  });

  const [sort, setSort] = useState("recommended");

  const available = useMemo(
    () =>
      categoryConfig.map((c) => {
        const items = allProducts.filter((p) => p.category === c.key);

        return {
          ...c,
          count: items.length,
          cover: items[0],
        };
      }),
    [allProducts]
  );

  const products = useMemo(() => {
    if (!selected) return [];

    let list = allProducts.filter(
      (p) => p.category === selected.key
    );

    if (selected.sub) {
      list = list.filter(
        (p) => p.subCategory === selected.sub
      );
    }

    if (sort === "priceLow") {
      list = [...list].sort((a, b) => a.price - b.price);
    }

    if (sort === "priceHigh") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    if (sort === "discount") {
      list = [...list].sort((a, b) => b.discount - a.discount);
    }

    return list;
  }, [allProducts, selected, sort]);

  const openCategory = (category) => {
    setSelected({
      ...category,
      sub: "",
    });

    setSort("recommended");
  };

  return (
    <>
      <Header navigate={navigate} />

      <Navigation navigate={navigate} />

      <main className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6">

        {!selected ? (
          <>
            <p className="text-xs font-black uppercase tracking-[.25em] text-[var(--theme-primary)]">
              Browse
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Shop by Category
            </h1>

            <p className="mt-2 max-w-2xl text-[var(--theme-muted)]">
              Choose a category first, then explore its subcategories and
              products.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {available.map((c) => (
                <button
                  key={c.key}
                  onClick={() => openCategory(c)}
                  className="overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-28 overflow-hidden bg-[var(--theme-bg)]">
                    <ProductImage
                      src={c.cover?.image}
                      images={c.cover?.images}
                      alt={c.name}
                      product={c.cover}
                      className="h-full w-full"
                    />
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-black">
                      {c.name}
                    </h2>

                    <p className="mt-1 text-sm text-[var(--theme-muted)]">
                      {c.count} products
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelected(null)}
              className="mb-5 font-black"
            >
              ← Back to Categories
            </button>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.25em] text-[var(--theme-primary)]">
                  Category
                </p>

                <h1 className="mt-2 text-4xl font-black">
                  {selected.name}
                </h1>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 font-bold"
              >
                <option value="recommended">Recommended</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>

            <div className="mt-7 flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() =>
                  setSelected({
                    ...selected,
                    sub: "",
                  })
                }
                className={`whitespace-nowrap rounded-full px-5 py-3 font-black ${
                  !selected.sub
                    ? "bg-[var(--theme-primary)] text-white"
                    : "border"
                }`}
              >
                All {selected.name}
              </button>

              {selected.subs.map((sub) => (
                <button
                  key={sub}
                  onClick={() =>
                    setSelected({
                      ...selected,
                      sub,
                    })
                  }
                  className={`whitespace-nowrap rounded-full px-5 py-3 font-bold ${
                    selected.sub === sub
                      ? "bg-[var(--theme-primary)] text-white"
                      : "border"
                  }`}
                >
                  {title(sub)}
                </button>
              ))}
            </div>

            <Section
              title={
                selected.sub
                  ? title(selected.sub)
                  : `${selected.name} Products`
              }
              subtitle={`${products.length} products available`}
            >
              {products.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((p, i) => (
                    <Product
                      key={p.id}
                      product={{
                        ...p,
                        __returnCategory: selected.key,
                        __returnSubCategory: selected.sub || "",
                      }}
                      navigate={navigate}
                      priority={i < 4}
                    />
                  ))}
                </div>
              ) : null}
            </Section>
          </>
        )}
      </main>
    </>
  );
}