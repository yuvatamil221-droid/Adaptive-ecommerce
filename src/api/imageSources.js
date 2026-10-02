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
const IMAGE_CACHE_KEY = "adaptive-image-sources-r18-semantic-match";
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
  const context = String(item?.context || "");
  pool.push({
    url,
    key: `${source}:${workId}`,
    title,
    context,
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
  smartphones: { category: "electronics", queries: ["smartphone product photo", "mobile phone product photo"], terms: /smartphone|mobile phone|iphone|galaxy|pixel|phone/i, negative: /airpods|earbud|earphone|Headphone|speaker|soundbar|laptop|tablet|camera|television|tv|watch/i },
  laptops: { category: "electronics", queries: ["laptop product photo", "notebook computer product photo"], terms: /laptop|notebook|macbook|thinkpad|pavilion|inspiron|computer/i, negative: /phone|smartphone|iphone|galaxy|tablet|camera|tv|television|earbud|headphone|speaker/i },
  tablets: { category: "electronics", queries: ["tablet product photo", "ipad product photo"], terms: /tablet|ipad|galaxy tab/i, negative: /phone|smartphone|laptop|camera|tv|television|earbud|headphone|speaker/i },
  televisions: { category: "electronics", queries: ["smart television product photo", "4k tv product photo", "oled television product photo"], terms: /television|smart tv|4k tv|oled|qled|bravia|tv/i, negative: /phone|smartphone|laptop|tablet|camera|earbud|headphone|speaker/i },
  cameras: { category: "electronics", queries: ["digital camera product photo", "mirrorless camera product photo", "dslr camera product"], terms: /camera|mirrorless|dslr/i, negative: /airpods|earbud|earphone|headphone|speaker|soundbar|laptop|phone|smartphone|tablet|tv|television/i, wikiQueries: ["digital camera product", "mirrorless camera product", "dslr camera"] },
  audio: { category: "electronics", queries: ["headphones product photo", "wireless earbuds product photo", "bluetooth speaker product photo", "soundbar product photo"], terms: /headphone|earbud|earphone|speaker|soundbar|audio/i, negative: /laptop|smartphone|iphone|galaxy|tablet|camera|television|tv/i, wikiQueries: ["headphones product", "wireless earbuds product", "bluetooth speaker product"] },
  "computer accessories": { category: "electronics", queries: ["computer keyboard mouse product photo", "usb charger computer accessory product photo", "webcam usb hub ssd product photo"], terms: /keyboard|mouse|charger|cable|usb|webcam|ssd|computer accessory/i, negative: /phone|smartphone|laptop|tablet|camera|tv|television|earbud|headphone|speaker/i },
  wearables: { category: "electronics", queries: ["smartwatch product photo", "fitness tracker product photo"], terms: /smartwatch|fitness tracker|gps watch/i, negative: /phone|smartphone|laptop|tablet|camera|tv|television|earbud|headphone|speaker/i },
  gaming: { category: "electronics", queries: ["gaming console product photo", "gaming controller product photo", "gaming headset product photo", "gaming keyboard product photo"], terms: /gaming|console|controller|headset/i, negative: /phone|smartphone|laptop|tablet|camera|tv|television/i },

  "men fashion": { category: "fashion", queries: ["men shirt clothing product photo", "men jeans clothing product photo", "men t shirt product photo", "men polo shirt product photo", "men trousers pants product photo", "men hoodie jacket product photo"], terms: /shirt|t-shirt|polo|jeans|jacket|hoodie|trouser|pants|suit|clothing|top/i, gender: /men|mens|man|male|boys|boy/i, negative: /women|womens|woman|female|girls|girl|kids|children|dress|sari|skirt|heel|shoe|sandal/i },
  "women fashion": { category: "fashion", queries: ["women tops clothing product photo", "women dress clothing product photo", "women blouse clothing product photo", "women jeans clothing product photo", "women sari saree product photo", "women trousers clothing product photo"], terms: /dress|blouse|top|jeans|jacket|skirt|trouser|pants|shirt|sari|saree|clothing/i, gender: /women|womens|woman|female|girls|girl/i, negative: /men|mens|man|male|boys|boy|kids|children|shoe|sandal|sneaker|boot/i },
  "kids fashion": { category: "fashion", queries: ["kids clothing product photo", "children clothes product photo", "kids tops product photo", "kids t shirt product photo", "kids dress product photo", "kids pants clothing product photo"], terms: /kids|kid|children|child|boys|girls|boy|girl|shirt|dress|jeans|jacket|hoodie|pants|clothing|top/i, gender: /kids|kid|children|child|boys|girls|boy|girl|youth|junior/i, negative: /adult|men|mens|women|womens|lady|ladies|sari|saree|shoe|sandal/i },

  "men footwear": { category: "footwear", queries: ["men shoes product photo", "men sneakers product photo", "men boots product photo", "men sandals product photo", "men slippers product photo"], terms: /shoe|sneaker|boot|sandal|slipper|trainer/i, gender: /men|mens|man|male|boys|boy/i, negative: /women|womens|woman|female|girls|girl|kids|children|heel|dress/i },
  "women footwear": { category: "footwear", queries: ["women shoes product photo", "women heels product photo", "women sandals product photo", "women boots product photo", "women slippers product photo"], terms: /shoe|sneaker|heel|boot|sandal|slipper|trainer/i, gender: /women|womens|woman|female|girls|girl/i, negative: /men|mens|man|male|boys|boy|kids|children/i },
  "kids footwear": { category: "footwear", queries: ["kids shoes isolated product", "children sneakers isolated product", "kids sandals isolated product", "kids school shoes isolated product", "kids sports shoes isolated product", "kids slippers isolated product"], terms: /shoe|sneaker|sandal|slipper|trainer|boot/i, gender: /kids|kid|children|child|boys|girls|boy|girl|youth|junior|school/i, negative: /adult|men|mens|man|male|women|womens|woman|female|lady|ladies|advertisement|advertising|catalog|catalogue|book|magazine|map|poster|history|leather|mcdonald/i, wikiQueries: ["kids sneakers product", "children shoes product", "kids sandals product", "kids school shoes"] },

  skincare: { category: "beauty", queries: ["skincare product photo", "serum moisturizer cosmetic product photo", "sunscreen product photo"], terms: /skin|serum|moisturizer|cream|sunscreen|skincare|cleanser/i, negative: /chair|sofa|table|furniture|shoe|dress|shirt|laptop|phone/i },
  makeup: { category: "beauty", queries: ["makeup product photo lipstick mascara", "foundation concealer blush product photo", "cosmetics product photo"], terms: /makeup|lipstick|mascara|foundation|concealer|blush|cosmetic/i, negative: /chair|sofa|table|furniture|shoe|dress|shirt|laptop|phone/i },
  haircare: { category: "beauty", queries: ["shampoo haircare product photo", "hair conditioner product photo", "hair serum product photo"], terms: /shampoo|conditioner|hair|haircare/i, negative: /chair|sofa|table|furniture|shoe|dress|shirt|laptop|phone|perfume/i },
  fragrance: { category: "beauty", queries: ["perfume fragrance bottle product photo", "cologne perfume product photo", "eau de parfum product photo"], terms: /perfume|fragrance|cologne|parfum|eau de/i, negative: /chair|sofa|table|furniture|shoe|dress|shirt|laptop|phone|shampoo|conditioner/i },

  furniture: { category: "home", queries: ["furniture product photo sofa table chair bed", "home furniture product photo", "cabinet wardrobe furniture product photo"], terms: /sofa|chair|table|bed|cabinet|wardrobe|furniture/i, negative: /laptop|phone|airpods|headphone|mascara|lipstick|dress|shirt|shoe|sandal|kitchen|cookware/i },
  "home decor": { category: "home", queries: ["home decor product photo lamp vase mirror", "home decoration product photo", "wall art cushion decor product photo"], terms: /decor|lamp|vase|mirror|cushion|wall art|decoration/i, negative: /laptop|phone|airpods|headphone|mascara|lipstick|dress|shirt|shoe|sandal|kitchen|cookware|sofa|bed/i },
  appliances: { category: "home", queries: ["home appliance product photo", "vacuum cleaner air purifier appliance product photo", "fan cooler appliance product photo"], terms: /appliance|vacuum|purifier|fan|cooler|microwave/i, negative: /dress|shirt|shoe|sandal|beauty|mascara|lipstick|jewelry/i },
  "kitchen accessories": { category: "home", queries: ["kitchen accessories product photo", "cookware kitchen product photo", "kettle pan plate bowl utensil product photo"], terms: /kitchen|cookware|kettle|pan|pot|knife|plate|bowl|utensil|mixer|container/i, negative: /laptop|phone|headphone|mascara|lipstick|dress|shirt|shoe|sandal|sofa|bed/i },

  watches: { category: "accessories", queries: ["watch product photo", "wristwatch product photo"], terms: /watch|wristwatch/i, negative: /phone|laptop|shoe|dress|sofa|chair/i },
  bags: { category: "accessories", queries: ["handbag product photo", "backpack bag product photo", "shoulder bag product photo"], terms: /bag|handbag|backpack|purse|tote/i, negative: /shoe|dress|laptop|phone|watch/i },
  jewelry: { category: "accessories", queries: ["jewelry product photo necklace ring bracelet", "jewellery product photo"], terms: /jewelry|jewellery|necklace|ring|bracelet|earring/i, negative: /shoe|dress|laptop|phone|watch|bag/i },
  sunglasses: { category: "accessories", queries: ["sunglasses product photo", "eyewear product photo"], terms: /sunglasses|eyewear|glasses/i, negative: /shoe|dress|laptop|phone|watch|bag/i },
  

  "educational toys": { category: "toys", queries: ["educational toy product photo puzzle", "learning toy product photo", "STEM educational toy product photo"], terms: /puzzle|educational|learning|stem|alphabet|math|science|blocks|toy/i, negative: /adult|fashion|shoe|dress|laptop|phone/i },
  "kids toys": { category: "toys", queries: ["kids toy product photo", "building blocks toy product photo", "doll play set toy product photo", "remote control toy product photo"], terms: /toy|doll|blocks|construction|remote control|pretend play|kids/i, negative: /adult|fashion|shoe|dress|laptop|phone|board game|chess|dice|card game/i },
  "board games": { category: "toys", queries: ["board game product photo", "chess board game product photo", "dice game product photo", "card game product photo"], terms: /board game|chess|dice|card game|strategy game|family game/i, negative: /shoe|dress|laptop|phone|sofa|cosmetic/i },

  cricket: { category: "sports", queries: ["cricket bat product photo", "cricket ball product photo", "cricket gloves product photo", "cricket helmet product photo"], terms: /cricket|bat|ball|glove|helmet/i, negative: /football|soccer|badminton|tennis|basketball|dress|shoe/i },
  badminton: { category: "sports", queries: ["badminton racket product photo", "badminton shuttlecock product photo", "badminton net product photo"], terms: /badminton|shuttle|racket/i, negative: /football|soccer|cricket|tennis|basketball|dress|shoe/i },
  football: { category: "sports", queries: ["football soccer ball product photo", "football equipment product photo"], terms: /football|soccer/i, negative: /cricket|badminton|tennis|basketball|dress|shoe/i },
  tennis: { category: "sports", queries: ["tennis racket product photo", "tennis ball product photo", "tennis net product photo"], terms: /tennis|racket|racquet/i, negative: /football|soccer|cricket|badminton|basketball|dress|shoe/i },
  basketball: { category: "sports", queries: ["basketball product photo", "basketball ball product photo"], terms: /basketball|hoop/i, negative: /football|soccer|cricket|badminton|tennis|dress|shoe/i },
  "sports & outdoor": { category: "sports", queries: ["sports equipment product photo", "outdoor sports gear product photo", "training cone yoga mat sports product photo"], terms: /sport|equipment|outdoor|cone|duffel|yoga|resistance/i, negative: /football|soccer|cricket|badminton|tennis|basketball|dress|shoe/i },
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


const FAMILY_RULES = [
  { key: "shirt", terms: /shirt|t-shirt|tee|polo|blouse|top/i, conflicts: /dress|skirt|sari|saree|jeans|trouser|pants|jacket|hoodie/i },
  { key: "dress", terms: /dress/i, conflicts: /shirt|t-shirt|top|blouse|jeans|trouser|pants|skirt|sari|saree/i },
  { key: "sari", terms: /sari|saree/i, conflicts: /shirt|t-shirt|top|blouse|dress|jeans|trouser|pants|skirt/i },
  { key: "jeans", terms: /jeans|denim/i, conflicts: /dress|shirt|t-shirt|top|blouse|sari|saree|skirt/i },
  { key: "trousers", terms: /trouser|pants|jogger|cargo/i, conflicts: /dress|shirt|t-shirt|top|blouse|sari|saree|skirt|jeans/i },
  { key: "skirt", terms: /skirt/i, conflicts: /dress|shirt|t-shirt|top|blouse|sari|saree|jeans|trouser|pants/i },
  { key: "jacket", terms: /jacket|hoodie/i, conflicts: /dress|shirt|t-shirt|top|blouse|sari|saree|jeans|trouser|pants|skirt/i },
  { key: "shoes", terms: /shoe|sneaker|trainer/i, conflicts: /sandal|slipper|boot|heel/i },
  { key: "sandal", terms: /sandal/i, conflicts: /shoe|sneaker|trainer|slipper|boot|heel/i },
  { key: "slipper", terms: /slipper/i, conflicts: /shoe|sneaker|trainer|sandal|boot|heel/i },
  { key: "boot", terms: /boot/i, conflicts: /shoe|sneaker|trainer|sandal|slipper|heel/i },
  { key: "heel", terms: /heel|court|platform/i, conflicts: /shoe|sneaker|trainer|sandal|slipper|boot/i },
{
  key: "smartphone",
  terms: /\bsmartphone\b|\biphone\b|\bgalaxy\b|\bpixel\b/i,
  conflicts: /headphone|earbud|earphone|speaker|soundbar|laptop|tablet|camera|television|tv|watch/i
},
  { key: "laptop", terms: /laptop|macbook|thinkpad|notebook|ideapad|pavilion|inspiron/i, conflicts: /smartphone|phone|tablet|camera|headphone|earbud|speaker|television|tv|watch/i },
  { key: "tablet", terms: /tablet|ipad|galaxy tab/i, conflicts: /smartphone|phone|laptop|camera|headphone|earbud|speaker|television|tv|watch/i },
  { key: "camera", terms: /camera|dslr|mirrorless/i, conflicts: /smartphone|phone|laptop|tablet|headphone|earbud|speaker|television|tv/i },
  { key: "audio", terms: /headphone|earbud|earphone|speaker|soundbar/i, conflicts: /smartphone|phone|laptop|tablet|camera|television|tv|watch/i },
  { key: "television", terms: /television|smart tv|4k tv|oled|qled|bravia|tv/i, conflicts: /smartphone|phone|laptop|tablet|camera|headphone|earbud|speaker/i },
  { key: "watch", terms: /watch|wristwatch|smartwatch/i, conflicts: /smartphone|phone|laptop|tablet|camera|headphone|earbud|speaker|television|tv/i },
  { key: "makeup", terms: /mascara|lipstick|foundation|blush|concealer|makeup/i, conflicts: /shampoo|conditioner|hair|perfume|fragrance|serum|moisturizer|sunscreen/i },
  { key: "haircare", terms: /shampoo|conditioner|hair serum|hair mask|hair oil|haircare/i, conflicts: /lipstick|mascara|foundation|blush|makeup|perfume|fragrance/i },
  { key: "fragrance", terms: /perfume|fragrance|cologne|parfum|eau de/i, conflicts: /shampoo|conditioner|hair|lipstick|mascara|foundation|blush|makeup/i },
  { key: "skincare", terms: /serum|moisturizer|cream|sunscreen|cleanser|skincare/i, conflicts: /shampoo|conditioner|hair|lipstick|mascara|foundation|blush|makeup|perfume|fragrance/i },
  { key: "furniture", terms: /sofa|chair|table|bed|cabinet|wardrobe|furniture/i, conflicts: /vase|mirror|lamp|wall art|cushion|kitchen|cookware|kettle|pan|pot|plate|bowl|knife|utensil|mixer/i },
  { key: "decor", terms: /vase|mirror|lamp|wall art|cushion|decor/i, conflicts: /sofa|chair|table|bed|cabinet|wardrobe|kitchen|cookware|kettle|pan|pot|plate|bowl|knife|utensil|mixer/i },
  { key: "kitchen", terms: /kitchen|cookware|kettle|pan|pot|plate|bowl|knife|utensil|mixer|container/i, conflicts: /sofa|chair|table|bed|cabinet|wardrobe|vase|mirror|lamp|wall art/i },
  { key: "puzzle", terms: /puzzle|alphabet|math|science|stem|learning/i, conflicts: /shoe|dress|car|doll|board game|chess|dice|card game/i },
  { key: "boardgame", terms: /board game|chess|dice|card game|strategy game|family game/i, conflicts: /puzzle|alphabet|math|science|stem|shoe|dress/i },
  { key: "football", terms: /football|soccer/i, conflicts: /cricket|badminton|tennis|basketball/i },
  { key: "cricket", terms: /cricket|batting|cricket ball/i, conflicts: /football|soccer|badminton|tennis|basketball/i },
  { key: "badminton", terms: /badminton|shuttlecock|shuttle/i, conflicts: /football|soccer|cricket|tennis|basketball/i },
  { key: "tennis", terms: /tennis/i, conflicts: /football|soccer|cricket|badminton|basketball/i },
  { key: "basketball", terms: /basketball/i, conflicts: /football|soccer|cricket|badminton|tennis/i },
  { key: "watch", terms: /watch|wristwatch/i, conflicts: /bag|handbag|backpack|sunglasses|jewelry|jewellery|wallet/i },
  { key: "bag", terms: /bag|handbag|backpack|purse|tote/i, conflicts: /watch|sunglasses|jewelry|jewellery|wallet/i },
  { key: "sunglasses", terms: /sunglasses|eyewear|glasses/i, conflicts: /watch|bag|handbag|backpack|jewelry|jewellery|wallet/i },
  { key: "jewelry", terms: /jewelry|jewellery|necklace|ring|bracelet|earring/i, conflicts: /watch|bag|sunglasses|wallet/i },
  
];

function familyRule(text) {
  const value = clean(text);
  return FAMILY_RULES.find((rule) => rule.terms.test(value)) || null;
}

function titleMatches(rule, title, context = "", productText = "") {
  const text = clean(`${title} ${context}`);
  const titleOnly = clean(title);
  if (!titleOnly) return false;
  if (!rule.terms.test(text)) return false;
  if (rule.negative && rule.negative.test(titleOnly)) return false;
  if (rule.gender && !rule.gender.test(text)) return false;

  // Match the product family too. A women's TOP should not receive a DRESS image,
  // a men's TROUSER should not receive a SHIRT image, and a FOOTBALL should not
  // receive a CRICKET image merely because both are sports.
  const wantedFamily = familyRule(productText);
  const candidateFamily = familyRule(titleOnly) || familyRule(context);
  if (wantedFamily && candidateFamily) {
    if (wantedFamily.key !== candidateFamily.key) return false;
  } else if (candidateFamily && rule.category === "fashion") {
    // If the product family is unknown, still reject an obviously different garment.
    const product = clean(productText);
    if (candidateFamily.conflicts.test(product)) return false;
  }
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
        if (!titleMatches(rule, title, p.category?.name || "")) continue;
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
        if (!titleMatches(rule, title, p.category || "")) continue;
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
        if (!info?.thumburl || !titleMatches(rule, title, query)) return;
        addCandidate(pool, { id: page.pageid, identifier: `commons:${page.pageid}`, title, context: query, url: info.thumburl }, `wikimedia:${type}`);
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
        if (!titleMatches(rule, title, query)) return;
        addCandidate(pool, {
          id: item.id || item.identifier,
          identifier: item.identifier || item.foreign_identifier,
          title,
          context: query,
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
      return titleMatches(rule, item.title, item.context, product.name);
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
