"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PriceInput = number | "";

export function SellFormClient() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState<PriceInput>("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("meget_pæn");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("Angiv mindst en titel på varen.");
      return;
    }

    if (!price || typeof price !== "number" || price <= 0) {
      setErrorMsg("Angiv en realistisk prisidé (større end 0).");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Angiv din mail, så vi kan vende tilbage.");
      return;
    }

    if (!files || files.length === 0) {
      setErrorMsg("Upload mindst ét billede af varen.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("brand", brand);
      formData.append("price", String(price));
      formData.append("description", description);
      formData.append("condition", condition);
      formData.append("email", email);
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("/api/sell", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server-fejl");
      }

      // Gem et lille snapshot til tak-siden
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "dd_last_sell_submission",
          JSON.stringify({
            title,
            brand,
            price: typeof price === "number" ? price : null,
            condition,
          })
        );
      }

      router.push("/sell/thanks");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Der skete en fejl under upload. Prøv igen om lidt – eller tjek din forbindelse."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basis info */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Basis info
        </div>
        <label className="block text-sm text-slate-200">
          Titel
          <input
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fx The Spanish Chair"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Brand / producent
          <input
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Fx Fredericia, Acne Studios, Supreme"
          />
        </label>
        <label className="block text-sm text-slate-200">
          Prisidé (DKK)
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value ? Number(e.target.value) : "")
            }
            placeholder="Fx 9.500"
          />
        </label>
      </div>

      {/* Detaljer */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Detaljer
        </div>
        <label className="block text-sm text-slate-200">
          Kort beskrivelse
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Fortæl kort om stand, alder, købssted og evt. original emballage."
          />
        </label>

        <label className="block text-sm text-slate-200">
          Stand
          <select
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 focus:border-slate-400 focus:outline-none"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="som_ny">Som ny</option>
            <option value="meget_pæn">Meget pæn brugt stand</option>
            <option value="brugsspor">Brugt med synlige brugsspor</option>
          </select>
        </label>
      </div>

      {/* Kontakt + billeder */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Kontakt & billeder
        </div>

        <label className="block text-sm text-slate-200">
          Din mail
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-slate-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Din mail til opfølgning"
          />
        </label>

        <label className="block text-sm text-slate-200">
          Billeder (3–6 anbefalet)
          <input
            type="file"
            multiple
            accept="image/*"
            className="mt-1 w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
            onChange={(e) => setFiles(e.target.files)}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Brug naturligt lys, vis både helhed og detaljer. Undgå collager.
          </p>
        </label>
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/70 rounded-xl px-3 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-sm font-semibold text-slate-950 dd-glow-cta disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Kører AI-scan..." : "Kør AI-scan og prisestimat"}
      </button>
    </form>
  );
}
