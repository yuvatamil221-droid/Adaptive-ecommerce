import {createContext,useMemo,useState} from "react";

export const UserContext=createContext(null);

const blankProfile={
  name:"",
  age:"",
  gender:"",
  experience:"dealHunter",
  preferredCategories:[],
  preferredBrands:[],
  priceSensitivity:"medium",
  shoppingBehavior:"discover",
  profileColor:"#7c3aed",
};

const readJSON=(key,fallback)=>{
  try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}
  catch{return fallback;}
};

function readInitialData(){
  const savedAccount=readJSON("adaptive-account",null);
  const savedProfiles=readJSON("adaptive-profile-list",null);

  if(savedAccount){
    return {
      account:savedAccount,
      profiles:Array.isArray(savedProfiles)?savedProfiles:[],
      activeId:localStorage.getItem("adaptive-active-profile")||"",
      session:localStorage.getItem("adaptive-session")==="true",
    };
  }

  // One-time migration from the previous V3 structure.
  const oldProfiles=readJSON("adaptive-profiles",[]);
  if(Array.isArray(oldProfiles)&&oldProfiles.length){
    const first=oldProfiles[0];
    const account={name:first.name||"",email:first.email||"",phone:first.phone||"",password:first.password||""};
    const profiles=oldProfiles.map(p=>({
      ...blankProfile,
      id:p.id,
      name:p.name||"",
      age:p.age||"",
      gender:p.gender||"",
      experience:p.experience||"dealHunter",
      preferredCategories:p.preferredCategories||[],
      preferredBrands:p.preferredBrands||[],
      priceSensitivity:p.priceSensitivity||"medium",
      shoppingBehavior:p.shoppingBehavior||"discover",
    }));
    const activeId=localStorage.getItem("adaptive-active")||profiles[0]?.id||"";
    return {account,profiles,activeId,session:!!localStorage.getItem("adaptive-active")};
  }

  return {account:null,profiles:[],activeId:"",session:false};
}

export default function UserProvider({children}){
  const initial=useMemo(readInitialData,[]);
  const [account,setAccount]=useState(initial.account);
  const [profiles,setProfiles]=useState(initial.profiles);
  const [activeId,setActiveId]=useState(initial.activeId);
  const [session,setSession]=useState(initial.session);

  const activeProfile=profiles.find(p=>p.id===activeId)||null;
  const preferences=activeProfile||blankProfile;
  const isLoggedIn=!!account&&session;

  const saveAccount=(next)=>{
    setAccount(next);
    localStorage.setItem("adaptive-account",JSON.stringify(next));
  };

  const saveProfiles=(next)=>{
    setProfiles(next);
    localStorage.setItem("adaptive-profile-list",JSON.stringify(next));
  };

  const selectProfile=(id)=>{
    if(!profiles.some(p=>p.id===id))return;
    setActiveId(id);
    localStorage.setItem("adaptive-active-profile",id);
  };

  const addProfile=(data)=>{
    const profile={
      ...blankProfile,
      ...data,
      id:`P${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      createdAt:new Date().toISOString(),
    };
    const next=[...profiles,profile];
    saveProfiles(next);
    setActiveId(profile.id);
    localStorage.setItem("adaptive-active-profile",profile.id);
    return profile;
  };

  const updateProfile=(data)=>{
    if(!data?.id)return;
    saveProfiles(profiles.map(p=>p.id===data.id?{...p,...data}:p));
    if(data.id===activeId)selectProfile(data.id);
  };

  const deleteProfile=(id)=>{
    const next=profiles.filter(p=>p.id!==id);
    saveProfiles(next);
    if(id===activeId){
      const nextId=next[0]?.id||"";
      setActiveId(nextId);
      if(nextId)localStorage.setItem("adaptive-active-profile",nextId);
      else localStorage.removeItem("adaptive-active-profile");
    }
  };

  const register=(data)=>{
    const email=String(data.email||"").trim().toLowerCase();
    if(!email)return {ok:false,message:"Email is required."};
    if(account&&String(account.email||"").toLowerCase()===email){
      return {ok:false,message:"An account with this email already exists. Please login."};
    }
    const next={name:String(data.name||"").trim(),email,phone:"",password:String(data.password||"")};
    saveAccount(next);
    saveProfiles([]);
    setActiveId("");
    setSession(false);
    localStorage.removeItem("adaptive-active-profile");
    localStorage.setItem("adaptive-session","false");
    return {ok:true};
  };

  const login=(email,password)=>{
    if(!account||String(account.email||"").toLowerCase()!==String(email||"").trim().toLowerCase()){
      return {ok:false,code:"NOT_FOUND",message:"Account not found. Please create an account first."};
    }
    if(String(account.password||"")!==String(password||"")){
      return {ok:false,code:"PASSWORD",message:"Incorrect password. Please try again."};
    }
    setSession(true);
    localStorage.setItem("adaptive-session","true");
    const nextId=activeId||profiles[0]?.id||"";
    if(nextId)selectProfile(nextId);
    return {ok:true,profile:profiles.find(p=>p.id===nextId)||null};
  };

  const logout=()=>{
    setSession(false);
    setActiveId("");
    localStorage.setItem("adaptive-session","false");
    localStorage.removeItem("adaptive-active-profile");
  };

  const updatePreferences=(patch)=>{
    if(activeProfile)updateProfile({...activeProfile,...patch});
  };

  const updateAccount=(patch)=>{
    if(!account)return;
    saveAccount({...account,...patch});
  };

  const value=useMemo(()=>({
    user:activeProfile,
    account,
    isLoggedIn,
    userProfile:preferences,
    userConfig:preferences,
    preferences,
    profiles,
    activeProfile,
    setPreferences:updatePreferences,
    updatePreferences,
    addProfile,
    updateProfile,
    deleteProfile,
    selectProfile,
    login,
    register,
    logout,
    updateAccount,
  }),[account,profiles,activeId,session]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
