import CollectionPage from "./CollectionPage";export default function ExplorerHome(p){return <CollectionPage {...p} title="Discover" filter={x=>x.trending||x.newArrival}/>}
