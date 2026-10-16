import React from 'react';
import { Link2, LayoutDashboard, List } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="flex shrink-0 flex-col border-b border-dark-border bg-dark-sidebar md:sticky md:top-0 md:h-screen md:w-56 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 border-b border-dark-border px-5 py-4 md:px-5 md:py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded border border-brand-500/30 text-brand-400">
          <Link2 className="h-4 w-4" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-tight text-slate-100">LinkForge</h1>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Link workspace</p>
        </div>
      </div>

      <nav aria-label="Navigasi utama" className="flex gap-1 overflow-x-auto p-3 md:block md:flex-1 md:space-y-1 md:p-3">
        <a href="#overview" className="flex shrink-0 items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-dark-hover hover:text-white focus-visible:outline-brand-400">
          <LayoutDashboard className="h-4 w-4 text-slate-500" />
          Overview
        </a>
        <a href="#links" className="flex shrink-0 items-center gap-3 rounded border border-brand-500/15 bg-brand-500/[0.07] px-3 py-2.5 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-500/10 focus-visible:outline-brand-400">
          <List className="h-4 w-4" />
          Links
        </a>
      </nav>

      <div className="hidden border-t border-dark-border px-5 py-4 md:block">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-600">LinkForge</p>
        <p className="mt-1 text-xs text-slate-500">Version 1.0</p>
      </div>
    </aside>
  );
}