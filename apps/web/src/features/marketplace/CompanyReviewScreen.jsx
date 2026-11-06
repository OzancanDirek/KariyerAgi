import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { companyApi } from './companyApi.js';

export function CompanyReviewScreen({ runAuthenticated }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    runAuthenticated((token) => companyApi.pending(token))
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

  async function review(company, approved) {
    setError('');
    setWorkingId(company.id);
    try {
      await runAuthenticated((token) => companyApi.review(token, company.id, approved));
      setCompanies((items) => items.filter((item) => item.id !== company.id));
    } catch (cause) {
      setError(cause.message);
    } finally {
      setWorkingId(null);
    }
  }

  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8"><div className="flex items-center gap-3 text-[#243B64]"><ShieldCheck size={28} /><h1 className="text-3xl font-bold">Şirket incelemeleri</h1></div><p className="mt-3 text-[#64748B]">Şirket bilgilerini ve web sitesini inceleyip karar ver. Onaylanan şirketler ilan yayımlayabilir.</p>{error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}{loading ? <p className="mt-8 text-[#64748B]">Yükleniyor...</p> : companies.length === 0 ? <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-8 text-[#64748B]">İnceleme bekleyen şirket yok.</div> : <div className="mt-8 space-y-4">{companies.map((company) => <section key={company.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-[#243B64]">{company.name}</h2><p className="mt-2 text-[#52627A]">{company.description || 'Açıklama eklenmedi.'}</p><p className="mt-3 text-sm text-[#64748B]">{[company.sector, company.location].filter(Boolean).join(' · ')}</p>{company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-[#426C9D] underline">Şirket web sitesini aç</a>}<div className="mt-5 flex gap-3"><button type="button" disabled={workingId === company.id} onClick={() => review(company, true)} className="rounded-xl bg-[#258977] px-4 py-2.5 font-semibold text-white disabled:opacity-50">Onayla</button><button type="button" disabled={workingId === company.id} onClick={() => review(company, false)} className="rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-700 disabled:opacity-50">Reddet</button></div></section>)}</div>}</main>;
}
