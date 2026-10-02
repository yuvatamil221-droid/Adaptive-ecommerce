import {useContext,useMemo,useEffect,useState} from "react";
import {ProductContext} from "../context/ProductContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Product from "../components/product";
import {Section} from "../components/common";

export default function DealHome({navigate}){
 const {allProducts}=useContext(ProductContext);
 const [minDiscount,setMinDiscount]=useState(20);
 const [seconds,setSeconds]=useState(5*60*60);
 useEffect(()=>{const timer=setInterval(()=>setSeconds(s=>s>0?s-1:5*60*60),1000);return()=>clearInterval(timer)},[]);
 const deals=useMemo(()=>allProducts.filter(p=>p.deal&&p.discount>=minDiscount).sort((a,b)=>b.discount-a.discount||a.price-b.price),[allProducts,minDiscount]);
 const flash=useMemo(()=>allProducts.filter(p=>p.flashSale&&p.discount>=30).sort((a,b)=>b.discount-a.discount||a.price-b.price),[allProducts]);
 const h=String(Math.floor(seconds/3600)).padStart(2,"0");
 const m=String(Math.floor((seconds%3600)/60)).padStart(2,"0");
 const s=String(seconds%60).padStart(2,"0");
 return <><Header navigate={navigate}/><Navigation navigate={navigate}/><main className="pb-28">
   <section className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 px-4 py-12 text-white"><div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"/><div className="relative mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[.3em]">Adaptive Deals</p><h1 className="mt-2 text-4xl font-black sm:text-6xl">Save more. Shop smarter.</h1><p className="mt-3 max-w-xl">Discount-focused products selected for clear, easy-to-read savings.</p><div className="mt-6 inline-flex rounded-2xl bg-black/20 px-5 py-3 text-lg font-black">Sale ends in {h}:{m}:{s}</div><div><button onClick={()=>navigate("products",{flashSale:true})} className="mt-6 rounded-2xl bg-white px-6 py-3 font-black text-red-600">View Flash Sale →</button></div></div></section>
   <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6"><div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3"><span className="mr-2 text-sm font-black">Minimum discount</span>{[20,30,40].map(x=><button key={x} onClick={()=>setMinDiscount(x)} className={`rounded-full px-4 py-2 text-sm font-bold ${minDiscount===x?"bg-[var(--theme-primary)] text-white":"border"}`}>{x}%+</button>)}</div></div>
   <Section title="Top Deals" subtitle="Real products with clear discount labels" action="View all" onAction={()=>navigate("products",{deal:true})}>
     {deals.length?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{deals.slice(0,12).map((p,i)=><Product key={p.id} product={p} navigate={navigate} variant="deal" priority={i<4}/>)}</div>:<p className="rounded-3xl border border-dashed p-10 text-center text-[var(--theme-muted)]">No deals are available for this discount level.</p>}
   </Section>
   <Section title="Flash Sale" subtitle="30% OFF and above" action="View all" onAction={()=>navigate("products",{flashSale:true})}>
     {flash.length?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{flash.slice(0,8).map((p,i)=><Product key={p.id} product={p} navigate={navigate} variant="deal" priority={i<4}/>)}</div>:<p className="rounded-3xl border border-dashed p-10 text-center text-[var(--theme-muted)]">No flash-sale products found.</p>}
   </Section>
 </main></>;
}
