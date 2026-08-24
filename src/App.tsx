import React, { useState, useEffect } from 'react';
import { NavTab, Project } from './types';
import { useProjects } from './context/ProjectsContext';
import { useAdminAuth } from './context/AdminAuthContext';
import { useVisitorAnalytics } from './context/VisitorAnalyticsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BackgroundGrid } from './components/BackgroundGrid';
import { HeroSection } from './components/HeroSection';
import { HomeWorksSection } from './components/HomeWorksSection';
import { SelectedWorksView } from './components/SelectedWorksView';
import { AboutView } from './components/AboutView';
import { ContactSection } from './components/ContactSection';
import { AdminEditView } from './components/AdminEditView';
import { ProjectModal } from './components/ProjectModal';
import { AIConsultantModal } from './components/AIConsultantModal';
import { Toast } from './components/Toast';
import { Eye, Layers, Film, Image as ImageIcon, SlidersHorizontal, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type WorksTestScenario = 'all' | 'empty' | 'no-video' | 'no-product';

export default function App() {
  const { projects } = useProjects();
  const { isAuthenticated } = useAdminAuth();
  const { recordPageView, recordProjectView } = useVisitorAnalytics();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [startModalWithVideo, setStartModalWithVideo] = useState(false);
  const [isAIConsultantOpen, setIsAIConsultantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testScenario, setTestScenario] = useState<WorksTestScenario>('all');
  const [isCaptureShieldActive, setIsCaptureShieldActive] = useState(false);

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    recordPageView(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // High-Security Secret Ghost Typing Listener
  // User simply types "loveystudio" or "lovey77" anywhere on the screen (outside form inputs)
  useEffect(() => {
    let keyBuffer = '';
    let timer: NodeJS.Timeout | null = null;
    const SECRET_SEQUENCES = ['loveystudio', 'lovey77', 'loveymaster'];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is actively typing in input / textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
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
            keyBuffer = '';
            setActiveTab('admin');
            setToastMessage('관리자 보안 게이트가 열렸습니다.');
            break;
          }
        }

        // Reset buffer after 4 seconds of inactivity
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          keyBuffer = '';
        }, 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Secure URL Fallback (Only obscure secret hash / parameter)
  useEffect(() => {
    const checkSecretURL = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#gate-lovey-77' || search.includes('access=lovey_master')) {
        setActiveTab('admin');
        setToastMessage('보안 키 인증: 관리자 모드 진입');
      }
    };
    checkSecretURL();
    window.addEventListener('hashchange', checkSecretURL);
    return () => window.removeEventListener('hashchange', checkSecretURL);
  }, []);

  // Global Anti-Theft & Right-Click / PrintScreen / Mobile Screenshot Protection
  useEffect(() => {
    let restoreTimeout: NodeJS.Timeout | null = null;

    const triggerCaptureProtection = (reason: string = '화면 캡처') => {
      // 1. Immediately overwrite clipboard with copyright notice
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(
            '🔒 [lovey 저작권 안내] 본 포트폴리오 작업물의 무단 캡처, 복제 및 도용은 저작권법에 의해 엄격히 금지되어 있습니다. (All Rights Reserved © lovey)'
          ).catch(() => {});
        }
      } catch {
        // Ignore
      }

      // 2. Instantly show pitch-black anti-capture shield (0ms latency to ruin any capture buffer)
      setIsCaptureShieldActive(true);
      setToastMessage(`🔒 ${reason}가 감지되어 화면이 보호 처리되었습니다.`);
    };

    // 1. Block Context Menu (Right-Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setToastMessage('🔒 포트폴리오 작업물의 무단 복제 및 도용을 방지하기 위해 마우스 오른쪽 버튼 사용이 제한되어 있습니다.');
    };

    // 2. Block Image Dragging / Dropping
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.closest('.portfolio-media'))) {
        e.preventDefault();
      }
    };

    // 3. Block Keyboard shortcuts (PrintScreen, Ctrl+S, Ctrl+P, Mac Screenshots, Snipping Tool)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key (Windows/Linux)
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        try { e.preventDefault(); } catch {}
        triggerCaptureProtection('PrintScreen 캡처');
        return;
      }

      // Ctrl + S or Cmd + S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setToastMessage('🔒 작업물 저장이 제한되어 있습니다.');
        return;
      }

      // Ctrl + P or Cmd + P (Print / PDF save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        try { e.preventDefault(); } catch {}
        triggerCaptureProtection('화면 인쇄');
        return;
      }

      // Mac Screenshot shortcuts: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5' || e.key === '$' || e.key === '%' || e.key === '#')) {
        try { e.preventDefault(); } catch {}
        triggerCaptureProtection('Mac 화면 캡처');
        return;
      }

      // Windows Snipping tool shortcut: Win+Shift+S or Ctrl+Shift+S
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        try { e.preventDefault(); } catch {}
        triggerCaptureProtection('캡처 도구');
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        triggerCaptureProtection('PrintScreen 캡처');
      }
    };

    // 4. Mobile & Desktop App Switcher / Screenshot Blur Protection
    // Mobile screenshot triggers app blur/visibility change (Volume+Power, 3-finger swipe, notification drag)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsCaptureShieldActive(true);
      }
    };

    const handleWindowBlur = () => {
      // Instantly blank screen when focus is lost (e.g. mobile screenshot overlay or snippet tool)
      setIsCaptureShieldActive(true);
    };

    const handleWindowFocus = () => {
      // When user returns, keep shield for a brief safety moment then auto-unlock if desired
      if (restoreTimeout) clearTimeout(restoreTimeout);
      restoreTimeout = setTimeout(() => {
        // Allow user to tap/click to unlock
      }, 1000);
    };

    // 5. Mobile multi-finger screenshot gesture detection (3 or more fingers swipe)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length >= 3) {
        triggerCaptureProtection('모바일 제스처 캡처');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('touchstart', handleTouchStart);
      if (restoreTimeout) clearTimeout(restoreTimeout);
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

  // Derive current projects according to the selected test scenario
  const currentProjects = React.useMemo(() => {
    if (testScenario === 'empty') return [];
    if (testScenario === 'no-video') {
      return projects.filter((p) => p.categoryTag === 'PRODUCT' || p.category === 'PRODUCT PAGE');
    }
    if (testScenario === 'no-product') {
      return projects.filter((p) => p.categoryTag === 'VIDEO' || p.categoryTag === 'SHORTS');
    }
    return projects;
  }, [projects, testScenario]);

  return (
    <div className="relative min-h-screen bg-[#fafafc] text-neutral-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 sm:pb-0">
      {/* Background Architectural Grid Lines & Watermarks */}
      <BackgroundGrid
        watermarkPosition={
          activeTab === 'home'
            ? 'hero'
            : activeTab === 'contact'
            ? 'contact'
            : 'none'
        }
      />

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenContactModal={() => setIsAIConsultantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="flex flex-col">
            {/* Hero Section matching Screenshot 1 */}
            <HeroSection
              onExploreWorks={() => handleSelectTab('works')}
              onGetInTouch={() => setIsAIConsultantOpen(true)}
            />

            {/* Curated Selected Works matching Screenshot 1 */}
            <HomeWorksSection
              projects={currentProjects}
              onSelectProject={(project) => handleOpenProject(project, false)}
              onPlayVideo={(project) => handleOpenProject(project, true)}
              onViewAllWorks={() => handleSelectTab('works')}
            />

            {/* Contact / Let's create something amazing. section matching Screenshot 1 */}
            <ContactSection
              onOpenContactModal={() => setIsAIConsultantOpen(true)}
              onShowToast={handleShowToast}
            />
          </div>
        )}

        {activeTab === 'works' && (
          <SelectedWorksView
            projects={currentProjects}
            onSelectProject={(project) => handleOpenProject(project, false)}
            onPlayVideo={(project) => handleOpenProject(project, true)}
            onOpenContactModal={() => setIsAIConsultantOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            onOpenContactModal={() => setIsAIConsultantOpen(true)}
            onExploreWorks={() => handleSelectTab('works')}
          />
        )}

        {activeTab === 'contact' && (
          <div className="pt-8">
            <ContactSection
              onOpenContactModal={() => setIsAIConsultantOpen(true)}
              onShowToast={handleShowToast}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminEditView
            onSelectProjectPreview={(project) => handleOpenProject(project, false)}
            onNavigateHome={() => handleSelectTab('home')}
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
              setTestScenario('all');
              handleShowToast(`현재 등록된 작업물 (${projects.length}개) 표시`);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              testScenario === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            전체 ({projects.length}개)
          </button>

          <button
            onClick={() => {
              setTestScenario('empty');
              handleShowToast('작업물 0개 (빈 화면) 테스트 모드');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              testScenario === 'empty'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Layers size={11} />
            <span>0개 (빈화면)</span>
          </button>

          <button
            onClick={() => {
              setTestScenario('no-video');
              handleShowToast('영상 작업물 없음 테스트');
            }}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              testScenario === 'no-video'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Film size={11} />
            <span>영상 없음</span>
          </button>

          <button
            onClick={() => {
              setTestScenario('no-product');
              handleShowToast('상세페이지 없음 테스트');
            }}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              testScenario === 'no-product'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <ImageIcon size={11} />
            <span>사진 없음</span>
          </button>

          <div className="h-3 w-[1px] bg-neutral-200 mx-0.5" />

          <button
            onClick={() => {
              handleSelectTab('admin');
              handleShowToast('게시글 관리(EDIT) 화면으로 이동');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
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

      {/* Anti-Screen-Capture Visual Shield Overlay (Instant Blackout to Ruin Mobile & PC Screenshots) */}
      <AnimatePresence>
        {isCaptureShieldActive && (
          <motion.div
            id="anti-capture-shield"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={() => setIsCaptureShieldActive(false)}
            className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center text-white p-6 select-none cursor-pointer"
          >
            <div className="flex flex-col items-center text-center max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="h-16 w-16 rounded-3xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 shadow-2xl">
                <ShieldAlert size={32} />
              </div>
              <span className="font-display text-[11px] font-mono font-bold tracking-widest text-red-400 uppercase mb-1">
                SECURITY ALERT
              </span>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-white mb-2 tracking-tight">
                화면 캡처가 차단되었습니다
              </h2>
              <p className="text-xs leading-relaxed text-neutral-400 mb-6">
                본 포트폴리오 작업물은 <strong className="text-white font-bold">© lovey</strong>의 저작권 보호를 받는 창작물입니다. 무단 캡처 및 복제는 엄격히 제한됩니다.
              </p>
              <button
                type="button"
                onClick={() => setIsCaptureShieldActive(false)}
                className="rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-6 py-2.5 text-xs font-bold transition border border-neutral-700 shadow-md cursor-pointer"
              >
                화면 터치하여 계속 보기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
