import {vi} from "vitest";
import {Contributor, Project, ProjectStatus} from "@/projects/types/project";
import api from "@/utils/axios";
import {contributorService} from "@/projects/services";

vi.mock('@/utils/axios');

describe('contributorService', () => {
    const mockProjectId = 1;
    const mockContributor: Contributor = {
        name: 'John Doe',
        role: 'Developer',
        profileUrl: 'https://github.com/johndoe'
    };

    const mockProject: Project = {
        id: mockProjectId,
        name: 'Test Project',
        slug: 'test-project',
        description: 'Test Description',
        status: ProjectStatus.IN_PROGRESS,
        features: ['Feature 1'],
        technologies: ['React', 'TypeScript'],
        contributors: [mockContributor],
        projectImages: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addContributor', () => {
        test('should add contributor successfully', async () => {
            vi.mocked(api.post).mockResolvedValueOnce({data: mockProject});

            const result = await contributorService.addContributor(mockProjectId, mockContributor);

            expect(api.post).toHaveBeenCalledWith(
                `/api/projects/${mockProjectId}/contributors`,
                mockContributor
            );
            expect(result).toEqual(mockProject);
            expect(result.contributors).toContainEqual(mockContributor);
        });

        test('should handle add contributor error', async () => {
            const error = new Error('Add contributor failed');
            vi.mocked(api.post).mockRejectedValueOnce(error);

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            });

            await expect(contributorService.addContributor(mockProjectId, mockContributor))
                .rejects
                .toThrow('Add contributor failed');

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding contributor', error);
            consoleErrorSpy.mockRestore();
        });
    });
});