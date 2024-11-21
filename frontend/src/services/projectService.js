import api from "../utils/axios";

export const projectService = {
    getAllProjects: async () => {
        try {
            const response = await api.get('/projects');
            return response.data;
        } catch (error) {
            console.error('Error fetching projectSection:', error)
            throw error;
        }
    },

    getProject: async (id) => {
        try {
            const response = await api.get(`/projects/${id}`)
            return response.data;
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    },

    createProject: async (projectData) => {
        try {
            const response = await api.get('/projects', projectData);
            return response.data;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    uploadProjectImage: async (projectId, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await api.post(
                `/projects/${projectId}/images`,
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
    }
};
