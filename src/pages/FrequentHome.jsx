import {useContext,useMemo} from "react";
import {ProductContext} from "../context/ProductContext";
import {UserContext} from "../context/UserContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Product from "../components/product";
import {Section} from "../components/common";

export default function FrequentHome({navigate}){
 const {allProducts}=useContext(ProductContext);
 const {preferences}=useContext(UserContext);
 const orders=JSON.parse(localStorage.getItem("adaptive-orders")||"[]");
 const reorderIds=new Set(orders.flatMap(o=>(o.items||[]).map(p=>p.id)));
 const reorder=useMemo(()=>allProducts.filter(p=>reorderIds.has(p.id)),[allProducts,orders.length]);
 const general=useMemo(()=>allProducts.filter(p=>p.trending||p.newArrival),[allProducts]);
 return <><Header navigate={navigate}/><Navigation navigate={navigate}/><main className="pb-28"><Section title={`For ${preferences.name||"You"}`} subtitle="Personalized by your profile, gender and age"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{general.slice(0,12).map(p=><Product key={p.id} product={p} navigate={navigate}/>)}</div></Section>{reorder.length>0&&<Section title="Reorder what you bought" subtitle="Products from your previous orders"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{reorder.slice(0,8).map(p=><Product key={p.id} product={p} navigate={navigate} variant="reorder"/>)}</div></Section>}</main></>
}
