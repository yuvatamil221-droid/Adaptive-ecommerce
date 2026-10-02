// Image-source layer only.
// The rest of the catalogue/UI is intentionally untouched.
//
// Rules:
// 1. A product image must belong to the product's exact collection/type.
// 2. Never fall back from one collection to another.
// 3. Never reuse the same source work/image for two products.
// 4. If a suitable image cannot be found, return no image instead of showing
//    an unrelated laptop, mascara, AirPods, etc. in another category.

const OPENVERSE_URL = "https://api.openverse.org/v1/images/";
const DUMMYJSON_URL = "https://dummyjson.com/products/category/";
const ESCUELA_URL = "https://api.escuelajs.co/api/v1/products?offset=0&limit=100";
const FAKESTORE_URL = "https://fakestoreapi.com/products";
const WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php";
const IMAGE_CACHE_KEY = "adaptive-image-sources-r17-strict";
const IMAGE_CACHE_TTL = 24 * 60 * 60 * 1000;

const clean = (v) => String(v || "").toLowerCase().replace(/\s+/g, " ").trim();
const cleanUrl = (v) => {
  if (!v) return "";
  let u = String(v).trim().replace(/^['"]|['"]$/g, "");
  if (u.startsWith("[")) {
    try { u = JSON.parse(u)[0] || ""; } catch {}
  }
  return /^https?:\/\//i.test(u) ? u : "";
};

function addCandidate(pool, item, source) {
  const url = cleanUrl(item?.url || item?.image || item?.thumbnail);
  if (!url) return;
  const workId = item?.identifier || item?.foreign_identifier || item?.id || url;
  const title = String(item?.title || item?.name || "");
  pool.push({
    url,
    key: `${source}:${workId}`,
    title,
    source,
  });
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Image source ${response.status}`);
  return response.json();
}

// Exact collection types used by the existing expanded catalogue.
const TYPE_RULES = {
  smartphones: { category: "electronics", queries: ["smartphone product photo", "mobile phone product photo"], terms: /smartphone|mobile phone|iphone|galaxy|pixel|phone/i },
  laptops: { category: "electronics", queries: ["laptop product photo", "notebook computer product photo"], terms: /laptop|notebook|macbook|thinkpad|pavilion|inspiron|computer/i },
  tablets: { category: "electronics", queries: ["tablet product photo", "ipad product photo"], terms: /tablet|ipad|galaxy tab/i },
  televisions: { category: "electronics", queries: ["smart television product photo", "4k tv product photo"], terms: /television|smart tv|4k tv|oled|qled|bravia|tv/i },
  cameras: { category: "electronics", queries: ["digital camera product photo", "mirrorless camera product photo", "dslr camera product"], terms: /camera|mirrorless|dslr/i, wikiQueries: ["digital camera product", "mirrorless camera product", "dslr camera"] },
  audio: { category: "electronics", queries: ["headphones earbuds speaker product photo", "audio headphones product photo", "wireless earbuds product photo"], terms: /headphone|earbud|earphone|speaker|soundbar/i, wikiQueries: ["headphones product", "wireless earbuds product", "bluetooth speaker product"] },
  "computer accessories": { category: "electronics", queries: ["computer keyboard mouse product photo", "usb charger computer accessory product photo"], terms: /keyboard|mouse|charger|cable|usb|webcam|ssd|computer accessory/i },
  wearables: { category: "electronics", queries: ["smartwatch product photo", "fitness tracker product photo"], terms: /smartwatch|fitness tracker|gps watch/i },
  gaming: { category: "electronics", queries: ["gaming console controller product photo", "gaming headset keyboard product photo"], terms: /gaming|console|controller|headset/i },

  "men fashion": { category: "fashion", queries: ["men shirt clothing product photo", "men jeans jacket clothing product photo", "men t shirt product photo", "men polo shirt product photo"], terms: /shirt|t-shirt|polo|jeans|jacket|hoodie|trouser|pants|suit|clothing|top/i },
  "women fashion": { category: "fashion", queries: ["women dress clothing product photo", "women blouse jeans clothing product photo", "women tops clothing product photo", "women t shirt product photo"], terms: /dress|blouse|top|jeans|jacket|skirt|trouser|pants|shirt|clothing/i },
  "kids fashion": { category: "fashion", queries: ["kids clothing product photo", "children clothes product photo", "kids tops product photo"], terms: /kids|children|shirt|dress|jeans|jacket|clothing|top/i },

  "men footwear": { category: "footwear", queries: ["men shoes product photo", "men sneakers boots sandals product photo"], terms: /shoe|sneaker|boot|sandal|slipper|trainer/i },
  "women footwear": { category: "footwear", queries: ["women shoes product photo", "women heels sandals boots product photo"], terms: /shoe|sneaker|heel|boot|sandal|slipper|trainer/i },
  "kids footwear": { category: "footwear", queries: ["kids shoes product photo", "children sneakers sandals product photo", "kids school shoes product photo", "kids sports shoes product photo"], terms: /kids|children|shoe|sneaker|sandal|slipper|trainer/i, wikiQueries: ["children shoes product", "kids sneakers product", "kids sandals product"] },

  skincare: { category: "beauty", queries: ["skincare product photo", "serum moisturizer cosmetic product photo"], terms: /skin|serum|moisturizer|cream|sunscreen|skincare/i },
  makeup: { category: "beauty", queries: ["makeup product photo lipstick mascara", "cosmetics product photo"], terms: /makeup|lipstick|mascara|foundation|concealer|blush|cosmetic/i },
  haircare: { category: "beauty", queries: ["shampoo haircare product photo", "hair conditioner product photo"], terms: /shampoo|conditioner|hair|haircare/i },
  fragrance: { category: "beauty", queries: ["perfume fragrance product photo", "cologne perfume bottle product photo"], terms: /perfume|fragrance|cologne/i },

  furniture: { category: "home", queries: ["furniture product photo sofa table chair bed", "home furniture product photo"], terms: /sofa|chair|table|bed|cabinet|wardrobe|furniture/i },
  "home decor": { category: "home", queries: ["home decor product photo lamp vase mirror", "home decoration product photo"], terms: /decor|lamp|vase|mirror|cushion|wall art|decoration/i },
  appliances: { category: "home", queries: ["home appliance product photo", "vacuum air purifier appliance product photo"], terms: /appliance|vacuum|purifier|fan|cooler/i },
  "kitchen accessories": { category: "home", queries: ["kitchen accessories product photo", "cookware kitchen product photo"], terms: /kitchen|cookware|kettle|pan|pot|knife|plate|bowl|utensil/i },

  watches: { category: "accessories", queries: ["watch product photo", "wristwatch product photo"], terms: /watch|wristwatch/i },
  bags: { category: "accessories", queries: ["handbag product photo", "backpack bag product photo"], terms: /bag|handbag|backpack/i },
  jewelry: { category: "accessories", queries: ["jewelry product photo necklace ring bracelet", "jewellery product photo"], terms: /jewelry|jewellery|necklace|ring|bracelet|earring/i },
  sunglasses: { category: "accessories", queries: ["sunglasses product photo", "eyewear product photo"], terms: /sunglasses|eyewear|glasses/i },

  "educational toys": { category: "toys", queries: ["educational toy product photo puzzle", "learning toy product photo"], terms: /puzzle|educational|learning|blocks|toy/i },
  "kids toys": { category: "toys", queries: ["kids toy product photo", "board game toy product photo"], terms: /toy|game|puzzle|doll|blocks|kids/i },

  cricket: { category: "sports", queries: ["cricket equipment product photo ball bat", "cricket sports product photo"], terms: /cricket|bat|ball/i },
  badminton: { category: "sports", queries: ["badminton racket shuttle product photo", "badminton equipment product photo"], terms: /badminton|shuttle|racket/i },
  football: { category: "sports", queries: ["football soccer ball product photo", "football equipment product photo"], terms: /football|soccer/i },
  tennis: { category: "sports", queries: ["tennis racket ball product photo", "tennis equipment product photo"], terms: /tennis|racket|racquet/i },
  "sports & outdoor": { category: "sports", queries: ["sports equipment product photo", "outdoor sports gear product photo"], terms: /sport|equipment|ball|helmet/i },
};

function typeForProduct(product) {
  return clean(product?.subCategory || "") || "";
}

function typeRule(product) {
  const sub = typeForProduct(product);
  if (TYPE_RULES[sub]) return TYPE_RULES[sub];
  const text = clean(`${product?.subCategory || ""} ${product?.name || ""}`);
  for (const rule of Object.values(TYPE_RULES)) if (rule.terms.test(text)) return rule;
  return null;
}

function titleMatches(rule, title) {
  const text = clean(title);
  if (!text) return false;
  if (!rule.terms.test(text)) return false;
  // Strong negative rules prevent obvious cross-collection mistakes.
  if (rule.category === "electronics" && /dress|shirt|jean|jacket|sofa|mascara|lipstick|shoe|sandal/i.test(text)) return false;
  if (rule.category === "fashion" && /laptop|phone|airpods|headphone|mascara|lipstick|sofa|table|shoe|sandal/i.test(text)) return false;
  if (rule.category === "footwear" && /laptop|phone|airpods|headphone|mascara|lipstick|sofa|table|dress|shirt|jean/i.test(text)) return false;
  if (rule.category === "beauty" && /laptop|phone|airpods|headphone|sofa|table|shoe|sandal|dress/i.test(text)) return false;
  if (rule.category === "home" && /laptop|phone|airpods|headphone|mascara|lipstick|dress|shirt|shoe|sandal/i.test(text)) return false;
  if (rule.category === "electronics") {
    if (rule === TYPE_RULES.smartphones && /airpods|earbud|earphone|headphone|speaker|soundbar|laptop|tablet|camera|television|tv|watch/i.test(text)) return false;
    if (rule === TYPE_RULES.cameras && /airpods|earbud|earphone|headphone|speaker|soundbar|laptop|phone|tablet/i.test(text)) return false;
    if (rule === TYPE_RULES.audio && /laptop|smartphone|iphone|galaxy|tablet|camera|television|tv/i.test(text)) return false;
  }
  if (rule === TYPE_RULES["kids footwear"] && /adult|men|mens|women|womens|lady|ladies/i.test(text)) return false;
  return true;
}

async function loadDummyCategory(category, pool) {
  try {
    const data = await fetchJson(`${DUMMYJSON_URL}${encodeURIComponent(category)}?limit=100`);
    (data?.products || []).forEach((p) => addCandidate(pool, {
      id: p.id,
      title: p.title,
      image: Array.isArray(p.images) ? p.images[0] : p.thumbnail,
    }, `dummyjson:${category}`));
  } catch {}
}

async function loadDummySources() {
  const pools = {};
  const mapping = {
    smartphones: ["smartphones"],
    laptops: ["laptops"],
    tablets: ["tablets"],
    "computer accessories": ["mobile-accessories"],
    audio: ["mobile-accessories"],
    "men fashion": ["mens-shirts"],
    "women fashion": ["womens-dresses"],
    "men footwear": ["mens-shoes"],
    "women footwear": ["womens-shoes"],
    skincare: ["skin-care"],
    fragrance: ["fragrances"],
    furniture: ["furniture"],
    "home decor": ["home-decoration"],
    "kitchen accessories": ["kitchen-accessories"],
    sunglasses: ["sunglasses"],
    watches: ["mens-watches", "womens-watches"],
    jewelry: ["womens-jewellery"],
    "sports & outdoor": ["sports-accessories"],
  };
  await Promise.all(Object.entries(mapping).map(async ([type, cats]) => {
    const pool = [];
    for (const cat of cats) await loadDummyCategory(cat, pool);
    pools[type] = pool;
  }));
  return pools;
}

async function loadOtherSources() {
  const pools = {};
  try {
    const data = await fetchJson(ESCUELA_URL);
    (Array.isArray(data) ? data : []).forEach((p) => {
      const title = `${p.category?.name || ""} ${p.title || ""}`;
      for (const [type, rule] of Object.entries(TYPE_RULES)) {
        if (!titleMatches(rule, title)) continue;
        const image = Array.isArray(p.images) ? p.images[0] : p.images;
        addCandidate(pools[type] ||= [], { id: p.id, title: p.title, image }, "escuela");
        break;
      }
    });
  } catch {}

  try {
    const data = await fetchJson(FAKESTORE_URL);
    (Array.isArray(data) ? data : []).forEach((p) => {
      const title = `${p.category || ""} ${p.title || ""}`;
      for (const [type, rule] of Object.entries(TYPE_RULES)) {
        if (!titleMatches(rule, title)) continue;
        addCandidate(pools[type] ||= [], { id: p.id, title: p.title, image: p.image }, "fakestore");
        break;
      }
    });
  } catch {}
  return pools;
}

async function loadWikimediaType(type, rule) {
  const pool = [];
  const queries = Array.isArray(rule?.wikiQueries) ? rule.wikiQueries : [];
  for (const query of queries) {
    try {
      const params = new URLSearchParams({
        action: "query", generator: "search", gsrsearch: query, gsrnamespace: "6",
        gsrlimit: "30", prop: "imageinfo", iiprop: "url", iiurlwidth: "800",
        format: "json", origin: "*"
      });
      const data = await fetchJson(`${WIKIMEDIA_API}?${params.toString()}`);
      const pages = Object.values(data?.query?.pages || {});
      pages.forEach((page) => {
        const title = String(page?.title || "");
        const info = page?.imageinfo?.[0];
        if (!info?.thumburl || !titleMatches(rule, title)) return;
        addCandidate(pool, { id: page.pageid, identifier: `commons:${page.pageid}`, title, url: info.thumburl }, `wikimedia:${type}`);
      });
    } catch {}
  }
  return uniquePool(pool);
}

async function loadOpenverseType(type, rule) {
  const pool = [];
  for (const query of rule.queries) {
    try {
      const url = `${OPENVERSE_URL}?q=${encodeURIComponent(query)}&page_size=100&page=1`;
      const data = await fetchJson(url);
      (data?.results || []).forEach((item) => {
        const title = String(item.title || "");
        // Openverse is only allowed to contribute when its own metadata agrees
        // with the target collection. No generic category fallback is permitted.
        if (!titleMatches(rule, title)) return;
        addCandidate(pool, {
          id: item.id || item.identifier,
          identifier: item.identifier || item.foreign_identifier,
          title,
          url: item.thumbnail || item.url,
        }, `openverse:${type}`);
      });
    } catch {}
  }
  return uniquePool(pool);
}

function uniquePool(pool) {
  const seen = new Set();
  return (pool || []).filter((item) => {
    if (!item?.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

export async function getImagePools() {
  try {
    const cached = JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || "null");
    if (cached?.savedAt && Date.now() - cached.savedAt < IMAGE_CACHE_TTL && cached.pools) return cached.pools;
  } catch {}

  const [dummy, other] = await Promise.all([loadDummySources(), loadOtherSources()]);
  const pools = {};

  // Fetch Openverse by exact collection/type rather than one broad category.
  await Promise.all(Object.entries(TYPE_RULES).map(async ([type, rule]) => {
    const [open, wiki] = await Promise.all([loadOpenverseType(type, rule), loadWikimediaType(type, rule)]);
    pools[type] = uniquePool([...(dummy[type] || []), ...(other[type] || []), ...open, ...wiki]);
  }));

  try { localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), pools })); } catch {}
  return pools;
}

export function assignUniqueImages(products, pools) {
  const used = new Set();
  const next = Object.fromEntries(Object.entries(pools || {}).map(([key, value]) => [key, [...value]]));

  return products.map((product) => {
    if (!product || product.source !== "expanded-local") return product;
    const rule = typeRule(product);
    if (!rule) return { ...product, image: "", images: [], localImage: "", imageSource: "none" };

    const type = typeForProduct(product);
    const pool = next[type] || [];
    const foundIndex = pool.findIndex((item) => {
      if (!item?.url || used.has(item.key) || used.has(item.url)) return false;
      return titleMatches(rule, item.title);
    });

    // IMPORTANT: no fallback to another type/category.
    // An unavailable correct image is better than a wrong image.
    if (foundIndex < 0) return { ...product, image: "", images: [], localImage: "", imageSource: "none" };

    const [item] = pool.splice(foundIndex, 1);
    used.add(item.key);
    used.add(item.url);
    return {
      ...product,
      image: item.url,
      images: [item.url],
      localImage: item.url,
      imageSource: item.key,
    };
  });
}
