import {useContext} from "react";
import {CartContext} from "../context/CartContext";
import {WishlistContext} from "../context/WishlistContext";
import {UserContext} from "../context/UserContext";
import {UIConfigContext} from "../context/UIConfigContext";
import {ctaConfig} from "../config/cta";
import {ProductImage} from "./common";

const label=(value)=>String(value||"").replaceAll("-"," ").replace(/\b\w/g,x=>x.toUpperCase());

export default function Product({product,navigate,variant,priority=false}){
  const {addToCart}=useContext(CartContext);
  const {wishlist,toggleWishlist}=useContext(WishlistContext);
  const {preferences}=useContext(UserContext);
  const {reducedMotion}=useContext(UIConfigContext);
  const expMap={dealHunter:"deal",premiumShopper:"premium",frequentShopper:"reorder",explorer:"recommended"};
  const v=variant||expMap[preferences.experience]||"default";
  const c=ctaConfig[v]||ctaConfig.default;
  const wished=wishlist.some(x=>x.id===product.id);
  const motion=reducedMotion?"":"transition duration-300 hover:-translate-y-1 hover:shadow-xl";
  const open=()=>navigate("productDetails",product);

  return <article onClick={open} className={`group cursor-pointer overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-sm ${motion}`}>
    <div className="relative aspect-square overflow-hidden bg-[var(--theme-bg)]">
      <ProductImage
        src={product.image}
        images={product.images}
        alt={product.name}
        product={product}
        priority={priority}
        className={`${reducedMotion?"":"transition duration-500 group-hover:scale-105"}`}
      />

      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
        {v==="deal" && product.discount>0 && <span className="rounded-full bg-green-600 px-2 py-1 text-[10px] font-black text-white">{product.discount}% OFF</span>}
        {product.flashSale && <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-black text-white">FLASH</span>}
        {!product.flashSale && product.newArrival && <span className="rounded-full bg-gray-950 px-2 py-1 text-[10px] font-black text-white">NEW</span>}
        {!product.flashSale && !product.newArrival && v!=="deal" && product.discount>=20 && <span className="rounded-full bg-green-700 px-2 py-1 text-[10px] font-black text-white">{product.discount}% OFF</span>}
      </div>

      <button aria-label="Add to wishlist" onClick={(e)=>{e.stopPropagation();toggleWishlist(product)}} className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--theme-surface)]/95 text-xl shadow ${reducedMotion?"":"transition hover:scale-110"}`}>
        {wished?"♥":"♡"}
      </button>
    </div>

    <div className="p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--theme-primary)]">{label(product.category)}</p>
      <h3 className="mt-1 min-h-12 text-left font-bold text-[var(--theme-text)]">{product.name}</h3>
      <div className="mt-2 flex items-center gap-2 text-sm"><span>★ {Number(product.rating).toFixed(1)}</span><span className="text-[var(--theme-muted)]">({product.reviews})</span></div>
      <div className="mt-3 flex flex-wrap items-end gap-2"><b className="text-xl">₹{Number(product.price).toLocaleString()}</b>{product.discount>0&&<><del className="text-sm text-[var(--theme-muted)]">₹{Number(product.oldPrice).toLocaleString()}</del><span className="text-xs font-black text-green-600">{product.discount}% off</span></>}</div>
      <div className="mt-4 flex gap-2">
        <button onClick={(e)=>{e.stopPropagation();open()}} className="flex-1 rounded-xl border border-[var(--theme-border)] px-3 py-2 text-sm font-bold">{c.primary}</button>
        <button onClick={(e)=>{e.stopPropagation();addToCart(product)}} className="rounded-xl bg-[var(--theme-primary)] px-3 py-2 font-bold text-white">🛒</button>
      </div>
    </div>
  </article>;
}
