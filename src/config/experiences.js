export const experiences={
  dealHunter:{label:"Deal Hunter",theme:"vibrant",nav:["home","deals","under999","flashSale","wishlist","cart"],cta:"deal",card:"deal",home:["hero","flashSale","deals","recommended","wishlistOffers","trending"],description:"Save more with discounts, deals and flash sales."},
  premiumShopper:{label:"Premium Shopper",theme:"premium",nav:["home","newArrivals","brands","wishlist","cart"],cta:"premium",card:"premium",home:["hero","premiumCollection","favoriteBrands","newArrivals","recommended","seasonal"],description:"A spacious, brand-led premium shopping experience."},
  frequentShopper:{label:"Frequent Shopper",theme:"minimal",nav:["home","forYou","orders","wishlist","cart"],cta:"reorder",card:"reorder",home:["hero","continueShopping","recommended","frequentlyBought","recentlyViewed"],description:"Quick paths to things you buy again and again."},
  explorer:{label:"Explorer",theme:"vibrant",nav:["home","trending","newArrivals","categories","wishlist","cart"],cta:"explore",card:"recommended",home:["hero","trending","newArrivals","recommended","seasonal","favoriteBrands"],description:"Discover new products across many categories."},
};

export const navItems={
  home:{label:"Home",icon:"⌂",page:"home"},
  shop:{label:"Shop",icon:"▦",page:"products"},
  categories:{label:"Categories",icon:"◈",page:"categories"},
  deals:{label:"Deals",icon:"🔥",page:"deals"},
  flashSale:{label:"Flash Sale",icon:"⚡",page:"products",filters:{flashSale:true}},
  under999:{label:"Under ₹999",icon:"₹",page:"products",filters:{under999:true}},
  newArrivals:{label:"New Arrivals",icon:"✦",page:"newArrivals"},
  brands:{label:"Brands",icon:"◇",page:"brands"},
  forYou:{label:"For You",icon:"♥",page:"forYou"},
  trending:{label:"Trending",icon:"↗",page:"trending"},
  wishlist:{label:"Wishlist",icon:"♡",page:"wishlist"},
  cart:{label:"Cart",icon:"🛒",page:"cart"},
  orders:{label:"Orders",icon:"▣",page:"orders"},
};

export const getNav=(key)=>experiences[key]?.nav.map(x=>({...navItems[x],key:x})).filter(Boolean)||[];
