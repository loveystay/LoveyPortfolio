import React, { useState } from 'react';
import { Project, NavTab } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useProjects } from '../context/ProjectsContext';
import { useVisitorAnalytics } from '../context/VisitorAnalyticsContext';
import {
  Lock,
  Unlock,
  Key,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  Play,
  Layers,
  Search,
  RotateCcw,
  Sparkles,
  LogOut,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Sliders,
  BarChart3,
  Users,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectEditorModal } from './ProjectEditorModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { AdminVisitorAnalytics } from './AdminVisitorAnalytics';

interface AdminEditViewProps {
  onSelectProjectPreview: (project: Project) => void;
  onNavigateHome: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminEditView: React.FC<AdminEditViewProps> = ({
  onSelectProjectPreview,
  onNavigateHome,
  onShowToast,
}) => {
  const { isAuthenticated, login, logout, defaultPasswordHint } = useAdminAuth();
  const { projects, addProject, updateProject, deleteProject, resetToDefaults, toggleFeatured } =
    useProjects();
  const { analytics } = useVisitorAnalytics();

  // Admin Section Tab ('projects' | 'analytics')
  const [adminActiveTab, setAdminActiveTab] = useState<'projects' | 'analytics'>('projects');

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin filter & search state
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const success = login(passwordInput);
    if (success) {
      onShowToast('관리자로 로그인되었습니다.');
      setPasswordInput('');
    } else {
      setLoginError('비밀번호가 올바르지 않습니다. 다시 확인해 주세요.');
    }
  };

  const handleOpenCreateModal = () => {
    setProjectToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setProjectToEdit(project);
    setIsEditorOpen(true);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>, id?: string) => {
    if (id) {
      updateProject(id, projectData);
      onShowToast(`'${projectData.title}' 프로젝트가 수정되었습니다.`);
    } else {
      const created = addProject(projectData);
      onShowToast(`새 프로젝트 '${created.title}'이(가) 등록되었습니다.`);
    }
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      onShowToast(`'${projectToDelete.title}' 프로젝트가 삭제되었습니다.`);
      setProjectToDelete(null);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('기본 샘플 6개 프로젝트 데이터로 초기화하시겠습니까? (수정/추가된 데이터가 기본값으로 리셋됩니다)')) {
      resetToDefaults();
      onShowToast('기본 프로젝트 데이터로 복원되었습니다.');
    }
  };

  // Filtered projects for admin view
  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeCategory === 'ALL'
        ? true
        : activeCategory === 'YOUTUBE'
        ? p.category === 'YOUTUBE VIDEO' || p.category === 'VIDEO EDITING'
        : activeCategory === 'SHORTS'
        ? p.category === 'SHORTS / REELS' || p.categoryTag === 'SHORTS'
        : activeCategory === 'PRODUCT'
        ? p.category === 'PRODUCT PAGE' || p.categoryTag === 'PRODUCT'
        : true;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const youtubeCount = projects.filter((p) => p.category === 'YOUTUBE VIDEO' || p.category === 'VIDEO EDITING').length;
  const shortsCount = projects.filter((p) => p.category === 'SHORTS / REELS' || p.categoryTag === 'SHORTS').length;
  const productCount = projects.filter((p) => p.category === 'PRODUCT PAGE' || p.categoryTag === 'PRODUCT').length;

  // 1. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-xl"
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 shadow-2xs mb-4">
              <Lock size={26} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold tracking-wider text-neutral-700 uppercase mb-2">
              ADMIN AUTHENTICATION
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-950">
              포트폴리오 관리자 로그인
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-normal break-keep leading-relaxed">
              본인만 로그인하여 영상 및 상세페이지 게시글을 등록·수정·삭제할 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-7 space-y-4">
            {loginError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                관리자 비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:bg-white focus:outline-none transition pr-11 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Quick Helper Badge */}
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-2.5 text-[11px] text-neutral-500 border border-neutral-100">
              <span>초기 기본 비밀번호: <strong className="font-mono text-neutral-800">{defaultPasswordHint}</strong></span>
              <button
                type="button"
                onClick={() => setPasswordInput(defaultPasswordHint)}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                자동 입력
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-md hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>관리자 모드로 입장</span>
              <ArrowRight size={15} />
            </button>

            {/* Change Password Prompt Button */}
            <div className="pt-2 text-center border-t border-neutral-100 mt-4">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
              >
                <Key size={13} />
                <span>관리자 비밀번호 변경하기</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full text-center text-xs font-medium text-neutral-400 hover:text-neutral-700 pt-1 transition cursor-pointer"
            >
              ← 메인 홈으로 돌아가기
            </button>
          </form>

          {/* Change Password Modal when logged out */}
          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onSuccessToast={onShowToast}
          />
        </motion.div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div id="admin-management-view" className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-24 sm:px-10 lg:px-12">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 uppercase border border-emerald-200">
              <ShieldCheck size={13} />
              <span>LOVEY ADMIN LOGGED IN</span>
            </span>
            <span className="text-xs text-neutral-400">게시글 관리 센터</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
            게시글 & 카테고리 관리
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            포트폴리오 영상 및 상세페이지 게시물을 추가, 수정, 삭제하고 메인 노출을 설정합니다.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus size={15} />
            <span>새 프로젝트 등록</span>
          </button>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50/80 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
          >
            <Key size={14} className="text-emerald-700" />
            <span>비밀번호 변경</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition cursor-pointer"
            title="기본 샘플 6개로 복원"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">초기 복원</span>
          </button>

          <button
            onClick={() => {
              logout();
              onShowToast('관리자에서 로그아웃되었습니다.');
            }}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-3.5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-200 transition cursor-pointer"
          >
            <LogOut size={13} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/90 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAdminActiveTab('projects')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              adminActiveTab === 'projects'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Layers size={16} />
            <span>작업물 & 게시글 관리 ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminActiveTab('analytics')}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              adminActiveTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <BarChart3 size={16} />
            <span>방문자 통계 분석</span>
            <span className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
              adminActiveTab === 'analytics' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              오늘 {analytics.todayVisitors}명
            </span>
          </button>
        </div>

        {/* Quick Visitor Stats Pill */}
        <div
          onClick={() => setAdminActiveTab('analytics')}
          className="flex items-center gap-2.5 rounded-full border border-blue-200 bg-blue-50/70 px-4 py-2 text-xs text-blue-900 cursor-pointer hover:bg-blue-100 transition shadow-2xs w-fit"
          title="클릭하여 상세 방문자 통계 보기"
        >
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>오늘 방문: <strong className="font-bold text-blue-700">{analytics.todayVisitors.toLocaleString()}명</strong></span>
          <span className="text-blue-300">|</span>
          <span className="text-neutral-600">누적: <strong className="font-bold text-neutral-900">{analytics.totalVisitors.toLocaleString()}명</strong></span>
          <TrendingUp size={13} className="text-blue-600 ml-0.5" />
        </div>
      </div>

      {/* Main Content Area based on Selected Admin Tab */}
      {adminActiveTab === 'analytics' ? (
        <div className="mt-8">
          <AdminVisitorAnalytics onSelectProjectPreview={onSelectProjectPreview} />
        </div>
      ) : (
        <>
          {/* Metric Cards Summary */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            <div
              onClick={() => setActiveCategory('ALL')}
              className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                activeCategory === 'ALL'
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-600/20'
                  : 'border-neutral-200/80 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">전체 등록</span>
                <Layers size={16} className={activeCategory === 'ALL' ? 'text-blue-600' : ''} />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-neutral-950">
                {projects.length}
                <span className="text-xs font-normal text-neutral-400 ml-1">개</span>
              </p>
            </div>

            <div
              onClick={() => setActiveCategory('YOUTUBE')}
              className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                activeCategory === 'YOUTUBE'
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-600/20'
                  : 'border-neutral-200/80 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">유튜브 롱폼</span>
                <Film size={16} className={activeCategory === 'YOUTUBE' ? 'text-blue-600' : ''} />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-neutral-950">
                {youtubeCount}
                <span className="text-xs font-normal text-neutral-400 ml-1">개</span>
              </p>
            </div>

            <div
              onClick={() => setActiveCategory('SHORTS')}
              className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                activeCategory === 'SHORTS'
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-600/20'
                  : 'border-neutral-200/80 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">숏폼 / 릴스</span>
                <Play size={16} className={activeCategory === 'SHORTS' ? 'text-blue-600' : ''} />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-neutral-950">
                {shortsCount}
                <span className="text-xs font-normal text-neutral-400 ml-1">개</span>
              </p>
            </div>

            <div
              onClick={() => setActiveCategory('PRODUCT')}
              className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                activeCategory === 'PRODUCT'
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-600/20'
                  : 'border-neutral-200/80 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">상세페이지 LP</span>
                <ImageIcon size={16} className={activeCategory === 'PRODUCT' ? 'text-blue-600' : ''} />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-neutral-950">
                {productCount}
                <span className="text-xs font-normal text-neutral-400 ml-1">개</span>
              </p>
            </div>

            {/* 5th Card: Today Visitors Quick Jump */}
            <div
              onClick={() => setAdminActiveTab('analytics')}
              className="cursor-pointer rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/60 to-emerald-100/30 p-4 sm:p-5 transition-all hover:shadow-sm hover:border-emerald-300"
            >
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-xs font-bold uppercase tracking-wider">오늘 방문자</span>
                <Users size={16} className="text-emerald-600" />
              </div>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-emerald-950">
                {analytics.todayVisitors}
                <span className="text-xs font-normal text-emerald-600 ml-1">명</span>
              </p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="flex items-center space-x-4 sm:space-x-6 text-xs font-bold tracking-wider uppercase overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'ALL', label: '전체 (ALL)' },
            { id: 'YOUTUBE', label: '유튜브 롱폼' },
            { id: 'SHORTS', label: '숏폼 / 릴스' },
            { id: 'PRODUCT', label: '상세페이지 LP' },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`relative pb-2 transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 클라이언트 검색..."
            className="w-full rounded-full border border-neutral-200 bg-neutral-50/70 py-1.5 pl-9 pr-4 text-xs font-medium text-neutral-900 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-neutral-700 font-bold"
            >
              지우기
            </button>
          )}
        </div>
      </div>

      {/* Projects List in Admin Mode */}
      {filteredProjects.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-neutral-200/80 bg-white p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-4">
            <Layers size={24} />
          </div>
          <h3 className="font-display text-lg font-bold text-neutral-950">
            해당 조건의 등록된 게시물이 없습니다.
          </h3>
          <p className="mt-1.5 text-xs text-neutral-500 max-w-sm break-keep">
            새로운 작업물을 등록하거나 다른 카테고리 필터를 선택해 보세요.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>이 카테고리에 첫 게시물 등록</span>
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3.5">
          {filteredProjects.map((project, index) => {
            const isVideo = project.categoryTag === 'VIDEO' || project.categoryTag === 'SHORTS' || !!project.videoUrl;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
                className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs hover:shadow-sm hover:border-neutral-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative h-18 w-28 sm:h-20 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-900 border border-neutral-200">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 z-10">
                      <span className="rounded bg-neutral-950/80 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                        {project.categoryTag}
                      </span>
                    </div>
                    {isVideo && (
                      <div className="absolute inset-0 bg-neutral-950/20 flex items-center justify-center">
                        <Play size={14} className="fill-white text-white opacity-80" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
                      <span className="truncate">{project.client || '개인 작업'}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                      {project.duration && (
                        <>
                          <span>•</span>
                          <span className="truncate">{project.duration}</span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-0.5 font-display text-base font-bold text-neutral-900 group-hover:text-blue-600 transition truncate">
                      {project.title}
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500 line-clamp-1 break-keep">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Right: Featured Toggle & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                  {/* Home Featured Toggle */}
                  <button
                    onClick={() => toggleFeatured(project.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer ${
                      project.featuredInHome
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : 'bg-neutral-100 text-neutral-400 hover:text-neutral-700'
                    }`}
                    title="클릭하여 메인 홈 큐레이션 노출 여부 변경"
                  >
                    <CheckCircle size={13} className={project.featuredInHome ? 'text-blue-600' : 'text-neutral-400'} />
                    <span>{project.featuredInHome ? '홈 노출 ON' : '홈 노출 OFF'}</span>
                  </button>

                  {/* Preview Button */}
                  <button
                    onClick={() => onSelectProjectPreview(project)}
                    className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                    title="상세 모달 미리보기"
                  >
                    <Eye size={16} />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditModal(project)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>수정</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setProjectToDelete(project)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="프로젝트 삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      </>
      )}

      {/* Editor Modal */}
      <ProjectEditorModal
        isOpen={isEditorOpen}
        projectToEdit={projectToEdit}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProject}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccessToast={onShowToast}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProjectToDelete(null)}
              className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200 z-10 text-center"
            >
              <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200 mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-neutral-950">
                프로젝트를 삭제하시겠습니까?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 break-keep">
                '{projectToDelete.title}' 게시글이 영구적으로 삭제됩니다. 계속 진행하시겠습니까?
              </p>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="rounded-full border border-neutral-300 px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 cursor-pointer"
                >
                  삭제하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
