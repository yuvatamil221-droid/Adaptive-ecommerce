import CollectionPage from "./CollectionPage";
export default function ForYouHome(p){return <CollectionPage {...p} title="For You" personalized filter={x=>x.trending||x.newArrival}/>}
