import { useEffect, useState } from 'react';
import { companyMemberApi } from './companyMemberApi.js';

export function CompanyMembershipPanel({ companies, runAuthenticated, onMembershipsChange }) {
  const [memberships, setMemberships] = useState([]);
  const [companyMembers, setCompanyMembers] = useState({});
  const [email, setEmail] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const companyKey = companies.map((company) => company.id).join(',');

  async function load() {
    const mine = await runAuthenticated((token) => companyMemberApi.mine(token));
    setMemberships(mine);
    onMembershipsChange(mine);
    const owned = mine.filter((item) => item.role === 'sahip' && item.status === 'aktif');
    const lists = await Promise.all(owned.map(async (item) => {
      const members = await runAuthenticated((token) => companyMemberApi.forCompany(token, item.companyId));
      return [item.companyId, members];
    }));
    setCompanyMembers(Object.fromEntries(lists));
  }

  useEffect(() => {
    load().catch((cause) => setError(cause.message));
    // Company creation changes the membership list through a database trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyKey]);

  const ownedCompanies = companies.filter((company) => memberships.some((item) => item.companyId === company.id && item.role === 'sahip' && item.status === 'aktif'));
  const pending = memberships.filter((item) => item.role === 'ise_alim' && item.status === 'beklemede');

  async function perform(action, success) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      await load();
      setNotice(success);
      return true;
    } catch (cause) {
      setError(cause.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  return <section className="mt-7 rounded-2xl border border-[#DFE6EE] bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold text-[#243B64]">Şirket ekibi</h2>
    <p className="mt-2 text-sm text-[#64748B]">İşe alım çalışanları kendi işveren hesaplarıyla giriş yapar. Erişim, daveti kabul edince açılır.</p>
    {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    {notice && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-emerald-800">{notice}</p>}
    {pending.length > 0 && <div className="mt-5 space-y-3"><h3 className="font-semibold text-[#243B64]">Bekleyen davetlerin</h3>{pending.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D8E0EA] p-4"><span>{item.companyName} · İşe alım çalışanı</span><div className="flex gap-2"><button disabled={busy} onClick={() => perform(() => runAuthenticated((token) => companyMemberApi.accept(token, item.id)), 'Daveti kabul ettin.')} className="rounded-lg bg-[#243B64] px-3 py-2 text-sm text-white">Kabul et</button><button disabled={busy} onClick={() => perform(() => runAuthenticated((token) => companyMemberApi.decline(token, item.id)), 'Daveti reddettin.')} className="rounded-lg border px-3 py-2 text-sm">Reddet</button></div></div>)}</div>}
    {ownedCompanies.length > 0 && <form onSubmit={(event) => { event.preventDefault(); const companyId = targetCompany || ownedCompanies[0].id; perform(() => runAuthenticated((token) => companyMemberApi.invite(token, companyId, email.trim())), 'Davet oluşturuldu. Çalışan hesabına girip kabul edebilir.').then((success) => { if (success) { setEmail(''); } }); }} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><select aria-label="Şirket" value={targetCompany} onChange={(event) => setTargetCompany(event.target.value)} className="rounded-xl border border-[#D8E0EA] px-3 py-2">{ownedCompanies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select><input aria-label="Çalışanın e-posta adresi" type="email" required placeholder="Çalışanın e-posta adresi" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-[#D8E0EA] px-3 py-2" /><button disabled={busy} className="rounded-xl bg-[#243B64] px-4 py-2 font-semibold text-white disabled:opacity-50">Davet et</button></form>}
    {ownedCompanies.map((company) => <div key={company.id} className="mt-5"><h3 className="font-semibold text-[#243B64]">{company.name} ekibi</h3><div className="mt-2 space-y-2">{(companyMembers[company.id] ?? []).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#F8FAFC] p-3 text-sm"><span>{item.role === 'sahip' ? 'Şirket sahibi' : 'İşe alım çalışanı'} · {item.status === 'aktif' ? 'Aktif' : item.status === 'beklemede' ? 'Davet bekliyor' : 'Reddedildi'}</span>{item.role !== 'sahip' && <button disabled={busy} onClick={() => perform(() => runAuthenticated((token) => companyMemberApi.remove(token, company.id, item.id)), 'Üye erişimi kaldırıldı.')} className="text-red-700">Erişimi kaldır</button>}</div>)}</div></div>)}
  </section>;
}
