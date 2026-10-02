import {useContext,useState} from "react";
import {UserContext} from "../context/UserContext";
import {Button} from "../components/common";

export default function Register({navigate}){
 const {register}=useContext(UserContext);
 const [form,setForm]=useState({name:"",email:"",password:"",confirmPassword:""});
 const [error,setError]=useState("");
 const set=(key,value)=>setForm(f=>({...f,[key]:value}));
 const submit=e=>{
   e.preventDefault();
   setError("");
   if(form.password.length<6){setError("Password must be at least 6 characters.");return;}
   if(form.password!==form.confirmPassword){setError("Passwords do not match.");return;}
   const result=register(form);
   if(!result.ok){setError(result.message);return;}
   navigate("login");
 };
 return <main className="grid min-h-screen place-items-center bg-[var(--theme-bg)] p-4"><form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-[var(--theme-surface)] p-7 shadow-xl">
   <button type="button" onClick={()=>navigate("home")} className="flex items-center gap-2 font-black"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--theme-primary)] text-white">A</span>Adaptive.</button>
   <h1 className="mt-7 text-3xl font-black">Create your account</h1>
   <p className="mt-2 text-[var(--theme-muted)]">Create the main account first. You can add shopping profiles after login.</p>
   <label className="mt-6 block font-bold">Name<input required value={form.name} onChange={e=>set("name",e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label>
   <label className="mt-4 block font-bold">Email<input required type="email" value={form.email} onChange={e=>set("email",e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label>
   <label className="mt-4 block font-bold">Password<input required type="password" value={form.password} onChange={e=>set("password",e.target.value)} className="mt-2 w-full rounded-xl border p-3" placeholder="Minimum 6 characters"/></label>
   <label className="mt-4 block font-bold">Confirm Password<input required type="password" value={form.confirmPassword} onChange={e=>set("confirmPassword",e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label>
   {error&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
   <Button type="submit" className="mt-6 w-full">Create Account</Button>
   <button type="button" onClick={()=>navigate("login")} className="mt-5 w-full text-sm font-bold text-[var(--theme-primary)]">Already registered? Login</button>
 </form></main>;
}
