// Local product catalogue only.
// No product API, image API, remote image search, or network request is used.
import { buildExpandedCatalog } from "../data/expandedCatalog";
import { applyManualImageOverrides } from "../data/manualImageOverrides";

export async function fetchProducts() {
  // The existing expanded catalogue is kept exactly as the product source.
  // Add/change images later in manualImageOverrides.js without changing any
  // product data, UI, filtering, search, cart, wishlist, or navigation.
  return applyManualImageOverrides(buildExpandedCatalog());
}
