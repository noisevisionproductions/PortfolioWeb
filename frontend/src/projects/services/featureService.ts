import api from "../../utils/axios";
import {Project} from "../types/project";

export const featureService = {
    updateFeatures: async (projectId: number, features: string[]): Promise<Project> => {
        try {
            const response = await api.put(`/api/projects/${projectId}/features`, features);
            return response.data;
        } catch (error) {
            console.error('Error updating features:', error);
            throw error;
        }
    }
};