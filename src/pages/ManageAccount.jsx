import {useContext,useState} from "react";
import {UserContext} from "../context/UserContext";
import {Button} from "../components/common";

export default function ManageAccount({navigate}){
 const {account,updateAccount}=useContext(UserContext);
 const [f,setF]=useState(account||{});
 if(!account)return <main className="p-8">Create an account first.</main>;
 return <main className="mx-auto max-w-2xl px-4 py-8 pb-20"><button onClick={()=>navigate("profile")} className="font-bold">← Profile</button><h1 className="mt-5 text-4xl font-black">Manage Account</h1><form onSubmit={e=>{e.preventDefault();updateAccount(f);navigate("profile")}} className="mt-6 rounded-3xl border bg-[var(--theme-surface)] p-6"><div className="space-y-4"><label className="block font-bold">Name<input value={f.name||""} onChange={e=>setF(x=>({...x,name:e.target.value}))} className="mt-2 w-full rounded-xl border p-3"/></label><label className="block font-bold">Email<input type="email" value={f.email||""} onChange={e=>setF(x=>({...x,email:e.target.value}))} className="mt-2 w-full rounded-xl border p-3"/></label><label className="block font-bold">Mobile<input value={f.phone||""} onChange={e=>setF(x=>({...x,phone:e.target.value}))} className="mt-2 w-full rounded-xl border p-3"/></label></div><Button className="mt-6 w-full">Save Account</Button></form><Button variant="secondary" className="mt-4 w-full" onClick={()=>navigate("addresses")}>Manage Addresses →</Button></main>;
}
