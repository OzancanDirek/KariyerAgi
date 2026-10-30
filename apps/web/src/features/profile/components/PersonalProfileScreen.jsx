import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Trash2, Upload, UserRound } from 'lucide-react';
import { profileApi } from '../api/profileApi.js';
import { careerProfileApi } from '../api/careerProfileApi.js';
import { CareerProfileFields, careerToForm, careerToPayload, initialCareerForm } from './CareerProfileFields.jsx';
import { fieldClass } from './profileFormStyles.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { useProfilePhoto } from '../hooks/useProfilePhoto.js';

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

function PersonalFields({ profile, form, updateField, photoSource, selectedPhoto, selectPhoto, photoInput, uploadPhoto, deletePhoto, uploadingPhoto }) {
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
        <div className="rounded-xl border border-[#E3E7ED] bg-[#F8FAFC] p-5">
          <h3 className="text-sm font-semibold text-[#243B64]">Profil fotoğrafı</h3>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#243B64] text-white">
              {photoSource ? <img src={photoSource} alt="Profil fotoğrafı önizlemesi" className="h-full w-full object-cover" /> : <UserRound size={30} />}
            </div>
            <div className="min-w-0 flex-1">
              <input ref={photoInput} aria-label="Profil fotoğrafı seç" type="file" accept="image/jpeg,image/png" onChange={(event) => selectPhoto(event.target.files?.[0] || null)} className="block w-full max-w-sm text-sm text-[#52627A] file:mr-3 file:rounded-lg file:border-0 file:bg-[#E8EEF6] file:px-3 file:py-2 file:font-semibold file:text-[#243B64]" />
              <p className="mt-2 text-xs text-[#77849A]">JPG veya PNG · en fazla 3 MB</p>
              {selectedPhoto && <p className="mt-1 truncate text-sm font-medium text-[#243B64]">Seçilen: {selectedPhoto.name}</p>}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={uploadPhoto} disabled={!selectedPhoto || uploadingPhoto}><Upload size={16} />{uploadingPhoto ? 'Yükleniyor...' : 'Fotoğrafı yükle'}</Button>
            {(profile.hasUploadedPhoto || profile.photoUrl) && <Button type="button" variant="secondary" onClick={deletePhoto} disabled={uploadingPhoto}><Trash2 size={16} />Fotoğrafı kaldır</Button>}
          </div>
        </div>
    </section>
  );
}

export function PersonalProfileScreen({ runAuthenticated, onBack }) {
  const [personal, setPersonal] = useState(null);
  const [career, setCareer] = useState(null);
  const [personalForm, setPersonalForm] = useState(emptyForm);
  const [careerForm, setCareerForm] = useState(initialCareerForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInput = useRef(null);
  const photoSource = useProfilePhoto(personal, runAuthenticated, selectedPhoto);

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

  async function uploadPhoto() {
    if (!selectedPhoto) {
      return;
    }
    setError('');
    setUploadingPhoto(true);
    try {
      const updated = await runAuthenticated((token) => profileApi.uploadPhoto(token, selectedPhoto));
      setPersonal({ ...updated, photoVersion: Date.now() });
      setPersonalForm(toForm(updated));
      setSelectedPhoto(null);
      if (photoInput.current) {
        photoInput.current.value = '';
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function deletePhoto() {
    setError('');
    setUploadingPhoto(true);
    try {
      const updated = await runAuthenticated(profileApi.deletePhoto);
      setPersonal(updated);
      setPersonalForm(toForm(updated));
      setSelectedPhoto(null);
      if (photoInput.current) {
        photoInput.current.value = '';
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setUploadingPhoto(false);
    }
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
    <div className="text-[#202938]">
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
          <div><h2 className="mb-4 text-lg font-semibold text-[#243B64]">Kişisel bilgiler</h2><PersonalFields profile={personal} form={personalForm} updateField={updatePersonal} photoSource={photoSource} selectedPhoto={selectedPhoto} selectPhoto={setSelectedPhoto} photoInput={photoInput} uploadPhoto={uploadPhoto} deletePhoto={deletePhoto} uploadingPhoto={uploadingPhoto} /></div>
          <div><h2 className="mb-4 text-lg font-semibold text-[#243B64]">Kariyer bilgileri</h2><CareerProfileFields form={careerForm} updateField={updateCareer} /></div>
          {selectedPhoto && <p className="text-right text-sm text-[#667085]">Profili kaydetmeden önce seçtiğin fotoğrafı yükle.</p>}
          <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="secondary" onClick={onBack}>Vazgeç</Button><Button type="submit" isLoading={saving} disabled={Boolean(selectedPhoto) || uploadingPhoto}>Profili kaydet</Button></div>
        </form>}
      </main>
    </div>
  );
}
