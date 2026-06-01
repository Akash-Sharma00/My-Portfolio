export interface Stat {
  label: string;
  value: string;
  suffix: string;
}

export interface Social {
  github: string;
  linkedin: string;
}

export interface Personal {
  name: string;
  title: string;
  specializations: string[];
  about: string;
  aboutExtended: string;
  location: string;
  email: string;
  phone: string;
  social: Social;
  stats: Stat[];
  status: string;
}

export interface ProjectLink {
  live?: string;
  android?: string;
  ios?: string;
  github?: string;
  playstore?: string;
  appstore?: string;
  web?: string;
  pubdev?: string;
}

export interface Project {
  id: string;
  name: string;
  company: string;
  type: string;
  summary: string;
  description: string;
  impact: string;
  impactDetail: string;
  tech: string[];
  features: string[];
  links: ProjectLink;
  screenshots?: string[];
  screenshotCaptions?: string[];
  color: string;
  featured: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  note: string | null;
  website?: string;
  client?: string;
  clientWebsite?: string;
  projects: Project[];
}

export interface PersonalProject {
  id: string;
  name: string;
  type: string;
  summary: string;
  description: string;
  tech: string[];
  features: string[];
  links: ProjectLink;
  screenshots?: string[];
  highlight: string;
  color: string;
}

export interface Contribution {
  name: string;
  description: string;
  links: ProjectLink;
}

export interface Education {
  degree: string;
  college: string;
  location: string;
  period: string;
  cgpa: string;
}

export interface Portfolio {
  personal: Personal;
  skills: Record<string, string[]>;
  aiTools: string[];
  workExperience: WorkExperience[];
  personalProjects: PersonalProject[];
  contributions: Contribution[];
  education: Education;
  learnings: string[];
}
