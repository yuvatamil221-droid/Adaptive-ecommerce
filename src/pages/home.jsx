import {useContext,useMemo} from "react";
import {ProductContext} from "../context/ProductContext";
import {UserContext} from "../context/UserContext";
import {sectionLabels} from "../config/homepage";
import {experiences} from "../config/experiences";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Hero from "../components/hero";
import Product from "../components/product";
import {Section,SkeletonCard} from "../components/common";

const takeUnique=(list,count,used)=>{
 const out=[];
 for(const p of list){if(!p||used.has(p.id))continue;used.add(p.id);out.push(p);if(out.length===count)break;}
 return out;
};

export default function Home({navigate,currentPage,currentData}){
 const {allProducts,loading,error,recommend}=useContext(ProductContext);
 const {preferences}=useContext(UserContext);
 const exp=experiences[preferences.experience]||experiences.dealHunter;
 const premiumOnly=useMemo(()=>allProducts.filter(p=>p.premium&&p.price>=3000&&!p.deal&&!p.flashSale&&!['sports','vehicle'].includes(p.category)),[allProducts]);
 const source=preferences.experience==="premiumShopper"?premiumOnly:allProducts;
 const products=useMemo(()=>recommend(preferences,source),[source,preferences]);
 const sets=useMemo(()=>{
   const used=new Set();
   const by=(list,count)=>takeUnique(list,count,used);
   const pool=source.filter(p=>p.category!=="sports"||preferences.experience!=="premiumShopper");
   const recommendedPool=products.length?products:pool;
   const trendingPool=pool.filter(p=>p.trending);
   const flashPool=pool.filter(p=>p.flashSale&&p.discount>=30);
   const dealPool=pool.filter(p=>p.deal&&p.discount>=20);
   const newPool=pool.filter(p=>p.newArrival);
   const discounted=pool.filter(p=>p.discount>=25);
   return {
     recommended:by(recommendedPool,8),
     trending:by(trendingPool,8),
     flashSale:by(flashPool,8),
     deals:by(dealPool,8),
     newArrivals:by(newPool,8),
     premiumCollection:by(premiumOnly,8),
     favoriteBrands:by(pool.filter(p=>p.premium||p.brand!=="Unbranded"),6),
     continueShopping:by(recommendedPool.slice(8),6),
     reorder:by(recommendedPool.slice(14),6),
     frequentlyBought:by(recommendedPool.slice(20),6),
     recentlyViewed:by(recommendedPool.slice(26),6),
     seasonal:by(trendingPool.slice(8),6),
     wishlistOffers:by(discounted,6),
   };
 },[source,products,premiumOnly,preferences.experience]);
 const renderSection=(section)=>{
   if(section==="favoriteBrands"){
     const brands=[...new Set(premiumOnly.map(p=>p.brand).filter(b=>b&&b!=="Unbranded"))].slice(0,8);
     if(!brands.length)return null;
     return <Section key={section} title="Favorite Brands" subtitle="Premium brands only" action="Browse brands" onAction={()=>navigate("brands")}>
       <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{brands.map(b=><button key={b} onClick={()=>navigate("brands",{brand:b})} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 text-left font-black shadow-sm hover:shadow-lg"><span className="text-xs uppercase tracking-widest text-[var(--theme-muted)]">Premium brand</span><span className="mt-2 block text-lg">{b}</span><span className="mt-2 block text-sm text-[var(--theme-primary)]">Open collection →</span></button>)}</div>
     </Section>;
   }
   if(!sets[section]?.length)return null;
   return <Section key={section} title={sectionLabels[section]||section} action="View all" onAction={()=>section==="trending"?navigate("trending"):navigate("products",section==="flashSale"?{flashSale:true}:section==="deals"?{deal:true}:section==="newArrivals"?{newArrivals:true}:null)}>
     <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{sets[section].map((p,index)=><Product key={p.id} product={p} navigate={navigate} priority={index<4}/>)}</div>
   </Section>;
 };
 return <><Header navigate={navigate}/><Navigation navigate={navigate} currentPage={currentPage} currentData={currentData}/><Hero navigate={navigate}/>{error&&<div className="mx-auto max-w-7xl px-4 pt-4 text-sm font-bold text-red-600">Online product API could not be reached. Refresh after checking your internet connection.</div>}{loading?<section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-8 sm:grid-cols-4 sm:px-6">{[1,2,3,4].map(x=><SkeletonCard key={x}/>)}</section>:exp.home.filter(x=>x!=="hero").map(renderSection)}</>
}
