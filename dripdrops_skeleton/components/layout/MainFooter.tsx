export function MainFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} DRIPDROPS™</span>
        <span>Built for one-tap secondhand drops.</span>
      </div>
    </footer>
  );
}
