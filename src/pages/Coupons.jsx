import { useState } from "react";
import { Button } from "../components/common";
export const couponList = [
  {
    code: "SAVE100",
    title: "₹100 OFF",
    text: "Get ₹100 off on orders above ₹999",
    min: 999,
    discount: 100,
  },
  {
    code: "SAVE200",
    title: "₹200 OFF",
    text: "Get ₹200 off on orders above ₹1,499",
    min: 1499,
    discount: 200,
  },
  {
    code: "SAVE500",
    title: "₹500 OFF",
    text: "Get ₹500 off on orders above ₹4,999",
    min: 4999,
    discount: 500,
  },
  {
    code: "WELCOME10",
    title: "₹150 OFF",
    text: "Special offer for new users",
    min: 1999,
    discount: 150,
  },
  {
    code: "FASHION20",
    title: "20% OFF",
    text: "Save 20% on fashion products",
    min: 1499,
    percent: 20,
  },
  {
    code: "TECH10",
    title: "10% OFF",
    text: "Save 10% on selected electronics",
    min: 1999,
    percent: 10,
  },
];
export default function Coupons({ navigate }) {
  const [copied, setCopied] = useState("");
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-20">
      <button onClick={() => navigate("profile")} className="font-bold">
        ← Profile
      </button>
      <h1 className="mt-5 text-4xl font-black">My Coupons</h1>
      <p className="mt-2 text-[var(--theme-muted)]">
        Claim an offer now and apply it during checkout.
      </p>
      <div className="mt-7 space-y-3">
        {couponList.map((c) => (
          <article
            key={c.code}
            className="rounded-2xl border bg-[var(--theme-surface)] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-[var(--theme-primary)]">
                  {c.title}
                </h2>
                <p className="mt-1 text-sm">{c.text}</p>
                <p className="mt-3 text-xs font-black tracking-widest">
                  {c.code}
                </p>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard?.writeText(c.code);
                  setCopied(c.code);
                }}
              >
                {copied === c.code ? "COPIED" : "COPY"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
