import { useState } from 'react';
import { LoginScreen } from './features/auth/components/LoginScreen.jsx';
import { RegisterScreen } from './features/auth/components/RegisterScreen.jsx';
import { useAuthentication } from './features/auth/hooks/useAuthentication.js';
import { WelcomeDashboard } from './features/dashboard/components/WelcomeDashboard.jsx';
import { PersonalProfileScreen } from './features/profile/components/PersonalProfileScreen.jsx';
import { ProfileOverviewScreen } from './features/profile/components/ProfileOverviewScreen.jsx';
import { CareerGoalsScreen } from './features/profile/components/CareerGoalsScreen.jsx';
import { ProfileRecordsScreen } from './features/profile/components/ProfileRecordsScreen.jsx';

export default function App() {
  const { session, ready, login, register, logout, runAuthenticated } = useAuthentication();
  const [screen, setScreen] = useState('login');
  const [isEmployer, setIsEmployer] = useState(false);
  const [notice, setNotice] = useState('');
  const [signedInScreen, setSignedInScreen] = useState('dashboard');

  async function handleRegister(details) {
    const result = await register(details);
    if (result.emailConfirmationRequired || !result.session) {
      setNotice('Hesabın oluşturuldu. E-postandaki doğrulama bağlantısını açtıktan sonra giriş yap.');
      setScreen('login');
    }
  }

  function handleNavigate(nextScreen) {
    setNotice('');
    setScreen(nextScreen);
  }

  if (!ready) {
    return <p className="p-8">Oturum kontrol ediliyor...</p>;
  }

  if (session) {
    if (signedInScreen === 'profile-edit' || signedInScreen === 'profile-edit-goals') {
      const fromGoals = signedInScreen === 'profile-edit-goals';
      return <PersonalProfileScreen runAuthenticated={runAuthenticated} focusGoals={fromGoals} onBack={() => setSignedInScreen(fromGoals ? 'career-goals' : 'profile-overview')} onLogout={logout} />;
    }

    if (signedInScreen === 'career-goals') {
      return <CareerGoalsScreen runAuthenticated={runAuthenticated} onHome={() => setSignedInScreen('dashboard')} onProfile={() => setSignedInScreen('profile-overview')} onEdit={() => setSignedInScreen('profile-edit-goals')} onLogout={logout} />;
    }

    if (signedInScreen.startsWith('records-')) {
      return <ProfileRecordsScreen kind={signedInScreen.slice('records-'.length)} runAuthenticated={runAuthenticated} onBack={() => setSignedInScreen('profile-overview')} />;
    }

    if (signedInScreen === 'profile-overview') {
      return <ProfileOverviewScreen runAuthenticated={runAuthenticated} onHome={() => setSignedInScreen('dashboard')} onEdit={() => setSignedInScreen('profile-edit')} onOpenGoals={() => setSignedInScreen('career-goals')} onOpenRecords={(kind) => setSignedInScreen(`records-${kind}`)} onLogout={logout} />;
    }

    return <WelcomeDashboard user={session.user} onOpenProfile={() => setSignedInScreen('profile-overview')} onOpenGoals={() => setSignedInScreen('career-goals')} onLogout={logout} />;
  }

  if (screen === 'register') {
    return <RegisterScreen onNavigate={handleNavigate} onRegister={handleRegister} isEmployer={isEmployer} onToggleEmployer={() => setIsEmployer((value) => !value)} />;
  }

  return <LoginScreen onNavigate={handleNavigate} onLogin={login} isEmployer={isEmployer} onToggleEmployer={() => setIsEmployer((value) => !value)} notice={notice} />;
}
