# Product image replacement guide

The catalogue now assigns a direct product photo based on the existing product category/type.

To replace one product image manually, edit:

`src/data/manualImageOverrides.js`

Example:

```js
export const manualImageOverrides = {
  "electronics-smartphones-1": "https://your-direct-image-url.jpg",
};
```

The key is the product `id`. The manual image overrides the automatic catalogue image.

`PRODUCT-IMAGE-MAP.csv` contains every product id, product name, category, subcategory and assigned image URL so individual products are easy to locate.
