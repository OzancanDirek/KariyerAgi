import { CheckCircle2, CircleHelp, Download, ExternalLink, MinusCircle, SearchX, X } from 'lucide-react';

const matchVerdicts = {
  matched: { label: 'Eşleşiyor', Icon: CheckCircle2, classes: 'border-emerald-200 bg-emerald-50 text-emerald-800', accent: 'border-l-emerald-400' },
  partial: { label: 'Kısmen eşleşiyor', Icon: MinusCircle, classes: 'border-amber-200 bg-amber-50 text-amber-800', accent: 'border-l-amber-400' },
  not_found: { label: 'CV’de kanıt yok', Icon: SearchX, classes: 'border-rose-200 bg-rose-50 text-rose-800', accent: 'border-l-rose-400' },
  cannot_determine: { label: 'Belirlenemedi', Icon: CircleHelp, classes: 'border-slate-200 bg-slate-100 text-slate-700', accent: 'border-l-slate-300' },
};

function MatchResult({ match, criteria }) {
  const requiredByTitle = new Map(criteria?.criteria.map((criterion) => [criterion.title, criterion.required]) ?? []);
  const score = Math.min(100, Math.max(0, Number(match.score) || 0));

  return <div className="mt-5 space-y-5">
    <div className="rounded-2xl border border-[#DCE6F1] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-widest text-[#64809E]">Genel ilan uyumu</p><p className="mt-1 text-4xl font-bold tracking-tight text-[#243B64]">%{score}</p></div>
        <span className="rounded-full border border-[#C8DFDA] bg-[#EAF6F2] px-3 py-1.5 text-xs font-semibold text-[#24776D]">İnceleme desteği</span>
      </div>
      <div role="progressbar" aria-label="İlan uyumu" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#E7EDF4]"><div className="h-full rounded-full bg-[#2F8F83]" style={{ width: `${score}%` }} /></div>
      <p className="mt-3 text-xs leading-5 text-[#718096]">CV’deki kanıtlar, ilan için kaydedilen ölçütlerle karşılaştırıldı.</p>
    </div>
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2"><h4 className="font-bold text-[#243B64]">Ölçütlere göre değerlendirme</h4><span className="text-xs text-[#8290A3]">{match.evidence.length} ölçüt</span></div>
      <div className="space-y-3">{match.evidence.map((item, index) => {
        const verdict = matchVerdicts[item.verdict] ?? matchVerdicts.cannot_determine;
        const VerdictIcon = verdict.Icon;
        return <article key={`${item.title}-${index}`} className={`rounded-xl border border-l-4 border-[#DFE6EE] bg-white p-4 sm:p-5 ${verdict.accent}`}>
          <div className="flex flex-wrap items-start justify-between gap-3"><h5 className="min-w-0 flex-1 font-semibold leading-6 text-[#243B64]">{item.title}</h5><span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${verdict.classes}`}><VerdictIcon size={14} aria-hidden="true" />{verdict.label}</span></div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-md bg-[#F1F5F9] px-2.5 py-1 font-semibold text-[#52627A]">{item.weight} puan ağırlık</span><span className="rounded-md bg-[#F1F5F9] px-2.5 py-1 text-[#52627A]">{requiredByTitle.get(item.title) ? 'Temel ölçüt' : 'Tercih'}</span></div>
          <p className="mt-3 border-t border-[#EDF1F5] pt-3 text-sm leading-6 text-[#52627A]">{item.evidence || 'CV’de bu ölçüt için açıklayıcı kanıt bulunamadı.'}</p>
        </article>;
      })}</div>
    </div>
  </div>;
}

export function ApplicantDialog({ detail, loading, error, cvLoading, onLoadCv, onDownloadCv, onClose, match, matchBusy, onEvaluate, criteriaReady, criteria }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172640]/70 px-4 py-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { onClose(); } }}>
    <section role="dialog" aria-modal="true" aria-labelledby="applicant-title" className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DFE6EE] bg-white px-6 py-5 sm:px-8"><div><p className="text-xs font-bold uppercase tracking-widest text-[#2F8F83]">Aday başvurusu</p><h2 id="applicant-title" className="mt-1 text-2xl font-bold text-[#243B64]">{detail?.candidateName || 'Başvuru detayı'}</h2></div><button type="button" aria-label="Kapat" onClick={onClose} className="rounded-lg p-2 text-[#52627A] hover:bg-[#F1F5F9]"><X size={22} /></button></div>
      {error && <p role="alert" className="mx-6 mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {loading ? <p className="p-8 text-[#718096]">Aday bilgileri yükleniyor...</p> : detail && <div className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#8290A3]">Pozisyon ve konum</p><p className="mt-1 font-semibold text-[#243B64]">{detail.title || 'Unvan belirtilmedi'}</p><p className="text-sm text-[#52627A]">{detail.location || 'Konum belirtilmedi'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-[#8290A3]">İletişim</p>{detail.email && <a className="mt-1 block break-all font-semibold text-[#5276A7]" href={`mailto:${detail.email}`}>{detail.email}</a>}{detail.phone && <a className="block text-sm text-[#52627A]" href={`tel:${detail.phone}`}>{detail.phone}</a>}{!detail.email && !detail.phone && <p className="mt-1 text-sm text-[#718096]">İletişim bilgisi bulunmuyor.</p>}</div></div>
        {detail.summary && <div><h3 className="font-bold text-[#243B64]">Hakkında</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#52627A]">{detail.summary}</p></div>}
        <div><h3 className="font-bold text-[#243B64]">Ön yazı</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#52627A]">{detail.coverLetter || 'Ön yazı eklenmedi.'}</p></div>
        {(detail.linkedInUrl || detail.gitHubUrl || detail.portfolioUrl) && <div className="flex flex-wrap gap-3">{[['LinkedIn', detail.linkedInUrl], ['GitHub', detail.gitHubUrl], ['Portfolyo', detail.portfolioUrl]].filter(([, url]) => /^https:\/\//i.test(url || '')).map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#5276A7]">{label}<ExternalLink size={14} /></a>)}</div>}
        <div className="rounded-2xl border border-[#DFE6EE] bg-[#F8FAFC] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-[#243B64]">İlan uyumu</h3><p className="mt-1 text-sm text-[#718096]">Yalnızca bu başvuruya eklenen CV ve onaylı ilan ölçütleri değerlendirilir. ATS okunabilirlik puanından ayrıdır.</p></div>{detail.cvFileName && criteriaReady && !match && <button type="button" disabled={matchBusy} onClick={onEvaluate} className="rounded-lg bg-[#243B64] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{matchBusy ? 'Değerlendiriliyor...' : 'CV’yi ölçütlere göre değerlendir'}</button>}</div>
          {match ? <MatchResult match={match} criteria={criteria} /> : <p className="mt-3 text-sm text-[#718096]">{criteriaReady ? 'Henüz değerlendirilmedi.' : 'Önce ilan ölçütlerini kaydedin.'}</p>}
          <p className="mt-3 text-xs text-[#718096]">Bu puan otomatik karar vermez. CV’de kanıt bulunmaması becerinin olmadığı anlamına gelmez.</p></div>
        <div className="rounded-2xl border border-[#DFE6EE] bg-[#F8FAFC] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-[#243B64]">Başvuru CV’si</h3><p className="mt-1 text-sm text-[#718096]">{detail.cvFileName || 'Bu başvuruya CV eklenmedi.'}</p></div>{detail.cvFileName && <div className="flex gap-2">{detail.cvContentType === 'application/pdf' && <button type="button" disabled={cvLoading} onClick={onLoadCv} className="rounded-lg bg-[#243B64] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{cvLoading ? 'Açılıyor...' : 'CV’yi görüntüle'}</button>}<button type="button" disabled={cvLoading} onClick={onDownloadCv} className="inline-flex items-center gap-2 rounded-lg border border-[#CAD7E7] px-4 py-2 text-sm font-semibold text-[#243B64]"><Download size={16} /> İndir</button></div>}</div></div>
      </div>}
    </section>
  </div>;
}

export function CvPreviewDialog({ url, fileName, onDownload, onClose }) {
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101B30]/85 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { onClose(); } }}>
    <section role="dialog" aria-modal="true" aria-labelledby="cv-preview-title" className="flex h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#DFE6EE] px-5 py-4 sm:px-7"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-[#2F8F83]">Başvuru CV’si</p><h2 id="cv-preview-title" className="truncate text-lg font-bold text-[#243B64]">{fileName}</h2></div><div className="flex shrink-0 items-center gap-2"><button type="button" onClick={onDownload} className="inline-flex items-center gap-2 rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64]"><Download size={16} /> <span className="hidden sm:inline">İndir</span></button><button type="button" aria-label="CV önizlemesini kapat" onClick={onClose} className="rounded-lg p-2 text-[#52627A] hover:bg-[#F1F5F9]"><X size={22} /></button></div></header>
      <iframe title={`${fileName} önizlemesi`} src={url} className="min-h-0 w-full flex-1 bg-[#EEF2F7]" />
    </section>
  </div>;
}

