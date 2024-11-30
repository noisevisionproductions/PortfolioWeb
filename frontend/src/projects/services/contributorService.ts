import {Contributor, Project} from "@/projects/types/project";
import api from "@/utils/axios";

export const contributorService = {
    addContributor: async (projectId: number, contributor: Contributor): Promise<Project> => {
        try {
            const response = await api.post(`/api/projects/${projectId}/contributors`, contributor);
            return response.data;
        } catch (error) {
            console.error('Error adding contributor', error);
            throw error;
        }
    }
};