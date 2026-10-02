import {useContext,useEffect,useState} from "react";
import {CartContext} from "../context/CartContext";
import {WishlistContext} from "../context/WishlistContext";
import {ProductContext} from "../context/ProductContext";
import {UserContext} from "../context/UserContext";
import Header from "../components/header";
import Navigation from "../components/navigation";
import Product from "../components/product";
import {Button,ProductImage,Section} from "../components/common";

const label=(value)=>String(value||"").replaceAll("-"," ").replace(/\b\w/g,x=>x.toUpperCase());

export default function ProductDetails({navigate,product,goBack}){
 const {addToCart}=useContext(CartContext);
 const {wishlist,toggleWishlist}=useContext(WishlistContext);
 const {allProducts}=useContext(ProductContext);
 const {isLoggedIn}=useContext(UserContext);

 const [qty,setQty]=useState(1);
 const [size,setSize]=useState(product?.sizes?.[0]||"");
 const [color,setColor]=useState(product?.colors?.[0]||"");

 useEffect(()=>{
   if(product){
     const old=JSON.parse(localStorage.getItem("recently-viewed")||"[]");

     localStorage.setItem(
       "recently-viewed",
       JSON.stringify(
         [product,...old.filter(x=>x.id!==product.id)].slice(0,12)
       )
     );
   }
 },[product]);

 if(!product)return null;

 const hasSizes=Array.isArray(product.sizes)&&product.sizes.length>0;
 const hasColors=Array.isArray(product.colors)&&product.colors.length>0;

 const related=allProducts
   .filter(p=>p.id!==product.id&&p.category===product.category)
   .slice(0,4);

 const bought=allProducts
   .filter(p=>p.id!==product.id&&p.brand===product.brand)
   .slice(0,4);

 const add=()=>addToCart(
   {
     ...product,
     selectedSize:size,
     selectedColor:color
   },
   qty
 );

 return (
   <>
     <Header navigate={navigate}/>
     <Navigation navigate={navigate}/>

     <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6">

       <button
         onClick={()=>
           product.__returnCategory
             ? navigate("categories",{selectedCategory:product.__returnCategory})
             : goBack()
         }
         className="mb-5 font-black"
       >
         ← Back
       </button>

       <div className="grid gap-8 lg:grid-cols-2">

         <div className="overflow-hidden rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)]">
           <ProductImage
             src={product.image}
             images={product.images}
             alt={product.name}
             product={product}
             className="aspect-square w-full"
           />
         </div>

         <div>

           <p className="text-sm font-black uppercase tracking-widest text-[var(--theme-primary)]">
             {label(product.category)}
           </p>

           <h1 className="mt-2 text-3xl font-black sm:text-4xl">
             {product.name}
           </h1>

           <div className="mt-4 flex flex-wrap gap-3 text-sm">
             <span>★ {Number(product.rating).toFixed(1)}</span>
             <span>{product.reviews} reviews</span>
             <span className="text-green-600">
               {product.inStock?"In stock":"Out of stock"}
             </span>
           </div>

           <div className="mt-6 flex flex-wrap items-end gap-3">
             <b className="text-4xl">
               ₹{Number(product.price).toLocaleString()}
             </b>

             <del className="text-[var(--theme-muted)]">
               ₹{Number(product.oldPrice).toLocaleString()}
             </del>

             <span className="font-black text-green-600">
               {product.discount}% off
             </span>
           </div>

           <p className="mt-6 leading-7 text-[var(--theme-muted)]">
             {product.description}
           </p>

           {(hasSizes||hasColors)&&
             <div className="mt-6 grid gap-4 sm:grid-cols-2">

               {hasSizes&&
                 <label className="font-bold">
                   Size

                   <select
                     value={size}
                     onChange={e=>setSize(e.target.value)}
                     className="mt-2 w-full rounded-xl border p-3"
                   >
                     {product.sizes.map(x=>
                       <option key={x}>{x}</option>
                     )}
                   </select>
                 </label>
               }

               {hasColors&&
                 <label className="font-bold">
                   Color

                   <select
                     value={color}
                     onChange={e=>setColor(e.target.value)}
                     className="mt-2 w-full rounded-xl border p-3"
                   >
                     {product.colors.map(x=>
                       <option key={x}>{x}</option>
                     )}
                   </select>
                 </label>
               }

             </div>
           }

           <div className="mt-6 grid gap-4 sm:grid-cols-3">

             <div className="rounded-2xl bg-[var(--theme-bg)] p-4">
               <b>Brand</b>
               <p className="mt-1">{product.brand}</p>
             </div>

             <div className="rounded-2xl bg-[var(--theme-bg)] p-4">
               <b>Category</b>
               <p className="mt-1 capitalize">
                 {label(product.category)}
               </p>
             </div>

             <div className="rounded-2xl bg-[var(--theme-bg)] p-4">
               <b>Availability</b>
               <p className="mt-1">
                 {product.inStock?"In stock":"Out of stock"}
               </p>
             </div>

           </div>

           <div className="mt-7 flex items-center gap-3">

             <div className="flex items-center rounded-xl border">

               <button
                 onClick={()=>setQty(Math.max(1,qty-1))}
                 className="px-4 py-3"
               >
                 −
               </button>

               <b className="px-3">
                 {qty}
               </b>

               <button
                 onClick={()=>setQty(qty+1)}
                 className="px-4 py-3"
               >
                 +
               </button>

             </div>

             {/* ADD TO CART - NO LOGIN REQUIRED */}
             <Button
               onClick={add}
               className="flex-1"
             >
               Add to Cart
             </Button>

             <Button
               variant="secondary"
               onClick={()=>toggleWishlist(product)}
             >
               {wishlist.some(x=>x.id===product.id)?"♥":"♡"}
             </Button>

           </div>

           {/* BUY NOW - LOGIN REQUIRED */}
           <Button
             className="mt-3 w-full"
             onClick={()=>{
               if(!isLoggedIn){
                 navigate("login");
                 return;
               }

               add();
               navigate("checkout");
             }}
           >
             Buy Now
           </Button>

           <div className="mt-6 rounded-2xl border p-4 text-sm">
             <b>Delivery</b>

             <p className="mt-1 text-[var(--theme-muted)]">
               Free delivery over ₹999 • Easy returns • Secure checkout
             </p>
           </div>

         </div>
       </div>

       <Section title="Product details">

         <div className="grid gap-4 sm:grid-cols-3">

           <div className="rounded-2xl border p-5">
             <b>Specifications</b>

             <p className="mt-2 text-sm text-[var(--theme-muted)]">
               Brand: {product.brand}
               <br/>
               Category: {label(product.category)}
               <br/>
               Availability: {product.inStock?"In stock":"Out of stock"}
             </p>
           </div>

           <div className="rounded-2xl border p-5">
             <b>Reviews</b>

             <p className="mt-2 text-sm text-[var(--theme-muted)]">
               ★ {Number(product.rating).toFixed(1)} from {product.reviews} shoppers.
             </p>
           </div>

           <div className="rounded-2xl border p-5">
             <b>Personalized for you</b>

             <p className="mt-2 text-sm text-[var(--theme-muted)]">
               Your active profile influences related product recommendations.
             </p>
           </div>

         </div>

       </Section>

       {related.length>0&&
         <Section title="Related Products">

           <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
             {related.map(p=>
               <Product
                 key={p.id}
                 product={p}
                 navigate={navigate}
               />
             )}
           </div>

         </Section>
       }

       {bought.length>0&&
         <Section title={`More from ${product.brand}`}>

           <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
             {bought.map(p=>
               <Product
                 key={p.id}
                 product={p}
                 navigate={navigate}
               />
             )}
           </div>

         </Section>
       }

     </main>
   </>
 );
}