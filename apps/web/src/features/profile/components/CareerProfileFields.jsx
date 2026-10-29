import { fieldClass } from './profileFormStyles.js';

export const initialCareerForm = {
  title: '', summary: '', experienceLevel: '', linkedInUrl: '', gitHubUrl: '', portfolioUrl: '',
  targetTitle: '', targetIndustry: '', workModels: [], preferredLocationsText: '',
  targetSeniority: '', careerNotes: '', visibility: 'basvurulanlar',
};
const levelOptions = [
  ['stajyer', 'Stajyer'], ['baslangic', 'Başlangıç'], ['orta', 'Orta'],
  ['kidemli', 'Kıdemli'], ['lider', 'Lider'],
];

export function careerToForm(profile) {
  return {
    title: profile.title || '',
    summary: profile.summary || '',
    experienceLevel: profile.experienceLevel || '',
    linkedInUrl: profile.linkedInUrl || '',
    gitHubUrl: profile.gitHubUrl || '',
    portfolioUrl: profile.portfolioUrl || '',
    targetTitle: profile.targetTitle || '',
    targetIndustry: profile.targetIndustry || '',
    workModels: profile.workModels || [],
    preferredLocationsText: (profile.preferredLocations || []).join(', '),
    targetSeniority: profile.targetSeniority || '',
    careerNotes: profile.careerNotes || '',
    visibility: profile.visibility || 'basvurulanlar',
  };
}

export function careerToPayload(form) {
  return {
    title: form.title,
    summary: form.summary,
    experienceLevel: form.experienceLevel || null,
    linkedInUrl: form.linkedInUrl,
    gitHubUrl: form.gitHubUrl,
    portfolioUrl: form.portfolioUrl,
    targetTitle: form.targetTitle,
    targetIndustry: form.targetIndustry,
    workModels: form.workModels,
    preferredLocations: form.preferredLocationsText.split(',').map((item) => item.trim()).filter(Boolean),
    targetSeniority: form.targetSeniority || null,
    careerNotes: form.careerNotes,
    visibility: form.visibility,
  };
}

export function CareerProfileFields({ form, updateField }) {
  return (
    <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm md:p-9 space-y-9">
        <div>
          <h2 className="text-lg font-semibold text-[#243B64]">Kendini anlat</h2>
          <p className="mt-1 text-sm text-[#667085]">Unvanın ve kısa özetin profilinin ilk izlenimini oluşturur.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium">Güncel unvan<input className={fieldClass} value={form.title} maxLength={150} placeholder="Örn. Yazılım geliştirici" onChange={(event) => updateField('title', event.target.value)} /></label>
            <label className="block text-sm font-medium">Deneyim seviyesi<select className={fieldClass} value={form.experienceLevel} onChange={(event) => updateField('experienceLevel', event.target.value)}><option value="">Seçiniz</option>{levelOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <label className="mt-5 block text-sm font-medium">Hakkımda<textarea className={`${fieldClass} min-h-32 resize-y`} value={form.summary} maxLength={2000} placeholder="Becerilerini, deneyimlerini ve ilgilendiğin alanları anlat..." onChange={(event) => updateField('summary', event.target.value)} /><span className="mt-1 block text-right text-xs font-normal text-[#98A2B3]">{form.summary.length}/2000</span></label>
        </div>

        <div className="border-t border-[#E3E7ED] pt-8">
          <h2 className="text-lg font-semibold text-[#243B64]">Bağlantılar ve görünürlük</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium">LinkedIn<input className={fieldClass} type="url" value={form.linkedInUrl} maxLength={300} placeholder="https://linkedin.com/in/..." onChange={(event) => updateField('linkedInUrl', event.target.value)} /></label>
            <label className="block text-sm font-medium">GitHub<input className={fieldClass} type="url" value={form.gitHubUrl} maxLength={300} placeholder="https://github.com/..." onChange={(event) => updateField('gitHubUrl', event.target.value)} /></label>
            <label className="block text-sm font-medium">Portfolyo<input className={fieldClass} type="url" value={form.portfolioUrl} maxLength={300} placeholder="https://..." onChange={(event) => updateField('portfolioUrl', event.target.value)} /></label>
            <label className="block text-sm font-medium">Profil görünürlüğü<select className={fieldClass} value={form.visibility} onChange={(event) => updateField('visibility', event.target.value)}><option value="gizli">Gizli</option><option value="basvurulanlar">Başvurulan ilanlar</option><option value="herkese_acik">Herkese açık</option></select></label>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#667085]">Görünürlük tercihi kaydedilir. İşveren erişim kuralları ilgili modülde devreye alınacak.</p>
        </div>

    </section>
  );
}
