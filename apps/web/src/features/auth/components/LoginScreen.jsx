import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { AuthFrame } from '../../../shared/ui/AuthFrame.jsx';
import { FormInput } from '../../../shared/ui/FormInput.jsx';
import { Button } from '../../../shared/ui/Button.jsx';

export function LoginScreen({ onNavigate, onLogin, isEmployer, onToggleEmployer, notice }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'E-posta adresi gereklidir.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Geçerli bir e-posta adresi girin.';
    }

    if (!password) {
      nextErrors.password = 'Şifre gereklidir.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await onLogin({ email: email.trim(), password }, rememberMe);
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
      switchLabel={isEmployer ? 'Aday Girişi' : 'Kurumsal Giriş'}
      heading={isEmployer ? 'Kurumsal Giriş' : 'Tekrar hoş geldin'}
      supportingText={isEmployer ? 'Şirket hesabına giriş yaparak ilanlarını yönet.' : 'Hesabına giriş yaparak kariyer yolculuğuna devam et.'}
      brandHeading={isEmployer ? 'Aradığınız yeteneklere en doğru adımlarla ulaşın.' : 'Kariyer yolculuğuna kaldığın yerden devam et.'}
      brandText={isEmployer ? 'Açık pozisyonlarınıza uygun becerilere sahip adayları keşfedin.' : 'Becerilerini keşfet, gelişimini takip et ve hedeflerine uygun fırsatlara ulaş.'}
      footer={<>Hesabın yok mu?{' '}<button type="button" onClick={() => onNavigate('register')} className="font-semibold text-[#243B64] underline-offset-4 hover:underline">Kayıt ol</button></>}
    >

            {notice && <p role="status" className="mb-4 rounded-lg border border-[#2F8F83]/30 bg-[#EBF5F4] p-3 text-sm text-[#27796F]">{notice}</p>}
            {errors.general && <p role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-[#C74747]/30 bg-[#FDF2F2] p-3 text-sm text-[#C74747]"><AlertCircle size={16} />{errors.general}</p>}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <FormInput label={isEmployer ? 'Şirket e-posta adresi' : 'E-posta adresi'} id="login-email" type="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined, general: undefined })); }} error={errors.email} placeholder="ornek@universite.edu.tr" />
              <FormInput label="Şifre" id="login-password" isPassword autoComplete="current-password" required value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined, general: undefined })); }} error={errors.password} placeholder="••••••••" />
              <label className="flex items-center gap-2 text-xs text-[#202938]">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 accent-[#243B64]" />
                Beni hatırla
              </label>
              <Button type="submit" variant="primary" isLoading={isLoading} className="auth-submit mt-2 w-full">{isEmployer ? 'Kurumsal Giriş Yap' : 'Giriş Yap'}</Button>
            </form>
    </AuthFrame>
  );
}
