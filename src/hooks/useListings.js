import { useState, useEffect } from 'react';
import { db } from '../lib/db';

export default function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await db.listListings();
        if (!mounted) return;
        setListings(data);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await db.listListings();
      setListings(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { listings, loading, error, refresh };
}
