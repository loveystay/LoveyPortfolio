import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../data/projects';
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (projectData: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (id: string, updatedData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProjects(DEFAULT_PROJECTS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error: queryError } = await requireSupabase()
      .from('projects')
      .select('id, payload')
      .order('created_at', { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setIsLoading(false);
      return;
    }

    setProjects((data ?? []).map((row) => ({ ...(row.payload as Omit<Project, 'id'>), id: row.id })));
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = { ...projectData, id: crypto.randomUUID() };
    const { error: insertError } = await requireSupabase().from('projects').insert({
      id: newProject.id,
      payload: projectData,
    });
    if (insertError) throw new Error(insertError.message);
    setProjects((previous) => [newProject, ...previous]);
    return newProject;
  };

  const updateProject = async (id: string, updatedData: Partial<Project>) => {
    const current = projects.find((project) => project.id === id);
    if (!current) throw new Error('Project not found.');
    const nextProject = { ...current, ...updatedData, id };
    const payload = Object.fromEntries(Object.entries(nextProject).filter(([key]) => key !== 'id'));
    const { error: updateError } = await requireSupabase().from('projects').update({ payload }).eq('id', id);
    if (updateError) throw new Error(updateError.message);
    setProjects((previous) => previous.map((project) => (project.id === id ? nextProject : project)));
  };

  const deleteProject = async (id: string) => {
    const { error: deleteError } = await requireSupabase().from('projects').delete().eq('id', id);
    if (deleteError) throw new Error(deleteError.message);
    setProjects((previous) => previous.filter((project) => project.id !== id));
  };

  const resetToDefaults = async () => {
    const client = requireSupabase();
    const { error: deleteError } = await client.from('projects').delete().neq('id', '');
    if (deleteError) throw new Error(deleteError.message);
    const seedRows = DEFAULT_PROJECTS.map(({ id, ...payload }) => ({ id, payload }));
    const { error: insertError } = await client.from('projects').insert(seedRows);
    if (insertError) throw new Error(insertError.message);
    setProjects(DEFAULT_PROJECTS);
  };

  const toggleFeatured = async (id: string) => {
    const current = projects.find((project) => project.id === id);
    if (current) await updateProject(id, { featuredInHome: !current.featuredInHome });
  };

  return (
    <ProjectsContext.Provider value={{ projects, isLoading, error, addProject, updateProject, deleteProject, resetToDefaults, toggleFeatured, getProjectById: (id) => projects.find((project) => project.id === id), refreshProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error('useProjects must be used within a ProjectsProvider');
  return context;
};
