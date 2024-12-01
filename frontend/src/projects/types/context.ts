import {Project, ProjectDTO, Contributor} from "./project";

export interface BaseProjectContextType {
    projects: Project[];
    selectedProject: Project | null;
    loading: boolean;
    error: string | null;
    fetchProjects: () => Promise<void>;
    getProject: (id: number) => Promise<Project>;
    getProjectBySlug: (slug: string) => Promise<Project>;
    createProject: (projectData: ProjectDTO) => Promise<Project>;
    updateProject: (id: number, projectData: ProjectDTO) => Promise<Project>;
    deleteProject: (id: number) => Promise<void>;
}

export interface ProjectFeatureContextType {
    loading: boolean;
    error: string | null;
    updateFeatures: (projectId: number, features: string[]) => Promise<void>;
}

export interface ProjectImageContextType {
    loading: boolean;
    error: string | null;
    uploadProjectImage: (projectId: number, imageFile: File) => Promise<void>;
    deleteProjectImage: (projectId: number, imageId: number) => Promise<void>;
}

export interface ProjectContributorContextType {
    loading: boolean;
    error: string | null;
    addContributor: (projectId: number, contributor: Contributor) => Promise<void>;
}