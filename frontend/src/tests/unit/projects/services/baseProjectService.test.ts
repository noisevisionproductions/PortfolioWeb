import {beforeEach, describe, expect, test, vi} from 'vitest';
import {baseProjectService} from '@/projects/services/baseProjectService';
import api from '@/utils/axios';
import {baseAuthService} from '@/auth/services/baseAuthService';
import {ApiError} from '@/auth/types/errors';
import {Project, ProjectDTO, ProjectStatus} from '@/projects/types/project';

vi.mock('@/utils/axios');
vi.mock('@/auth/services/baseAuthService');
vi.mock('@/auth/services/errorHandler', () => ({
    createErrorHandler: vi.fn((error) => {
        if (error instanceof ApiError) return error;
        return new ApiError(500, 'Unexpected error', 'UNKNOWN_ERROR');
    }),
}));

describe('baseProjectService', () => {
    const mockProject: Project = {
        contributors: [],
        features: [],
        status: ProjectStatus.IN_PROGRESS,
        id: 1,
        name: 'Test Project',
        description: 'Test Description',
        slug: 'test-project',
        technologies: ['React', 'TypeScript'],
        projectImages: [],
        createdAt: new Date(),
        lastModifiedAt: new Date()
    };

    const mockProjectDTO: ProjectDTO = {
        contributors: [],
        features: [],
        slug: "",
        status: ProjectStatus.IN_PROGRESS,
        name: 'Test Project',
        description: 'Test Description',
        technologies: ['React', 'TypeScript']
    };

    let originalWindow: Window & typeof globalThis;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(true);

        originalWindow = window;

        const windowMock = {
            ...window,
            location: {
                ...window.location,
                href: ''
            }
        };

        Object.defineProperty(global, 'window', {
            value: windowMock,
            writable: true
        });
    });

    afterEach(() => {
        Object.defineProperty(global, 'window', {
            value: originalWindow,
            writable: true
        });
    });

    describe('createProject', () => {
        test('should create project successfully when authenticated', async () => {
            vi.mocked(api.post).mockResolvedValueOnce({data: mockProject});

            const result = await baseProjectService.createProject(mockProjectDTO);

            expect(api.post).toHaveBeenCalledWith('/api/projects', mockProjectDTO);
            expect(result).toEqual(mockProject);
        });

        test('should throw error and redirect when not authenticated', async () => {
            vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(false);

            await expect(baseProjectService.createProject(mockProjectDTO))
                .rejects
                .toThrow(ApiError);

            expect(window.location.href).toBe('/login');
        });

        test('should handle api error', async () => {
            const error = new Error('API Error');
            vi.mocked(api.post).mockRejectedValueOnce(error);

            await expect(baseProjectService.createProject(mockProjectDTO))
                .rejects
                .toThrow(ApiError);
        });
    });

    describe('getAllProjects', () => {
        test('should fetch all projects successfully', async () => {
            const mockProjects = [mockProject];
            vi.mocked(api.get).mockResolvedValueOnce({data: mockProjects});

            const result = await baseProjectService.getAllProjects();

            expect(api.get).toHaveBeenCalledWith('/api/projects');
            expect(result).toEqual(mockProjects);
        });

        test('should handle api error when fetching all projects', async () => {
            const error = new Error('API Error');
            vi.mocked(api.get).mockRejectedValueOnce(error);

            await expect(baseProjectService.getAllProjects())
                .rejects
                .toThrow(ApiError);
        });
    });

    describe('getProject', () => {
        test('should fetch single project by id successfully', async () => {
            vi.mocked(api.get).mockResolvedValueOnce({data: mockProject});

            const result = await baseProjectService.getProject(1);

            expect(api.get).toHaveBeenCalledWith('/api/projects/1');
            expect(result).toEqual(mockProject);
        });

        test('should handle api error when fetching single project', async () => {
            const error = new Error('API Error');
            vi.mocked(api.get).mockRejectedValueOnce(error);

            await expect(baseProjectService.getProject(1))
                .rejects
                .toThrow(ApiError);
        });
    });

    describe('getProjectBySlug', () => {
        test('should fetch project by slug successfully', async () => {
            vi.mocked(api.get).mockResolvedValueOnce({data: mockProject});

            const result = await baseProjectService.getProjectBySlug('test-project');

            expect(api.get).toHaveBeenCalledWith('/api/projects/slug/test-project');
            expect(result).toEqual(mockProject);
        });

        test('should handle api error when fetching by slug', async () => {
            const error = new Error('API Error');
            vi.mocked(api.get).mockRejectedValueOnce(error);

            await expect(baseProjectService.getProjectBySlug('test-project'))
                .rejects
                .toThrow(ApiError);
        });
    });

    describe('updateProject', () => {
        test('should update project successfully when authenticated', async () => {
            vi.mocked(api.put).mockResolvedValueOnce({data: mockProject});

            const result = await baseProjectService.updateProject(1, mockProjectDTO);

            expect(api.put).toHaveBeenCalledWith('/api/projects/1', mockProjectDTO);
            expect(result).toEqual(mockProject);
        });

        test('should throw error and redirect when not authenticated', async () => {
            vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(false);

            await expect(baseProjectService.updateProject(1, mockProjectDTO))
                .rejects
                .toThrow(ApiError);

            expect(window.location.href).toBe('/login');
        });

        test('should handle api error during update', async () => {
            const error = new Error('API Error');
            vi.mocked(api.put).mockRejectedValueOnce(error);

            await expect(baseProjectService.updateProject(1, mockProjectDTO))
                .rejects
                .toThrow(ApiError);
        });
    });

    describe('deleteProject', () => {
        test('should delete project successfully when authenticated', async () => {
            vi.mocked(api.delete).mockResolvedValueOnce({data: undefined});

            await baseProjectService.deleteProject(1);

            expect(api.delete).toHaveBeenCalledWith('/api/projects/1');
        });

        test('should throw error and redirect when not authenticated', async () => {
            vi.mocked(baseAuthService.isAuthenticated).mockReturnValue(false);

            await expect(baseProjectService.deleteProject(1))
                .rejects
                .toThrow(ApiError);

            expect(window.location.href).toBe('/login');
        });

        test('should handle api error during deletion', async () => {
            const error = new Error('API Error');
            vi.mocked(api.delete).mockRejectedValueOnce(error);

            await expect(baseProjectService.deleteProject(1))
                .rejects
                .toThrow(ApiError);
        });
    });
});