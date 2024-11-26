import { ProjectImage} from "../types/project";
import api from "../../utils/axios";

export const imageService = {
    uploadProjectImage: async (projectId: number, imageFile: File): Promise<ProjectImage> => {
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
        try {
            const response = await api.post(`/api/projects/${projectId}/images`, imageData);
            return response.data;
        } catch (error) {
            console.error('Error adding project image:', error);
            throw error;
        }
    },

    deleteProjectImage: async (projectId: number, imageId: number): Promise<void> => {
        try {
            await api.delete(`/api/projects/${projectId}/images/${imageId}`);
        } catch (error) {
            console.error('Error deleting project image:', error);
            throw error;
        }
    },
};
