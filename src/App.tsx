import React, { useState, useEffect } from "react";
import { NavTab, Project } from "./types";
import { useProjects } from "./context/ProjectsContext";
import { useAdminAuth } from "./context/AdminAuthContext";
import { useVisitorAnalytics } from "./context/VisitorAnalyticsContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BackgroundGrid } from "./components/BackgroundGrid";
import { HeroSection } from "./components/HeroSection";
import { HomeWorksSection } from "./components/HomeWorksSection";
import { SelectedWorksView } from "./components/SelectedWorksView";
import { AboutView } from "./components/AboutView";
import { ContactSection } from "./components/ContactSection";
import { AdminEditView } from "./components/AdminEditView";
import { ProjectModal } from "./components/ProjectModal";
import { AIConsultantModal } from "./components/AIConsultantModal";
import { Toast } from "./components/Toast";
import { isSupabaseConfigured, requireSupabase } from "./lib/supabase";
import {
  Eye,
  Layers,
  Film,
  Image as ImageIcon,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

export type WorksTestScenario = "all" | "empty" | "no-video" | "no-product";

const normalizePath = (pathname: string) => pathname.replace(/\/+$/, "") || "/";

const getActiveTabFromLocation = (): NavTab => {
  if (normalizePath(window.location.pathname) === "/admin") return "admin";

  const historyTab = window.history.state?.tab as NavTab | undefined;
  return historyTab && ["home", "about", "works", "contact"].includes(historyTab)
    ? historyTab
    : "home";
};

export default function App() {
  const { projects } = useProjects();
  const { isAuthenticated } = useAdminAuth();
  const { recordPageView, recordProjectView } = useVisitorAnalytics();
  const [activeTab, setActiveTab] = useState<NavTab>(getActiveTabFromLocation);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [startModalWithVideo, setStartModalWithVideo] = useState(false);
  const [isAIConsultantOpen, setIsAIConsultantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testScenario, setTestScenario] = useState<WorksTestScenario>("all");
  const [isHeroOpenForProjects, setIsHeroOpenForProjects] = useState(true);
  const [isHeroStatusLoading, setIsHeroStatusLoading] = useState(isSupabaseConfigured);
  const [isHeroStatusSaving, setIsHeroStatusSaving] = useState(false);

  const handleSelectTab = (tab: NavTab) => {
    const currentPath = normalizePath(window.location.pathname);
    const currentState =
      typeof window.history.state === "object" && window.history.state !== null
        ? window.history.state
        : {};

    if (tab === "admin") {
      if (currentPath !== "/admin") {
        window.history.replaceState(
          { ...currentState, tab: activeTab },
          "",
          window.location.href,
        );
        window.history.pushState({ tab }, "", "/admin");
      } else if (window.location.pathname !== "/admin") {
        window.history.replaceState(
          { ...currentState, tab },
          "",
          `/admin${window.location.search}${window.location.hash}`,
        );
      }
    } else if (currentPath === "/admin") {
      window.history.pushState({ tab }, "", "/");
    } else {
      window.history.replaceState(
        { ...currentState, tab },
        "",
        window.location.href,
      );
    }

    setActiveTab(tab);
    recordPageView(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSelectTabRef = React.useRef(handleSelectTab);
  handleSelectTabRef.current = handleSelectTab;
  const activeTabRef = React.useRef(activeTab);
  activeTabRef.current = activeTab;
  const recordPageViewRef = React.useRef(recordPageView);
  recordPageViewRef.current = recordPageView;

  useEffect(() => {
    const activeRouteTab = getActiveTabFromLocation();
    const currentState =
      typeof window.history.state === "object" && window.history.state !== null
        ? window.history.state
        : {};
    const normalizedPath = normalizePath(window.location.pathname);
    const url = `${normalizedPath}${window.location.search}${window.location.hash}`;

    window.history.replaceState({ ...currentState, tab: activeRouteTab }, "", url);
    if (window.location.pathname !== normalizedPath) setActiveTab(activeRouteTab);

    const handlePopState = () => {
      const tab = getActiveTabFromLocation();
      setActiveTab(tab);
      recordPageViewRef.current(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsHeroStatusLoading(false);
      return;
    }

    let isCurrent = true;
    const loadHeroStatus = async () => {
      const { data, error } = await requireSupabase()
        .from("site_settings")
        .select("value")
        .eq("key", "hero_open_for_projects")
        .maybeSingle();

      if (!isCurrent) return;
      if (error) {
        console.error("Failed to load hero availability status:", error.message);
      } else if (data) {
        setIsHeroOpenForProjects(data.value !== false);
      }
      setIsHeroStatusLoading(false);
    };

    void loadHeroStatus();
    return () => {
      isCurrent = false;
    };
  }, []);

  // Secret Ghost Typing Listener
  useEffect(() => {
    let keyBuffer = "";
    let timer: NodeJS.Timeout | null = null;
    const SECRET_SEQUENCES = ["loveystudio", "loveymaster"];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is actively typing in input / textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key && e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 25) {
          keyBuffer = keyBuffer.slice(-25);
        }

        // Check if buffer contains any secret sequence
        for (const secret of SECRET_SEQUENCES) {
          if (keyBuffer.endsWith(secret)) {
            keyBuffer = "";
            handleSelectTabRef.current("admin");
            setToastMessage("관리자 보안 게이트가 열렸습니다.");
            break;
          }
        }

        // Reset buffer after 4 seconds of inactivity
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          keyBuffer = "";
        }, 4000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Secure URL Fallback (Only obscure secret hash / parameter)
  useEffect(() => {
    const checkSecretURL = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === "#gate-lovey-77" || search.includes("access=lovey_master")) {
        handleSelectTabRef.current("admin");
        setToastMessage("보안 키 인증: 관리자 모드 진입");
      }
    };
    checkSecretURL();
    window.addEventListener("hashchange", checkSecretURL);
    return () => window.removeEventListener("hashchange", checkSecretURL);
  }, []);

  // Preserve basic content protections without interfering with screenshots.
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setToastMessage(
        "🔒 포트폴리오 작업물의 무단 복제 및 도용을 방지하기 위해 마우스 오른쪽 버튼 사용이 제한되어 있습니다.",
      );
    };

    const handleDragStart = (e: DragEvent) => {
      if (activeTabRef.current === "admin") return;

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "IMG" ||
          target.tagName === "VIDEO" ||
          target.closest(".portfolio-media"))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  const handleOpenProject = (project: Project, withVideo: boolean = false) => {
    setSelectedProject(project);
    setStartModalWithVideo(withVideo);
    recordProjectView(project.id);
  };

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleToggleHeroStatus = async () => {
    if (!isAuthenticated || isHeroStatusLoading || isHeroStatusSaving) return;

    const nextStatus = !isHeroOpenForProjects;
    setIsHeroStatusSaving(true);
    try {
      const { error } = await requireSupabase()
        .from("site_settings")
        .upsert(
          { key: "hero_open_for_projects", value: nextStatus },
          { onConflict: "key" },
        );
      if (error) {
        console.error("Failed to update hero availability status:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        if (["PGRST204", "PGRST205", "42P01"].includes(error.code)) {
          handleShowToast("Supabase 테이블 설정이 반영되지 않았습니다. 최신 마이그레이션을 적용해 주세요.");
        } else if (error.code === "42501") {
          handleShowToast("Supabase 수정 권한을 확인해 주세요. 최신 마이그레이션과 profiles의 admin 역할이 필요합니다.");
        } else {
          handleShowToast(`상태 변경 저장 실패 [${error.code}]: ${error.message}`);
        }
        return;
      }

      setIsHeroOpenForProjects(nextStatus);
      handleShowToast(
        nextStatus ? "프로젝트 문의 상태를 열었습니다." : "프로젝트 문의 상태를 닫았습니다.",
      );
    } catch (error) {
      console.error("Failed to update hero availability status:", error);
      handleShowToast("상태 변경 저장 중 연결 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsHeroStatusSaving(false);
    }
  };

  // Derive current projects according to the selected test scenario
  const currentProjects = React.useMemo(() => {
    if (testScenario === "empty") return [];
    if (testScenario === "no-video") {
      return projects.filter(
        (p) => p.categoryTag === "PRODUCT" || p.category === "PRODUCT PAGE",
      );
    }
    if (testScenario === "no-product") {
      return projects.filter(
        (p) => p.categoryTag === "VIDEO" || p.categoryTag === "SHORTS",
      );
    }
    return projects;
  }, [projects, testScenario]);

  return (
    <div
      className={`relative min-h-screen w-full min-w-0 bg-[#fafafc] text-neutral-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 sm:pb-0 ${activeTab === "admin" ? "" : "copy-protection"}`}
      onDragStart={(event) => {
        if (activeTab !== "admin") event.preventDefault();
      }}
    >
      {/* Background Architectural Grid Lines & Watermarks */}
      <BackgroundGrid
        watermarkPosition={
          activeTab === "home"
            ? "hero"
            : activeTab === "contact"
              ? "contact"
              : "none"
        }
      />

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenContactModal={() => setIsAIConsultantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="min-w-0 flex-grow">
        {activeTab === "home" && (
          <div className="flex flex-col">
            {/* Hero Section matching Screenshot 1 */}
            <HeroSection
              onExploreWorks={() => handleSelectTab("works")}
              onGetInTouch={() => setIsAIConsultantOpen(true)}
              isOpenForProjects={isHeroOpenForProjects}
              canToggleStatus={isAuthenticated}
              isStatusSaving={isHeroStatusLoading || isHeroStatusSaving}
              onToggleStatus={handleToggleHeroStatus}
            />

            {/* Curated Selected Works matching Screenshot 1 */}
            <HomeWorksSection
              projects={currentProjects}
              onSelectProject={(project) => handleOpenProject(project, false)}
              onPlayVideo={(project) => handleOpenProject(project, true)}
              onViewAllWorks={() => handleSelectTab("works")}
            />

            {/* Contact / Let's create something amazing. section matching Screenshot 1 */}
            <ContactSection
              onOpenContactModal={() => setIsAIConsultantOpen(true)}
              onShowToast={handleShowToast}
            />
          </div>
        )}

        {activeTab === "works" && (
          <SelectedWorksView
            projects={currentProjects}
            onSelectProject={(project) => handleOpenProject(project, false)}
            onPlayVideo={(project) => handleOpenProject(project, true)}
            onOpenContactModal={() => setIsAIConsultantOpen(true)}
          />
        )}

        {activeTab === "about" && (
          <AboutView
            onOpenContactModal={() => setIsAIConsultantOpen(true)}
            onExploreWorks={() => handleSelectTab("works")}
          />
        )}

        {activeTab === "contact" && (
          <div className="pt-8">
            <ContactSection
              onOpenContactModal={() => setIsAIConsultantOpen(true)}
              onShowToast={handleShowToast}
            />
          </div>
        )}

        {activeTab === "admin" && (
          <AdminEditView
            onSelectProjectPreview={(project) =>
              handleOpenProject(project, false)
            }
            onNavigateHome={() => handleSelectTab("home")}
            onShowToast={handleShowToast}
          />
        )}
      </main>

      {/* Floating Admin & Test Controller Bar - ONLY VISIBLE WHEN LOGGED IN AS ADMIN */}
      {isAuthenticated && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 rounded-full border border-neutral-300/80 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md text-xs">
          <span className="flex items-center gap-1 font-bold text-emerald-700 mr-1 pl-1 text-[11px]">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>관리자 모드:</span>
          </span>

          <button
            onClick={() => {
              setTestScenario("all");
              handleShowToast(`현재 등록된 작업물 (${projects.length}개) 표시`);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              testScenario === "all"
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            전체 ({projects.length}개)
          </button>

          <button
            onClick={() => {
              setTestScenario("empty");
              handleShowToast("작업물 0개 (빈 화면) 테스트 모드");
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              testScenario === "empty"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <Layers size={11} />
            <span>0개 (빈화면)</span>
          </button>

          <button
            onClick={() => {
              setTestScenario("no-video");
              handleShowToast("영상 작업물 없음 테스트");
            }}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              testScenario === "no-video"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <Film size={11} />
            <span>영상 없음</span>
          </button>

          <button
            onClick={() => {
              setTestScenario("no-product");
              handleShowToast("상세페이지 없음 테스트");
            }}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              testScenario === "no-product"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <ImageIcon size={11} />
            <span>사진 없음</span>
          </button>

          <div className="h-3 w-[1px] bg-neutral-200 mx-0.5" />

          <button
            onClick={() => {
              handleSelectTab("admin");
              handleShowToast("게시글 관리(EDIT) 화면으로 이동");
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "admin"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <SlidersHorizontal size={11} />
            <span>EDIT</span>
          </button>
        </div>
      )}

      {/* Footer matching Screenshots */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Project Case Study / Video Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
        allProjects={projects}
        startWithVideo={startModalWithVideo}
      />

      {/* 1:1 AI Consultation & Project Inquiry Assistant Modal */}
      <AIConsultantModal
        isOpen={isAIConsultantOpen}
        onClose={() => setIsAIConsultantOpen(false)}
        onShowToast={handleShowToast}
        projects={projects}
        onOpenProject={(project) => {
          setIsAIConsultantOpen(false);
          handleOpenProject(project);
        }}
      />

      {/* Global Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
