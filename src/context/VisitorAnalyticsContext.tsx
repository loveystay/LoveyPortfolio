import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DailyVisitStat {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "8/15 (토)"
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
  resetAnalytics: () => void;
}

const STORAGE_KEY = 'lovey_visitor_analytics_v1';
const SESSION_VISITED_KEY = 'lovey_session_recorded';

const generateInitialStats = (): VisitorAnalyticsData => {
  const today = new Date();
  const dailyStats: DailyVisitStat[] = [];
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  // Generate realistic past 7 days stats
  const baseCounts = [28, 34, 45, 39, 52, 61, 48];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const month = d.getMonth() + 1;
    const dateNum = d.getDate();
    const dayName = days[d.getDay()];
    const dayLabel = `${month}/${dateNum} (${dayName})`;
    const count = baseCounts[6 - i] + Math.floor(Math.random() * 5);
    dailyStats.push({
      date: dateStr,
      dayLabel,
      visitors: count,
      pageViews: Math.round(count * 2.8),
    });
  }

  const todayStat = dailyStats[dailyStats.length - 1];
  const yesterdayStat = dailyStats[dailyStats.length - 2];

  return {
    totalVisitors: 1428,
    todayVisitors: todayStat ? todayStat.visitors : 48,
    yesterdayVisitors: yesterdayStat ? yesterdayStat.visitors : 61,
    totalPageViews: 3892,
    todayPageViews: todayStat ? todayStat.pageViews : 134,
    desktopCount: 885,
    mobileCount: 543,
    dailyStats,
    projectViews: {
      '1': 412,
      '2': 365,
      '3': 298,
      '4': 245,
      '5': 210,
      '6': 189,
    },
    lastVisitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
};

const VisitorAnalyticsContext = createContext<VisitorAnalyticsContextType | undefined>(undefined);

export const VisitorAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analytics, setAnalytics] = useState<VisitorAnalyticsData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return generateInitialStats();
  });

  // Track new session / visit on initial mount
  useEffect(() => {
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isNewSession = !sessionStorage.getItem(SESSION_VISITED_KEY);

      setAnalytics((prev) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const now = new Date();
        const dayLabel = `${now.getMonth() + 1}/${now.getDate()} (${days[now.getDay()]})`;

        const updatedDaily = [...prev.dailyStats];
        let todayItem = updatedDaily.find((s) => s.date === todayStr);

        if (!todayItem) {
          todayItem = {
            date: todayStr,
            dayLabel,
            visitors: 0,
            pageViews: 0,
          };
          updatedDaily.push(todayItem);
          if (updatedDaily.length > 14) {
            updatedDaily.shift();
          }
        }

        const addVisitor = isNewSession ? 1 : 0;
        todayItem.visitors += addVisitor;
        todayItem.pageViews += 1;

        const nextState: VisitorAnalyticsData = {
          ...prev,
          totalVisitors: prev.totalVisitors + addVisitor,
          todayVisitors: prev.todayVisitors + addVisitor,
          totalPageViews: prev.totalPageViews + 1,
          todayPageViews: prev.todayPageViews + 1,
          desktopCount: prev.desktopCount + (!isMobile && isNewSession ? 1 : 0),
          mobileCount: prev.mobileCount + (isMobile && isNewSession ? 1 : 0),
          dailyStats: updatedDaily,
          lastVisitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        return nextState;
      });

      if (isNewSession) {
        sessionStorage.setItem(SESSION_VISITED_KEY, 'true');
      }
    } catch {
      // Ignore
    }
  }, []);

  const recordPageView = (_tabName?: string) => {
    setAnalytics((prev) => {
      const nextState = {
        ...prev,
        totalPageViews: prev.totalPageViews + 1,
        todayPageViews: prev.todayPageViews + 1,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {}
      return nextState;
    });
  };

  const recordProjectView = (projectId: string) => {
    setAnalytics((prev) => {
      const currentViews = prev.projectViews[projectId] || 0;
      const nextViews = {
        ...prev.projectViews,
        [projectId]: currentViews + 1,
      };
      const nextState = {
        ...prev,
        totalPageViews: prev.totalPageViews + 1,
        todayPageViews: prev.todayPageViews + 1,
        projectViews: nextViews,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {}
      return nextState;
    });
  };

  const resetAnalytics = () => {
    const initial = generateInitialStats();
    setAnalytics(initial);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch {}
  };

  return (
    <VisitorAnalyticsContext.Provider
      value={{
        analytics,
        recordPageView,
        recordProjectView,
        resetAnalytics,
      }}
    >
      {children}
    </VisitorAnalyticsContext.Provider>
  );
};

export const useVisitorAnalytics = () => {
  const context = useContext(VisitorAnalyticsContext);
  if (!context) {
    throw new Error('useVisitorAnalytics must be used within a VisitorAnalyticsProvider');
  }
  return context;
};
