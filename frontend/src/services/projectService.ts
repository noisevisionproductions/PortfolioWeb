import api from "../utils/axios";
import {Project, ProjectImage, ProjectDTO, Contributor} from "../types/project";
import {authService} from "./authService";

const checkAuth = () => {
    if (!authService.isAuthenticated()) {
        throw new Error('Unauthorized');
    }
};

export const projectService = {
    createProject: async (projectData: ProjectDTO): Promise<Project> => {
        checkAuth();
        try {
            const response = await api.post('/api/projects', projectData);
            return response.data;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    getAllProjects: async (): Promise<Project[]> => {
        try {
            const response = await api.get('/api/projects');
            return response.data;
        } catch (error) {
            console.error('Error fetching projectSection:', error)
            throw error;
        }
    },

    getProject: async (id: number): Promise<Project> => {
        try {
            const response = await api.get(`/api/projects/${id}`)
            return response.data;
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    },

    getProjectBySlug: async (slug: string): Promise<Project> => {
        try {
            const response = await api.get(`/api/projects/slug/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching project by slug:', error);
            throw error;
        }
    },

    updateProject: async (id: number, projectData: ProjectDTO): Promise<Project> => {
        checkAuth();
        try {
            const response = await api.put(`/api/projects/${id}`, projectData);
            return response.data;
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    },

    deleteProject: async (id: number): Promise<void> => {
        checkAuth();
        try {
            await api.delete(`/api/projects/${id}`);
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    },

    uploadProjectImage: async (projectId: number, imageFile: File): Promise<ProjectImage> => {
        checkAuth();
        try {
            const formData = new FormData();
            formData.append('file', imageFile);

            const response = await api.post(
                `/api/projects/${projectId}/images/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    addProjectImage: async (projectId: number, imageData: Omit<ProjectImage, 'id'>): Promise<ProjectImage> => {
        checkAuth();
        try {
            const response = await api.post(`/api/projects/${projectId}/images`, imageData);
            return response.data;
        } catch (error) {
            console.error('Error adding project image:', error);
            throw error;
        }
    },

    deleteProjectImage: async (projectId: number, imageId: number): Promise<void> => {
        checkAuth();
        try {
            await api.delete(`/api/projects/${projectId}/images/${imageId}`);
        } catch (error) {
            console.error('Error deleting project image:', error);
            throw error;
        }
    },

    addContributor: async (projectId: number, contributor: Contributor): Promise<Project> => {
        checkAuth();
        try {
            const response = await api.post(`/api/projects/${projectId}/contributors`, contributor);
            return response.data;
        } catch (error) {
            console.error('Error adding contributor', error);
            throw error;
        }
    },

    updateFeatures: async (projectId: number, features: string[]): Promise<Project> => {
        checkAuth();
        try {
            const response = await api.put(`/api/projects/${projectId}/features`, features);
            return response.data;
        } catch (error) {
            console.error('Error updating features:', error);
            throw error;
        }
    }
};
