const brandSets = {
  fashionMen: [
    "Nike",
    "Adidas",
    "Zara",
    "Puma",
    "Levi's",
    "H&M",
    "Uniqlo",
    "Tommy Hilfiger",
    "Calvin Klein",
    "Reebok",
  ],
  fashionWomen: [
    "Zara",
    "H&M",
    "Nike",
    "Adidas",
    "Levi's",
    "Mango",
    "Forever New",
    "Calvin Klein",
    "Puma",
    "Vero Moda",
  ],
  fashionKids: [
    "Nike Kids",
    "Adidas Kids",
    "Zara Kids",
    "H&M Kids",
    "Puma Kids",
    "Levi's Kids",
  ],
  footwearMen: [
    "Nike",
    "Adidas",
    "Puma",
    "Reebok",
    "New Balance",
    "Skechers",
    "Clarks",
    "Bata",
  ],
  footwearWomen: [
    "Nike",
    "Adidas",
    "Puma",
    "Aldo",
    "Charles & Keith",
    "Steve Madden",
    "Clarks",
    "Skechers",
  ],
  footwearKids: ["Nike Kids", "Adidas Kids", "Puma Kids", "Skechers Kids"],
  electronics: [
    "Apple",
    "Samsung",
    "Sony",
    "OnePlus",
    "Google",
    "Lenovo",
    "HP",
    "Dell",
    "Asus",
    "JBL",
    "Logitech",
    "Canon",
  ],
  beauty: [
    "L'Oreal",
    "Maybelline",
    "Nivea",
    "MAC",
    "Clinique",
    "Estée Lauder",
    "The Body Shop",
    "Lakme",
    "Dior",
    "Chanel",
  ],
  toys: [
    "LEGO",
    "Mattel",
    "Hasbro",
    "Fisher-Price",
    "Ravensburger",
    "Spin Master",
  ],
  home: [
    "Dyson",
    "Philips",
    "IKEA",
    "Bosch",
    "Samsung",
    "LG",
    "Godrej",
    "Havells",
    "Milton",
    "Prestige",
  ],
  accessories: [
    "Rolex",
    "Casio",
    "Fossil",
    
    "Coach",
    "Ray-Ban",
    "Tissot",
    "Titan",
  ],
  sports: [
    "Nike",
    "Adidas",
    "Puma",
    "Yonex",
    "Wilson",
    "SG",
    "SS",
    "Spalding",
    "Decathlon",
    "Nivia",
  ],
};

const names = {
  fashion: [
    "Classic Cotton Shirt",
    "Premium Casual T-Shirt",
    "Slim Fit Jeans",
    "Everyday Hoodie",
    "Tailored Jacket",
    "Comfort Trousers",
    "Pleated Skirt",
    "Premium Party Dress",
  ],
  footwear: [
    "Urban Running Shoes",
    "Classic Leather Shoes",
    "Street Sneakers",
    "Comfort Sandals",
    "Everyday Slippers",
    "Trail Boots",
  ],
  electronics: [
    "Pro Smartphone",
    "Ultra Laptop",
    "Air Tablet",
    "Wireless Headphones",
    "Mirrorless Camera",
    "Smart Television",
    "Mechanical Keyboard",
    "Pro Mouse",
    "Premium Smartwatch",
    "Gaming Console",
    "Home Smart Appliance",
    "Flagship Smartphone",
  ],
  beauty: [
    "Hydrating Serum",
    "Daily Moisturizer",
    "Volume Mascara",
    "Matte Lipstick",
    "Repair Shampoo",
    "Luxury Perfume",
    "Glow Face Cream",
    "Professional Makeup Kit",
  ],
  toys: [
    "Building Blocks Set",
    "Educational Puzzle",
    "Strategy Board Game",
    "Creative Craft Kit",
    "Magnetic Construction Set",
    "Kids Learning Game",
  ],
  home: [
    "Modern Sofa",
    "Accent Chair",
    "Bedside Lamp",
    "Premium Table",
    "Smart Vacuum",
    "Air Purifier",
    "Designer Vase",
    "Kitchen Mixer",
  ],
  accessories: [
    "Classic Watch",
    "Leather Handbag",
    "Premium Backpack",
    "Designer Sunglasses",
   
    "Gold-tone Bracelet",
    "Minimal Necklace",
  ],
  sports: [
    "Match Football",
    "Professional Cricket Bat",
    "Tournament Cricket Ball",
    "Carbon Badminton Racket",
    "Tennis Racket",
    "Training Cone Set",
    "Sports Duffel Bag",
  ],
};

const priceBase = {
  fashion: 1400,
  footwear: 1800,
  electronics: 6500,
  beauty: 900,
  toys: 700,
  home: 2200,
  accessories: 1800,
  sports: 900,
};
const premiumEvery = 3;
const clean = (v) => String(v || "").toLowerCase();
const pick = (arr, i) => arr[i % arr.length];

// Keep every product in the correct subcategory using the product's own
// name first, then brand/category/subcategory as supporting information.
// This only corrects classification; no product, price, UI, or page data is changed.
function classifySubCategory(
  category,
  name,
  brand,
  existingSubCategory,
  department,
) {
  const text = clean(`${name} ${brand} ${category} ${existingSubCategory}`);
  const nameText = clean(name);
  const brandText = clean(brand);

  if (category === "electronics") {
    if (/\bsmartphone\b|\biphone\b|\bgalaxy smartphone\b|\bpixel smartphone\b|\breno smartphone\b|\boneplus smartphone\b|\bxperia smartphone\b|\bmoto smartphone\b|\bnord smartphone\b/i.test(nameText)) return "smartphones";
    if (
      /laptop|macbook|notebook|thinkpad|ideapad|pavilion|inspiron|vaio|galaxy book/.test(
        nameText,
      )
    )
      return "laptops";
    if (/tablet|ipad|galaxy tab/.test(nameText)) return "tablets";
    if (/tv|television|bravia|oled|qled|uhd|google tv/.test(nameText))
      return "televisions";
    if (/camera|mirrorless|vlog camera|action camera/.test(nameText))
      return "cameras";
    if (/headphone|earbud|earphone|speaker|soundbar|audio/.test(nameText))
      return "audio";
    if (/smartwatch|fitness tracker|gps smartwatch|watch/.test(nameText))
      return "wearables";
    if (
      /gaming console|gaming controller|gaming headset|gaming keyboard/.test(
        nameText,
      )
    )
      return "gaming";
    if (
      /mouse|keyboard|charger|laptop stand|webcam|usb hub|external ssd|computer accessory/.test(
        nameText,
      )
    )
      return "computer accessories";
    return existingSubCategory || "electronics";
  }

  if (category === "accessories") {
    // Product name is the strongest signal. Brand is used only where it is
    // strongly associated with one accessory type and the name is generic.
    if (/watch|smartwatch|chronograph|timepiece/.test(nameText))
      return "watches";
    if (
      /bag|handbag|backpack|tote|purse|satchel|crossbody|shoulder bag/.test(
        nameText,
      )
    )
      return "bags";
    if (/sunglass|sunglasses|eyewear/.test(nameText)) return "sunglasses";
   
    if (
      /jewel|ring|necklace|bracelet|earring|pendant|chain|bangle/.test(nameText)
    )
      return "jewelry";
    if (/rolex|casio|tissot|titan/.test(brandText)) return "watches";
    if (/ray-ban/.test(brandText)) return "sunglasses";
    return existingSubCategory || "accessories";
  }

  if (category === "sports") {
    if (/football|soccer/.test(nameText)) return "football";
    if (/cricket/.test(nameText)) return "cricket";
    if (/badminton|shuttle/.test(nameText)) return "badminton";
    if (/tennis|racket|racquet/.test(nameText)) return "tennis";
    return existingSubCategory || "cricket";
  }

  if (category === "beauty") {
    if (
      /shampoo|conditioner|hair serum|hair mask|hair oil|haircare|anti-dandruff/.test(
        nameText,
      )
    )
      return "haircare";
    if (
      /perfume|fragrance|eau de parfum|eau de toilette|cologne/.test(nameText)
    )
      return "fragrance";
    if (/lipstick|mascara|foundation|blush|makeup|concealer/.test(nameText))
      return "makeup";
    if (
      /serum|moisturizer|face cream|cleanser|sunscreen|skincare/.test(nameText)
    )
      return "skincare";
    return existingSubCategory || "makeup";
  }

  if (category === "toys") {
    if (/puzzle|learning|educational|alphabet|math|science|stem/.test(nameText))
      return "educational toys";
    if (
      /board game|chess|card game|dice game|strategy game|family game/.test(
        nameText,
      )
    )
      return "board games";
    return existingSubCategory || "kids toys";
  }

  if (category === "home") {
    if (/sofa|chair|table|cabinet|bed|furniture/.test(nameText))
      return "furniture";
    if (/vase|mirror|lamp|wall art|cushion|decor/.test(nameText))
      return "home decor";
    if (
      /kitchen|cookware|dinner set|knife set|storage container|mixer|kettle/.test(
        nameText,
      )
    )
      return "kitchen accessories";
    return existingSubCategory || "home decor";
  }

  if (category === "fashion")
    return existingSubCategory || `${department.toLowerCase()} fashion`;
  if (category === "footwear")
    return existingSubCategory || `${department.toLowerCase()} footwear`;
  return existingSubCategory || category;
}

const realPhotoPools = {
  electronics: {
    smartphones: [
      "https://images.unsplash.com/photo-1723054072995-af2b91c5cbb6?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1572069678199-5a7c0fc0411e?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1578606460787-c1725b634269?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    laptops: [
      "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1593982624332-9c7a6ac54341?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    audio: [
      "https://images.unsplash.com/photo-1505740106531-4243f3831c78?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    cameras: [
      "https://images.unsplash.com/photo-1578606460787-c1725b634269?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    televisions: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    tablets: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    "computer accessories": [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    wearables: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    gaming: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
  },
  fashion: {
    shirts: [
      "https://images.unsplash.com/photo-1511500587571-7b710abffba7?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    jeans: [
      "https://unsplash.com/photos/child-touching-white-painted-wall-during-daytime-20ll1TJWASk",
      "https://images.unsplash.com/photo-1618990746415-1178da5a0b28?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    dresses: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
  },
  footwear: {
    shoes: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    boots: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    sandals: [
      "https://images.unsplash.com/photo-1667314614949-e7e45c8074fd?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
  },
  beauty: {
    makeup: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    skincare: [
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    fragrance: [
      "https://images.unsplash.com/photo-1658266844018-303455852da6?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    haircare: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
  },
  home: {
    furniture: [
      "https://images.unsplash.com/photo-1616046386594-c152babc9e15?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    decor: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    appliances: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    kitchen: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
  },
  sports: {
    badminton: [
      "https://images.unsplash.com/photo-1716155249759-b5f068f74e63?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    tennis: [
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1617083934555-5d3b9c2c1a2a?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    football: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    cricket: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
  },
  toys: {
    blocks: [
      "https://images.unsplash.com/photo-1613602144332-f084fbe2429a?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    games: [
      "https://images.unsplash.com/photo-1642056446796-8c7d1dcb630b?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
  },
  accessories: {
    sunglasses: [
      "https://images.unsplash.com/photo-1680789526881-43b622effa36?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    watches: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    bags: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
    jewelry: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&fm=jpg&q=75&w=700",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&fm=jpg&q=75&w=700",
    ],
  },
};

// Product-specific photo pools.
// Each named men's fashion product has its own 4-image collection so images
// are not shared between these products. Other products keep the existing
// category/subcategory image logic below.
const productPhotoPools = {
  "fashion-men-1": [
    "https://images.unsplash.com/photo-1740711152088-88a009e877bb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D",
  ],
  "fashion-men-2": [
    "https://media.istockphoto.com/id/542577988/photo/hipster-wearing-white-blank-t-shirt-with-space-for-your-logo.jpg?s=612x612&w=0&k=20&c=BcMxgS5GGUQ_XYIQ54uvbwUw9AI_76hpLiD9EV_-7kI=",
  ],
  "fashion-men-3": [
    "https://media.istockphoto.com/id/467533204/photo/mans-legs.jpg?s=612x612&w=0&k=20&c=VDp989Q_xNjpWcPh25MmL_o0QXGq1XDfLnrrCP5Qjm8=",
  ],
  "fashion-men-4": [
    "https://images.unsplash.com/photo-1563899981-1c5ba5185ca2?auto=format&fit=crop&fm=jpg&q=75&w=700",
  ],
  "fashion-men-5": [
    "https://images.unsplash.com/photo-1771711374565-0ed2cbd78dee?auto=format&fit=crop&fm=jpg&q=75&w=700",
  ],
  "fashion-men-6": [
    "https://images.unsplash.com/photo-1706177208693-2e3c68e5f0f2?w=1000&auto=format&fit=crop&q=60",
  ],
  "fashion-men-7": [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=60",
  ],
  "fashion-men-8": [
    "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amFja2V0fGVufDB8fDB8fHww",
  ],
  "fashion-men-9": [
    "https://images.unsplash.com/photo-1625910513399-c9fcba54338c?auto=format&fit=crop&fm=jpg&q=75&w=700",
  ],
  "fashion-men-10": [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=687&auto=format&fit=crop",
  ],

  "fashion-women-1": [
    "https://media.kohlsimg.com/is/image/kohls/7971938?hei=600&op_sharpen=1&wid=600",
  ],

  "fashion-women-2": [
    "https://www.bluesalon.com/cdn/shop/files/OMN204DRZ00070_0.jpg?v=1722514048",
  ],

  "fashion-women-3": [
    "https://www.brandalley.co.uk/cdn-cgi/image/quality%3D75%2Cfit%3Dcontain%2Cwidth%3D1150%2Cformat%3Dwebp/media/catalog/product/4/5/4538-1.jpg",
  ],

  "fashion-women-4": [
    "https://images.unsplash.com/photo-1659025162971-8d33b4d5e008?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWRpZGFzJTIwd29tZW4lMjBibG91c2V8ZW58MHx8MHx8fDA%3D",
  ],

  "fashion-women-5": [
    "https://images.unsplash.com/photo-1762154057377-cc9d3dd6900c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN1bW1lciUyMGRyZXNzfGVufDB8fDB8fHww",
  ],

  "fashion-women-6": [
    "https://cdn.tutitextil.hu/content/2022/09/tc19806311ae7dde05b.jpg",
  ],

  "fashion-women-7": [
    "https://contents.lotteon.com/itemimage/20260113002101/LE/12/20/73/05/53/_1/32/48/35/30/3/LE1220730553_1324835303_1.jpg/dims/optimize/resizemc/400x400",
  ],

  "fashion-women-8": [
    "https://i5.walmartimages.com/seo/Madden-NYC-Women-s-Juniors-Trouser-Pant_3b4a3f5b-08fb-48e0-ab27-6b8d833a479f.b80f162c8d8cf1cf74a79dbda6aa838b.jpeg",
  ],

  "fashion-women-9": [
    "https://i.ebayimg.com/images/g/9MoAAOSw1LNksEkL/s-l1200.jpg",
  ],

  "fashion-women-10": [
    "https://cdn.media.amplience.net/i/lmg/7028172236White-7028172236WhiteAW08012026_01-2100.jpg?%24prodimg-m-prt-pdp-2x%24=&%24quality-standard%24=&fmt=auto&sm=c",
  ],

  // =========================
  // KIDS FASHION
  // =========================

  "fashion-kids-1": [
    "https://plus.unsplash.com/premium_photo-1691367782367-2bd37f646abc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHNoaXJ0JTIwa2lkc3xlbnwwfHwwfHx8MA%3D%3D",
  ],

  "fashion-kids-2": [
    "https://images.unsplash.com/photo-1714074565982-555b6b1e12ac?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2lkcyUyMGplYW58ZW58MHx8MHx8fDA%3D",
  ],

  "fashion-kids-3": [
    "https://www.mashup.in/cdn/shop/files/cozy-cool-hoodie-t-shirt-and-jogger-set-for-kids.jpg",
  ],

  "fashion-kids-4": [
    "https://www.mashup.in/cdn/shop/files/bad-boys-rockstar-party-set-for-little-boys.jpg",
  ],

  "fashion-kids-5": [
    "https://www.mashup.in/cdn/shop/files/bad-boys-rockstar-party-set-for-little-boys.jpg",
  ],

  "fashion-kids-6": [
    "https://www.meesho.com/cdn/shop/files/boys-printed-t-shirt-jogger-pant-set.jpg",
  ],

  "fashion-kids-7": [
    "https://www.includ.com/cdn/shop/files/boys-white-abstract-printed-summer-oversized-t-shirt-with-jogger-set.jpg",
  ],
};

const poolFor = (category, text) => {
  const t = text.toLowerCase();
  if (category === "electronics")
    return realPhotoPools.electronics[
      /phone|smartphone/.test(t)
        ? "smartphones"
        : /laptop/.test(t)
          ? "laptops"
          : /tablet/.test(t)
            ? "tablets"
            : /headphone|audio|speaker/.test(t)
              ? "audio"
              : /camera/.test(t)
                ? "cameras"
                : /tv|television/.test(t)
                  ? "televisions"
                  : /smartwatch|fitness tracker|gps/.test(t)
                    ? "wearables"
                    : /gaming|console|controller/.test(t)
                      ? "gaming"
                      : "computer accessories"
    ];
  if (category === "fashion")
    return realPhotoPools.fashion[
      /jean|pant|trouser/.test(t)
        ? "jeans"
        : /shirt|t-shirt|hoodie|jacket/.test(t)
          ? "shirts"
          : "dresses"
    ];
  if (category === "footwear")
    return realPhotoPools.footwear[
      /boot/.test(t) ? "boots" : /sandal|slipper/.test(t) ? "sandals" : "shoes"
    ];
  if (category === "beauty")
    return realPhotoPools.beauty[
      /mascara|lipstick|makeup/.test(t)
        ? "makeup"
        : /perfume|fragrance/.test(t)
          ? "fragrance"
          : /shampoo|hair/.test(t)
            ? "haircare"
            : "skincare"
    ];
  if (category === "home")
    return realPhotoPools.home[
      /sofa|chair|table|bed|furniture/.test(t)
        ? "furniture"
        : /lamp|decor|vase/.test(t)
          ? "decor"
          : /vacuum|appliance|purifier/.test(t)
            ? "appliances"
            : "kitchen"
    ];
  if (category === "sports")
    return realPhotoPools.sports[
      /badminton|shuttle/.test(t)
        ? "badminton"
        : /tennis|racket/.test(t)
          ? "tennis"
          : /football|soccer/.test(t)
            ? "football"
            : /cricket/.test(t)
              ? "cricket"
              : "badminton"
    ];
  if (category === "toys")
    return realPhotoPools.toys[
      /puzzle|game|dice|board/.test(t) ? "games" : "blocks"
    ];
  if (category === "accessories")
    return realPhotoPools.accessories[
      /watch/.test(t)
        ? "watches"
        : /bag|backpack|handbag/.test(t)
          ? "bags"
          : /sunglass/.test(t)
            ? "sunglasses"
            : "jewelry"
    ];
  return [];
};

const stableFallbackPools = {
  electronics: [
    "https://images.pexels.com/photos/18311088/pexels-photo-18311088.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/11002709/pexels-photo-11002709.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/9652434/pexels-photo-9652434.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
  ],
  fashion: [
    "https://images.pexels.com/photos/9522933/pexels-photo-9522933.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/10956683/pexels-photo-10956683.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
  ],
  footwear: [
    "https://images.pexels.com/photos/20298288/pexels-photo-20298288.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/6748330/pexels-photo-6748330.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/1461048/pexels-photo-1461048.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/5526492/pexels-photo-5526492.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
  ],
  beauty: [
    "https://images.pexels.com/photos/9757213/pexels-photo-9757213.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/14473448/pexels-photo-14473448.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/4841273/pexels-photo-4841273.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/4841167/pexels-photo-4841167.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
  ],
  toys: [
    "https://images.pexels.com/photos/9227507/pexels-photo-9227507.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/9227224/pexels-photo-9227224.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/8385972/pexels-photo-8385972.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
  ],
  accessories: [
    "https://images.pexels.com/photos/5788856/pexels-photo-5788856.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/2861929/pexels-photo-2861929.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
    "https://images.pexels.com/photos/22434759/pexels-photo-22434759.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
  ],
  home: [
    "https://static.ananas.rs/assets/categories/bela_tehnika/shutterstock_1668941428.jpg",
    "https://images.pexels.com/photos/22434759/pexels-photo-22434759.jpeg?auto=compress&cs=tinysrgb&w=700&h=900&fit=crop",
  ],
  sports: [
    "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTA0L3NyLWltYWdlLTMxMDMyMDI1LW1rMDktcy0zMjQuanBn.jpg",
  ],
};

const stableFallbackFor = (category, index = 0) => {
  const pool = stableFallbackPools[category] || stableFallbackPools.accessories;
  return pool[index % pool.length];
};

function photoQuery(category, subCategory, name) {
  const text = clean(`${subCategory} ${name}`);
  if (category === "electronics") {
    if (
      /smartphone|iphone|galaxy|pixel|reno|oneplus|xperia|moto|nord/.test(text)
    )
      return "smartphone product isolated studio";
    if (
      /laptop|macbook|thinkpad|ideapad|pavilion|inspiron|vaio|galaxy book/.test(
        text,
      )
    )
      return "laptop computer product isolated studio";
    if (/tablet|ipad|galaxy tab/.test(text))
      return "tablet product isolated studio";
    if (/television|smart tv|oled|qled|bravia|google tv|crystal/.test(text))
      return "flat screen smart television product isolated studio";
    if (/camera/.test(text))
      return "digital mirrorless camera product isolated studio";
    if (/headphone|earbud|earphone|speaker|soundbar/.test(text))
      return "headphones audio product isolated studio";
    if (/mouse/.test(text)) return "computer mouse product isolated studio";
    if (/keyboard/.test(text))
      return "mechanical keyboard product isolated studio";
    if (/charger|cable|usb-c|usb hub/.test(text))
      return "phone charger usb cable product isolated studio";
    if (/webcam/.test(text)) return "webcam product isolated studio";
    if (/ssd/.test(text)) return "external ssd drive product isolated studio";
    if (/smartwatch|fitness tracker|gps/.test(text))
      return "smartwatch product isolated studio";
    if (/gaming/.test(text) || /console|controller/.test(text))
      return "gaming console controller product isolated studio";
  }
  if (category === "fashion") {
    if (/jeans/.test(text))
      return "denim jeans clothing product isolated studio";
    if (/trouser|pants|jogger/.test(text))
      return "trousers pants clothing product isolated studio";
    if (/jacket/.test(text))
      return "denim jacket clothing product isolated studio";
    if (/hoodie/.test(text))
      return "hoodie sweatshirt clothing product isolated studio";
    if (/dress/.test(text)) return "dress clothing product isolated studio";
    if (/skirt/.test(text)) return "skirt clothing product isolated studio";
    if (/shirt|t-shirt|top|blouse/.test(text))
      return "shirt t-shirt clothing product isolated studio";
  }
  if (category === "footwear") {
    if (/boot/.test(text)) return "boots footwear product isolated studio";
    if (/sandal|slipper/.test(text))
      return "sandals slippers footwear product isolated studio";
    if (/heel|court|platform/.test(text))
      return "women heels footwear product isolated studio";
    return "sneakers shoes footwear product isolated studio";
  }
  if (category === "beauty") {
    if (/mascara|lipstick|foundation|blush|makeup|concealer/.test(text))
      return "makeup product lipstick mascara isolated studio";
    if (/shampoo|conditioner|hair serum|hair mask|hair oil/.test(text))
      return "haircare shampoo product isolated studio";
    if (/perfume|parfum|fragrance|cologne|eau de/.test(text))
      return "perfume fragrance bottle product isolated studio";
    return "skincare moisturizer serum product isolated studio";
  }
  if (category === "toys") {
    if (/puzzle|alphabet|math|science|stem|learning|educational/.test(text))
      return "educational toy puzzle game product isolated studio";
    if (/board game|chess|card game|dice/.test(text))
      return "board game chess cards dice product isolated studio";
    return "kids toy building blocks product isolated studio";
  }
  if (category === "home") {
    if (/sofa|chair|table|bed|cabinet|furniture/.test(text))
      return "furniture product isolated studio";
    if (/vase|mirror|lamp|decor|cushion|wall art/.test(text))
      return "home decor product isolated studio";
    return "kitchen accessories cookware kettle dinner set product isolated studio";
  }
  if (category === "sports") {
    if (/football/.test(text)) return "football ball product isolated studio";
    if (/cricket bat/.test(text)) return "cricket bat product isolated studio";
    if (/cricket ball/.test(text))
      return "cricket ball product isolated studio";
    if (/glove/.test(text))
      return "cricket batting gloves product isolated studio";
    if (/helmet/.test(text)) return "cricket helmet product isolated studio";
    if (/badminton shuttle/.test(text))
      return "badminton shuttlecock product isolated studio";
    if (/badminton/.test(text))
      return "badminton racket product isolated studio";
    if (/tennis ball/.test(text)) return "tennis ball product isolated studio";
    if (/tennis racket/.test(text))
      return "tennis racket product isolated studio";
    return "sports equipment product isolated studio";
  }
  if (category === "accessories") {
    if (/watch/.test(text)) return "wrist watch product isolated studio";
    if (/bag|backpack|handbag/.test(text))
      return "handbag backpack product isolated studio";
    if (/sunglass/.test(text)) return "sunglasses product isolated studio";
    if (/jewelry|necklace|bracelet/.test(text))
      return "jewelry product isolated studio";
    return "wallet accessory product isolated studio";
  }
  return `${category} product isolated studio`;
}

function stablePhotoLock(category, index, subCategory, name) {
  const value = `${category}|${subCategory}|${name}|${index}`;
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 1000000000 || 1;
}

function stableProductPhoto(
  category,
  index,
  subCategory,
  name,
  variant = 0,
  id = "",
) {
  // Exact product pools are checked first. This keeps each named product's
  // images separate and prevents the same pool from being reused for them.
  const productPool = productPhotoPools[id];
  if (productPool && productPool.length)
    return productPool[variant % productPool.length];
  // Use the verified direct photo collections already kept in this file.
  // No image API, random image service, or generated placeholder is used.
  const pool = poolFor(category, `${subCategory} ${name}`);
  if (!pool || !pool.length) return stableFallbackFor(category, index);
  return pool[(Math.max(0, index - 1) + variant) % pool.length];
}

function productImage(category, index, subCategory = "", name = "", id = "") {
  return stableProductPhoto(category, index, subCategory, name, 0, id);
}

function makeProduct({
  id,
  name,
  category,
  subCategory,
  department,
  brand,
  index,
  price,
  premium = false,
}) {
  subCategory = classifySubCategory(
    category,
    name,
    brand,
    subCategory,
    department,
  );
  const discount = premium ? 15 : [15, 20, 25, 30, 35, 40, 45][index % 7];
  const finalPrice = Math.round(price / 50) * 50;
  const oldPrice = Math.round(finalPrice / (1 - discount / 100));
  // Image assignment is based on the exact product category/type.
  // Each product receives a direct product-photo URL from the matching collection.
  const image = productImage(category, index, subCategory, name, id);
  const localImage = image;
  // Keep all four product-specific photos for the product gallery while
  // retaining the first selected photo as the card/primary image.
  const imageCandidates = productPhotoPools[id]
    ? [...productPhotoPools[id]]
    : [image];
  const gender =
    department === "Men"
      ? "male"
      : department === "Women"
        ? "female"
        : "unisex";
  return {
    id,
    name,
    title: name,
    description: `${brand} ${name} from the ${subCategory} collection.`,
    brand,
    category,
    subCategory,
    department,
    price: finalPrice,
    oldPrice,
    discount,
    rating: 4.1 + (index % 9) / 10,
    reviews: 220 + (index % 41) * 31,
    images: imageCandidates,
    image,
    localImage,
    newArrival: index % 6 === 0,
    trending: index % 3 !== 0,
    flashSale: !premium && discount >= 30 && index % 2 === 0,
    deal: !premium && discount >= 20,
    premium: premium || finalPrice >= 3000,
    gender,
    ageGroup: department === "Kids" ? "kids" : "adult",
    minAge: department === "Kids" ? 3 : 18,
    maxAge: department === "Kids" ? 16 : 60,
    inStock: true,
    sizes:
      category === "fashion"
        ? ["S", "M", "L", "XL"]
        : category === "footwear"
          ? ["6", "7", "8", "9", "10"]
          : [],
    colors: ["Black", "White", "Blue", "Beige"],
    source: "expanded-local",
    tags: [category, subCategory, department],
  };
}

export function buildExpandedCatalog() {
  const out = [];
  const add = (cfg) => out.push(makeProduct(cfg));

  // Fashion: 150 total — Men 50, Women 70, Kids 30.
  const menFashionNames = [
    "Classic Cotton Shirt",
    "Premium Casual T-Shirt",
    "Slim Fit Jeans",
    "Everyday Hoodie",
    "Tailored Jacket",
    "Comfort Trousers",
    "Formal Oxford Shirt",
    "Denim Jacket",
    "Polo T-Shirt",
    "Cargo Trousers",
  ];
  const womenFashionNames = [
    "Women’s Casual Top",
    "Women’s Maxi Dress",
    "Women’s Slim Fit Jeans",
    "Women’s Blouse",
    "Women’s Summer Dress",
    "Women’s Pleated Skirt",
    "Women’s Tailored Jacket",
    "Women’s Wide-Leg Trousers",
    "Women’s Party Dress",
    "Women’s Cotton Shirt",
  ];
  const kidsFashionNames = [
    "Kids Cotton T-Shirt",
    "Kids Denim Jeans",
    "Kids Hoodie",
    "Kids Casual Shirt",
    "Kids Party Dress",
    "Kids Jogger Pants",
    "Kids Summer Top",
    "Kids Denim Jacket",
  ];
  for (let i = 1; i <= 10; i++) {
    const brand = pick(brandSets.fashionMen, i - 1),
      product = pick(menFashionNames, i - 1),
      premium = i % 3 === 0;
    add({
      id: `fashion-men-${i}`,
      name: `${brand} Men's ${product}`,
      category: "fashion",
      subCategory: "men fashion",
      department: "Men",
      brand,
      index: i,
      price: premium ? 4200 + (i % 8) * 500 : 1200 + (i % 12) * 150,
      premium,
    });
  }
  for (let i = 1; i <= 10; i++) {
    const brand = pick(brandSets.fashionWomen, i - 1),
      product = pick(womenFashionNames, i - 1),
      premium = i % 3 === 0;
    add({
      id: `fashion-women-${i}`,
      name: `${brand} Women's ${product}`,
      category: "fashion",
      subCategory: "women fashion",
      department: "Women",
      brand,
      index: 50 + i,
      price: premium ? 4500 + (i % 8) * 550 : 1400 + (i % 12) * 170,
      premium,
    });
  }
  for (let i = 1; i <= 6; i++) {
    const brand = pick(brandSets.fashionKids, i - 1),
      product = pick(kidsFashionNames, i - 1),
      premium = i % 5 === 0;
    add({
      id: `fashion-kids-${i}`,
      name: `${brand} ${product}`,
      category: "fashion",
      subCategory: "kids fashion",
      department: "Kids",
      brand,
      index: 120 + i,
      price: premium ? 3200 + (i % 6) * 350 : 650 + (i % 8) * 40,
      premium,
    });
  }

  // Footwear: 90 total — Men 35, Women 35, Kids 20.
  const menFoot = [
    "Running Shoes",
    "Classic Leather Shoes",
    "Street Sneakers",
    "Comfort Sandals",
    "Everyday Slippers",
    "Trail Boots",
    "Sports Trainers",
    "Canvas Sneakers",
  ];
  const womenFoot = [
    "Running Shoes",
    "Classic Leather Heels",
    "Street Sneakers",
    "Comfort Sandals",
    "Everyday Slippers",
    "Ankle Boots",
    "Court Shoes",
    "Platform Sandals",
  ];
  const kidsFoot = [
    "Kids Running Shoes",
    "Kids Sneakers",
    "Kids Sandals",
    "Kids Slippers",
    "Kids School Shoes",
    "Kids Sports Shoes",
  ];
  for (let i = 1; i <= 8; i++) {
    const brand = pick(brandSets.footwearMen, i - 1);
    add({
      id: `footwear-men-${i}`,
      name: `${brand} Men's ${pick(menFoot, i - 1)}`,
      category: "footwear",
      subCategory: "men footwear",
      department: "Men",
      brand,
      index: i,
      price: i % 3 === 0 ? 3800 + (i % 6) * 400 : 1800 + (i % 8) * 180,
      premium: i % 3 === 0,
    });
  }
  for (let i = 1; i <= 8; i++) {
    const brand = pick(brandSets.footwearWomen, i - 1);
    add({
      id: `footwear-women-${i}`,
      name: `${brand} Women's ${pick(womenFoot, i - 1)}`,
      category: "footwear",
      subCategory: "women footwear",
      department: "Women",
      brand,
      index: 35 + i,
      price: i % 3 === 0 ? 4000 + (i % 6) * 450 : 1900 + (i % 8) * 180,
      premium: i % 3 === 0,
    });
  }
  for (let i = 1; i <= 5; i++) {
    const brand = pick(brandSets.footwearKids, i - 1);
    add({
      id: `footwear-kids-${i}`,
      name: `${brand} ${pick(kidsFoot, i - 1)}`,
      category: "footwear",
      subCategory: "kids footwear",
      department: "Kids",
      brand,
      index: 70 + i,
      price: 820 + (i % 6) * 30,
      premium: false,
    });
  }

  // Electronics: exactly 400, split by product type. No mixed product types inside a collection.
  const electronicGroups = [
    [
      "smartphones",
      10,
      [
        "iPhone",
        "Galaxy Smartphone",
        "Pixel Smartphone",
        "Reno Smartphone",
        "OnePlus Smartphone",
        "Xperia Smartphone",
        "Moto Smartphone",
        "Nord Smartphone",
      ],
    ],
    [
      "laptops",
      10,
      [
        "MacBook Laptop",
        "Galaxy Book Laptop",
        "VAIO Laptop",
        "ThinkPad Laptop",
        "IdeaPad Laptop",
        "Pavilion Laptop",
        "Inspiron Laptop",
        "ASUS Laptop",
      ],
    ],
    [
      "tablets",
      7,
      [
        "iPad Tablet",
        "Galaxy Tab",
        "Xiaomi Tablet",
        "OnePlus Tablet",
        "Lenovo Tablet",
        "ASUS Tablet",
      ],
    ],
    [
      "televisions",
      6,
      [
        "Bravia Smart TV",
        "Crystal UHD Smart TV",
        "OLED Smart TV",
        "4K Smart TV",
        "QLED Smart TV",
        "Google TV",
      ],
    ],
    [
      "cameras",
      8,
      [
        "Mirrorless Camera",
        "Digital Camera",
        "Action Camera",
        "Vlog Camera",
        "Professional Camera",
      ],
    ],
    [
      "audio",
      10,
      [
        "Wireless Headphones",
        "Noise Cancelling Headphones",
        "True Wireless Earbuds",
        "Bluetooth Speaker",
        "Soundbar",
        "Wireless Earphones",
      ],
    ],
    [
      "computer accessories",
      9,
      [
        "Wireless Mouse",
        "Mechanical Keyboard",
        "USB-C Charger",
        "Laptop Stand",
        "Webcam",
        "USB Hub",
        "External SSD",
      ],
    ],
    ["wearables", 10, ["Smartwatch", "Fitness Tracker", "GPS Smartwatch"]],
    [
      "gaming",
      8,
      [
        "Gaming Console",
        "Gaming Controller",
        "Gaming Headset",
        "Gaming Keyboard",
      ],
    ],
  ];
  let eIndex = 0;
  for (const [sub, count, products] of electronicGroups) {
    for (let j = 1; j <= count; j++) {
      const brand = pick(brandSets.electronics, j - 1),
        product = pick(products, j - 1),
        premium = j % 2 === 0;
      const base = {
        smartphones: 22000,
        laptops: 48000,
        tablets: 18000,
        televisions: 28000,
        cameras: 30000,
        audio: 5000,
        "computer accessories": 2500,
        wearables: 9000,
        gaming: 18000,
      }[sub];
      eIndex++;
      add({
        id: `electronics-${sub.replace(/\s+/g, "-")}-${j}`,
        name: `${brand} ${product}`,
        category: "electronics",
        subCategory: sub,
        department: "Unisex",
        brand,
        index: eIndex,
        price: premium ? base + 8000 + (j % 9) * 3500 : base + (j % 10) * 700,
        premium,
      });
    }
  }

  // Beauty & Personal Care: 72 — evenly useful coverage across skincare, makeup, haircare, fragrance.
  const beautyNames = {
    skincare: [
      "Hydrating Serum",
      "Daily Moisturizer",
      "Glow Face Cream",
      "Vitamin C Face Serum",
      "Gentle Cleanser",
      "Sunscreen Lotion",
    ],
    makeup: [
      "Matte Lipstick",
      "Volume Mascara",
      "Liquid Foundation",
      "Blush Palette",
      "Makeup Kit",
      "Concealer Stick",
    ],
    haircare: [
      "Repair Shampoo",
      "Nourishing Conditioner",
      "Hair Serum",
      "Hair Mask",
      "Anti-Dandruff Shampoo",
      "Hair Oil",
    ],
    fragrance: [
      "Luxury Perfume",
      "Eau de Parfum",
      "Floral Fragrance",
      "Woody Cologne",
      "Fresh Eau de Toilette",
    ],
  };
  let bIndex = 0;
  for (const sub of ["skincare", "makeup", "haircare", "fragrance"]) {
    for (let j = 1; j <= 8; j++) {
      bIndex++;
      const brand = pick(brandSets.beauty, j - 1);
      const base = {
        skincare: 200,
        makeup: 800,
        haircare: 750,
        fragrance: 2500,
      }[sub];
      const premium = j % 3 === 0 || sub === "fragrance";
      add({
        id: `beauty-${sub}-${j}`,
        name: `${brand} ${pick(beautyNames[sub], j - 1)}`,
        category: "beauty",
        subCategory: sub,
        department: "Women",
        brand,
        index: bIndex,
        price: premium ? base + 3000 + (j % 8) * 400 : base + (j % 9) * 180,
        premium,
      });
    }
  }

  // Toys: 70 — Kids Toys 35, Educational Toys 20, Board Games 15.
  const toyNames = {
    "kids toys": [
      "Building Blocks Set",
      "Remote Control Car",
      "Plush Toy",
      "Doll Play Set",
      "Magnetic Construction Set",
      "Kids Pretend Play Set",
    ],
    "educational toys": [
      "Educational Puzzle",
      "Alphabet Learning Set",
      "Math Learning Game",
      "Science Experiment Kit",
      "STEM Building Set",
    ],
    "board games": [
      "Strategy Board Game",
      "Family Board Game",
      "Dice Game",
      "Chess Board Game",
      "Card Game",
    ],
  };
  let tIndex = 0;
  for (const [sub, count] of [
    ["kids toys", 6],
    ["educational toys", 6],
    ["board games", 6],
  ]) {
    for (let j = 1; j <= count; j++) {
      tIndex++;
      const brand = pick(brandSets.toys, j - 1);
      add({
        id: `toys-${sub.replace(/\s+/g, "-")}-${j}`,
        name: `${brand} ${pick(toyNames[sub], j - 1)}`,
        category: "toys",
        subCategory: sub,
        department: "Kids",
        brand,
        index: tIndex,
        price: 650 + (j % 9) * 120,
        premium: j % 6 === 0,
      });
    }
  }

  // Home: 70 — Furniture 25, Home Decor 20, Kitchen Accessories 25. No Home Appliances.
  const homeNames = {
    furniture: [
      "Modern Sofa",
      "Accent Chair",
      "Bedside Table",
      "Dining Table",
      "Storage Cabinet",
      "Platform Bed",
    ],
    "home decor": [
      "Designer Vase",
      "Wall Mirror",
      "Decorative Lamp",
      "Table Decor",
      "Cushion Set",
      "Wall Art",
    ],
    "kitchen accessories": [
      "Kitchen Mixer",
      "Cookware Set",
      "Dinner Set",
      "Knife Set",
      "Storage Container Set",
      "Electric Kettle",
    ],
  };
  let hIndex = 0;
  for (const [sub, count] of [
    ["furniture", 9],
    ["home decor", 10],
    ["kitchen accessories", 10],
  ]) {
    for (let j = 1; j <= count; j++) {
      hIndex++;
      const brand = pick(brandSets.home, j - 1);
      const base = {
        furniture: 9000,
        "home decor": 2500,
        "kitchen accessories": 1800,
      }[sub];
      const premium = j % 3 === 0;
      add({
        id: `home-${sub.replace(/\s+/g, "-")}-${j}`,
        name: `${brand} ${pick(homeNames[sub], j - 1)}`,
        category: "home",
        subCategory: sub,
        department: "Unisex",
        brand,
        index: hIndex,
        price: premium ? base + 7000 + (j % 7) * 900 : base + (j % 10) * 350,
        premium,
      });
    }
  }

  // Accessories unchanged in spirit: 60 products.
  for (let i = 1; i <= 30; i++) {
    const brand = pick(brandSets.accessories, i - 1);
    const sub = pick(
      ["watches", "bags", "jewelry", "sunglasses", "wallets"],
      i - 1,
    );
    const base = {
      watches: 7000,
      bags: 4500,
      jewelry: 3500,
      sunglasses: 3000,
     
    }[sub];
    const premium = i % 2 === 0;
    add({
      id: `accessories-${i}`,
      name: `${brand} ${pick(names.accessories, i - 1)} ${i}`,
      category: "accessories",
      subCategory: sub,
      department: "Unisex",
      brand,
      index: i,
      price: premium ? base + 6000 + (i % 8) * 1000 : base + (i % 9) * 350,
      premium,
    });
  }

  // Sports: 50. Product names and image queries stay tied to the exact sport/product.
  const sportsNames = {
    football: [
      "Match Football",
      "Training Football",
      "Professional Football",
      "Club Football",
    ],
    cricket: [
      "Professional Cricket Bat",
      "Tournament Cricket Ball",
      "Cricket Batting Gloves",
      "Cricket Helmet",
    ],
    badminton: [
      "Carbon Badminton Racket",
      "Badminton Shuttlecock Set",
      "Badminton Net",
    ],
    tennis: ["Tennis Racket", "Tennis Ball Set", "Tennis Net"],
  };
  let sIndex = 0;
  for (const [sub, count] of [
    ["football", 8],
    ["cricket", 7],
    ["badminton", 6],
    ["tennis", 6],
  ]) {
    for (let j = 1; j <= count; j++) {
      sIndex++;
      const brand = pick(brandSets.sports, j - 1);
      add({
        id: `sports-${sub.replace(/\s+/g, "-")}-${j}`,
        name: `${brand} ${pick(sportsNames[sub], j - 1)}`,
        category: "sports",
        subCategory: sub,
        department: "Unisex",
        brand,
        index: sIndex,
        price:
          { football: 650, cricket: 780, badminton: 820, tennis: 1200 }[sub] +
          (j % 12) * 180,
        premium: false,
      });
    }
  }
  return out;
}
