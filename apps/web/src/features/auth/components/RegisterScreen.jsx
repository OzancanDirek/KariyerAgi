import { useState } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import { AuthFrame } from '../../../shared/ui/AuthFrame.jsx';
import { FormInput } from '../../../shared/ui/FormInput.jsx';
import { Button } from '../../../shared/ui/Button.jsx';

export function RegisterScreen({ onNavigate, onRegister, isEmployer, onToggleEmployer }) {
  const [form, setForm] = useState({ ad: '', soyad: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const hasMinLength = form.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, general: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!form.ad.trim()) {
      nextErrors.ad = 'Ad gereklidir.';
    }

    if (!form.soyad.trim()) {
      nextErrors.soyad = 'Soyad gereklidir.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Geçerli bir e-posta adresi girin.';
    }

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      nextErrors.password = 'Şifre gereksinimlerini karşılamalıdır.';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Şifre tekrarı gereklidir.';
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Şifreler eşleşmiyor.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await onRegister({
        ad: form.ad.trim(),
        soyad: form.soyad.trim(),
        email: form.email.trim(),
        password: form.password,
        rol: isEmployer ? 'isveren' : 'aday',
      });
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFrame
      isEmployer={isEmployer}
      onToggleEmployer={onToggleEmployer}
      switchLabel={isEmployer ? 'Aday Kaydı' : 'Kurumsal Kayıt'}
      heading={isEmployer ? 'İşveren Hesabı Oluştur' : 'Kariyerine ilk adımını at'}
      supportingText={isEmployer ? 'Kurumsal hesabını oluşturarak adayları keşfet.' : 'Kariyer profilini oluştur ve fırsatları takip etmeye başla.'}
      brandHeading={isEmployer ? 'Kurumsal yetenek havuzunuzu yapay zeka ile güçlendirin.' : 'Geleceğin kariyerini bugünden şekillendir.'}
      brandText={isEmployer ? 'İlanlarınız için en uygun adaylarla eşleşin.' : 'Becerilerini haritalandır, gelişim alanlarını gör ve kariyer yolunu belirle.'}
      footer={<>Zaten hesabın var mı?{' '}<button type="button" onClick={() => onNavigate('login')} className="font-semibold text-[#243B64] underline-offset-4 hover:underline">Giriş yap</button></>}
    >
            {errors.general && <p role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-[#C74747]/30 bg-[#FDF2F2] p-3 text-sm text-[#C74747]"><AlertCircle size={16} />{errors.general}</p>}

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormInput label="Ad" id="register-ad" required autoComplete="given-name" value={form.ad} onChange={(event) => updateField('ad', event.target.value)} error={errors.ad} placeholder="Ahmet" />
                <FormInput label="Soyad" id="register-soyad" required autoComplete="family-name" value={form.soyad} onChange={(event) => updateField('soyad', event.target.value)} error={errors.soyad} placeholder="Yılmaz" />
              </div>
              <FormInput label={isEmployer ? 'Kurumsal e-posta adresi' : 'E-posta adresi'} id="register-email" type="email" required autoComplete="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} error={errors.email} placeholder="ornek@universite.edu.tr" />
              <FormInput label="Şifre" id="register-password" isPassword required autoComplete="new-password" value={form.password} onChange={(event) => updateField('password', event.target.value)} error={errors.password} placeholder="••••••••" />

              {form.password && <div className="space-y-1 rounded-lg border border-[#E3E7ED] bg-[#F7F8FA] p-2.5 text-xs text-[#667085]">
                <p className="font-medium text-[#202938]">Şifre gereksinimleri</p>
                {[[hasMinLength, 'En az 8 karakter'], [hasUppercase, 'En az bir büyük harf'], [hasNumber, 'En az bir rakam']].map(([valid, label]) => <p key={label} className="flex items-center gap-1.5">{valid ? <Check size={14} className="text-[#2F8F83]" /> : <X size={14} />}{label}</p>)}
              </div>}

              <FormInput label="Şifreyi tekrar gir" id="register-confirm" isPassword required autoComplete="new-password" value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} error={errors.confirmPassword} placeholder="••••••••" />
              <Button type="submit" variant="primary" isLoading={isLoading} className="auth-submit mt-2 w-full">{isEmployer ? 'Kurumsal Hesap Oluştur' : 'Hesap Oluştur'}</Button>
            </form>
    </AuthFrame>
  );
}
