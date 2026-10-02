import {createContext,useEffect,useMemo,useState} from "react";

export const UIConfigContext=createContext(null);

export default function UIConfigProvider({children}){
 const [appearance,setAppearance]=useState(()=>localStorage.getItem("adaptive-appearance")||"auto");
 const [layout,setLayout]=useState(()=>localStorage.getItem("adaptive-layout")||"comfortable");
 const [highContrast,setHighContrast]=useState(false);
 const [largeText,setLargeText]=useState(false);
 const [reducedMotion,setReducedMotion]=useState(false);
 const [largerButtons,setLargerButtons]=useState(false);

 useEffect(()=>{
  localStorage.setItem("adaptive-appearance",appearance);
  localStorage.setItem("adaptive-layout",layout);
  document.body.classList.toggle("reduced-motion",reducedMotion);
  document.body.classList.toggle("larger-buttons",largerButtons);
  document.body.classList.toggle("large-text",largeText);
  document.body.classList.toggle("high-contrast",highContrast);
  document.body.dataset.layout=layout;
 },[appearance,layout,reducedMotion,largerButtons,largeText,highContrast]);

 const value=useMemo(()=>({appearance,setAppearance,layout,setLayout,highContrast,setHighContrast,largeText,setLargeText,reducedMotion,setReducedMotion,largerButtons,setLargerButtons}),[appearance,layout,highContrast,largeText,reducedMotion,largerButtons]);
 return <UIConfigContext.Provider value={value}>{children}</UIConfigContext.Provider>;
}
