import { useState, useEffect } from 'react';

export function useLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/links');
      if (!res.ok) throw new Error('Gagal mengambil data tautan');
      const data = await res.json();
      setLinks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (original_url, alias) => {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_url, alias }),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat tautan');
    
    // Update state langsung agar UI reaktif tanpa refresh
    setLinks([data, ...links]);
    return data;
  };

  const deleteLink = async (id) => {
    const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus tautan');
    
    setLinks(links.filter(link => link.id !== id));
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return { links, loading, error, addLink, deleteLink };
}