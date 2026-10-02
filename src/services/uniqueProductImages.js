const API = "https://api.openverse.org/v1/images/";
const CACHE_KEY = "adaptive-openverse-image-pools-v1";
const USED_KEY = "adaptive-openverse-used-works-v1";
const ASSIGNED_KEY = "adaptive-openverse-product-assignments-v1";

const memoryPools = new Map();
const memoryAssignments = new Map();
const memoryUsed = new Set();
const queryLocks = new Map();

const readJSON = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const clean = value => String(value || "").trim().replace(/\s+/g, " ");
const normalize = value => clean(value).toLowerCase();

function productType(product) {
  const text = normalize(`${product?.subCategory || ""} ${product?.name || ""}`);
  if (/\bsmartphone\b|\bphone\b|\bmobile\b|\biphone\b|\bgalaxy\b|\bpixel\b/i.test(text)) {
  return "smartphone";
}
  if (/laptop|macbook|thinkpad|pavilion|inspiron/.test(text)) return "laptop computer";
  if (/tablet|ipad|galaxy tab/.test(text)) return "tablet";
  if (/television|smart tv|oled|qled|bravia/.test(text)) return "smart television";
  if (/headphone|earbud|earphone|speaker|soundbar/.test(text)) return "audio headphones";
  if (/camera|mirrorless|dslr/.test(text)) return "camera";
  if (/keyboard/.test(text)) return "computer keyboard";
  if (/mouse/.test(text)) return "computer mouse";
  if (/charger|cable|usb/.test(text)) return "charger cable";
  if (/smartwatch|watch/.test(text)) return "watch";
  if (/jeans|denim/.test(text)) return "jeans clothing";
  if (/shirt|t-shirt|polo|blouse|top/.test(text)) return "shirt clothing";
  if (/jacket/.test(text)) return "jacket clothing";
  if (/hoodie/.test(text)) return "hoodie clothing";
  if (/dress/.test(text)) return "dress clothing";
  if (/skirt/.test(text)) return "skirt clothing";
  if (/trouser|pants|jogger/.test(text)) return "trousers clothing";
  if (/shoe|sneaker|trainer/.test(text)) return "shoes footwear";
  if (/boot/.test(text)) return "boots footwear";
  if (/sandal|slipper/.test(text)) return "sandals footwear";
  if (/lipstick|mascara|makeup|foundation|concealer|blush/.test(text)) return "makeup product";
  if (/shampoo|conditioner|hair serum|hair oil/.test(text)) return "haircare product";
  if (/perfume|fragrance|cologne/.test(text)) return "perfume product";
  if (/serum|moisturizer|skincare|cream|sunscreen/.test(text)) return "skincare product";
  if (/football|soccer/.test(text)) return "football";
  if (/cricket bat/.test(text)) return "cricket bat";
  if (/cricket ball/.test(text)) return "cricket ball";
  if (/badminton|shuttle/.test(text)) return "badminton equipment";
  if (/tennis/.test(text)) return "tennis equipment";
  if (/puzzle|board game|dice|chess|toy|blocks/.test(text)) return "toy game puzzle";
  if (/sofa|chair|table|bed|cabinet|furniture/.test(text)) return "furniture";
  if (/vase|mirror|lamp|decor|cushion|wall art/.test(text)) return "home decor";
  if (/kitchen|cookware|kettle|dinner set|knife set/.test(text)) return "kitchen product";
  if (/bag|backpack|handbag/.test(text)) return "bag backpack";
  if (/sunglass/.test(text)) return "sunglasses";
  if (/jewelry|necklace|bracelet|ring/.test(text)) return "jewelry";
  return clean(product?.category || "product") + " product";
}

function queryFor(product) {
  const brand = clean(product?.brand);
  const type = productType(product);
  // Brand is intentionally part of the search query. A result reserved for one
  // brand is never assigned to another brand.
  return `${brand} ${type} product`.trim();
}

function workKey(item) {
  return [item?.id, item?.source, item?.url].filter(Boolean).join("|");
}

function usable(item) {
  return Boolean(item?.url || item?.thumbnail) && !item?.mature && !item?.isSensitive;
}

function hydrateStoredState() {
  const used = readJSON(USED_KEY, []);
  used.forEach(x => memoryUsed.add(x));
  const assigned = readJSON(ASSIGNED_KEY, {});
  Object.entries(assigned).forEach(([key, value]) => memoryAssignments.set(key, value));
}

let stateHydrated = false;
function ensureState() {
  if (!stateHydrated) {
    hydrateStoredState();
    stateHydrated = true;
  }
}

async function fetchPool(query, page) {
  const cacheKey = `${query}|${page}`;
  if (memoryPools.has(cacheKey)) return memoryPools.get(cacheKey);

  const stored = readJSON(CACHE_KEY, {});
  if (stored[cacheKey]) {
    memoryPools.set(cacheKey, stored[cacheKey]);
    return stored[cacheKey];
  }

  const url = `${API}?q=${encodeURIComponent(query)}&page=${page}&page_size=20`;
  try {
    const response = await fetch(url, {headers:{Accept:"application/json"}});
    if (!response.ok) throw new Error(`Openverse ${response.status}`);
    const json = await response.json();
    const results = Array.isArray(json?.results) ? json.results.filter(usable).map(item => ({
      id:item.id,
      source:item.source,
      url:item.url,
      thumbnail:item.thumbnail,
      title:item.title,
      creator:item.creator,
      foreign_landing_url:item.foreign_landing_url,
    })) : [];
    memoryPools.set(cacheKey, results);
    stored[cacheKey] = results;
    writeJSON(CACHE_KEY, stored);
    return results;
  } catch {
    memoryPools.set(cacheKey, []);
    return [];
  }
}

async function reserveFromPool(query) {
  for (let page = 1; page <= 8; page += 1) {
    const pool = await fetchPool(query, page);
    for (const item of pool) {
      const key = workKey(item);
      if (!key || memoryUsed.has(key)) continue;
      memoryUsed.add(key);
      writeJSON(USED_KEY, [...memoryUsed]);
      return item;
    }
    if (pool.length < 20) break;
  }
  return null;
}

function queueFor(query, task) {
  const previous = queryLocks.get(query) || Promise.resolve();
  const next = previous.then(task, task);
  queryLocks.set(query, next.catch(() => {}));
  return next;
}

export async function getUniqueProductImage(product) {
  ensureState();
  const productKey = String(product?.id || `${product?.brand}|${product?.name}|${product?.subCategory}`);
  if (memoryAssignments.has(productKey)) return memoryAssignments.get(productKey);

  const stored = readJSON(ASSIGNED_KEY, {});
  if (stored[productKey]) {
    memoryAssignments.set(productKey, stored[productKey]);
    return stored[productKey];
  }

  const query = queryFor(product);
  const result = await queueFor(query, () => reserveFromPool(query));
  if (!result) return null;

  const image = result.url || result.thumbnail;
  memoryAssignments.set(productKey, image);
  stored[productKey] = image;
  writeJSON(ASSIGNED_KEY, stored);
  return image;
}

export function clearUniqueImageRegistry() {
  memoryPools.clear();
  memoryAssignments.clear();
  memoryUsed.clear();
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(USED_KEY);
    localStorage.removeItem(ASSIGNED_KEY);
  } catch {}
}
