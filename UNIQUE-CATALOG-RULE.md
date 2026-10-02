# Unique catalog image rule

Every expanded-catalog product must receive a globally unique Openverse work.

- The same image work must never be assigned to two products.
- Brand is included in the API search query.
- A work reserved for one brand is never reused for another brand.
- Product assignments and used work IDs are persisted in localStorage.
- The old shared Pexels/Unsplash/LoremFlickr fallback is not used for expanded products.
- If the image API cannot provide a unique work, the UI shows an unavailable state instead of silently reusing another product's image.

This is intentional: a smaller honest collection is preferable to showing customers duplicated designs as if they were different products.

## R14 image loading rule
Expanded-catalog products now use deterministic local images under `public/products/expanded/`.
The expanded catalogue no longer waits for Openverse/LoremFlickr image API requests. Each generated
product has its own category/index image path, so an image request cannot be shared between brands.
If a local image is missing, the product shows `Image unavailable` rather than silently reusing another
product's image.
