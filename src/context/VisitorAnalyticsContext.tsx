import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, requireSupabase, supabase } from '../lib/supabase';

export interface DailyVisitStat {
  date: string;
  dayLabel: string;
  visitors: number;
  pageViews: number;
}

export interface VisitorAnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  yesterdayVisitors: number;
  totalPageViews: number;
  todayPageViews: number;
  desktopCount: number;
  mobileCount: number;
  dailyStats: DailyVisitStat[];
  projectViews: Record<string, number>;
  lastVisitTime: string;
}

interface VisitorAnalyticsContextType {
  analytics: VisitorAnalyticsData;
  recordPageView: (tabName?: string) => void;
  recordProjectView: (projectId: string) => void;
  resetAnalytics: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
}

type AnalyticsEvent = {
  event_type: 'visit' | 'page_view' | 'project_view';
  project_id: string | null;
  device_type: 'desktop' | 'mobile';
  session_id: string;
  created_at: string;
};

const emptyAnalytics = (): VisitorAnalyticsData => ({
  totalVisitors: 0,
  todayVisitors: 0,
  yesterdayVisitors: 0,
  totalPageViews: 0,
  todayPageViews: 0,
  desktopCount: 0,
  mobileCount: 0,
  dailyStats: [],
  projectViews: {},
  lastVisitTime: '-',
});

const dayKey = (date: Date) => date.toISOString().slice(0, 10);
const sessionKey = 'lovey_analytics_session_id';
const visitedKey = 'lovey_analytics_session_visited';

const VisitorAnalyticsContext = createContext<VisitorAnalyticsContextType | undefined>(undefined);

export const VisitorAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<VisitorAnalyticsData>(emptyAnalytics);

  const refreshAnalytics = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const client = requireSupabase();
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session) return;
    const { data, error } = await client
      .from('analytics_events')
      .select('event_type, project_id, device_type, session_id, created_at')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Unable to load analytics:', error.message);
      return;
    }

    const events = (data ?? []) as AnalyticsEvent[];
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - index));
      return date;
    });
    const daily = new Map(days.map((date) => [dayKey(date), { date: dayKey(date), dayLabel: new Intl.DateTimeFormat('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'short' }).format(date), visitors: 0, pageViews: 0, visitorSessions: new Set<string>() }]));
    const visitorSessions = new Set<string>();
    const desktopSessions = new Set<string>();
    const mobileSessions = new Set<string>();
    const projectViews: Record<string, number> = {};
    let totalPageViews = 0;

    for (const event of events) {
      const key = event.created_at.slice(0, 10);
      const stat = daily.get(key);
      if (event.event_type === 'visit') {
        visitorSessions.add(event.session_id);
        if (event.device_type === 'mobile') mobileSessions.add(event.session_id);
        else desktopSessions.add(event.session_id);
        if (stat) stat.visitorSessions.add(event.session_id);
      } else {
        totalPageViews += 1;
        if (stat) stat.pageViews += 1;
        if (event.event_type === 'project_view' && event.project_id) {
          projectViews[event.project_id] = (projectViews[event.project_id] ?? 0) + 1;
        }
      }
    }

    const dailyStats = Array.from(daily.values()).map(({ visitorSessions: sessions, ...stat }) => ({ ...stat, visitors: sessions.size }));
    const todayStat = dailyStats.at(-1) ?? { visitors: 0, pageViews: 0 };
    const yesterdayStat = dailyStats.at(-2) ?? { visitors: 0 };
    setAnalytics({
      totalVisitors: visitorSessions.size,
      todayVisitors: todayStat.visitors,
      yesterdayVisitors: yesterdayStat.visitors,
      totalPageViews,
      todayPageViews: todayStat.pageViews,
      desktopCount: desktopSessions.size,
      mobileCount: mobileSessions.size,
      dailyStats,
      projectViews,
      lastVisitTime: events.at(-1) ? new Date(events.at(-1)!.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-',
    });
  }, []);

  const record = useCallback((eventType: AnalyticsEvent['event_type'], projectId?: string, tabName?: string) => {
    if (!isSupabaseConfigured) return;
    let sessionId = sessionStorage.getItem(sessionKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(sessionKey, sessionId);
    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    void requireSupabase().from('analytics_events').insert({
      event_type: eventType,
      project_id: projectId ?? null,
      page_name: tabName ?? null,
      device_type: isMobile ? 'mobile' : 'desktop',
      session_id: sessionId,
    }).then(({ error }) => {
      if (error) console.error('Unable to record analytics event:', error.message);
    });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (!sessionStorage.getItem(visitedKey)) {
      record('visit');
      sessionStorage.setItem(visitedKey, 'true');
    }
    record('page_view', undefined, 'home');
    const { data: listener } = supabase!.auth.onAuthStateChange(() => void refreshAnalytics());
    return () => listener.subscription.unsubscribe();
  }, [record, refreshAnalytics]);

  const resetAnalytics = async () => {
    const { error } = await requireSupabase().from('analytics_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw new Error(error.message);
    setAnalytics(emptyAnalytics());
  };

  return <VisitorAnalyticsContext.Provider value={{ analytics, recordPageView: (tabName) => record('page_view', undefined, tabName), recordProjectView: (projectId) => record('project_view', projectId), resetAnalytics, refreshAnalytics }}>{children}</VisitorAnalyticsContext.Provider>;
};

export const useVisitorAnalytics = () => {
  const context = useContext(VisitorAnalyticsContext);
  if (!context) throw new Error('useVisitorAnalytics must be used within a VisitorAnalyticsProvider');
  return context;
};
