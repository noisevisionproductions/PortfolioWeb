import {vi} from "vitest";
import {Project, ProjectStatus} from "@/projects/types/project";
import api from "@/utils/axios";
import {featureService} from "@/projects/services";

vi.mock('@/utils/axios');

describe('featureService', () => {
    const mockProjectId = 1;
    const mockFeatures = ['Feature 1', 'Feature 2', 'Feature 3'];
    const mockProject: Project = {
        id: mockProjectId,
        name: 'Test Project',
        slug: 'test-project',
        description: 'Test Description',
        status: ProjectStatus.IN_PROGRESS,
        features: mockFeatures,
        technologies: ['React', 'TypeScript'],
        contributors: [],
        projectImages: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('updateFeatures', () => {
        test('should update features successfully', async () => {
            vi.mocked(api.put).mockResolvedValueOnce({data: mockProject});

            const result = await featureService.updateFeatures(mockProjectId, mockFeatures);

            expect(api.put).toHaveBeenCalledWith(
                `/api/projects/${mockProjectId}/features`,
                mockFeatures
            );
            expect(result).toEqual(mockProject);
            expect(result.features).toEqual(mockFeatures);
        });

        test('should handle update error', async () => {
            const error = new Error('Update failed');
            vi.mocked(api.put).mockRejectedValueOnce(error);

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(featureService.updateFeatures(mockProjectId, mockFeatures))
                .rejects
                .toThrow('Update failed');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating features:', error);
            consoleErrorSpy.mockRestore();
        });
    });
});