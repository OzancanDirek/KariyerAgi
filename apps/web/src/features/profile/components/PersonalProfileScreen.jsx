import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, LogOut, UserRound } from 'lucide-react';
import { profileApi } from '../api/profileApi.js';
import { careerProfileApi } from '../api/careerProfileApi.js';
import { CareerProfileFields, careerToForm, careerToPayload, initialCareerForm } from './CareerProfileFields.jsx';
import { fieldClass } from './profileFormStyles.js';
import { Logo } from '../../../shared/ui/Logo.jsx';
import { Button } from '../../../shared/ui/Button.jsx';

const emptyForm = { firstName: '', lastName: '', phone: '', location: '', photoUrl: '' };

function toForm(profile) {
  return {
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    location: profile.location || '',
    photoUrl: profile.photoUrl || '',
  };
}

function PersonalFields({ profile, form, updateField }) {
  return (
    <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm md:p-9 space-y-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">Ad <span className="text-[#B42318]">*</span><input className={fieldClass} value={form.firstName} maxLength={100} required autoComplete="given-name" onChange={(event) => updateField('firstName', event.target.value)} /></label>
          <label className="block text-sm font-medium">Soyad <span className="text-[#B42318]">*</span><input className={fieldClass} value={form.lastName} maxLength={100} required autoComplete="family-name" onChange={(event) => updateField('lastName', event.target.value)} /></label>
        </div>
        <label className="block text-sm font-medium">E-posta adresi<input className={`${fieldClass} bg-[#F7F8FA] text-[#667085]`} value={profile.email || ''} readOnly aria-readonly="true" /><span className="mt-2 block text-xs font-normal text-[#98A2B3]">E-posta adresin giriş hesabına bağlıdır.</span></label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">Telefon<input className={fieldClass} value={form.phone} maxLength={30} autoComplete="tel" placeholder="+90 5xx xxx xx xx" onChange={(event) => updateField('phone', event.target.value)} /></label>
          <label className="block text-sm font-medium">Konum<input className={fieldClass} value={form.location} maxLength={150} autoComplete="address-level2" placeholder="İstanbul, Türkiye" onChange={(event) => updateField('location', event.target.value)} /></label>
        </div>
        <label className="block text-sm font-medium">Profil fotoğrafı bağlantısı<input className={fieldClass} value={form.photoUrl} type="url" placeholder="https://..." onChange={(event) => updateField('photoUrl', event.target.value)} /><span className="mt-2 block text-xs font-normal text-[#98A2B3]">Şimdilik HTTPS görsel bağlantısı kullanabilirsin. Dosya yüklemeyi daha sonra ekleyeceğiz.</span></label>
    </section>
  );
}

export function PersonalProfileScreen({ runAuthenticated, onBack, onLogout }) {
  const [personal, setPersonal] = useState(null);
  const [career, setCareer] = useState(null);
  const [personalForm, setPersonalForm] = useState(emptyForm);
  const [careerForm, setCareerForm] = useState(initialCareerForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const person = await runAuthenticated(profileApi.getProfile);
        const candidate = await runAuthenticated(careerProfileApi.getCareerProfile);
        if (active) {
          setPersonal(person);
          setCareer(candidate);
          setPersonalForm(toForm(person));
          setCareerForm(careerToForm(candidate));
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
    load();
    return () => { active = false; };
  }, []);

  function updatePersonal(field, value) {
    setPersonalForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function updateCareer(field, value) {
    setCareerForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    let personalSaved = false;
    try {
      const updatedPerson = await runAuthenticated((token) => profileApi.updateProfile(token, personalForm));
      personalSaved = true;
      setPersonal(updatedPerson);
      const updatedCareer = await runAuthenticated((token) => careerProfileApi.updateCareerProfile(token, careerToPayload(careerForm)));
      setCareer(updatedCareer);
      setPersonalForm(toForm(updatedPerson));
      setCareerForm(careerToForm(updatedCareer));
      setSaved(true);
    } catch (failure) {
      setError(personalSaved
        ? `Kişisel bilgiler kaydedildi; kariyer bilgileri kaydedilemedi: ${failure.message} Tekrar kaydetmeyi deneyin.`
        : failure.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202938]">
      <header className="border-b border-[#E3E7ED] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Logo size="md" />
          <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-[#E3E7ED] px-4 py-2 text-sm font-medium text-[#243B64] hover:bg-[#F7F8FA]"><LogOut size={16} />Çıkış yap</button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10 md:py-16">
        <button type="button" onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#5276A7] hover:text-[#243B64]"><ArrowLeft size={17} />Geri dön</button>
        <div className="mb-9 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E8F2F0] text-[#2F8F83]"><UserRound size={26} /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F8F83]">Hesap · Profil</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#243B64]">Profilim</h1>
            <p className="mt-2 text-sm leading-6 text-[#667085]">Kişisel ve genel kariyer bilgilerini buradan güncelleyebilirsin. Hedeflerin için Kariyer Hedeflerim ekranını kullan.</p>
          </div>
        </div>
        {loading && <p role="status" className="rounded-2xl bg-white p-6 text-sm text-[#667085]">Profil bilgilerin yükleniyor...</p>}
        {error && <p role="alert" className="mb-6 rounded-xl border border-[#EFCACA] bg-[#FFF5F5] px-4 py-3 text-sm text-[#B42318]">{error}</p>}
        {saved && <p role="status" className="mb-6 flex items-center gap-2 rounded-xl border border-[#BCE0D9] bg-[#EBF5F4] px-4 py-3 text-sm text-[#27796F]"><CheckCircle2 size={17} />Profilin kaydedildi.</p>}
        {personal && career && <form onSubmit={save} className="space-y-8">
          <div><h2 className="mb-4 text-lg font-semibold text-[#243B64]">Kişisel bilgiler</h2><PersonalFields profile={personal} form={personalForm} updateField={updatePersonal} /></div>
          <div><h2 className="mb-4 text-lg font-semibold text-[#243B64]">Kariyer bilgileri</h2><CareerProfileFields form={careerForm} updateField={updateCareer} /></div>
          <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="secondary" onClick={onBack}>Vazgeç</Button><Button type="submit" isLoading={saving}>Profili kaydet</Button></div>
        </form>}
      </main>
    </div>
  );
}
