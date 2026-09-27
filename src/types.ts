export type NavTab = 'home' | 'about' | 'works' | 'contact' | 'admin';

export type FilterCategory = 'ALL' | 'YOUTUBE VIDEO' | 'PRODUCT PAGE' | 'SHORTS';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface DetailSection {
  title?: string;
  badge?: string;
  subtitle?: string;
  image: string;
  text?: string;
  points?: string[];
  specs?: { label: string; value: string }[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: 'YOUTUBE VIDEO' | 'PRODUCT PAGE' | 'SHORTS / REELS' | 'VIDEO EDITING';
  categoryTag: 'VIDEO' | 'PRODUCT' | 'SHORTS' | 'DESIGN';
  year: string;
  description: string;
  fullStory?: string;
  client?: string;
  role?: string;
  duration?: string;
  tools?: string[];
  image: string;
  videoUrl?: string;
  isWide?: boolean;
  featuredInHome?: boolean;
  metrics?: ProjectMetric[];
  highlights?: string[];
  gallery?: string[];
  detailSections?: DetailSection[];
  longDetailImage?: string;
  productCategory?: string;
  storeUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  projectName: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}
