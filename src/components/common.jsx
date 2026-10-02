import {useContext,useEffect,useState} from "react";
import {UIConfigContext} from "../context/UIConfigContext";

export function Button({children,onClick,variant="primary",className="",disabled=false,type="button"}){const {reducedMotion}=useContext(UIConfigContext);const styles={primary:"bg-[var(--theme-primary)] text-white",secondary:"bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)]",ghost:"bg-transparent text-[var(--theme-text)] border border-transparent",danger:"bg-red-600 text-white"};return <button type={type} disabled={disabled} onClick={onClick} className={`rounded-[var(--theme-radius)] px-4 py-3 font-bold ${reducedMotion?"":"transition hover:-translate-y-0.5"} disabled:opacity-50 ${styles[variant]} ${className}`}>{children}</button>}
export function Section({title,subtitle,children,action,onAction}){return <section className="layout-section mx-auto w-full max-w-7xl px-4 py-7 sm:px-6"><div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-black sm:text-3xl">{title}</h2>{subtitle&&<p className="mt-1 text-sm text-[var(--theme-muted)]">{subtitle}</p>}</div>{action&&<button onClick={onAction} className="text-sm font-bold text-[var(--theme-primary)]">{action} →</button>}</div>{children}</section>}
export function Toast({message,onClose}){if(!message)return null;return <div role="status" className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-xl">{message}<button onClick={onClose} className="ml-3">×</button></div>}
export function SkeletonCard(){return <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)]"><div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-800"/><div className="space-y-3 p-4"><div className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800"/><div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"/><div className="h-8 animate-pulse rounded bg-slate-200 dark:bg-slate-800"/></div></div>}
export function EmptyState({title,description,action,onAction}){return <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-[var(--theme-border)] p-10 text-center"><div className="text-5xl">○</div><h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-2 text-[var(--theme-muted)]">{description}</p>{action&&<Button onClick={onAction} className="mt-6">{action}</Button>}</div>}

export function ProductImage({src,images=[],alt,product,className="",priority=false}){
 const isExpanded=product?.source==="expanded-local";
 const fallback=[src,...images].filter(Boolean)[0]||"";
 const current=isExpanded?(product?.image||product?.localImage||fallback):fallback;
 const [failed,setFailed]=useState(false);
 useEffect(()=>{setFailed(false)},[current]);
 const handleError=()=>setFailed(true);
 return <div className={`relative h-full w-full overflow-hidden bg-[var(--theme-bg)] ${className}`}>
   {current&&!failed&&
  <img
  src={current}
  onError={handleError}
    loading="eager"
    fetchPriority="high"
    decoding="async"
    referrerPolicy="no-referrer"
    alt={alt || "Product"}
    className="absolute inset-0 block h-full w-full object-cover opacity-100 transition-opacity duration-150"
  />}
   {(!current||failed)&&<div className="absolute inset-0 grid place-items-center p-4 text-center text-xs font-bold text-[var(--theme-muted)]">Image unavailable</div>}
 </div>;
}
