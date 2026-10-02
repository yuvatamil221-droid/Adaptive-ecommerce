# Adaptive E-Commerce

Beginner-friendly React + Vite + Tailwind adaptive e-commerce project.

## Product source

Products are fetched online from DummyJSON:

`https://dummyjson.com/products?limit=0`

The app normalizes the online data into the fields used by the existing UI, removes food/grocery/vehicle items, keeps product images from the API/CDN, and converts the sample API prices to INR-looking demo prices.

## Main adaptive features

- Deal Hunter / Premium Shopper / Frequent Shopper / Explorer
- Experience switcher returns to Home after switching
- Profile-based age and gender personalization
- Multiple profiles under one account
- Category browser with subcategories and top brands
- Combined category + price + rating + discount + availability filters
- Flash Sale without the side filter panel
- Premium sections at ₹3,000+
- Manual coupons
- Required checkout address and payment details
- Orders and reorder recommendations
- Dark mode, layout and reduced motion
- Product cards open Product Details from anywhere on the card
- Product-specific size/color options only when appropriate
- Login / registration / logout flow

## Run

```bash
npm install
npm run dev
```
