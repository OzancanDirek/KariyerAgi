import { useEffect, useState } from 'react';
import { LoginScreen } from './features/auth/components/LoginScreen.jsx';
import { RegisterScreen } from './features/auth/components/RegisterScreen.jsx';
import { useAuthentication } from './features/auth/hooks/useAuthentication.js';
import { WelcomeDashboard } from './features/dashboard/components/WelcomeDashboard.jsx';
import { PersonalProfileScreen } from './features/profile/components/PersonalProfileScreen.jsx';
import { ProfileOverviewScreen } from './features/profile/components/ProfileOverviewScreen.jsx';
import { CareerGoalsScreen } from './features/profile/components/CareerGoalsScreen.jsx';
import { ProfileRecordsScreen } from './features/profile/components/ProfileRecordsScreen.jsx';
import { CvAnalysisScreen } from './features/cv/components/CvAnalysisScreen.jsx';
import { CvBuilderScreen } from './features/cv/builder/CvBuilderScreen.jsx';
import { AuthenticatedLayout } from './shared/ui/AuthenticatedLayout.jsx';
import { SkillMapScreen } from './features/skills/SkillMapScreen.jsx';
import { RoadmapScreen } from './features/roadmap/RoadmapScreen.jsx';
import { LearningResourcesScreen } from './features/resources/LearningResourcesScreen.jsx';
import { CompanyWorkspace } from './features/marketplace/CompanyWorkspace.jsx';
import { CompanyReviewScreen } from './features/marketplace/CompanyReviewScreen.jsx';
import { EmployerJobsScreen } from './features/marketplace/EmployerJobsScreen.jsx';
import { CandidateJobsScreen } from './features/marketplace/CandidateJobsScreen.jsx';

const signedInScreens = new Set([
  'dashboard', 'profile-overview', 'profile-edit', 'career-goals',
  'cv-analysis', 'cv-builder', 'skill-map', 'roadmap', 'learning-resources', 'records-experiences',
  'records-educations', 'records-projects', 'records-cv', 'records-certificates', 'company', 'employer-jobs', 'company-review', 'candidate-jobs'
]);

function screenFromUrl() {
  const screen = decodeURIComponent(window.location.hash.replace(/^#\/?/, '').split('?')[0]);
  return signedInScreens.has(screen) ? screen : 'dashboard';
}

export default function App() {
  const { session, ready, login, register, logout, runAuthenticated } = useAuthentication();
  const [screen, setScreen] = useState('login');
  const [isEmployer, setIsEmployer] = useState(false);
  const [notice, setNotice] = useState('');
  const [signedInScreen, setSignedInScreen] = useState(screenFromUrl);

  useEffect(() => {
    function syncScreen() {
      setSignedInScreen(screenFromUrl());
    }

    window.addEventListener('hashchange', syncScreen);
    return () => window.removeEventListener('hashchange', syncScreen);
  }, []);

  function navigateSignedIn(nextScreen) {
    if (!signedInScreens.has(nextScreen)) {
      return;
    }

    window.location.hash = `/${nextScreen}`;
    setSignedInScreen(nextScreen);
  }

  async function handleLogout() {
    await logout();
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setSignedInScreen('dashboard');
  }

  async function handleRegister(details) {
    const result = await register(details);
    if (result.emailConfirmationRequired || !result.session) {
      setNotice(details.rol === 'isveren'
        ? 'İşveren hesabın oluşturuldu. Önce e-postandaki doğrulama bağlantısını aç, ardından kurumsal giriş yap. Şirket bilgileri formu girişten sonra açılacak.'
        : 'Hesabın oluşturuldu. E-postandaki doğrulama bağlantısını açtıktan sonra giriş yap.');
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
    const role = session.user?.role;
    const activeScreen = role === 'isveren'
      ? signedInScreen === 'employer-jobs' ? 'employer-jobs' : 'company'
      : role === 'yonetici' ? 'company-review' : signedInScreen;
    if (role === 'isveren') {
      page = activeScreen === 'employer-jobs'
        ? <EmployerJobsScreen runAuthenticated={runAuthenticated} />
        : <CompanyWorkspace runAuthenticated={runAuthenticated} />;
    } else if (role === 'yonetici') {
      page = <CompanyReviewScreen runAuthenticated={runAuthenticated} />;
    } else if (signedInScreen === 'profile-edit') {
      page = <PersonalProfileScreen runAuthenticated={runAuthenticated} onBack={() => navigateSignedIn('profile-overview')} />;
    } else if (signedInScreen === 'career-goals') {
      page = <CareerGoalsScreen runAuthenticated={runAuthenticated} onHome={() => navigateSignedIn('dashboard')} onProfile={() => navigateSignedIn('profile-overview')} />;
    } else if (signedInScreen.startsWith('records-')) {
      page = <ProfileRecordsScreen kind={signedInScreen.slice('records-'.length)} runAuthenticated={runAuthenticated} onBack={() => navigateSignedIn('profile-overview')} />;
    } else if (signedInScreen === 'cv-analysis') {
      page = <CvAnalysisScreen runAuthenticated={runAuthenticated} onOpenCvs={() => navigateSignedIn('records-cv')} />;
    } else if (signedInScreen === 'cv-builder') {
      page = <CvBuilderScreen runAuthenticated={runAuthenticated} onBack={() => navigateSignedIn('profile-overview')} />;
    } else if (signedInScreen === 'skill-map') {
      page = <SkillMapScreen runAuthenticated={runAuthenticated} />;
    } else if (signedInScreen === 'roadmap') {
      page = <RoadmapScreen runAuthenticated={runAuthenticated} onOpenSkills={() => navigateSignedIn('skill-map')} onOpenGoals={() => navigateSignedIn('career-goals')} onOpenResources={() => navigateSignedIn('learning-resources')} />;
    } else if (signedInScreen === 'learning-resources') {
      page = <LearningResourcesScreen runAuthenticated={runAuthenticated} onOpenRoadmap={() => navigateSignedIn('roadmap')} />;
    } else if (signedInScreen === 'candidate-jobs') {
      page = <CandidateJobsScreen runAuthenticated={runAuthenticated} onOpenCvs={() => navigateSignedIn('records-cv')} />;
    } else if (signedInScreen === 'profile-overview') {
      page = <ProfileOverviewScreen runAuthenticated={runAuthenticated} onEdit={() => navigateSignedIn('profile-edit')} onOpenGoals={() => navigateSignedIn('career-goals')} onOpenRecords={(kind) => navigateSignedIn(`records-${kind}`)} />;
    } else {
      page = <WelcomeDashboard user={session.user} onOpenProfile={() => navigateSignedIn('profile-overview')} onOpenGoals={() => navigateSignedIn('career-goals')} />;
    }

    return <AuthenticatedLayout screen={activeScreen} role={role} user={session.user} onNavigate={navigateSignedIn} onLogout={handleLogout}>{page}</AuthenticatedLayout>;
  }

  if (screen === 'register') {
    return <RegisterScreen onNavigate={handleNavigate} onRegister={handleRegister} isEmployer={isEmployer} onToggleEmployer={() => setIsEmployer((value) => !value)} />;
  }

  return <LoginScreen onNavigate={handleNavigate} onLogin={login} notice={notice} />;
}
