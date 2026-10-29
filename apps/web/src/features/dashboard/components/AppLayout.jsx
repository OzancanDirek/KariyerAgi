import { useState } from "react";
import { Sidebar } from "./Sidebar.jsx";
import { DashboardHeader } from "./DashboardHeader.jsx";
import { CareerDashboardView } from "./screens/CareerDashboardView.jsx";
import { CareerProfileView } from "./screens/CareerProfileView.jsx";
import { CareerGoalsView } from "./screens/CareerGoalsView.jsx";
import { CvAnalysisView } from "./screens/CvAnalysisView.jsx";
import { CvBuilderView } from "./screens/CvBuilderView.jsx";
import { KnowledgeGraphView } from "./screens/KnowledgeGraphView.jsx";
import { CareerRoadmapView } from "./screens/CareerRoadmapView.jsx";
import { LearningRecommendationsView } from "./screens/LearningRecommendationsView.jsx";
import { JobListingView } from "./screens/JobListingView.jsx";
import { JobDetailsView } from "./screens/JobDetailsView.jsx";
import { CompanyProfileView } from "./screens/CompanyProfileView.jsx";
import { CreateJobListingView } from "./screens/CreateJobListingView.jsx";
import { ApplicantManagementView } from "./screens/ApplicantManagementView.jsx";
import { initialSkillsData } from "../data/skillsData.js";
import {
  initialLearningResources,
  initialDevelopmentTasks
} from "../data/roadmapData.js";
import { initialJobListings } from "../data/jobsData.js";
import { initialCompanyProfile, initialCandidates } from "../data/employerData.js";
const AppLayout = ({
  user,
  onUpdateUser,
  onLogout,
  initialView = "dashboard"
}) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [skillsData, setSkillsData] = useState(
    user.skillsData && user.skillsData.length > 0 ? user.skillsData : initialSkillsData
  );
  const [selectedSkillId, setSelectedSkillId] = useState(
    user.selectedSkillId || "skill-react"
  );
  const [learningResources, setLearningResources] = useState(
    user.resourcesData && user.resourcesData.length > 0 ? user.resourcesData : initialLearningResources
  );
  const [developmentTasks, setDevelopmentTasks] = useState(
    user.developmentTasks && user.developmentTasks.length > 0 ? user.developmentTasks : initialDevelopmentTasks
  );
  const [jobListings, setJobListings] = useState(initialJobListings);
  const [selectedJob, setSelectedJob] = useState(initialJobListings[0]);
  const [companyProfile, setCompanyProfile] = useState(initialCompanyProfile);
  const [candidates, setCandidates] = useState(initialCandidates);
  const handleUpdateGoals = (newGoals) => {
    const updated = {
      ...user,
      targetRole: newGoals.targetRole,
      careerGoals: newGoals,
      completionRate: Math.min(100, (user.completionRate || 85) + 5)
    };
    onUpdateUser(updated);
  };
  const handleSelectSkill = (skillId) => {
    setSelectedSkillId(skillId);
    onUpdateUser({
      ...user,
      selectedSkillId: skillId
    });
  };
  const handleUpdateTasks = (updated) => {
    setDevelopmentTasks(updated);
    onUpdateUser({
      ...user,
      developmentTasks: updated
    });
  };
  const handleAddTaskToPlan = (title, relatedSkill) => {
    const newTask = {
      id: `task-${Date.now()}`,
      week: "Hafta 1",
      title: `E\u011Fitimi \u0130ncele & Ba\u015Fla: ${title}`,
      description: `${relatedSkill} yetkinli\u011Fini geli\u015Ftirmek i\xE7in e\u011Fitim mod\xFCl\xFCne ba\u015Fland\u0131.`,
      relatedSkill,
      dueDate: "Bu Hafta Sonu",
      completed: false,
      priority: "high",
      category: "course",
      categoryLabel: "Kurs & E\u011Fitim"
    };
    const next = [newTask, ...developmentTasks];
    setDevelopmentTasks(next);
    onUpdateUser({
      ...user,
      developmentTasks: next
    });
  };
  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };
  const handleToggleSaveJob = (jobId) => {
    setJobListings(
      (prev) => prev.map((j) => j.id === jobId ? { ...j, isSaved: !j.isSaved } : j)
    );
  };
  const handleUpdateCompany = (updated) => {
    setCompanyProfile(updated);
  };
  const handleAddJob = (newJob) => {
    setJobListings((prev) => [newJob, ...prev]);
  };
  const handleUpdateCandidate = (updated) => {
    setCandidates(
      (prev) => prev.map((c) => c.id === updated.id ? updated : c)
    );
  };
  return <div className="min-h-screen bg-[#F7F8FA] flex text-[#202938]">
      {
    /* Left Sidebar */
  }
      <Sidebar
    currentView={currentView}
    onViewChange={setCurrentView}
    user={user}
    onLogout={onLogout}
  />

      {
    /* Main Content Workspace */
  }
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
    currentView={currentView}
    onViewChange={setCurrentView}
    user={user}
  />

        <main className="flex-1 overflow-y-auto">
          {
    /* Module 02 Screens */
  }
          {currentView === "dashboard" && <CareerDashboardView
    user={user}
    onNavigate={(view) => setCurrentView(view)}
  />}

          {currentView === "profile" && <CareerProfileView
    user={user}
    onUpdateProfile={onUpdateUser}
  />}

          {currentView === "goals" && <CareerGoalsView
    user={user}
    onUpdateGoals={handleUpdateGoals}
  />}

          {
    /* Module 03 Screens */
  }
          {currentView === "cv-analysis" && <CvAnalysisView
    user={user}
    skillsData={skillsData}
    onNavigate={(view) => setCurrentView(view)}
  />}

          {currentView === "cv-builder" && <CvBuilderView
    user={user}
    onUpdateUser={onUpdateUser}
  />}

          {
    /* Module 04 Screen */
  }
          {currentView === "knowledge-graph" && <KnowledgeGraphView
    user={user}
    skillsData={skillsData}
    onSelectSkill={handleSelectSkill}
    onNavigate={(view) => setCurrentView(view)}
  />}

          {
    /* Module 05 Screens */
  }
          {currentView === "career-roadmap" && <CareerRoadmapView
    user={user}
    tasks={developmentTasks}
    onNavigate={(view) => setCurrentView(view)}
    onUpdateTasks={handleUpdateTasks}
  />}

          {currentView === "learning-recommendations" && <LearningRecommendationsView
    user={user}
    resources={learningResources}
    onNavigate={(view) => setCurrentView(view)}
    onAddTaskToPlan={handleAddTaskToPlan}
  />}

          {
    /* Module 06 Screen */
  }
          {(currentView === "job-listings" || currentView === "jobs") && <JobListingView
    user={user}
    jobs={jobListings}
    onSelectJob={handleSelectJob}
    onNavigate={(view) => setCurrentView(view)}
    onToggleSaveJob={handleToggleSaveJob}
  />}

          {currentView === "job-details" && <JobDetailsView
    user={user}
    selectedJob={selectedJob}
    onNavigate={(view) => setCurrentView(view)}
    onToggleSaveJob={handleToggleSaveJob}
  />}

          {
    /* Module 07 Screens — Employer & Company Management */
  }
          {currentView === "company-profile" && <CompanyProfileView
    user={user}
    company={companyProfile}
    jobs={jobListings}
    onUpdateCompany={handleUpdateCompany}
    onNavigate={(view) => setCurrentView(view)}
  />}

          {currentView === "create-job" && <CreateJobListingView
    user={user}
    company={companyProfile}
    onAddJob={handleAddJob}
    onNavigate={(view) => setCurrentView(view)}
  />}

          {currentView === "applicant-management" && <ApplicantManagementView
    user={user}
    candidates={candidates}
    jobs={jobListings}
    onUpdateCandidate={handleUpdateCandidate}
    onNavigate={(view) => setCurrentView(view)}
  />}

          {
    /* Fallback & Redirects */
  }
          {currentView === "cv-improvements" && <CvAnalysisView
    user={user}
    skillsData={skillsData}
    onNavigate={(view) => setCurrentView(view)}
  />}

          {(currentView === "skill-tracking" || currentView === "skill-details") && <KnowledgeGraphView
    user={user}
    skillsData={skillsData}
    onSelectSkill={handleSelectSkill}
    onNavigate={(view) => setCurrentView(view)}
  />}

          {currentView === "development-plan" && <CareerRoadmapView
    user={user}
    tasks={developmentTasks}
    onNavigate={(view) => setCurrentView(view)}
    onUpdateTasks={handleUpdateTasks}
  />}

          {(currentView === "skills" || currentView === "events" || currentView === "settings") && <CareerDashboardView
    user={user}
    onNavigate={(view) => setCurrentView(view)}
  />}
        </main>
      </div>
    </div>;
};
export {
  AppLayout
};
