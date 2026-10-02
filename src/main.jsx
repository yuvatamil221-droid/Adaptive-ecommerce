import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import UserProvider from "./context/UserContext";
import UIConfigProvider from "./context/UIConfigContext";
import ThemeProvider from "./context/ThemeContext";
import ProductProvider from "./context/ProductContext";
import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishlistContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <UIConfigProvider>
        <ThemeProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </UIConfigProvider>
    </UserProvider>
  </StrictMode>
);
