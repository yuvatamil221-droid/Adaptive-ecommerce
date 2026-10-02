import {useContext,useMemo,useState} from "react";
import {ProductContext} from "../context/ProductContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import {ProductImage} from "../components/common";

function MiniCard({product,navigate,priority=false}){return <button onClick={()=>navigate("productDetails",product)} className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] text-left shadow-sm"><ProductImage src={product.image} alt={product.name} product={product} priority={priority} className="h-32 w-full sm:h-40"/><div className="p-3"><h3 className="line-clamp-2 min-h-10 text-sm font-black">{product.name}</h3><b className="mt-2 block">₹{product.price.toLocaleString()}</b><span className="mt-1 block text-xs text-[var(--theme-muted)]">★ {product.rating.toFixed(1)}</span></div></button>}

export default function Trending({navigate}){
 const {allProducts}=useContext(ProductContext); const [category,setCategory]=useState("All"); const [expanded,setExpanded]=useState({});
 const categories=["All","Electronics","Fashion","Home","Kids"];
 const matches=useMemo(()=>{if(category==="All")return allProducts.filter(p=>p.trending);const key=category.toLowerCase();return allProducts.filter(p=>p.trending&&(p.category.includes(key)||p.subCategory.includes(key)||p.department.toLowerCase()===key));},[allProducts,category]);
 const groups=category==="All"?["Electronics","Fashion","Home","Kids"]:[category];
 return <><Header navigate={navigate}/><Navigation navigate={navigate}/><main className="pb-28">
  <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-6 sm:px-6"><div className="flex min-w-max gap-3">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full px-6 py-3 font-black ${category===c?"bg-black text-white":"bg-[var(--theme-bg)]"}`}>{c}</button>)}</div></div>
  <div className="border-t border-[var(--theme-border)]"/>
  {groups.map(group=>{const key=group.toLowerCase();const items=matches.filter(p=>group==="All"||p.category.includes(key)||p.subCategory.includes(key)||p.department.toLowerCase()===key).slice(0,28);if(!items.length)return null;const isOpen=!!expanded[group];const shown=isOpen?items:items.slice(0,8);const feature=items[4]||items[0];return <section key={group} className="bg-[var(--theme-bg)] py-10"><div className="mx-auto max-w-7xl px-4 sm:px-6"><h2 className="mb-6 text-3xl font-black">{group} Trends</h2><div className="grid grid-cols-3 gap-2 sm:gap-3"><div className="col-span-2 grid grid-cols-2 gap-2 sm:gap-3">{shown.slice(0,4).map((p,i)=><MiniCard key={p.id} product={p} navigate={navigate} priority={i<4}/>)}</div><button onClick={()=>navigate("productDetails",feature)} className="relative min-h-[270px] overflow-hidden rounded-2xl bg-slate-900 text-left sm:min-h-[360px]"><ProductImage src={feature.image} alt={feature.name} priority className="h-full w-full"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-3 pt-20 text-white sm:p-5 sm:pt-28"><span className="text-[10px] font-black uppercase tracking-widest sm:text-xs">Trending Pick</span><h3 className="mt-1 line-clamp-3 text-sm font-black sm:text-xl">{feature.name}</h3><b className="mt-2 block">₹{feature.price.toLocaleString()}</b></div></button></div><div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">{shown.slice(4).map((p,i)=><MiniCard key={p.id} product={p} navigate={navigate} priority={i<2}/>)}</div><button onClick={()=>setExpanded(x=>({...x,[group]:!isOpen}))} className="mt-6 w-full rounded-2xl bg-[var(--theme-surface)] px-5 py-4 text-center font-black shadow-sm">{isOpen?"VIEW LESS ←":`VIEW ${items.length} PRODUCTS →`}</button></div></section>})}
 </main></>
}
