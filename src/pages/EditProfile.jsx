import {useState,useContext} from "react";
import {UserContext} from "../context/UserContext";
import {Button} from "../components/common";

export default function EditProfile({navigate,profile}){
 const {activeProfile,updateProfile,deleteProfile}=useContext(UserContext);
 const base=profile||activeProfile;
 const [form,setForm]=useState(base||{});
 if(!base)return <main className="p-8">No profile selected.</main>;
 const set=(k,v)=>setForm(f=>({...f,[k]:v}));
 const save=e=>{e.preventDefault();updateProfile(form);navigate("profile")};
 return <main className="mx-auto max-w-2xl px-4 py-8 pb-20"><button onClick={()=>navigate("profile")} className="font-bold">← Profile</button><form onSubmit={save} className="mt-5 rounded-3xl border bg-[var(--theme-surface)] p-6"><h1 className="text-3xl font-black">Edit Profile</h1><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="font-bold">Profile Name<input value={form.name||""} onChange={e=>set("name",e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label><label className="font-bold">Age<input type="text" inputMode="numeric" value={form.age||""} onChange={e=>set("age",e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label><label className="font-bold">Gender<select value={form.gender||""} onChange={e=>set("gender",e.target.value)} className="mt-2 w-full rounded-xl border p-3"><option value="">Select</option><option value="female">Female</option><option value="male">Male</option><option value="unisex">Unisex</option></select></label></div><Button type="submit" className="mt-6 w-full">Save Changes</Button><Button type="button" variant="danger" className="mt-3 w-full" onClick={()=>{deleteProfile(base.id);navigate("profile")}}>Delete Profile</Button></form></main>;
}
