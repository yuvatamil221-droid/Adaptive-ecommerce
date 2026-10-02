import { useContext, useState } from "react";
import { UserContext } from "./context/UserContext";
import { experiences } from "./config/experiences";
import Header from "./components/header";
import Navigation from "./components/navigation";
import Home from "./pages/home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Categories from "./pages/Categories";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Customize from "./pages/Customize";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewArrivals from "./pages/NewArrivals";
import Trending from "./pages/Trending";
import PremiumBrands from "./pages/PremiumBrands";
import ForYouHome from "./pages/ForYouHome";
import DealHome from "./pages/DealHome";
import FrequentHome from "./pages/FrequentHome";
import ExplorerHome from "./pages/ExplorerHome";
import Coupons from "./pages/Coupons";
import Addresses from "./pages/Addresses";
import ManageAccount from "./pages/ManageAccount";
import HelpCenter from "./pages/HelpCenter";
import AccountDetails from "./pages/AccountDetails";
import AddProfile from "./pages/AddProfile";
import EditProfile from "./pages/EditProfile";
import ProfileDetails from "./pages/ProfileDetails";
import OrderDetails from "./pages/OrderDetails";
import TrackOrder from "./pages/TrackOrder";
export default function App() {
  const { preferences } = useContext(UserContext);
  const [page, setPage] = useState("home");
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = (next, payload = null) => {
    setHistory((h) => [...h, { page, data }]);
    setPage(next);
    setData(payload);
  };
  const goBack = () => {
  if (!history.length) return;

  const prev = history[history.length - 1];

  setPage(prev.page);
  setData(prev.data);
  setHistory(history.slice(0, -1));
};
  const props = {
    navigate,
    goBack,
    currentPage: page,
    currentData: data,
    selectedProfile: preferences,
  };
  const map = {
    home: <Home {...props} />,
    products: <Products {...props} filters={data} />,
    productDetails: <ProductDetails {...props} product={data} />,
    wishlist: <Wishlist {...props} />,
    cart: <Cart {...props} />,
    checkout: <Checkout {...props} />,
    categories: <Categories {...props} />,
    search: <Search {...props} />,
    profile: <Profile {...props} />,
    customize: <Customize {...props} />,
    orders: <Orders {...props} />,
    login: <Login {...props} />,
    register: <Register {...props} />,
    newArrivals: <NewArrivals {...props} />,
    trending: <Trending {...props} />,
    brands: <PremiumBrands {...props} />,
    forYou: <ForYouHome {...props} />,
    deals: <DealHome {...props} />,
    frequentHome: <FrequentHome {...props} />,
    explorerHome: <ExplorerHome {...props} />,
    coupons: <Coupons {...props} />,
    addresses: <Addresses {...props} />,
    manageAccount: <ManageAccount {...props} />,
    help: <HelpCenter {...props} />,
    accountDetails: <AccountDetails {...props} />,
    addProfile: <AddProfile {...props} />,
    editProfile: <EditProfile {...props} profile={data} />,
    profileDetails: <ProfileDetails {...props} />,
    orderDetails: <OrderDetails {...props} order={data} />,
    trackOrder: <TrackOrder {...props} order={data} />,
  };
  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] ${
        preferences.experience ? "" : ""}`}
    >
      {map[page] || <Home {...props} />}{" "}
      {page !== "login" && page !== "register" && (
        <button
          onClick={() => navigate("customize")}
          className="fixed bottom-28 right-4 z-50 rounded-full bg-[var(--theme-primary)] px-4 py-3 text-xs font-black text-white shadow-xl sm:bottom-5"
        >
          Customize
        </button>
      )}
    </div>
  );
}
