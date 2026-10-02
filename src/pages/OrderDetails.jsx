import { useContext } from "react";
import { ProductImage, Button } from "../components/common";
import { UserContext } from "../context/UserContext";
export default function OrderDetails({ navigate, order, goBack }) {
  const { activeProfile } = useContext(UserContext);
  if (!order) return <main className="p-8">Order not found.</main>;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-20">
      <button onClick={() => navigate("orders")} className="font-bold">
        ← Back to Orders
      </button>
      <div className="mt-5 rounded-3xl border p-6">
        <span className="text-xs text-[var(--theme-muted)]">ORDER</span>
        <h1 className="text-3xl font-black">{order.id}</h1>
        <p className="text-sm text-[var(--theme-muted)]">
          Ordered on {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
          {order.status}
        </span>
      </div>
      <section className="mt-4 rounded-3xl border p-6">
        <h2 className="text-xl font-black">Order Items</h2>
       {order.items.map((p) => (
  <div
    key={p.id}
    className="mt-4 grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-4 border-b pb-4"
  >
    <ProductImage
      src={p.image}
      images={p.images}
      alt={p.name}
      product={p}
      className="h-20 w-20 shrink-0 rounded-xl object-cover"
    />

    <div className="min-w-0">
      <b className="block break-words">{p.name}</b>

      <p className="mt-1 text-sm text-[var(--theme-muted)]">
        Quantity: {p.quantity}
      </p>
    </div>

    <b className="whitespace-nowrap text-right">
      ₹{(p.price * p.quantity).toLocaleString("en-IN")}
    </b>
  </div>
))}
        <div className="mt-4 flex justify-between text-xl">
          <b>Total</b>
          <b>₹{order.total.toLocaleString()}</b>
        </div>
      </section>
      <section className="mt-4 rounded-3xl border p-6">
        <h2 className="text-xl font-black">Delivery Details</h2>
        <p className="mt-3 text-sm">
          <b>Delivery:</b> {order.delivery}
        </p>
        <p className="mt-2 text-sm">
          <b>Address:</b>{" "}
          {order.address?.name || activeProfile?.name || "Customer"},{" "}
          {order.address?.line || "Saved address"}, {order.address?.city || ""},{" "}
          {order.address?.state || ""} - {order.address?.pin || ""}
        </p>
        <p className="mt-2 text-sm">
          <b>Payment:</b> {order.payment}
        </p>
        <p className="mt-2 text-sm">
          <b>Tracking ID:</b> {order.trackingId}
        </p>
        <Button
          className="mt-5 w-full"
          onClick={() => navigate("trackOrder", order)}
        >
          🚚 Track Order
        </Button>
      </section>
    </main>
  );
}
