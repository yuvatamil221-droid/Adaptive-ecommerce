import {createContext,useEffect,useMemo,useState} from "react";
import {fetchProducts} from "../api/productsApi";
export const ProductContext=createContext(null);
const scoreFor=(p,profile)=>{
 if(!profile)return 0; let s=0;
 if(profile.experience==="dealHunter") s+=p.deal*8+p.flashSale*10+p.discount/10+(p.price<999?6:0);
 if(profile.experience==="premiumShopper") s+=(p.price>=3000?12:0)+p.newArrival*5+p.rating*2+(p.price>5000?4:0);
 if(profile.experience==="frequentShopper") s+=p.trending*3+p.rating*2+(p.price<3000?2:0);
 if(profile.experience==="explorer") s+=p.trending*7+p.newArrival*7+p.rating*1.5;
 
 if(profile.gender && profile.gender!=="unisex") s+=p.gender===profile.gender?8:0;
 if(profile.age && Number(profile.age)>=p.minAge && Number(profile.age)<=p.maxAge)s+=6;
 if(profile.preferredCategories?.includes(p.subCategory))s+=10;
 if(profile.preferredBrands?.some(b=>clean(b)===clean(p.brand)))s+=10;
 if(profile.priceSensitivity==="high")s+=Math.max(0,6-p.price/1500);
 return s;
};
const clean=(v)=>String(v||"").toLowerCase();
export default function ProductProvider({children}){const [allProducts,setAllProducts]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{let active=true;fetchProducts().then(d=>{if(active)setAllProducts(d)}).catch(e=>{if(active)setError(e.message)}).finally(()=>active&&setLoading(false));return()=>{active=false}},[]);
 const api={allProducts,loading,error,productData:allProducts,getById:(id)=>allProducts.find(p=>String(p.id)===String(id)),recommend:(profile,list=allProducts)=>[...list].sort((a,b)=>scoreFor(b,profile)-scoreFor(a,profile))};
 return <ProductContext.Provider value={api}>{children}</ProductContext.Provider>}
