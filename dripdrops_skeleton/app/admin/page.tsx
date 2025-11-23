export const metadata = {
  title: "Admin · DRIPDROPS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm text-slate-400">
        Her skal du kunne se nye items til review, bygge drops og se nøgletal.
      </p>
    </div>
  );
}
