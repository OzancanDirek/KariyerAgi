import { useState } from 'react';
import { AuthFrame } from '../../../shared/ui/AuthFrame.jsx';
import { FormInput } from '../../../shared/ui/FormInput.jsx';
import { authenticationApi } from '../api/authenticationApi.js';

export function PasswordResetScreen({ recoveryToken, onBack, onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (recoveryToken && (password.length < 6 || password !== confirmation)) {
      setError('Şifre en az 6 karakter olmalı ve iki alan aynı olmalıdır.');
      return;
    }
    setWorking(true);
    try {
      if (recoveryToken) {
        await authenticationApi.updatePassword(recoveryToken, password);
        onDone();
      } else {
        await authenticationApi.requestPasswordReset(email.trim());
        setMessage('Bu e-posta için bir hesap varsa şifre yenileme bağlantısı gönderildi. Gelen kutunu kontrol et.');
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setWorking(false);
    }
  }

  return <AuthFrame isEmployer={false} heading={recoveryToken ? 'Yeni şifre oluştur' : 'Şifreni yenile'} supportingText={recoveryToken ? 'Hesabın için yeni bir şifre belirle.' : 'Hesabının e-posta adresine yenileme bağlantısı göndereceğiz.'} brandHeading="Kariyer yolculuğuna devam et." brandText="Hesabına güvenle yeniden eriş." footer={<button type="button" onClick={onBack} className="font-semibold text-[#243B64] hover:underline">Giriş ekranına dön</button>}>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    <form onSubmit={submit} className="space-y-4">
      {recoveryToken ? <><FormInput label="Yeni şifre" id="reset-password" isPassword required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /><FormInput label="Yeni şifre tekrar" id="reset-password-repeat" isPassword required autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></> : <FormInput label="E-posta adresi" id="reset-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />}
      <button type="submit" disabled={working} className="w-full rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white disabled:opacity-50">{working ? 'İşleniyor…' : recoveryToken ? 'Şifreyi kaydet' : 'Yenileme bağlantısı gönder'}</button>
    </form>
  </AuthFrame>;
}
