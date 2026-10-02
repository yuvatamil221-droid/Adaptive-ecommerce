import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Button, ProductImage } from "../components/common";
import { couponList } from "./Coupons";
import Header from "../components/header";
import Navigation from "../components/navigation";

const blankAddress = {
  name: "",
  phone: "",
  line: "",
  city: "",
  state: "",
  pin: "",
};
const readAddresses = () => {
  try {
    const v = JSON.parse(localStorage.getItem("adaptive-addresses") || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export default function Checkout({ navigate }) {
  const { items, subtotal, clearCart } = useContext(CartContext);
  const [step, setStep] = useState("delivery");
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [coupon, setCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [addresses, setAddresses] = useState(readAddresses);
  const [address, setAddress] = useState(() => {
    const list = readAddresses();
    try {
      const selected = localStorage.getItem("adaptive-checkout-address");
      return (
        list.find((a) => String(a.id) === String(selected)) || list[0] || {}
      );
    } catch {
      return list[0] || {};
    }
  });
  const [showAddressList, setShowAddressList] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(blankAddress);
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [done, setDone] = useState(null);
  const couponValue = useMemo(() => {
    if (!coupon || subtotal < coupon.min) return 0;
    return coupon.percent
      ? Math.round((subtotal * coupon.percent) / 100)
      : coupon.discount;
  }, [coupon, subtotal]);
  const shipping =
    delivery === "express" ? 149 : subtotal - couponValue >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal - couponValue + shipping);
  const addressReady = !!(
    address?.name &&
    address?.line &&
    address?.city &&
    address?.state &&
    address?.pin &&
    address?.phone
  );
  const paymentReady =
    payment === "cod" ||
    (payment === "upi" && upi.trim().length >= 3) ||
    (payment === "card" &&
      card.number.replace(/\s/g, "").length >= 12 &&
      card.expiry.length >= 4 &&
      card.cvv.length >= 3);
  const applyCoupon = () => {
    const c = couponList.find(
      (x) => x.code.toUpperCase() === couponCode.trim().toUpperCase(),
    );
    setCoupon(c || null);
    if (c) localStorage.setItem("selected-coupon", JSON.stringify(c));
    else localStorage.removeItem("selected-coupon");
  };
  const selectAddress = (a) => {
    setAddress(a);
    localStorage.setItem("adaptive-checkout-address", String(a.id));
    setShowAddressList(false);
    setEditingAddress(null);
  };
  const startEditAddress = (a) => {
    setEditingAddress(a.id);
    setAddressForm({ ...blankAddress, ...a });
    setShowAddressList(true);
  };
  const saveCheckoutAddress = (e) => {
    e.preventDefault();
    const item = { ...addressForm, id: editingAddress || Date.now() };
    const next = editingAddress
      ? addresses.map((a) => (a.id === editingAddress ? item : a))
      : [...addresses, item];
    setAddresses(next);
    localStorage.setItem("adaptive-addresses", JSON.stringify(next));
    selectAddress(item);
    setAddressForm(blankAddress);
    setEditingAddress(null);
  };
  const continueFromDelivery = () => {
    if (!addressReady) {
      alert("Please select or add a complete delivery address.");
      return;
    }
    setStep("payment");
  };
  const continueFromPayment = () => {
    if (!paymentReady) {
      alert("Please complete the selected payment details.");
      return;
    }
    setStep("review");
  };
  const place = () => {
    if (!addressReady) {
      alert(
        "Please select a complete delivery address before placing the order.",
      );
      return;
    }
    if (!paymentReady) {
      alert("Please complete the payment details before placing the order.");
      return;
    }
    const id = `ORD${Date.now()}`;
    const order = {
      id,
      status: "Placed",
      trackingId: `TRK${Date.now().toString().slice(-8)}`,
      total,
      subtotal,
      coupon: couponValue ? coupon : null,
      shipping,
      delivery,
      payment,
      address,
      items,
      createdAt: new Date().toISOString(),
    };
    const old = JSON.parse(localStorage.getItem("adaptive-orders") || "[]");
    localStorage.setItem("adaptive-orders", JSON.stringify([order, ...old]));
    localStorage.removeItem("selected-coupon");
    clearCart();
    setDone(order);
  };
  if (done)
    return (
      <>
        <Header navigate={navigate} />
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl text-green-600">
            ✓
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[.25em] text-green-600">
            Order Confirmed
          </p>
          <h1 className="mt-2 text-4xl font-black">Thank You!</h1>
          <p className="mt-3 text-[var(--theme-muted)]">
            Your order has been placed successfully.
          </p>
          <div className="mt-6 rounded-2xl border p-5">
            <span className="text-xs text-[var(--theme-muted)]">Order ID</span>
            <b className="mt-1 block text-xl">{done.id}</b>
            <span className="mt-3 block text-xs text-[var(--theme-muted)]">
              Order date
            </span>
            <b className="block">{new Date(done.createdAt).toLocaleString()}</b>
          </div>
          <Button className="mt-5 w-full" onClick={() => navigate("orders")}>
            View My Orders
          </Button>
        </main>
      </>
    );
  return (
    <>
      <Header navigate={navigate} />
      <Navigation navigate={navigate} />
      <main className="mx-auto max-w-6xl px-4 py-7 pb-28 sm:px-6">
        <button
          type="button"
          onClick={() => navigate("cart")}
          className="mb-6 block  px-4 py-2 text-sm font-bold text-gray-800 shadow-sm"
        >
          ← 
        </button>
        <h1 className="text-4xl font-black">Checkout</h1>
        <div className="mt-5 flex gap-2 overflow-x-auto">
          {["delivery", "payment", "review"].map((x, i) => (
            <button
              key={x}
              onClick={() => setStep(x)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black ${step === x ? "bg-[var(--theme-primary)] text-white" : "border"}`}
            >
              {i + 1}. {x}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border p-6">
            {step === "delivery" && (
              <>
                <h2 className="text-2xl font-black">Delivery method</h2>
                <div className="mt-5 space-y-3">
                  <label className="flex gap-3 rounded-2xl border p-4">
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === "standard"}
                      onChange={() => setDelivery("standard")}
                    />
                    <span>
                      <b>Standard Delivery</b>
                      <small className="block text-[var(--theme-muted)]">
                        Free above ₹999, otherwise ₹99
                      </small>
                    </span>
                  </label>
                  <label className="flex gap-3 rounded-2xl border p-4">
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === "express"}
                      onChange={() => setDelivery("express")}
                    />
                    <span>
                      <b>Express Delivery</b>
                      <small className="block text-[var(--theme-muted)]">
                        ₹149
                      </small>
                    </span>
                  </label>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-black">Delivery address</h2>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressList((v) => !v);
                        setEditingAddress(null);
                      }}
                      className="rounded-full border px-4 py-2 text-sm font-black"
                    >
                      {showAddressList ? "Close" : "Change address"}
                    </button>
                  )}
                </div>
                {addressReady ? (
                  <div className="mt-4 rounded-2xl bg-[var(--theme-bg)] p-4">
                    <b>{address.name}</b>
                    <p className="mt-1 text-sm">
                      {address.line}, {address.city}, {address.state} -{" "}
                      {address.pin}
                    </p>
                    <p className="text-sm">{address.phone}</p>
                    <span className="mt-3 inline-block rounded-full bg-[var(--theme-primary)] px-3 py-1 text-xs font-black text-white">
                      Selected for checkout
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed p-5">
                    <p className="font-bold">No delivery address selected.</p>
                    <button
                      type="button"
                      onClick={() => navigate("addresses")}
                      className="mt-2 font-bold text-[var(--theme-primary)]"
                    >
                      Add an address →
                    </button>
                  </div>
                )}
                {showAddressList && (
                  <div className="mt-4 rounded-3xl border p-4">
                    <h3 className="font-black">Saved addresses</h3>
                    <div className="mt-3 space-y-3">
                      {addresses.map((a) => (
                        <div
                          key={a.id}
                          className={`rounded-2xl border p-4 ${String(address?.id) === String(a.id) ? "border-[var(--theme-primary)] ring-1 ring-[var(--theme-primary)]" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <b>{a.name}</b>
                              <p className="mt-1 text-sm text-[var(--theme-muted)]">
                                {a.line}, {a.city}, {a.state} - {a.pin}
                              </p>
                              <p className="text-sm">{a.phone}</p>
                            </div>
                            {String(address?.id) === String(a.id) && (
                              <span className="text-xs font-black text-[var(--theme-primary)]">
                                Selected
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => selectAddress(a)}
                              className="rounded-xl bg-[var(--theme-primary)] px-4 py-2 text-xs font-black text-white"
                            >
                              Select
                            </button>
                            <button
                              type="button"
                              onClick={() => startEditAddress(a)}
                              className="rounded-xl border px-4 py-2 text-xs font-black"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(null);
                        setAddressForm(blankAddress);
                        navigate("addresses");
                      }}
                      className="mt-4 font-bold text-[var(--theme-primary)]"
                    >
                      ＋ Add new address
                    </button>
                  </div>
                )}
                {showAddressList && editingAddress && (
                  <form
                    onSubmit={saveCheckoutAddress}
                    className="mt-4 rounded-3xl border bg-[var(--theme-bg)] p-4"
                  >
                    <h3 className="font-black">Edit selected address</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {[
                        ["name", "Full name"],
                        ["phone", "Mobile"],
                        ["line", "Address"],
                        ["city", "City"],
                        ["state", "State"],
                        ["pin", "PIN code"],
                      ].map(([k, p]) => (
                        <input
                          key={k}
                          required
                          value={addressForm[k]}
                          onChange={(e) =>
                            setAddressForm((f) => ({
                              ...f,
                              [k]: e.target.value,
                            }))
                          }
                          placeholder={p}
                          className="rounded-xl border bg-[var(--theme-surface)] p-3"
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button type="submit">Save & Select</Button>
                      <button
                        type="button"
                        onClick={() => setEditingAddress(null)}
                        className="rounded-xl border px-4 py-2 text-sm font-black"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
            {step === "payment" && (
              <>
                <h2 className="text-2xl font-black">Payment</h2>
                <div className="mt-5 space-y-3">
                  <label className="block rounded-2xl border p-4">
                    <input
                      type="radio"
                      name="pay"
                      checked={payment === "upi"}
                      onChange={() => setPayment("upi")}
                    />{" "}
                    <b>UPI</b>
                    {payment === "upi" && (
                      <input
                        value={upi}
                        onChange={(e) => setUpi(e.target.value)}
                        placeholder="Enter UPI ID e.g. name@upi"
                        className="mt-3 w-full rounded-xl border p-3"
                      />
                    )}
                  </label>
                  <label className="block rounded-2xl border p-4">
                    <input
                      type="radio"
                      name="pay"
                      checked={payment === "card"}
                      onChange={() => setPayment("card")}
                    />{" "}
                    <b>Card</b>
                    {payment === "card" && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <input
                          value={card.number}
                          onChange={(e) =>
                            setCard({ ...card, number: e.target.value })
                          }
                          placeholder="Card number"
                          className="rounded-xl border p-3 sm:col-span-2"
                        />
                        <input
                          value={card.expiry}
                          onChange={(e) =>
                            setCard({ ...card, expiry: e.target.value })
                          }
                          placeholder="MM/YY"
                          className="rounded-xl border p-3"
                        />
                        <input
                          value={card.cvv}
                          onChange={(e) =>
                            setCard({ ...card, cvv: e.target.value })
                          }
                          placeholder="CVV"
                          className="rounded-xl border p-3"
                        />
                      </div>
                    )}
                  </label>
                  <label className="flex gap-3 rounded-2xl border p-4">
                    <input
                      type="radio"
                      name="pay"
                      checked={payment === "cod"}
                      onChange={() => setPayment("cod")}
                    />{" "}
                    <b>Cash on Delivery</b>
                  </label>
                </div>
              </>
            )}
            {step === "review" && (
              <>
                <h2 className="text-2xl font-black">Review & Summary</h2>
                <div className="mt-5 rounded-2xl bg-[var(--theme-bg)] p-4">
                  <span className="text-xs text-[var(--theme-muted)]">
                    Delivery address
                  </span>
                  <b className="mt-1 block">{address.name}</b>
                  <p className="text-sm">
                    {address.line}, {address.city}, {address.state} -{" "}
                    {address.pin}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep("delivery")}
                    className="mt-2 font-bold text-[var(--theme-primary)]"
                  >
                    Change address
                  </button>
                </div>
                <div className="mt-5 space-y-3">
                  {items.map((p) => (
                 <div
  key={p.id}
  className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 border-b pb-3"
>
  <ProductImage
    src={p.image}
    images={p.images}
    alt={p.name}
    product={p}
    className="h-16 w-16 shrink-0 rounded-xl"
  />

  <div className="min-w-0">
    <b className="block truncate">{p.name}</b>

    <span className="block text-xs text-[var(--theme-muted)]">
      Qty: {p.quantity}
    </span>
  </div>

  <b className="whitespace-nowrap text-right">
    ₹{(p.price * p.quantity).toLocaleString("en-IN")}
  </b>
</div>
                  ))}
                </div>
                <div className="mt-6">
                  <h3 className="font-black">Coupon</h3>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="min-w-0 flex-1 rounded-xl border p-3"
                    />
                    
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {couponList.map((c) => {
                      const eligible = subtotal >= c.min;
                      return (
                        <button
                          key={c.code}
                          disabled={!eligible}
                          onClick={() => {
                            setCouponCode(c.code);
                            setCoupon(c);
                            localStorage.setItem(
                              "selected-coupon",
                              JSON.stringify(c),
                            );
                          }}
                          className={`rounded-2xl border p-3 text-left text-xs font-bold ${eligible ? "" : "cursor-not-allowed opacity-40 blur-[1px]"}`}
                        >
                          <b>{c.title}</b>
                          <span className="mt-1 block text-[var(--theme-muted)]">
                            {c.text}
                          </span>
                          {!eligible && (
                            <span className="mt-1 block text-red-500">
                              Add ₹{(c.min - subtotal).toLocaleString()} more
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {coupon && (
                    <p className="mt-2 text-xs font-bold text-green-600">
                      Coupon {coupon.code} selected.
                    </p>
                  )}
                </div>
              </>
            )}
          </section>
          <aside className="h-fit rounded-3xl border p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-black">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Product total</span>
                <b>₹{subtotal.toLocaleString()}</b>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <b>{shipping ? `₹${shipping}` : "FREE"}</b>
              </div>
              {couponValue > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon</span>
                  <b>- ₹{couponValue.toLocaleString()}</b>
                </div>
              )}
              <div className="border-t pt-4 flex justify-between text-xl">
                <span>Total</span>
                <b>₹{total.toLocaleString()}</b>
              </div>
              <p className="text-xs text-[var(--theme-muted)]">
                Payment: {payment.toUpperCase()}
              </p>
            </div>
            <Button
              className="mt-6 w-full"
              onClick={() =>
                step === "delivery"
                  ? continueFromDelivery()
                  : step === "payment"
                    ? continueFromPayment()
                    : place()
              }
            >
              {step === "review"
                ? `Place Order · ₹${total.toLocaleString()}`
                : "Continue"}
            </Button>
          </aside>
        </div>
      </main>
    </>
  );
}
