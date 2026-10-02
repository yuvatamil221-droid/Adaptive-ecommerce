import {useContext} from "react";
import {UserContext} from "../context/UserContext";
import {experiences} from "../config/experiences";

export default function ExperienceSwitcher({navigate}){
  const {preferences,updatePreferences}=useContext(UserContext);
  const change=(value)=>{
    updatePreferences({experience:value});
    if(navigate)navigate("home");
  };

  return <select
    aria-label="Choose shopping experience"
    value={preferences.experience||"dealHunter"}
    onChange={e=>change(e.target.value)}
    className="w-[115px] sm:w-auto rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface)] px-3 py-2 text-xs sm:text-sm"
  >
    {Object.entries(experiences).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}
  </select>;
}
