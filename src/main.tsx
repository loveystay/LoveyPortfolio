import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { VisitorAnalyticsProvider } from './context/VisitorAnalyticsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AdminAuthProvider>
        <ProjectsProvider>
          <VisitorAnalyticsProvider>
            <App />
          </VisitorAnalyticsProvider>
        </ProjectsProvider>
      </AdminAuthProvider>
    </LanguageProvider>
  </StrictMode>,
);

