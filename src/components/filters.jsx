import {useEffect,useState} from "react";

const priceRanges=[
 ["0-500","Under ₹500"],
 ["500-1000","₹500 – ₹1,000"],
 ["1000-2500","₹1,000 – ₹2,500"],
 ["2500-5000","₹2,500 – ₹5,000"],
 ["5000-10000","₹5,000 – ₹10,000"],
];

export default function Filters({products,onChange,value={}}){
 const [open,setOpen]=useState(false);
 const [state,setState]=useState({category:"",priceRange:"",minRating:"",discount:"",...value});
 useEffect(()=>setState({category:"",priceRange:"",minRating:"",discount:"",...value}),[JSON.stringify(value)]);
 const set=(key,next)=>{const nextState={...state,[key]:next};setState(nextState);onChange(nextState);setOpen(false)};
 const clear=()=>{const empty={category:"",priceRange:"",minRating:"",discount:""};setState(empty);onChange(empty)};
 const categories=[...new Set(products.map(p=>p.category).filter(x=>x&&x!=="sports"))].sort();
 const Field=({label,children})=><label className="mt-4 block text-sm font-bold">{label}{children}</label>;
 return <><button onClick={()=>setOpen(true)} className="rounded-xl border px-4 py-3 text-sm font-bold lg:hidden">☷ Filters</button>
 <aside className={`${open?"fixed inset-x-4 bottom-4 z-[80] max-h-[80vh] overflow-auto rounded-3xl shadow-2xl":"hidden"} border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 lg:sticky lg:top-24 lg:block lg:rounded-2xl lg:shadow-none`}>
   <div className="flex items-center justify-between"><h3 className="font-black">Filters</h3><button onClick={()=>setOpen(false)} className="lg:hidden">×</button></div>
   <Field label="Category"><select value={state.category} onChange={e=>set("category",e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">All categories</option>{categories.map(x=><option key={x} value={x}>{x.replaceAll("-"," ")}</option>)}</select></Field>
   <Field label="Price range"><select value={state.priceRange} onChange={e=>set("priceRange",e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Any price</option>{priceRanges.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></Field>
   <Field label="Rating"><select value={state.minRating} onChange={e=>set("minRating",e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Any rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option></select></Field>
   <Field label="Discount"><select value={state.discount} onChange={e=>set("discount",e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Any discount</option><option value="20">20%+</option><option value="30">30%+</option><option value="40">40%+</option><option value="50">50%+</option></select></Field>
   <button onClick={clear} className="mt-5 w-full rounded-xl border px-4 py-3 text-sm font-bold">Clear filters</button>
 </aside>{open&&<div onClick={()=>setOpen(false)} className="fixed inset-0 z-[70] bg-black/40 lg:hidden"/>}</>;
}
