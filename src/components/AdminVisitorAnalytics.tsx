import React, { useState } from 'react';
import { useVisitorAnalytics } from '../context/VisitorAnalyticsContext';
import { useProjects } from '../context/ProjectsContext';
import { Project } from '../types';
import {
  Users,
  Eye,
  TrendingUp,
  Smartphone,
  Monitor,
  Activity,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Film,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminVisitorAnalyticsProps {
  onSelectProjectPreview: (project: Project) => void;
}

export const AdminVisitorAnalytics: React.FC<AdminVisitorAnalyticsProps> = ({
  onSelectProjectPreview,
}) => {
  const { analytics, resetAnalytics } = useVisitorAnalytics();
  const { projects } = useProjects();
  const [activeViewMode, setActiveViewMode] = useState<'visitors' | 'pageviews'>('visitors');

  const totalDevices = analytics.desktopCount + analytics.mobileCount || 1;
  const desktopPercent = Math.round((analytics.desktopCount / totalDevices) * 100);
  const mobilePercent = 100 - desktopPercent;

  // Comparison with yesterday
  const diffFromYesterday = analytics.todayVisitors - analytics.yesterdayVisitors;
  const isPositiveGrowth = diffFromYesterday >= 0;

  // Sort projects by view counts
  const rankedProjects = [...projects]
    .map((p) => ({
      ...p,
      views: analytics.projectViews[p.id] || 0,
    }))
    .sort((a, b) => b.views - a.views);

  const maxDailyValue = Math.max(
    ...analytics.dailyStats.map((s) => (activeViewMode === 'visitors' ? s.visitors : s.pageViews)),
    10
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>실시간 방문자 수집 중 (LIVE)</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            포트폴리오 방문자 & 트래픽 분석
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            관리자 모드 전용 비공개 데이터로, 포트폴리오 유입과 프로젝트 조회수를 실시간으로 집계합니다.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-neutral-400 block font-mono">최근 접속 기록</span>
            <span className="text-xs font-bold text-neutral-200">{analytics.lastVisitTime}</span>
          </div>
          <button
            onClick={async () => {
              if (window.confirm('방문자 통계 데이터를 기본 기준값으로 초기화하시겠습니까?')) {
                try {
                  await resetAnalytics();
                } catch (error) {
                  console.error('Analytics reset failed', error);
                  alert(error instanceof Error ? error.message : '통계를 초기화하지 못했습니다. 잠시 후 다시 시도해 주세요.');
                }
              }
            }}
            title="통계 초기화"
            className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800/80 px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 hover:text-white transition cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>통계 리셋</span>
          </button>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Grid (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Today Visitors */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              오늘 방문자 수 (Today)
            </span>
            <div className="h-9 w-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-neutral-950">
              {analytics.todayVisitors.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 font-medium">명</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <TrendingUp size={13} />
            <span>
              어제 대비 {isPositiveGrowth ? `+${diffFromYesterday}` : diffFromYesterday}명 (
              {analytics.yesterdayVisitors > 0
                ? `${Math.round((diffFromYesterday / analytics.yesterdayVisitors) * 100)}%`
                : '0%'}
              )
            </span>
          </div>
        </div>

        {/* Card 2: Cumulative Total Visitors */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              누적 총 방문자 (Total)
            </span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-neutral-950">
              {analytics.totalVisitors.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 font-medium">명</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            전체 집계 기간 동안의 순 방문자 수
          </p>
        </div>

        {/* Card 3: Today Page Views */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              오늘 페이지뷰 (PV)
            </span>
            <div className="h-9 w-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-neutral-950">
              {analytics.todayPageViews.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 font-medium">회</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            방문자 1인당 평균 {(analytics.todayPageViews / (analytics.todayVisitors || 1)).toFixed(1)}페이지 탐색
          </p>
        </div>

        {/* Card 4: Total Page Views */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              누적 총 페이지뷰
            </span>
            <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-neutral-950">
              {analytics.totalPageViews.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 font-medium">회</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            작업물 모달 및 상세페이지 열람 포함
          </p>
        </div>
      </div>

      {/* 3. Middle Section: Trend Bar Chart + Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Bar Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-neutral-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                <h3 className="font-display text-lg font-bold text-neutral-950">
                  최근 7일간 방문 추이
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">일자별 방문자 수와 페이지뷰 변동 현황</p>
            </div>

            {/* Toggle view mode */}
            <div className="inline-flex rounded-full bg-neutral-100 p-1 border border-neutral-200/80">
              <button
                type="button"
                onClick={() => setActiveViewMode('visitors')}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                  activeViewMode === 'visitors'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                방문자 (UV)
              </button>
              <button
                type="button"
                onClick={() => setActiveViewMode('pageviews')}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                  activeViewMode === 'pageviews'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                페이지뷰 (PV)
              </button>
            </div>
          </div>

          {/* Bar Chart Graphics */}
          <div className="mt-8">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pt-4 px-2">
              {analytics.dailyStats.map((stat, idx) => {
                const value = activeViewMode === 'visitors' ? stat.visitors : stat.pageViews;
                const heightPercent = Math.max(Math.round((value / maxDailyValue) * 100), 12);
                const isToday = idx === analytics.dailyStats.length - 1;

                return (
                  <div key={stat.date} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {value}
                    </span>
                    <div className="w-full max-w-[42px] bg-neutral-100 rounded-2xl p-1 flex flex-col justify-end h-40">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className={`w-full rounded-xl transition-all duration-300 ${
                          isToday
                            ? 'bg-gradient-to-t from-blue-600 to-blue-500 shadow-md'
                            : 'bg-neutral-300 group-hover:bg-neutral-400'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium ${isToday ? 'font-bold text-blue-600' : 'text-neutral-500'}`}>
                      {stat.dayLabel.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Device Breakdown Card (1 col) */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-neutral-950">
              접속 디바이스 분석
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">PC 데스크톱 vs 모바일 유입 비율</p>

            <div className="mt-8 space-y-6">
              {/* Desktop */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center gap-2 font-bold text-neutral-800">
                    <Monitor size={15} className="text-blue-600" />
                    <span>데스크톱 PC</span>
                  </span>
                  <span className="font-mono font-bold text-neutral-900">{desktopPercent}% ({analytics.desktopCount}명)</span>
                </div>
                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${desktopPercent}%` }}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center gap-2 font-bold text-neutral-800">
                    <Smartphone size={15} className="text-emerald-600" />
                    <span>스마트폰 / 모바일</span>
                  </span>
                  <span className="font-mono font-bold text-neutral-900">{mobilePercent}% ({analytics.mobileCount}명)</span>
                </div>
                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${mobilePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-50 p-4 border border-neutral-200/60">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 mb-1">
              <ShieldCheck size={14} className="text-blue-600" />
              <span>포트폴리오 최적화 팁</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              모바일 방문자 비중이 {mobilePercent}%입니다. 세로형 숏폼 영상 및 모바일 상세페이지 뷰어가 완벽히 최적화되어 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Top Projects Ranking (Most Viewed Works) */}
      <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
          <div>
            <h3 className="font-display text-lg font-bold text-neutral-950">
              인기 작업물 조회수 랭킹 TOP
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">클라이언트 및 방문자가 가장 많이 클릭하고 시청한 프로젝트</p>
          </div>
          <span className="text-xs font-bold text-neutral-400">총 {projects.length}개 작품</span>
        </div>

        <div className="mt-6 divide-y divide-neutral-100">
          {rankedProjects.map((project, index) => {
            const rankBadge =
              index === 0
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : index === 1
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : index === 2
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-neutral-100 text-neutral-600 border-neutral-200';

            return (
              <div
                key={project.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 rounded-2xl px-3 transition"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <span
                    className={`h-7 w-7 rounded-xl flex items-center justify-center text-xs font-black border ${rankBadge} shrink-0`}
                  >
                    {index + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Project Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                        {project.categoryTag}
                      </span>
                      {project.client && (
                        <span className="text-[11px] text-neutral-400">
                          {project.client}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-sm font-bold text-neutral-900 mt-0.5">
                      {project.title}
                    </h4>
                  </div>
                </div>

                {/* View count & Preview Button */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pl-11 sm:pl-0">
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 block font-medium">조회수</span>
                    <span className="font-mono text-base font-extrabold text-neutral-950">
                      {project.views.toLocaleString()} <span className="text-xs font-normal text-neutral-500">회</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProjectPreview(project)}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 transition cursor-pointer shadow-2xs"
                  >
                    <span>미리보기</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
