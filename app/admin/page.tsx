"use client";

import { useEffect, useState } from 'react';

function getKey() {
  return typeof window !== 'undefined' ? sessionStorage.getItem('adminKey') : null;
}

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [loggedIn, setLoggedIn] = useState(!!getKey());
  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  async function fetchPending() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pending', { headers: { Authorization: `Bearer ${sessionStorage.getItem('adminKey')}` } });
      const json = await res.json();
      if (json?.success) setPending(json.pending || []);
      else if (res.status === 401) { sessionStorage.removeItem('adminKey'); setLoggedIn(false); alert('Unauthorized — please enter key again'); }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch');
    } finally { setLoading(false); }
  }

  // fetch both pending and active approved bookings
  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pending', { headers: { Authorization: `Bearer ${sessionStorage.getItem('adminKey')}` } });
      const json = await res.json();
      if (json?.success) {
        setPending(json.pending || []);
        setApproved(json.approved || []);
      } else if (res.status === 401) {
        sessionStorage.removeItem('adminKey'); setLoggedIn(false); alert('Unauthorized — please enter key again');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch');
    } finally { setLoading(false); }
  }

  function login() {
    sessionStorage.setItem('adminKey', key);
    setLoggedIn(true);
  }

  async function approve(item: any) {
    if (!confirm(`Approve booking from ${item.fullName} for ${new Date(item.checkIn).toISOString().slice(0,10)} → ${new Date(item.checkOut).toISOString().slice(0,10)}?`)) return;
    try {
      const res = await fetch('/api/admin/approve', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('adminKey')}` }, body: JSON.stringify({ id: item.id }) });
      const json = await res.json();
        if (json?.success) {
          alert('Approved');
          // refresh both lists
          fetchAll();
        } else {
        alert('Failed: ' + (json?.error || 'unknown'));
      }
    } catch (err) {
      console.error(err);
      alert('Error');
    }
  }

  async function reject(item: any) {
    if (!confirm('Reject this booking?')) return;
    const res = await fetch('/api/admin/reject', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('adminKey')}` }, body: JSON.stringify({ id: item.id }) });
    const json = await res.json();
    if (json?.success) { alert('Rejected'); fetchPending(); } else alert('Failed');
  }

  async function cancel(item: any) {
    if (!confirm('Cancel this approved booking and remove blocks?')) return;
    const res = await fetch('/api/admin/cancel', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('adminKey')}` }, body: JSON.stringify({ id: item.id }) });
    const json = await res.json();
  if (json?.success) { alert('Cancelled'); fetchAll(); } else alert('Failed');
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
        <p className="mb-2">Enter your admin API key (stored in session only)</p>
        <input value={key} onChange={(e) => setKey(e.target.value)} className="w-full rounded-md border px-3 py-2 mb-3" placeholder="Paste ADMIN_API_KEY here" />
        <div className="flex gap-2">
          <button onClick={login} className="rounded bg-accent px-4 py-2 font-semibold">Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Admin — Pending Bookings</h1>
      <div className="mb-4">
        <button onClick={() => { sessionStorage.removeItem('adminKey'); setLoggedIn(false); }} className="text-sm underline">Sign out</button>
      </div>
      {loading ? <div>Loading…</div> : (
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Pending</h2>
            <div className="space-y-4">
              {pending.length === 0 ? <div>No pending bookings</div> : pending.map((b) => (
                <div key={b.id} className="rounded border p-4 bg-white/80">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{b.fullName}</div>
                      <div className="text-sm text-muted">{b.email} • {b.phone}</div>
                      <div className="text-sm mt-2">{new Date(b.checkIn).toISOString().slice(0,10)} → {new Date(b.checkOut).toISOString().slice(0,10)}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => approve(b)} className="rounded bg-green-500 px-4 py-2 text-white">Approve</button>
                      <button onClick={() => reject(b)} className="rounded bg-red-500 px-4 py-2 text-white">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Approved</h2>
            <div className="space-y-4">
              {approved.length === 0 ? <div>No approved bookings</div> : approved.map((b) => (
                <div key={b.id} className="rounded border p-4 bg-white/80">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{b.fullName}</div>
                      <div className="text-sm text-muted">{b.email} • {b.phone}</div>
                      <div className="text-sm mt-2">{new Date(b.checkIn).toISOString().slice(0,10)} → {new Date(b.checkOut).toISOString().slice(0,10)}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => cancel(b)} className="rounded bg-yellow-500 px-4 py-2 text-white">Cancel</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
