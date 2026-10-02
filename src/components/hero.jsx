import {useContext,useMemo} from "react";
import {UserContext} from "../context/UserContext";
import {experiences} from "../config/experiences";
import {ProductContext} from "../context/ProductContext";
import {Button,ProductImage} from "./common";

export default function Hero({navigate}){
 const {preferences}=useContext(UserContext);
 const {allProducts}=useContext(ProductContext);
 const exp=experiences[preferences.experience]||experiences.dealHunter;
 const featured=useMemo(()=>{
   const usable=allProducts.filter(p=>p.category!=="sports"&&p.category!=="vehicle");
   if(preferences.experience==="premiumShopper")return [...usable].filter(p=>p.price>=3000).sort((a,b)=>b.price-a.price)[0];
   if(preferences.experience==="frequentShopper")return [...usable].find(p=>p.trending)||usable[0];
   // Deal Hunter gets a real discounted product, rotated by category instead of one repeated image.
   const dealPool=usable.filter(p=>p.deal&&["fashion","footwear","electronics","beauty","accessories","home"].includes(p.category));
   const ranked=[...dealPool].sort((a,b)=>b.discount-a.discount||b.rating-a.rating);
   // Rotate the hero product by day so the same product photo is not used forever.
   return ranked.length?ranked[new Date().getDate()%Math.min(ranked.length,8)]:usable[0];
 },[allProducts,preferences.experience]);
 const data={
  dealHunter:{title:"Big savings, picked for you",sub:"Deals, flash sales and smart prices without the endless searching.",badge:"DEAL MODE",action:"Grab Deal"},
  premiumShopper:{title:"Curated for a premium eye",sub:"Explore premium brands, elevated collections and new arrivals.",badge:"PREMIUM EDIT",action:"Explore Premium"},
  frequentShopper:{title:"Buy again, faster",sub:"Your everyday shopping shortcuts are closer than ever.",badge:"QUICK SHOP",action:"For You"},
  explorer:{title:"Find your next favourite",sub:"Trending products and fresh arrivals across categories.",badge:"DISCOVER",action:"Start Exploring"}
 }[preferences.experience]||{};
 const goPrimary=()=>{
   if(preferences.experience==="dealHunter")navigate("products",{deal:true});
   else if(preferences.experience==="premiumShopper")navigate("newArrivals");
   else if(preferences.experience==="frequentShopper")navigate("forYou");
   else navigate("trending");
 };
 return <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
   <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow)]">
     <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage:featured?.source==="expanded-local"?"none":`url(${featured?.image||""})`}}/>
     <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-surface)] via-[var(--theme-surface)]/90 to-[var(--theme-surface)]/25"/>
     <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--theme-secondary)]/20 blur-3xl"/>
     <div className="relative grid min-h-[360px] gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_300px] lg:items-center">
       <div className="max-w-3xl">
         <span className="rounded-full bg-[var(--theme-primary)] px-3 py-1 text-xs font-black text-white">{data.badge}</span>
         <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{data.title}</h1>
         <p className="mt-4 max-w-2xl text-base text-[var(--theme-muted)] sm:text-lg">{data.sub}</p>
         <div className="mt-7 flex flex-wrap gap-3"><Button onClick={goPrimary}>{data.action}</Button><Button variant="secondary" onClick={()=>navigate("categories")}>Browse Categories</Button></div>
       </div>
       {featured&&<button onClick={()=>navigate("productDetails",featured)} className="group overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)]/90 text-left shadow-xl backdrop-blur-sm">
         <div className="aspect-square overflow-hidden"><ProductImage src={featured.image} images={featured.images} alt={featured.name} product={featured} className="h-full w-full transition duration-500 group-hover:scale-105"/></div>
         <div className="p-4"><p className="text-xs font-black uppercase tracking-widest text-[var(--theme-primary)]">Featured pick</p><h2 className="mt-1 line-clamp-2 font-black">{featured.name}</h2><div className="mt-2 flex items-center justify-between"><b>₹{featured.price.toLocaleString()}</b><span className="text-xs font-black text-green-600">{featured.discount}% OFF</span></div></div>
       </button>}
     </div>
   </div>
 </section>;
}
