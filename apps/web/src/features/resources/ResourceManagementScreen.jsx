import { useEffect, useMemo, useState } from 'react';
import { request } from '../../shared/api/request.js';

const blank = { skillId: '', title: '', url: '', provider: '', type: 'kurs', language: 'tr', level: 'baslangic', paid: false, active: true };
const options = { type: [['kurs', 'Kurs'], ['dokumantasyon', 'Dokümantasyon'], ['makale', 'Makale'], ['video', 'Video'], ['uygulama', 'Uygulama']], language: [['tr', 'Türkçe'], ['en', 'İngilizce']], level: [['baslangic', 'Başlangıç'], ['orta', 'Orta'], ['ileri', 'İleri']] };

export function ResourceManagementScreen({ runAuthenticated }) {
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    runAuthenticated((token) => Promise.all([request('learning-resources', 'manage', { token }), request('learning-resources', 'manage/skills', { token })]))
      .then(([items, catalog]) => { if (active) { setResources(items); setSkills(catalog); } })
      .catch((cause) => { if (active) { setError(cause.message); } })
      .finally(() => { if (active) { setLoading(false); } });
    return () => { active = false; };
  }, [runAuthenticated]);

  const skillNames = useMemo(() => new Map(skills.map((skill) => [skill.id, skill.name])), [skills]);
  const visible = resources.filter((item) => `${item.title} ${item.provider} ${skillNames.get(item.skillId) ?? ''}`.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR')));

  function edit(item) {
    setEditingId(item.id);
    setForm({ skillId: item.skillId, title: item.title, url: item.url, provider: item.provider, type: item.type, language: item.language, level: item.level, paid: item.paid, active: item.active });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(event) {
    event.preventDefault();
    setWorking(true);
    setError('');
    setMessage('');
    try {
      const saved = await runAuthenticated((token) => request('learning-resources', editingId ?? '', { method: editingId ? 'PUT' : 'POST', token, body: form }));
      setResources((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.title.localeCompare(b.title, 'tr')));
      setEditingId(null);
      setForm(blank);
      setMessage('Kaynak kaydedildi. Aktif kaynaklar adayların öğrenme ekranında görünür.');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setWorking(false);
    }
  }

  function field(key, label, type = 'text') {
    return <label className="block text-sm font-semibold text-[#344767]">{label}<input required type={type} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-[#D9E1EB] bg-white px-4 py-3 font-normal text-[#243B64]" /></label>;
  }

  return <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8"><div><p className="text-xs font-bold uppercase tracking-widest text-[#2F8F83]">Yönetim</p><h1 className="mt-2 text-3xl font-bold text-[#243B64]">Eğitim kaynakları</h1><p className="mt-2 text-[#66758D]">Katalog becerilerine bağlanan kaynakları ekle, güncelle ve yayından kaldır.</p></div>
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}{message && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-800">{message}</p>}
    <form onSubmit={save} className="mt-7 grid gap-4 rounded-3xl border border-[#DEE6EF] bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8"><div className="sm:col-span-2 flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-[#243B64]">{editingId ? 'Kaynağı düzenle' : 'Yeni kaynak ekle'}</h2>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(blank); }} className="text-sm font-semibold text-[#5276A7]">Vazgeç</button>}</div>
      <label className="block text-sm font-semibold text-[#344767]">İlgili beceri<select required value={form.skillId} onChange={(event) => setForm((current) => ({ ...current, skillId: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-[#D9E1EB] bg-white px-4 py-3 font-normal"><option value="">Beceri seç</option>{skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}</select></label>{field('title', 'Kaynak başlığı')}{field('url', 'HTTPS bağlantısı', 'url')}{field('provider', 'Sağlayıcı')}
      {Object.entries(options).map(([key, values]) => <label key={key} className="block text-sm font-semibold text-[#344767]">{{ type: 'Tür', language: 'Dil', level: 'Düzey' }[key]}<select value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-[#D9E1EB] bg-white px-4 py-3 font-normal">{values.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>)}
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.paid} onChange={(event) => setForm((current) => ({ ...current, paid: event.target.checked }))} />Ücretli</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} />Yayında</label><button type="submit" disabled={working || skills.length === 0} className="ml-auto rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white disabled:opacity-50">{working ? 'Kaydediliyor…' : 'Kaydet'}</button></div>
    </form>
    <section className="mt-7 rounded-3xl border border-[#DEE6EF] bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold text-[#243B64]">Kayıtlı kaynaklar ({resources.length})</h2><input aria-label="Kaynaklarda ara" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Başlık, sağlayıcı veya beceri ara" className="rounded-xl border border-[#D9E1EB] px-4 py-2.5 text-sm" /></div>{loading ? <p className="mt-5 text-[#66758D]">Yükleniyor…</p> : visible.length === 0 ? <p className="mt-5 text-[#66758D]">Kaynak bulunamadı.</p> : <div className="mt-5 divide-y divide-[#E8EDF2]">{visible.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><p className="font-semibold text-[#243B64]">{item.title}</p><p className="mt-1 text-sm text-[#718096]">{skillNames.get(item.skillId) ?? 'Bilinmeyen beceri'} · {item.provider} · {item.active ? 'Yayında' : 'Yayında değil'}</p></div><button type="button" onClick={() => edit(item)} className="rounded-lg border border-[#D9E1EB] px-4 py-2 text-sm font-semibold text-[#243B64]">Düzenle</button></div>)}</div>}</section>
  </main>;
}
