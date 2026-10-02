import {useContext,useMemo} from "react";
import {ProductContext} from "../context/ProductContext";
import {UserContext} from "../context/UserContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Product from "../components/product";

export default function CollectionPage({navigate,title,filter,personalized=false}){
 const {allProducts,recommend}=useContext(ProductContext);
 const {preferences}=useContext(UserContext);
 const list=useMemo(()=>{
   let items=allProducts.filter(filter);
   if(personalized){
     if(preferences.gender&&preferences.gender!=="unisex")items=items.filter(p=>p.gender===preferences.gender||p.gender==="unisex");
     if(preferences.age)items=items.filter(p=>Number(preferences.age)>=Number(p.minAge)&&Number(preferences.age)<=Number(p.maxAge));
     items=items.filter(p=>p.price>=999);
   }
   if(preferences.experience==="premiumShopper")items=items.filter(p=>p.price>=3000);
   return recommend(preferences,items);
 },[allProducts,preferences,filter,personalized]);
 return <><Header navigate={navigate}/><Navigation navigate={navigate}/><main className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6"><button onClick={()=>navigate("home")} className="mb-4 font-bold">← Home</button><h1 className="text-4xl font-black">{title}</h1><p className="mt-2 text-[var(--theme-muted)]">{list.length} products personalized for {preferences.name||"your profile"}.</p><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{list.map(p=><Product key={p.id} product={p} navigate={navigate}/>)}</div></main></>;
}
