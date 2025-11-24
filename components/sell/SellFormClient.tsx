"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SellFormClient() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [condition, setCondition] = useState("God stand");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("brand", brand);
    fd.append("price", price ? String(price) : "");
    fd.append("condition", condition);
    fd.append("email", email);

    images.forEach((file) => fd.append("images", file));

    const res = await fetch("/api/sell", {
      method: "POST",
      body: fd,
    });

    setLoading(false);

    if (res.ok) {
      router.push("/sell/thanks");
    } else {
      alert("Der opstod en fejl med upload.");
    }
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
        Basis info
      </div>

      <label className="block text-sm">
        Titel
        <input
          style={{ fontSize: 16 }}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        Brand
        <input
          style={{ fontSize: 16 }}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        Prisidé
        <input
          type="number"
          style={{ fontSize: 16 }}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value ? Number(e.target.value) : "")
          }
        />
      </label>

      <label className="block text-sm">
        Stand
        <select
          style={{ fontSize: 16 }}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option>Som ny</option>
          <option>Rigtig god</option>
          <option>God stand</option>
          <option>Brugt men ok</option>
        </select>
      </label>

      <label className="block text-sm">
        Email
        <input
          type="email"
          style={{ fontSize: 16 }}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        Upload billeder (3–6)
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          style={{ fontSize: 16 }}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setImages(files.slice(0, 6));
          }}
        />
      </label>

      <button
        disabled={loading}
        type="submit"
        className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-sm font-semibold text-slate-950 dd-glow-cta"
      >
        {loading ? "Uploader…" : "Kør AI-scan og prisestimat"}
      </button>
    </form>
  );
}
