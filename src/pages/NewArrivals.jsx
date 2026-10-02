import {useContext,useMemo} from "react";
import CollectionPage from "./CollectionPage";
import {UserContext} from "../context/UserContext";
export default function NewArrivals(p){
 const {preferences}=useContext(UserContext);
 const filter=useMemo(()=>x=>x.newArrival && (preferences.experience!=="premiumShopper" || x.price>=3000),[preferences.experience]);
 return <CollectionPage {...p} title="New Arrivals" filter={filter}/>;
}
