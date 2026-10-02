# Manual image overrides

This version uses a hybrid image system. Automatic image matching remains available, but a manual image override always wins.

## Add a local image

1. Put the image under `public/products/...`.
2. Open `src/data/manualImageOverrides.js`.
3. Add the product id and the public path:

```js
export const manualImageOverrides = {
  "footwear-kids-1": "/products/kids-footwear/nike-kids-running-shoes.jpg",
};
```

## Add an external image URL

```js
"footwear-kids-1": "https://example.com/nike-kids-running-shoes.jpg",
```

Manual images are used everywhere the product appears: product cards, product details, wishlist, cart, recommendations, deals, and other views that use the same product record.

No UI/layout code is changed by this feature.
