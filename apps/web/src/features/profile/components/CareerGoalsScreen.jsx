import { useEffect, useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, Home, Laptop, LogOut, Save, Sparkles, Target } from 'lucide-react';
import { careerProfileApi } from '../api/careerProfileApi.js';
import { careerToForm, careerToPayload, initialCareerForm } from './CareerProfileFields.jsx';
import { fieldClass } from './profileFormStyles.js';
import { Logo } from '../../../shared/ui/Logo.jsx';
import { Button } from '../../../shared/ui/Button.jsx';

const positions = ['Frontend Geliştirici', 'Full-Stack Geliştirici', 'Backend Geliştirici', 'Veri Analisti', 'UI/UX Tasarımcısı', 'Ürün Yöneticisi', 'DevOps Mühendisi'];
const models = [
  { value: 'uzaktan', label: 'Uzaktan', description: 'İstediğin yerden çalışma esnekliği', icon: Home },
  { value: 'hibrit', label: 'Hibrit', description: 'Ofis ve uzaktan çalışma bir arada', icon: Laptop },
  { value: 'ofis', label: 'Ofis / Yerinde', description: 'Şirket lokasyonunda çalışma', icon: Building2 },
];
const levels = [
  { value: 'stajyer', label: 'Stajyer', description: 'İlk iş deneyimi' },
  { value: 'baslangic', label: 'Başlangıç', description: 'Yeni mezun / junior' },
  { value: 'orta', label: 'Orta', description: 'Deneyimli uzman' },
  { value: 'kidemli', label: 'Kıdemli', description: 'Kıdemli uzman' },
  { value: 'lider', label: 'Lider', description: 'Ekip / teknik lider' },
];
const sectors = ['Teknoloji & Yazılım', 'Finans', 'Sağlık', 'Eğitim', 'E-Ticaret', 'Oyun', 'Sigorta', 'Üretim'];

function SummaryItem({ label, children }) {
  return <div className="border-b border-[#E3E7ED] py-4 last:border-0"><dt className="text-xs text-[#77849A]">{label}</dt><dd className="mt-1 whitespace-pre-wrap font-semibold text-[#243B64]">{children || 'Henüz belirtilmedi'}</dd></div>;
}

export function CareerGoalsScreen({ runAuthenticated, onHome, onProfile, onLogout }) {
  const [form, setForm] = useState(initialCareerForm);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadGoals() {
      try {
        const result = await runAuthenticated(careerProfileApi.getCareerProfile);
        if (active) {
          setForm(careerToForm(result));
          setLoaded(true);
        }
      } catch (failure) {
        if (active) {
          setError(failure.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadGoals();
    return () => {
      active = false;
    };
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function toggleModel(value) {
    updateField('workModels', form.workModels.includes(value)
      ? form.workModels.filter((model) => model !== value)
      : [...form.workModels, value]);
  }

  async function saveGoals(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const result = await runAuthenticated((token) => careerProfileApi.updateCareerProfile(token, careerToPayload(form)));
      setForm(careerToForm(result));
      setSaved(true);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  }

  const selectedModels = form.workModels.map((value) => models.find((model) => model.value === value)?.label || value).join(', ');
  const selectedLevel = levels.find((level) => level.value === form.targetSeniority)?.label;

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202938]">
      <header className="border-b border-[#E3E7ED] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8"><Logo size="md" /><button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-[#E3E7ED] px-4 py-2 text-sm font-medium text-[#243B64] hover:bg-[#F7F8FA]"><LogOut size={16} />Çıkış yap</button></div></header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm" aria-label="Sayfa yolu"><button type="button" onClick={onHome} className="text-[#667085] hover:text-[#243B64]">Ana sayfa</button><span className="text-[#98A2B3]">/</span><button type="button" onClick={onProfile} className="text-[#667085] hover:text-[#243B64]">Kariyer Profilim</button><span className="text-[#98A2B3]">/</span><span aria-current="page" className="font-semibold text-[#243B64]">Kariyer Hedeflerim</span></nav>
        <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F8F83]">Modül 02 · Kariyer & Profil</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#243B64] sm:text-4xl">Kariyer Hedeflerim</h1><p className="mt-3 text-sm leading-6 text-[#667085]">Hedeflediğin pozisyonu ve çalışma tercihlerini belirle.</p></div>
        {loading && <p role="status" className="rounded-2xl bg-white p-7 text-sm text-[#667085]">Kariyer hedeflerin yükleniyor...</p>}
        {error && <p role="alert" className="mb-5 rounded-xl border border-[#EFCACA] bg-[#FFF5F5] p-5 text-sm text-[#B42318]">{error}</p>}
        {saved && <p role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-[#BCE0D9] bg-[#EBF5F4] p-4 text-sm text-[#27796F]"><CheckCircle2 size={17} />Kariyer hedeflerin kaydedildi.</p>}
        {loaded && <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.85fr)]">
          <form onSubmit={saveGoals} className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-[#E3E7ED] pb-6"><h2 className="flex items-center gap-3 text-xl font-bold text-[#243B64]"><Target size={23} />Kariyer Hedefi Belirleme</h2><p className="mt-2 text-sm leading-6 text-[#667085]">Hedeflediğin rolü ve tercihlerini burada güncelleyebilirsin.</p></div>
            <label className="mt-7 block text-sm font-semibold">Hedeflenen meslek veya pozisyon<input className={fieldClass} value={form.targetTitle} maxLength={150} placeholder="Örn. Frontend Geliştirici" onChange={(event) => updateField('targetTitle', event.target.value)} /></label>
            <div className="mt-3 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs text-[#77849A]">Öneriler:</span>{positions.map((position) => <button key={position} type="button" onClick={() => updateField('targetTitle', position)} className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${form.targetTitle === position ? 'border-[#243B64] bg-[#243B64] text-white' : 'border-[#D8DEE8] bg-[#F7F8FA] text-[#52627A] hover:border-[#5276A7]'}`}>{position}</button>)}</div>
            <fieldset className="mt-8"><legend className="text-sm font-semibold">Tercih edilen çalışma modeli</legend><p className="mt-1 text-xs text-[#77849A]">Birden fazla model seçebilirsin.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{models.map(({ value, label, description, icon: Icon }) => { const selected = form.workModels.includes(value); return <button key={value} type="button" aria-pressed={selected} onClick={() => toggleModel(value)} className={`min-h-36 rounded-xl border p-4 text-left transition-colors ${selected ? 'border-[#243B64] bg-[#EEF2F6] ring-1 ring-[#243B64]' : 'border-[#D8DEE8] hover:border-[#5276A7]'}`}><span className="flex items-start justify-between text-[#243B64]"><Icon size={21} />{selected && <CheckCircle2 size={19} />}</span><strong className="mt-5 block text-sm">{label}</strong><span className="mt-1 block text-xs leading-5 text-[#77849A]">{description}</span></button>; })}</div></fieldset>
            <div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold">İlgi duyulan sektör<input className={fieldClass} list="career-goal-sectors" value={form.targetIndustry} maxLength={150} placeholder="Sektör seç veya yaz" onChange={(event) => updateField('targetIndustry', event.target.value)} /><datalist id="career-goal-sectors">{sectors.map((sector) => <option key={sector} value={sector} />)}</datalist></label><label className="block text-sm font-semibold">Çalışılmak istenen konum<input className={fieldClass} value={form.preferredLocationsText} placeholder="İstanbul, Ankara" onChange={(event) => updateField('preferredLocationsText', event.target.value)} /><span className="mt-2 block text-xs font-normal text-[#77849A]">Birden fazla konumu virgülle ayırabilirsin.</span></label></div>
            <fieldset className="mt-8"><legend className="text-sm font-semibold">Hedef kıdem / deneyim seviyesi</legend><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{levels.map(({ value, label, description }) => <button key={value} type="button" aria-pressed={form.targetSeniority === value} onClick={() => updateField('targetSeniority', form.targetSeniority === value ? '' : value)} className={`rounded-xl border p-3 text-left transition-colors ${form.targetSeniority === value ? 'border-[#243B64] bg-[#EEF2F6] ring-1 ring-[#243B64]' : 'border-[#D8DEE8] bg-[#F7F8FA] hover:border-[#5276A7]'}`}><strong className="block text-sm text-[#243B64]">{label}</strong><span className="mt-1 block text-xs leading-5 text-[#77849A]">{description}</span></button>)}</div></fieldset>
            <label className="mt-8 block text-sm font-semibold">Kariyer vizyonu ve beklentiler<textarea className={`${fieldClass} min-h-32 resize-y`} value={form.careerNotes} maxLength={2000} placeholder="Kariyerinde neyi başarmak istiyorsun?" onChange={(event) => updateField('careerNotes', event.target.value)} /><span className="mt-1 block text-right text-xs font-normal text-[#98A2B3]">{form.careerNotes.length}/2000</span></label>
            <div className="mt-8 flex justify-end border-t border-[#E3E7ED] pt-6"><Button type="submit" isLoading={saving} size="lg" className="gap-2"><Save size={18} />Hedeflerimi kaydet</Button></div>
          </form>
          <aside className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm lg:sticky lg:top-6"><h2 className="flex items-center gap-2 border-b border-[#E3E7ED] pb-5 text-lg font-bold text-[#243B64]"><Sparkles size={20} className="text-[#2F8F83]" />Canlı Hedef Özeti</h2><dl><SummaryItem label="Hedef pozisyon">{form.targetTitle}</SummaryItem><SummaryItem label="Sektör">{form.targetIndustry}</SummaryItem><SummaryItem label="Çalışma şekli">{selectedModels}</SummaryItem><SummaryItem label="Tercih edilen konum">{form.preferredLocationsText}</SummaryItem><SummaryItem label="Hedef kıdem">{selectedLevel}</SummaryItem><SummaryItem label="Kariyer vizyonu">{form.careerNotes}</SummaryItem></dl><p className="mt-5 rounded-xl border border-[#C9E4DE] bg-[#EBF5F4] p-4 text-xs leading-6 text-[#27796F]">Özet, formdaki değişiklikleri anında gösterir. Kaydet düğmesiyle hedeflerini güncellersin.</p></aside>
        </div>}
        <button type="button" onClick={onProfile} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#5276A7] hover:text-[#243B64]"><ArrowLeft size={17} />Kariyer profiline dön</button>
      </main>
    </div>
  );
}
