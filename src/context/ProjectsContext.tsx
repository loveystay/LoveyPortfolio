import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/projects';

interface ProjectsContextType {
  projects: Project[];
  addProject: (projectData: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updatedData: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  resetToDefaults: () => void;
  toggleFeatured: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
}

const PROJECTS_STORAGE_KEY = 'lovey_portfolio_projects_data';

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    return DEFAULT_PROJECTS;
  });

  // Save to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to persist projects to localStorage', e);
    }
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id'>): Project => {
    const newId = `project-${Date.now()}`;
    const newProject: Project = {
      ...projectData,
      id: newId,
    };

    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updatedData: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const resetToDefaults = () => {
    setProjects(DEFAULT_PROJECTS);
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    } catch {}
  };

  const toggleFeatured = (id: string) => {
    setProjects((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featuredInHome: !item.featuredInHome } : item
      )
    );
  };

  const getProjectById = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        resetToDefaults,
        toggleFeatured,
        getProjectById,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
