import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import { companyApi } from './companyApi.js';
import { CompanyMembershipPanel } from './CompanyMembershipPanel.jsx';

const emptyCompany = { name: '', description: '', sector: '', location: '', website: '' };

const statusText = {
  beklemede: 'İnceleme bekliyor',
  onaylandi: 'Şirket onaylandı',
  reddedildi: 'Başvuru reddedildi',
};

export function CompanyWorkspace({ runAuthenticated }) {
  const [companies, setCompanies] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [form, setForm] = useState(emptyCompany);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    runAuthenticated((token) => companyApi.mine(token))
      .then((items) => {
        if (active) {
          setCompanies(items);
        }
      })
      .catch((cause) => {
        if (active) {
          setError(cause.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [runAuthenticated]);

  function startEdit(company) {
    setCreating(false);
    setEditingId(company.id);
    setForm({ name: company.name, description: company.description ?? '', sector: company.sector ?? '', location: company.location ?? '', website: company.website ?? '' });
    setError('');
    setMessage('');
  }

  async function save(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const saved = await runAuthenticated((token) => editingId ? companyApi.update(token, editingId, form) : companyApi.create(token, form));
      setCompanies((items) => editingId ? items.map((item) => item.id === saved.id ? saved : item) : [saved, ...items]);
      setEditingId(null);
      setCreating(false);
      setForm(emptyCompany);
      setMessage(saved.verificationStatus === 'beklemede' ? 'Şirket bilgilerin kaydedildi ve incelemeye alındı.' : 'Şirket bilgilerin güncellendi.');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSaving(false);
    }
  }

  const hasCompany = companies.length > 0;
  const ownedCompanyIds = new Set(memberships.filter((item) => item.role === 'sahip' && item.status === 'aktif').map((item) => item.companyId));
  const selectedCompany = companies.find((company) => company.id === editingId) ?? companies[0];
  const showForm = !loading && (!hasCompany || editingId !== null || creating);

  function cancelForm() {
    setEditingId(null);
    setCreating(false);
    setForm(emptyCompany);
    setError('');
  }

  function refreshAfterMembershipChange(items) {
    setMemberships(items);
    runAuthenticated((token) => companyApi.mine(token))
      .then(setCompanies)
      .catch((cause) => setError(cause.message));
  }

  return <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <div className="rounded-[28px] bg-[#243B64] p-7 text-white sm:p-9"><div className="flex items-center gap-3 text-[#9AD8CE]"><Building2 size={25} /><span className="text-sm font-bold uppercase tracking-widest">İşveren alanı</span></div><h1 className="mt-5 text-3xl font-bold">{hasCompany ? 'Şirket hesabın' : 'Şirketini tanıt'}</h1><p className="mt-3 max-w-2xl text-[#D3DEEF]">{hasCompany ? 'Kayıtlı şirket bilgilerini görüntüleyebilir ve güncelleyebilirsin.' : 'Şirket bilgilerini kaydet. Yönetici incelemesinden sonra ilan yayımlayabileceksin.'}</p></div>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {message && <p role="status" className="mt-6 rounded-xl bg-emerald-50 p-4 text-emerald-800">{message}</p>}
    <div className="mt-7 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-[#DFE6EE] bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-[#243B64]">Şirketlerim</h2>{ownedCompanyIds.size > 0 && <button type="button" onClick={() => { setEditingId(null); setCreating(true); setForm(emptyCompany); setError(''); }} className="text-sm font-semibold text-[#426C9D] hover:underline">Başka şirket ekle</button>}</div>{loading ? <p className="mt-5 text-[#718096]">Yükleniyor...</p> : !hasCompany ? <p className="mt-5 text-[#718096]">Henüz şirket eklemedin. Formu doldurarak başlayabilirsin.</p> : <div className="mt-5 space-y-3">{companies.map((company) => <div key={company.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"><p className="font-semibold text-[#243B64]">{company.name}</p><p className="mt-1 flex items-center gap-2 text-sm text-[#64748B]">{company.verificationStatus === 'onaylandi' ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}{statusText[company.verificationStatus] ?? company.verificationStatus}</p>{company.verificationStatus === 'reddedildi' && <p className="mt-2 text-xs text-[#A34436]">Bilgileri düzelterek yeniden incelemeye gönderebilirsin.</p>}{ownedCompanyIds.has(company.id) && <button type="button" onClick={() => startEdit(company)} className="mt-3 text-sm font-semibold text-[#426C9D] hover:underline">Bilgileri düzenle</button>}</div>)}</div>}</section>
      {showForm ? <section className="rounded-2xl border border-[#DFE6EE] bg-white p-6 shadow-sm"><div className="flex items-center gap-2 text-[#243B64]"><ShieldCheck size={22} /><h2 className="text-xl font-bold">{editingId ? 'Şirketi düzenle' : 'Yeni şirket ekle'}</h2></div><form onSubmit={save} className="mt-5 space-y-4">{[['name', 'Şirket adı', true], ['sector', 'Sektör', false], ['location', 'Konum', false], ['website', 'Web sitesi (https://)', false]].map(([field, label, required]) => <label key={field} className="block text-sm font-medium text-[#334155]">{label}{required && ' *'}<input type={field === 'website' ? 'url' : 'text'} required={required} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className="mt-2 w-full rounded-xl border border-[#D8E0EA] px-4 py-3 outline-none focus:border-[#2F8F83]" /></label>)}<label className="block text-sm font-medium text-[#334155]">Açıklama<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="mt-2 w-full rounded-xl border border-[#D8E0EA] px-4 py-3 outline-none focus:border-[#2F8F83]" /></label><div className="flex gap-3"><button disabled={saving} type="submit" className="rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Kaydediliyor...' : editingId ? 'Değişiklikleri kaydet' : 'Şirketi kaydet'}</button>{hasCompany && <button type="button" onClick={cancelForm} className="rounded-xl border border-[#D8E0EA] px-4 py-3 text-[#52627A]">Vazgeç</button>}</div></form></section> : hasCompany && <section className="rounded-2xl border border-[#DFE6EE] bg-white p-6 shadow-sm"><div className="flex items-center gap-2 text-[#243B64]"><ShieldCheck size={22} /><h2 className="text-xl font-bold">Kayıtlı şirket bilgileri</h2></div><dl className="mt-5 space-y-4">{[['Şirket adı', selectedCompany.name], ['Sektör', selectedCompany.sector], ['Konum', selectedCompany.location], ['Web sitesi', selectedCompany.website], ['Açıklama', selectedCompany.description]].map(([label, value]) => <div key={label} className="border-b border-[#E8EDF3] pb-3"><dt className="text-xs font-semibold uppercase tracking-wide text-[#8090A5]">{label}</dt><dd className="mt-1 break-words text-[#243B64]">{value || 'Eklenmedi'}</dd></div>)}</dl>{ownedCompanyIds.has(selectedCompany.id) && <button type="button" onClick={() => startEdit(selectedCompany)} className="mt-5 rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white">Bilgileri düzenle</button>}</section>}
    </div>
    <CompanyMembershipPanel companies={companies} runAuthenticated={runAuthenticated} onMembershipsChange={refreshAfterMembershipChange} />
  </div>;
}
