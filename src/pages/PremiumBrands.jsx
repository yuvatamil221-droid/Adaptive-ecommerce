import {useContext,useEffect,useMemo,useState} from "react";
import {ProductContext} from "../context/ProductContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Product from "../components/product";
import {ProductImage} from "../components/common";

const categoryConfig=[
 {key:"electronics",name:"Electronics",subs:["smartphones","laptops","tablets","audio","cameras","televisions","computer accessories","wearables","gaming","home appliances"]},
 {key:"fashion",name:"Fashion",subs:["men fashion","women fashion","kids fashion"]},
 {key:"footwear",name:"Footwear",subs:["men footwear","women footwear","kids footwear"]},
 {key:"beauty",name:"Beauty",subs:["skincare","makeup","haircare","fragrance"]},
 {key:"accessories",name:"Accessories",subs:["watches","bags","jewelry","sunglasses","wallets"]},
 {key:"home",name:"Home & Living",subs:["furniture","home decor","home appliances","kitchen accessories"]},
];

const preferredBrands={
 electronics:["Apple","Samsung","Sony","OnePlus","Google","Lenovo","HP","Dell"],
 fashion:["Nike","Adidas","Zara","Puma","Levi's","Calvin Klein","Mango"],
 footwear:["Nike","Adidas","Puma","Reebok","New Balance","Skechers","Aldo"],
 beauty:["L'Oreal","Maybelline","Nivea","MAC","Clinique","Dior","Chanel"],
 accessories:["Rolex","Casio","Fossil","Michael Kors","Coach","Ray-Ban","Tissot"],
 home:["Dyson","Philips","IKEA","Bosch","Samsung","LG","Godrej","Havells"],
};

const label=v=>String(v||"").replace(/\b\w/g,x=>x.toUpperCase());

export default function PremiumBrands({navigate,currentData}){
 const {allProducts}=useContext(ProductContext);
 const initialBrand=currentData?.brand||"";
 const initialCategory=initialBrand?((allProducts.find(p=>p.premium&&p.brand?.toLowerCase()===initialBrand.toLowerCase())||{}).category||""):"";
 const [category,setCategory]=useState(initialCategory);
 const [sub,setSub]=useState("");
 const [brand,setBrand]=useState(initialBrand);

useEffect(() => {
  if (!initialBrand || !allProducts.length) return;

  const hit = allProducts.find(
    p =>
      p.premium &&
      p.brand?.toLowerCase() === initialBrand.toLowerCase()
  );

  if (hit && !category) {
    setCategory(hit.category);
  }
}, [initialBrand, allProducts]);
 const premium=useMemo(()=>allProducts.filter(p=>p.premium&&p.price>=3000&&!['sports','vehicle'].includes(p.category)),[allProducts]);
 const collections=useMemo(()=>categoryConfig.map(c=>({...c,products:premium.filter(p=>p.category===c.key)})).filter(c=>c.products.length),[premium]);
 const allPremiumVisible=useMemo(()=>premium.slice(0,24),[premium]);
 const categoryProducts=useMemo(()=>premium.filter(p=>p.category===category),[premium,category]);
 const filteredBySub=useMemo(()=>sub?categoryProducts.filter(p=>String(p.subCategory||"").toLowerCase()===sub.toLowerCase()):categoryProducts,[categoryProducts,sub]);
 const availableBrands=useMemo(()=>[...new Set(filteredBySub.map(p=>p.brand).filter(b=>b&&b!=="Unbranded"))],[filteredBySub]);
 const topBrands=useMemo(()=>{
   const preferred=preferredBrands[category]||[];
   return [...preferred.filter(b=>availableBrands.some(x=>x.toLowerCase()===b.toLowerCase())),...availableBrands.filter(b=>!preferred.some(x=>x.toLowerCase()===b.toLowerCase()))].slice(0,10);
 },[availableBrands,category]);
 const visible=useMemo(()=>brand?filteredBySub.filter(p=>String(p.brand||"").toLowerCase()===brand.toLowerCase()):filteredBySub,[filteredBySub,brand]);

 const resetToCategories=()=>{setCategory("");setSub("");setBrand("");};
 const chooseCategory=k=>{setCategory(k);setSub("");setBrand("");};
 const chooseSub=k=>{setSub(k);setBrand("");};
 const chooseBrand=b=>setBrand(b);

 useEffect(()=>{
   if(category&&(sub||brand))document.getElementById("premium-products")?.scrollIntoView({behavior:"smooth",block:"start"});
 },[category,sub,brand]);

 const selectedConfig=categoryConfig.find(c=>c.key===category);

 return <>
  <Header navigate={navigate}/><Navigation navigate={navigate}/>
  <main className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6">
   <button onClick={()=>category?resetToCategories():navigate("home")} className="font-black text-[var(--theme-primary)]">← {category?"Back to Premium Collection":"Home"}</button>
   <p className="mt-5 text-xs font-black uppercase tracking-[.25em] text-[var(--theme-primary)]">Premium Shopper</p>
   <h1 className="mt-2 text-4xl font-black">Premium Brand Collections</h1>
   <p className="mt-2 max-w-3xl text-[var(--theme-muted)]">Premium products only. Start with a premium collection. Selecting a category reveals its collections and top brands on this same page.</p>

   {!category ? <>
    <section className="mt-7 rounded-3xl border bg-[var(--theme-surface)] p-4 sm:p-5">
     <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">Premium Collection</h2><span className="text-xs font-bold text-[var(--theme-muted)]">Premium only</span></div>
     <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {collections.map(c=>{const cover=c.products[0];return <button key={c.key} onClick={()=>chooseCategory(c.key)} className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] text-left transition hover:-translate-y-0.5 hover:shadow-md">
       <div className="aspect-[4/3] overflow-hidden bg-white"><ProductImage src={cover.image} images={cover.images} alt={`${c.name} premium collection`} product={cover} priority className="h-full w-full"/></div>
       <div className="p-3 text-center text-sm font-black">{c.name}</div>
      </button>})}
     </div>
    </section>

    <section className="mt-8" id="premium-products">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[var(--theme-muted)]">Premium Collection</p><h2 className="mt-1 text-2xl font-black">Premium Products</h2><p className="mt-1 text-sm text-[var(--theme-muted)]">{premium.length} premium products available</p></div></div>
      {allPremiumVisible.length?<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{allPremiumVisible.map((p,i)=><Product key={p.id} product={p} navigate={navigate} variant="premium" priority={i<12}/>)}</div>:<p className="mt-6 rounded-3xl border border-dashed p-10 text-center text-[var(--theme-muted)]">No premium products found.</p>}
    </section>
   </> : <>
    <section className="mt-7 rounded-3xl border bg-[var(--theme-surface)] p-5 sm:p-6">
     <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-black uppercase tracking-[.2em] text-[var(--theme-muted)]">Selected Premium Collection</p><h2 className="mt-1 text-2xl font-black">{selectedConfig?.name}</h2></div>
      <button onClick={resetToCategories} className="rounded-full border px-4 py-2 text-sm font-black hover:bg-[var(--theme-bg)]">← Premium Collection</button>
     </div>

     <h3 className="mt-7 text-lg font-black">Collections</h3>
     <div className="mt-3 flex flex-wrap gap-2">
      <button onClick={()=>chooseSub("")} className={`rounded-full px-4 py-2 text-sm font-black ${!sub?"bg-[var(--theme-primary)] text-white":"border"}`}>All</button>
      {(selectedConfig?.subs||[]).map(x=><button key={x} onClick={()=>chooseSub(x)} className={`rounded-full px-4 py-2 text-sm font-bold ${sub===x?"bg-[var(--theme-primary)] text-white":"border"}`}>{label(x)}</button>)}
     </div>

     <h3 className="mt-7 text-lg font-black">Top Brands</h3>
     <div className="mt-3 flex flex-wrap gap-2">
      <button onClick={()=>chooseBrand("")} className={`rounded-full px-4 py-2 text-sm font-black ${!brand?"bg-[var(--theme-primary)] text-white":"border"}`}>All Products</button>
      {topBrands.map(b=><button key={b} onClick={()=>chooseBrand(b)} className={`rounded-full px-4 py-2 text-sm font-bold ${brand===b?"bg-[var(--theme-primary)] text-white":"border"}`}>{b}</button>)}
     </div>
    </section>

    <section className="mt-8" id="premium-products">
     <div className="flex flex-wrap items-end justify-between gap-3">
      <div><p className="text-xs font-black uppercase tracking-[.2em] text-[var(--theme-muted)]">Products</p><h2 className="mt-1 text-2xl font-black">{brand?`${brand} Products`:sub?`${label(sub)} Premium Products`:`All Premium ${selectedConfig?.name}`}</h2><p className="mt-1 text-sm text-[var(--theme-muted)]">{visible.length} products · premium only</p></div>
     </div>
     {visible.length?<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{visible.map((p,i)=><Product key={p.id} product={p} navigate={navigate} variant="premium" priority={i<12}/>)}</div>:<p className="mt-6 rounded-3xl border border-dashed p-10 text-center text-[var(--theme-muted)]">No premium products found for this selection.</p>}
    </section>
   </>}
  </main>
 </>;
}
