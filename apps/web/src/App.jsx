import { useState } from 'react';
import { LoginScreen } from './features/auth/components/LoginScreen.jsx';
import { RegisterScreen } from './features/auth/components/RegisterScreen.jsx';
import { useAuthentication } from './features/auth/hooks/useAuthentication.js';
import { WelcomeDashboard } from './features/dashboard/components/WelcomeDashboard.jsx';
import { PersonalProfileScreen } from './features/profile/components/PersonalProfileScreen.jsx';
import { ProfileOverviewScreen } from './features/profile/components/ProfileOverviewScreen.jsx';
import { CareerGoalsScreen } from './features/profile/components/CareerGoalsScreen.jsx';
import { ProfileRecordsScreen } from './features/profile/components/ProfileRecordsScreen.jsx';
import { AuthenticatedLayout } from './shared/ui/AuthenticatedLayout.jsx';

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
    let page;
    if (signedInScreen === 'profile-edit') {
      page = <PersonalProfileScreen runAuthenticated={runAuthenticated} onBack={() => setSignedInScreen('profile-overview')} />;
    } else if (signedInScreen === 'career-goals') {
      page = <CareerGoalsScreen runAuthenticated={runAuthenticated} onHome={() => setSignedInScreen('dashboard')} onProfile={() => setSignedInScreen('profile-overview')} />;
    } else if (signedInScreen.startsWith('records-')) {
      page = <ProfileRecordsScreen kind={signedInScreen.slice('records-'.length)} runAuthenticated={runAuthenticated} onBack={() => setSignedInScreen('profile-overview')} />;
    } else if (signedInScreen === 'profile-overview') {
      page = <ProfileOverviewScreen runAuthenticated={runAuthenticated} onEdit={() => setSignedInScreen('profile-edit')} onOpenGoals={() => setSignedInScreen('career-goals')} onOpenRecords={(kind) => setSignedInScreen(`records-${kind}`)} />;
    } else {
      page = <WelcomeDashboard user={session.user} onOpenProfile={() => setSignedInScreen('profile-overview')} onOpenGoals={() => setSignedInScreen('career-goals')} />;
    }

    return <AuthenticatedLayout screen={signedInScreen} onNavigate={setSignedInScreen} onLogout={logout}>{page}</AuthenticatedLayout>;
  }

  if (screen === 'register') {
    return <RegisterScreen onNavigate={handleNavigate} onRegister={handleRegister} isEmployer={isEmployer} onToggleEmployer={() => setIsEmployer((value) => !value)} />;
  }

  return <LoginScreen onNavigate={handleNavigate} onLogin={login} isEmployer={isEmployer} onToggleEmployer={() => setIsEmployer((value) => !value)} notice={notice} />;
}
