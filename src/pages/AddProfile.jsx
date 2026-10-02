import {useState,useContext} from "react";
import {UserContext} from "../context/UserContext";
import {Button} from "../components/common";

export default function AddProfile({navigate}){
 const {addProfile}=useContext(UserContext);
 const [form,setForm]=useState({name:"",age:"",gender:""});
 const [error,setError]=useState("");
 const set=(key,value)=>setForm(f=>({...f,[key]:value}));
 const save=e=>{e.preventDefault();if(!form.name.trim()||!form.age||!form.gender){setError("Name, age and gender are required.");return}addProfile(form);navigate("profile")};
 return <main className="mx-auto max-w-2xl px-4 py-8 pb-20"><button onClick={()=>navigate("profile")} className="font-bold">← Profile</button><form onSubmit={save} className="mt-5 rounded-3xl border bg-[var(--theme-surface)] p-6 shadow-[var(--theme-shadow)]">
   <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-primary)] font-black text-white">A</span><div><h1 className="text-3xl font-black">Add Profile</h1><p className="text-sm text-[var(--theme-muted)]">Profiles share the same account, phone, email and address.</p></div></div>
   <div className="mt-6 grid gap-4 sm:grid-cols-2">
     <label className="font-bold sm:col-span-2">Profile Name<input required value={form.name} onChange={e=>set("name",e.target.value)} className="mt-2 w-full rounded-xl border p-3" placeholder="Example: Yuvasri"/></label>
     <label className="font-bold">Age<input required type="text" inputMode="numeric" value={form.age} onChange={e=>set("age",e.target.value)} className="mt-2 w-full rounded-xl border p-3" placeholder="Enter age"/></label>
     <label className="font-bold">Gender<select required value={form.gender} onChange={e=>set("gender",e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select</option><option value="female">Female</option><option value="male">Male</option><option value="unisex">Unisex</option></select></label>
   </div>
   {error&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
   <Button type="submit" className="mt-6 w-full">Add Profile</Button>
 </form></main>;
}
