'use client';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Source = { id: number; title: string; url: string; snippet: string };
type Report = { id: string; question: string; answer: string; mode: string; sources: Source[]; created_at: string };
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [question, setQuestion] = useState('What are the advantages and limitations of retrieval-augmented generation?');
  const [result, setResult] = useState<Report | null>(null);
  const [history, setHistory] = useState<Report[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const loadHistory = async () => {
    try { const res = await fetch(`${API}/api/reports`); if (res.ok) setHistory(await res.json()); } catch {}
  };
  useEffect(() => { void loadHistory(); }, []);
  async function run(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API}/api/research`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, max_sources: 6 }) });
      if (!res.ok) { const data = await res.json(); throw new Error(typeof data.detail === 'string' ? data.detail : 'Request failed'); }
      setResult(await res.json()); await loadHistory();
    } catch (err) { setError(err instanceof Error ? err.message : 'Unexpected error'); }
    finally { setBusy(false); }
  }
  return <main className="shell">
    <aside><div className="brand">◈ NEXUS <span>RESEARCH</span></div><p className="muted">Evidence-driven intelligence</p><div className="sidehead">RECENT RESEARCH</div>
      {history.map(r => <button className="history" key={r.id} onClick={() => { setResult(r); setQuestion(r.question); }}>{r.question}</button>)}
      {history.length === 0 && <p className="muted">Your reports appear here.</p>}
    </aside>
    <section className="workspace"><div className="eyebrow">RESEARCH WORKSPACE / V0.1</div><h1>Explore any question.<em> Follow the evidence.</em></h1><p className="sub">Search the web, synthesize findings and inspect every cited source.</p>
      <form onSubmit={run}><label htmlFor="question">RESEARCH QUESTION</label><textarea id="question" value={question} onChange={e => setQuestion(e.target.value)} minLength={8} maxLength={1000} required/><div className="actions"><span>Live search · Cited findings · Saved reports</span><button disabled={busy}>{busy ? 'Researching…' : 'Run research →'}</button></div></form>
      {error && <div className="error">{error}</div>}
      {result && <article><div className="reporttop"><span>RESEARCH REPORT</span><span className="tag">{result.mode}</span></div><h2>{result.question}</h2><div className="markdown"><ReactMarkdown>{result.answer}</ReactMarkdown></div><h3>Sources ({result.sources.length})</h3>{result.sources.length ? <div className="sources">{result.sources.map(s => <a href={s.url} target="_blank" rel="noopener noreferrer" key={s.id}><strong>[{s.id}] {s.title} ↗</strong><small>{s.url}</small><p>{s.snippet}</p></a>)}</div> : <p className="muted">No sources returned. Add a Tavily API key to enable live search.</p>}</article>}
    </section>
  </main>;
}
