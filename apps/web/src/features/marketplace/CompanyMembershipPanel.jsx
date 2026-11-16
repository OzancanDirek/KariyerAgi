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
  const [transferTarget, setTransferTarget] = useState({});
  const [confirmTransfer, setConfirmTransfer] = useState('');
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
  const ownedForTransfer = memberships.filter((item) => item.role === 'sahip' && item.status === 'aktif').map((item) =>
    companies.find((company) => company.id === item.companyId) ?? { id: item.companyId, name: item.companyName || 'Arşivlenmiş şirket', archived: true });
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

  async function transfer(company) {
    const membershipId = transferTarget[company.id];
    if (!membershipId || confirmTransfer !== company.id) return;
    const recipient = (companyMembers[company.id] ?? []).find((member) => member.id === membershipId);
    const success = await perform(
      () => runAuthenticated((token) => companyMemberApi.transferOwnership(token, company.id, membershipId)),
      `${company.name} sahipliği ${recipient?.memberName || recipient?.memberEmail || 'seçilen çalışana'} devredildi.`,
    );
    if (success) {
      setConfirmTransfer('');
      setTransferTarget((current) => ({ ...current, [company.id]: '' }));
    }
  }

  return <section className="mt-7 rounded-2xl border border-[#DFE6EE] bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold text-[#243B64]">Şirket ekibi</h2>
    <p className="mt-2 text-sm text-[#64748B]">İşe alım çalışanları kendi işveren hesaplarıyla giriş yapar. Erişim, daveti kabul edince açılır.</p>
    {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
    {notice && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-emerald-800">{notice}</p>}
    {pending.length > 0 && <div className="mt-5 space-y-3"><h3 className="font-semibold text-[#243B64]">Bekleyen davetlerin</h3>{pending.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D8E0EA] p-4"><span>{item.companyName} · İşe alım çalışanı</span><div className="flex gap-2"><button disabled={busy} onClick={() => perform(() => runAuthenticated((token) => companyMemberApi.accept(token, item.id)), 'Daveti kabul ettin.')} className="rounded-lg bg-[#243B64] px-3 py-2 text-sm text-white">Kabul et</button><button disabled={busy} onClick={() => perform(() => runAuthenticated((token) => companyMemberApi.decline(token, item.id)), 'Daveti reddettin.')} className="rounded-lg border px-3 py-2 text-sm">Reddet</button></div></div>)}</div>}
    {ownedCompanies.length > 0 && <form onSubmit={(event) => { event.preventDefault(); const companyId = targetCompany || ownedCompanies[0].id; perform(() => runAuthenticated((token) => companyMemberApi.invite(token, companyId, email.trim())), 'Davet oluşturuldu. Çalışan hesabına girip kabul edebilir.').then((success) => { if (success) { setEmail(''); } }); }} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><select aria-label="Şirket" value={targetCompany} onChange={(event) => setTargetCompany(event.target.value)} className="rounded-xl border border-[#D8E0EA] px-3 py-2">{ownedCompanies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select><input aria-label="Çalışanın e-posta adresi" type="email" required placeholder="Çalışanın e-posta adresi" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-[#D8E0EA] px-3 py-2" /><button disabled={busy} className="rounded-xl bg-[#243B64] px-4 py-2 font-semibold text-white disabled:opacity-50">Davet et</button></form>}
    {ownedForTransfer.map((company) => {
      const members = companyMembers[company.id] ?? [];
      const eligible = members.filter((item) => item.role === 'ise_alim' && item.status === 'aktif');
      return <div key={company.id} className="mt-6 border-t border-[#E2E8F0] pt-5">
        <h3 className="font-semibold text-[#243B64]">{company.name} ekibi {company.archived && <span className="ml-2 rounded bg-slate-200 px-2 py-1 text-xs font-normal text-slate-700">Arşivlenmiş</span>}</h3>
        <div className="mt-3 space-y-2">{members.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#F8FAFC] p-3 text-sm"><span><strong className="block text-[#243B64]">{item.memberName || item.memberEmail || `Üye ${item.userId.slice(0, 8)}`}</strong><span className="text-[#64748B]">{item.memberEmail && item.memberName ? `${item.memberEmail} · ` : ''}{item.role === 'sahip' ? 'Şirket sahibi' : 'İşe alım çalışanı'} · {item.status === 'aktif' ? 'Aktif' : item.status === 'beklemede' ? 'Davet bekliyor' : 'Reddedildi'}</span></span>{item.role !== 'sahip' && <button type="button" disabled={busy} onClick={() => perform(() => runAuthenticated((token) => companyMemberApi.remove(token, company.id, item.id)), 'Üye erişimi kaldırıldı.')} className="text-red-700">Erişimi kaldır</button>}</div>)}</div>
        <div className="mt-4 rounded-xl border border-[#D8E0EA] bg-[#F8FAFC] p-4">
          <h4 className="font-semibold text-[#243B64]">Şirket sahipliğini devret</h4>
          <p className="mt-1 text-sm text-[#64748B]">Hesabını kapatmak istersen önce aktif bir işe alım çalışanına sahipliği devret. Devirden sonra şirketi yeni sahibi yönetir.{company.archived ? ' Bu şirket arşivde kalır.' : ''}</p>
          {eligible.length ? <div className="mt-3 flex flex-wrap items-center gap-2"><select aria-label={`${company.name} için yeni şirket sahibi`} value={transferTarget[company.id] ?? ''} onChange={(event) => { setTransferTarget((current) => ({ ...current, [company.id]: event.target.value })); setConfirmTransfer(''); }} className="min-w-52 rounded-lg border border-[#D8E0EA] bg-white px-3 py-2 text-sm"><option value="">Çalışan seç</option>{eligible.map((item) => <option key={item.id} value={item.id}>{item.memberName || item.memberEmail || item.userId.slice(0, 8)}{item.memberEmail && item.memberName ? ` (${item.memberEmail})` : ''}</option>)}</select>{confirmTransfer === company.id ? <><span className="text-sm text-[#9A3412]">Bu işlem şirket yönetimini devreder.</span><button type="button" disabled={busy} onClick={() => transfer(company)} className="rounded-lg bg-[#9A3412] px-3 py-2 text-sm font-semibold text-white">Devri onayla</button><button type="button" onClick={() => setConfirmTransfer('')} className="rounded-lg border px-3 py-2 text-sm">Vazgeç</button></> : <button type="button" disabled={busy || !transferTarget[company.id]} onClick={() => setConfirmTransfer(company.id)} className="rounded-lg border border-[#9A3412] px-3 py-2 text-sm font-semibold text-[#9A3412] disabled:opacity-50">Sahipliği devret</button>}</div> : <p className="mt-3 text-sm text-[#64748B]">Önce işveren hesabı olan bir çalışanı davet et; daveti kabul edince burada seçebilirsin.</p>}
        </div>
      </div>;
    })}
  </section>;
}
