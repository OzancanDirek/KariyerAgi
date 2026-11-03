import { useEffect, useRef, useState } from 'react';
import { Download, FileText, Plus, Star, Trash2, UploadCloud } from 'lucide-react';
import { cvApi } from '../api/cvApi.js';

const maxBytes = 10 * 1024 * 1024;

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function CvManager({ runAuthenticated, previewLimit, onShowAll }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    let active = true;
    runAuthenticated(cvApi.list)
      .then((files) => {
        if (active) {
          setItems(files);
        }
      })
      .catch((failure) => { if (active) { setError(failure.message); } })
      .finally(() => { if (active) { setLoading(false); } });
    return () => { active = false; };
  }, []);

  function choose(selected) {
    if (!selected) {
      return;
    }
    if (!/\.pdf$/i.test(selected.name) || selected.size === 0 || selected.size > maxBytes) {
      setError('En fazla 10 MB boyutunda bir PDF seçin.');
      return;
    }
    setError('');
    setFile(selected);
  }

  async function upload() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    setBusy(true);
    setError('');
    try {
      const created = await runAuthenticated((token) => cvApi.upload(token, file));
      setItems((current) => [created, ...current.map((item) => ({ ...item, isPrimary: created.isPrimary ? false : item.isPrimary }))]);
      setFile(null);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  async function download(item) {
    setBusy(true);
    setError('');
    try {
      const blob = await runAuthenticated((token) => cvApi.download(token, item.id));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  async function setPrimary(item) {
    setBusy(true);
    setError('');
    try {
      setItems(await runAuthenticated((token) => cvApi.setPrimary(token, item.id)));
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item) {
    if (!window.confirm('Bu CV dosyasını silmek istiyor musun?')) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      await runAuthenticated((token) => cvApi.remove(token, item.id));
      setItems(await runAuthenticated(cvApi.list));
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return <>
    {error && <p role="alert" className="mb-3 rounded-lg bg-[#FFF2F0] px-3 py-2 text-xs text-[#B42318]">{error}</p>}
    {loading && <p className="text-sm text-[#667085]">CV dosyaları yükleniyor...</p>}
    <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="sr-only" onChange={(event) => { choose(event.target.files?.[0]); event.target.value = ''; }} />
    <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files?.[0]); }} className={`rounded-xl border border-dashed p-4 text-center ${dragging ? 'border-[#5276A7] bg-[#EDF4FC]' : 'border-[#D8DEE8] bg-[#FAFBFC]'}`}>
      <UploadCloud className="mx-auto text-[#5276A7]" size={23} />
      <p className="mt-2 text-xs text-[#667085]">CV dosyanı buraya bırak veya bilgisayarından seç.</p>
      <p className="mt-1 text-[11px] text-[#98A2B3]">Yalnızca PDF · En fazla 10 MB</p>
      <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="mt-2 rounded-lg border border-[#CAD7E4] bg-white px-3 py-1.5 text-xs font-semibold text-[#243B64] disabled:opacity-50">Dosya seç</button>
      {file && <p className="mt-2 break-all text-xs font-semibold text-[#243B64]">Seçilen: {file.name} · {formatSize(file.size)}</p>}
      {file && <button type="button" onClick={upload} disabled={busy} className="mt-3 ml-2 inline-flex items-center gap-1 rounded-lg bg-[#243B64] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"><Plus size={13} />CV’yi yükle</button>}
    </div>
    {!loading && items.length === 0 && <p className="mt-3 text-center text-xs text-[#98A2B3]">Henüz CV yüklenmedi.</p>}
    <div className="mt-3 space-y-2">{(previewLimit == null ? items : items.slice(0, previewLimit)).map((item) => <div key={item.id} className="flex items-center gap-2 rounded-xl border border-[#E3E7ED] bg-[#F8F9FB] p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#31527F]"><FileText size={18} /></div>
      <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#243B64]" title={item.fileName}>{item.fileName}</p><p className="mt-0.5 text-[11px] text-[#77849A]">{formatSize(item.sizeBytes)}{item.isPrimary ? ' · Birincil CV' : ''}</p></div>
      {!item.isPrimary && <button type="button" disabled={busy} onClick={() => setPrimary(item)} title="Birincil CV yap" aria-label="Birincil CV yap" className="p-1.5 text-[#5276A7] hover:bg-white"><Star size={15} /></button>}
      <button type="button" disabled={busy} onClick={() => download(item)} title="CV'yi indir" aria-label="CV'yi indir" className="p-1.5 text-[#5276A7] hover:bg-white"><Download size={15} /></button>
      <button type="button" disabled={busy} onClick={() => remove(item)} title="CV'yi sil" aria-label="CV'yi sil" className="p-1.5 text-[#B42318] hover:bg-white"><Trash2 size={15} /></button>
    </div>)}</div>
    {onShowAll && !loading && <div className="mt-4 border-t border-[#EDF0F4] pt-3 text-center"><button type="button" onClick={onShowAll} className="text-sm font-semibold text-[#31527F] hover:underline">Tümünü gör ({items.length}) →</button></div>}
  </>;
}
