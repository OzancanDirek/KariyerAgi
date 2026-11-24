import i18n from './i18n.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginScreen } from './features/auth/components/LoginScreen.jsx';
import { PasswordResetScreen } from './features/auth/components/PasswordResetScreen.jsx';
import { takePasswordRecoveryToken } from './features/auth/authRedirect.js';
import { RegisterScreen } from './features/auth/components/RegisterScreen.jsx';
import { useAuthentication } from './features/auth/hooks/useAuthentication.js';
import { CandidateStartScreen } from './features/onboarding/CandidateStartScreen.jsx';
import { WelcomeDashboard } from './features/dashboard/components/WelcomeDashboard.jsx';
import { careerProfileApi } from './features/profile/api/careerProfileApi.js';
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
import { ResourceManagementScreen } from './features/resources/ResourceManagementScreen.jsx';
import { CompanyWorkspace } from './features/marketplace/CompanyWorkspace.jsx';
import { CompanyReviewScreen } from './features/marketplace/CompanyReviewScreen.jsx';
import { EmployerJobsScreen } from './features/marketplace/EmployerJobsScreen.jsx';
import { EmployerCandidatesScreen } from './features/marketplace/EmployerCandidatesScreen.jsx';
import { CandidateJobsScreen } from './features/marketplace/CandidateJobsScreen.jsx';
import { InterviewPracticeScreen } from './features/interview/InterviewPracticeScreen.jsx';

const signedInScreens = new Set([
  'dashboard', 'profile-overview', 'profile-edit', 'career-goals',
  'cv-analysis', 'cv-builder', 'skill-map', 'roadmap', 'learning-resources', 'resource-management', 'records-experiences',
  'records-educations', 'records-projects', 'records-cv', 'records-certificates', 'company', 'employer-jobs', 'employer-candidates', 'company-review', 'candidate-jobs', 'interview-practice'
]);

function screenFromUrl() {
  const screen = decodeURIComponent(window.location.hash.replace(/^#\/?/, '').split('?')[0]);
  return signedInScreens.has(screen) ? screen : 'dashboard';
}

export default function App() {
  useTranslation();
  const [recoveryToken, setRecoveryToken] = useState(takePasswordRecoveryToken);
  const { session, ready, login, register, logout, runAuthenticated } = useAuthentication();
  const [screen, setScreen] = useState('login');
  const [isEmployer, setIsEmployer] = useState(false);
  const [notice, setNotice] = useState('');
  const [signedInScreen, setSignedInScreen] = useState(screenFromUrl);
  const [selectedRoleId, setSelectedRoleId] = useState(() => window.sessionStorage.getItem('careerpath:selectedRoleId') || null);
  const [setupStatus, setSetupStatus] = useState(null);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;
    const storedUserId = window.sessionStorage.getItem('careerpath:selectedRoleUserId');
    if (storedUserId && storedUserId !== userId) {
      setSelectedRoleId(null);
      window.sessionStorage.removeItem('careerpath:selectedRoleId');
    }
    window.sessionStorage.setItem('careerpath:selectedRoleUserId', userId);
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.role !== 'aday' || !session.user.id) { return; }
    let active = true;
    runAuthenticated(careerProfileApi.getCareerProfile).then((profile) => {
      if (active) { setSetupStatus({ userId: session.user.id, completed: profile.initialSetupCompleted }); }
    }).catch(() => {
      if (active) { setSetupStatus({ userId: session.user.id, error: true }); }
    });
    return () => { active = false; };
  }, [session?.user?.id, session?.user?.role, runAuthenticated]);

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

  function selectRole(roleId) {
    setSelectedRoleId(roleId);
    if (roleId) {
      window.sessionStorage.setItem('careerpath:selectedRoleId', roleId);
      if (session?.user?.id) window.sessionStorage.setItem('careerpath:selectedRoleUserId', session.user.id);
    } else {
      window.sessionStorage.removeItem('careerpath:selectedRoleId');
    }
  }

  async function handleLogout() {
    await logout();
    selectRole(null);
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
    return <p className="p-8">{i18n.t("Oturum kontrol ediliyor...")}</p>;
  }

  if (recoveryToken) {
    return <PasswordResetScreen recoveryToken={recoveryToken} onBack={() => { setRecoveryToken(null); setScreen('login'); }} onDone={async () => { await logout(); setRecoveryToken(null); setNotice(i18n.t("Şifren güncellendi. Yeni şifrenle giriş yapabilirsin.")); setScreen('login'); }} />;
  }

  if (session) {
    let page;
    const role = session.user?.role;
    if (role === 'aday' && signedInScreen === 'dashboard') {
      if (setupStatus?.userId !== session.user.id) {
        return <p className="p-8">{i18n.t("Başlangıç ekranı yükleniyor...")}</p>;
      }
      if (setupStatus.error) {
        return <main className="p-8"><p>{i18n.t("Başlangıç bilgileri yüklenemedi.")}</p><button type="button" onClick={() => window.location.reload()} className="mt-3 underline">{i18n.t('Tekrar dene')}</button></main>;
      }
      if (!setupStatus.completed) {
        return <CandidateStartScreen runAuthenticated={runAuthenticated} onNavigate={navigateSignedIn} onLogout={handleLogout} onComplete={() => setSetupStatus({ userId: session.user.id, completed: true })} />;
      }
    }
    const activeScreen = role === 'isveren'
      ? ['employer-jobs', 'employer-candidates'].includes(signedInScreen) ? signedInScreen : 'company'
      : role === 'yonetici' ? signedInScreen === 'resource-management' ? 'resource-management' : 'company-review' : signedInScreen;
    if (role === 'isveren') {
      page = activeScreen === 'employer-jobs'
        ? <EmployerJobsScreen runAuthenticated={runAuthenticated} onOpenCandidates={(jobId) => { window.location.hash = `/employer-candidates?job=${encodeURIComponent(jobId)}`; setSignedInScreen('employer-candidates'); }} />
        : activeScreen === 'employer-candidates'
          ? <EmployerCandidatesScreen runAuthenticated={runAuthenticated} />
          : <CompanyWorkspace runAuthenticated={runAuthenticated} />;
    } else if (role === 'yonetici') {
      page = activeScreen === 'resource-management' ? <ResourceManagementScreen runAuthenticated={runAuthenticated} /> : <CompanyReviewScreen runAuthenticated={runAuthenticated} />;
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
      page = <SkillMapScreen runAuthenticated={runAuthenticated} roleId={selectedRoleId} onSelectRole={selectRole} />;
    } else if (signedInScreen === 'roadmap') {
      page = <RoadmapScreen runAuthenticated={runAuthenticated} selectedRoleId={selectedRoleId} onSelectRole={selectRole} onOpenSkills={() => navigateSignedIn('skill-map')} onOpenGoals={() => navigateSignedIn('career-goals')} onOpenResources={() => navigateSignedIn('learning-resources')} onOpenCustomCareer={() => { window.location.hash = '/learning-resources?custom=1'; setSignedInScreen('learning-resources'); }} />;
    } else if (signedInScreen === 'learning-resources') {
      page = <LearningResourcesScreen runAuthenticated={runAuthenticated} selectedRoleId={selectedRoleId} onSelectRole={selectRole} onOpenRoadmap={() => navigateSignedIn('roadmap')} />;
    } else if (signedInScreen === 'candidate-jobs') {
      page = <CandidateJobsScreen runAuthenticated={runAuthenticated} onOpenCvs={() => navigateSignedIn('records-cv')} />;
    } else if (signedInScreen === 'interview-practice') {
      page = <InterviewPracticeScreen runAuthenticated={runAuthenticated} />;
    } else if (signedInScreen === 'profile-overview') {
      page = <ProfileOverviewScreen runAuthenticated={runAuthenticated} onEdit={() => navigateSignedIn('profile-edit')} onOpenGoals={() => navigateSignedIn('career-goals')} onOpenRecords={(kind) => navigateSignedIn(`records-${kind}`)} />;
    } else {
      page = <WelcomeDashboard user={session.user} onOpenProfile={() => navigateSignedIn('profile-overview')} onOpenGoals={() => navigateSignedIn('career-goals')} />;
    }

    return <AuthenticatedLayout screen={activeScreen} role={role} user={session.user} onNavigate={navigateSignedIn} onLogout={handleLogout} runAuthenticated={runAuthenticated}>{page}</AuthenticatedLayout>;
  }

  if (screen === 'register') {
    return <RegisterScreen onNavigate={handleNavigate} onRegister={handleRegister} isEmployer={isEmployer} onToggleEmployer={() => setIsEmployer((value) => !value)} />;
  }

  if (screen === 'forgot-password') {
    return <PasswordResetScreen onBack={() => setScreen('login')} />;
  }

  return <LoginScreen onNavigate={handleNavigate} onLogin={login} notice={notice} />;
}
