import React, { useState } from 'react';
import { useLinks } from '../hooks/useLinks';
import { Copy, Trash2, ExternalLink, BarChart2, Search, Check, Link2, Plus, X, Loader2 } from 'lucide-react';

const getShortUrl = (alias) => {
  const baseUrl = import.meta.env.VITE_SHORT_URL_BASE || (
    import.meta.env.DEV
      ? `${window.location.protocol}//${window.location.hostname}:3000`
      : window.location.origin
  );

  return new URL(`/${encodeURIComponent(alias)}`, baseUrl).toString();
};

export default function Dashboard() {
  const { links, loading, error, addLink, deleteLink } = useLinks();
  
  // Form State
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [actionError, setActionError] = useState('');
  
  // Search & Copy State
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');

  // Menghitung Statistik
  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0);
  
  // Filter Pencarian
  const filteredLinks = links.filter(link => 
    link.alias.toLowerCase().includes(search.toLowerCase()) || 
    link.original_url.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      await addLink(url, alias);
      setSuccessMessage(`Tautan /${alias} berhasil dibuat.`);
      setUrl('');
      setAlias('');
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (alias, id) => {
    try {
      await navigator.clipboard.writeText(getShortUrl(alias));
      setCopiedId(id);
      setCopyMessage(`Tautan /${alias} disalin.`);
      window.setTimeout(() => setCopiedId(null), 2000);
      window.setTimeout(() => setCopyMessage(''), 2500);
      setActionError('');
    } catch {
      setActionError('Tautan tidak dapat disalin. Periksa izin clipboard browser.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus tautan ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        await deleteLink(id);
      } catch (err) {
        setActionError(err.message);
      }
    }
  };

  return (
    <main className="min-w-0 flex-1 px-5 py-7 md:px-10 md:py-9">
      <div className="mx-auto max-w-6xl">
        <section id="overview" className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-brand-400">LinkForge / Workspace</p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-100">Links</h2>
            <p className="mt-1.5 text-sm text-slate-400">Kelola tautan pendek dan pantau aktivitas klik.</p>
          </div>
          <button
            type="button"
            aria-expanded={showForm}
            aria-controls="create-link-form"
            onClick={() => {
              setShowForm(!showForm);
              setFormError('');
            }}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded bg-brand-500 px-4 text-sm font-medium text-dark-bg transition-colors hover:bg-brand-400 focus-visible:outline-brand-400 sm:self-auto"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Tutup' : 'Buat short link'}
          </button>
        </section>

        {successMessage && (
          <p role="status" className="mb-5 flex items-center gap-2 border-l-2 border-brand-400 bg-brand-500/[0.06] px-3 py-2 text-sm text-slate-200">
            <Check className="h-4 w-4 text-brand-400" />
            {successMessage}
          </p>
        )}

        <section id="summary" aria-label="Ringkasan tautan" className="mb-8 grid max-w-xl grid-cols-2 border-y border-dark-border py-4">
          <div className="border-r border-dark-border pr-6">
            <p className="text-xs text-slate-500">Total links</p>
            <p className="mt-1.5 font-mono text-2xl font-medium tabular-nums text-slate-100">{totalLinks.toLocaleString('id-ID')}</p>
          </div>
          <div className="pl-6">
            <p className="text-xs text-slate-500">Total clicks</p>
            <p className="mt-1.5 font-mono text-2xl font-medium tabular-nums text-slate-100">{totalClicks.toLocaleString('id-ID')}</p>
          </div>
        </section>

        {showForm && (
          <section id="create-link-form" aria-labelledby="create-link-title" className="mb-8 border-y border-dark-border bg-dark-surface/50 px-4 py-5 md:px-5">
            <div className="mb-4">
              <h3 id="create-link-title" className="text-sm font-semibold text-slate-100">Create short link</h3>
              <p className="mt-1 text-xs text-slate-500">Pilih URL tujuan dan alias yang mudah diingat.</p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_210px_auto] md:items-end">
              <label className="block min-w-0">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Destination URL</span>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/page"
                  aria-label="Destination URL"
                  className="h-10 w-full rounded border border-dark-border bg-dark-bg px-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400/20"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </label>
              <label className="block min-w-0">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Custom alias</span>
                <span className="flex h-10 items-center rounded border border-dark-border bg-dark-bg focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/20">
                  <span className="pl-3 font-mono text-sm text-slate-500">/</span>
                  <input
                    type="text"
                    required
                    placeholder="my-link"
                    pattern="[a-zA-Z0-9-_]+"
                    title="Hanya huruf, angka, strip, dan underscore"
                    aria-label="Custom alias"
                    className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-100 outline-none placeholder:text-slate-600"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                  />
                </span>
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded bg-brand-500 px-4 text-sm font-medium text-dark-bg transition-colors hover:bg-brand-400 focus-visible:outline-brand-400 disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Membuat...' : 'Buat link'}
              </button>
            </form>
            {formError && <p role="alert" className="mt-3 text-sm text-red-300">{formError}</p>}
          </section>
        )}

        <section id="links" aria-labelledby="links-title">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 id="links-title" className="text-base font-semibold text-slate-100">All links</h3>
              <p className="mt-1 text-xs text-slate-500">{filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}</p>
            </div>
            <label className="relative block w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              aria-label="Cari tautan"
              placeholder="Cari alias atau URL..."
              className="h-9 w-full rounded border border-dark-border bg-dark-bg pl-9 pr-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            </label>
          </div>

        {copyMessage && <p role="status" className="mb-2 text-xs text-brand-400">{copyMessage}</p>}
        {actionError && <p role="alert" className="mb-2 text-xs text-red-300">{actionError}</p>}
        <div className="overflow-hidden border-y border-dark-border">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Memuat tautan...</div>
          ) : error ? (
            <div role="alert" className="p-10 text-center text-sm text-red-300">Gagal memuat tautan: {error}</div>
          ) : filteredLinks.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
              <Link2 className="mb-3 h-5 w-5 text-slate-500" strokeWidth={1.6} />
              <p className="text-sm font-medium text-slate-200">{search ? 'Tidak ada tautan yang cocok' : 'Belum ada tautan'}</p>
              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                {search ? 'Coba kata kunci lain atau periksa URL yang dicari.' : 'Buat short link pertama untuk mulai mengelola dan melihat klik.'}
              </p>
              {!search && <button type="button" onClick={() => setShowForm(true)} className="mt-4 text-xs font-medium text-brand-400 hover:text-brand-300 focus-visible:outline-brand-400">Buat short link</button>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] table-fixed text-left text-sm">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[38%]" />
                  <col className="w-[12%]" />
                  <col className="w-[18%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead className="border-b border-dark-border text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium md:px-5">Short URL</th>
                    <th scope="col" className="px-4 py-3 font-medium md:px-5">Destination</th>
                    <th scope="col" className="px-4 py-3 font-medium md:px-5">Clicks</th>
                    <th scope="col" className="px-4 py-3 font-medium md:px-5">Created</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium md:px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border text-slate-300">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="transition-colors hover:bg-white/[0.025]">
                      <td className="px-4 py-4 md:px-5">
                        <a href={getShortUrl(link.alias)} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1.5 font-medium text-brand-400 hover:text-brand-300 focus-visible:outline-brand-400">
                          <span className="truncate font-mono">/{link.alias}</span>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        </a>
                      </td>
                      <td className="truncate px-4 py-4 text-slate-400 md:px-5" title={link.original_url}>{link.original_url}</td>
                      <td className="px-4 py-4 font-mono tabular-nums text-slate-200 md:px-5">{Number(link.clicks).toLocaleString('id-ID')}</td>
                      <td className="px-4 py-4 text-xs text-slate-500 md:px-5">
                        {new Date(link.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4 md:px-5">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleCopy(link.alias, link.id)}
                            aria-label={copiedId === link.id ? 'Tautan disalin' : 'Salin tautan'}
                            title={copiedId === link.id ? 'Tautan disalin' : 'Salin tautan'}
                            className="rounded p-2 text-slate-500 transition-colors hover:bg-brand-500/10 hover:text-brand-400 focus-visible:outline-brand-400"
                          >
                            {copiedId === link.id ? <Check className="h-4 w-4 text-brand-400" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(link.id)}
                            aria-label="Hapus tautan"
                            title="Hapus tautan"
                            className="rounded p-2 text-slate-500 transition-colors hover:bg-red-400/10 hover:text-red-300 focus-visible:outline-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </section>
      </div>
    </main>
  );
}