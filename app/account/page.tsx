export const metadata = {
  title: "Din konto",
  description: "Overblik over dine drops, salg og udbetalinger.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Konto</h1>
      <p className="text-sm text-slate-400">
        Her kommer oversigt over dine aktive drops, solgte items og udbetalinger.
      </p>
    </div>
  );
}
